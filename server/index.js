import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
import session from "express-session";
import http from "http";
import cors from "cors";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import { users } from "./data/data.js";

import { resolvers } from "./resolvers/resolvers.js";
import { typeDefs } from "./schema/schema.js";

import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;
const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

const app = express();
const httpServer = http.createServer(app);

app.use(session({
  secret: SECRET_KEY,
  resave: false,
  saveUninitialized: true
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (obj, done) {
  done(null, obj);
});

passport.use(
  new GitHubStrategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:4000/auth/github/callback",
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await profile.displayName;
      return cb(null, user);
    }
  )
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

await server.start();

app.use(
  "/gq",
  cors(),
  express.json(),
  expressMiddleware(server, {
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      try {
        if (token == "") {
          return {};
        }
        const decoded = jwt.verify(token, SECRET_KEY);
        const user = users.find((user) => user.id === decoded.userId);
        return { user };
      } catch (error) {
        console.log(error);
        return {};
      }
    },
  })
);

app.use(passport.initialize());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
  async function (req, res) {
    const token = jwt.sign({ username: req.user }, SECRET_KEY); // Adjusted to sign the username
    console.log(token);
    res.status(200).json({ token, username: req.user });
    // res.redirect(`/graphql?token=${token}`);
  });


await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
