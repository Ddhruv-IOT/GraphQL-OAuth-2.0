// import { ApolloServer } from "@apollo/server";
// import { expressMiddleware } from "@apollo/server/express4";
// // import { ApolloServerPluginDrainHttpServerDisabled } from "@apollo/server/plugin/drainHttpServer";
// import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";
// import express from "express";
// import http from "http";
// import cors from "cors";

// import jwt from "jsonwebtoken";
// import dotenv from "dotenv";

// import { users } from "./data/data.js";
// import { secretCode } from "./data/data.js";

// import { resolvers } from "./resolvers/resolvers.js";
// import { typeDefs } from "./schema/schema.js";

// import passport from "passport";
// import { Strategy as GitHubStrategy } from "passport-github";

// dotenv.config();
// const SECRET_KEY = process.env.SECRET_KEY;
// const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
// const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

// const app = express();
// // Our httpServer handles incoming requests to our Express app.
// // Below, we tell Apollo Server to "drain" this httpServer,
// // enabling our servers to shut down gracefully.
// const httpServer = http.createServer(app);

// passport.use(
//   new GitHubStrategy(
//     {
//       clientID: GITHUB_CLIENT_ID,
//       clientSecret: GITHUB_CLIENT_SECRET,
//       callbackURL: "http://localhost:4000/auth/github/callback", // Change this to your actual callback URL
//     },
//     function (accessToken, refreshToken, profile, cb) {
//       // You can handle the user creation or retrieval logic here
//       // For simplicity, let's assume profile.username is the unique identifier
//       const user = users.find((u) => u.username === profile.username);
//       return cb(null, user);
//     }
//   )
// );

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
//   // plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
//   // plugins: [ApolloServerPluginLandingPageDisabled()],
  
// });
// // Ensure we wait for our server to start
// await server.start();

// // Set up our Express middleware to handle CORS, body parsing,
// // and our expressMiddleware function.
// app.use(
//   "/",
//   cors(),
//   express.json(),
//   // expressMiddleware accepts the same arguments:
//   // an Apollo Server instance and optional configuration options
//   expressMiddleware(server, {
//     context: async ({ req }) => {
//       // Get the token from the request headers
//       const token = req.headers.authorization || "";
//       // console.log("tk", token)

//       try {
//         // Verify JWT token
//         if (token == "") {
//           return {};
//         }
//         const decoded = jwt.verify(token, SECRET_KEY);
//         // Add the user to the context
//         const user = users.find((user) => user.id === decoded.userId);
//         return { user, secretCode };
//       } catch (error) {
//         console.log(error);
//         return {};
//       }
//     },
//   })
// );
// app.use(passport.initialize());

// // Define route for GitHub OAuth authentication
// app.get('/auth/github', passport.authenticate('github'));

// // GitHub OAuth callback route
// app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function(req, res) {
//   // Successful authentication, redirect or respond as needed.
//   // For example, you might issue a JWT token here for the authenticated user.
//   const token = jwt.sign({ userId: req.user.id }, SECRET_KEY);
//   // Redirect or send response as needed
// });


// // Modified server startup
// await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

// console.log(`🚀 Server ready at http://localhost:4000/`);


import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import express from "express";
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
// app.use(passport.initialize());

// app.get('/auth/github', passport.authenticate('github'));

// app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }), function(req, res) {
//   const token = jwt.sign({ userId: req.user.profile }, SECRET_KEY);
//   console.log(token)
//   // res.redirect(`/graphql?token=${token}`);
// });

app.use(passport.initialize());

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/' }),
async  function(req, res) {
  const token =  jwt.sign({ username: req.user }, SECRET_KEY); // Adjusted to sign the username
  console.log(token);
  // res.redirect(`/graphql?token=${token}`);
});


await new Promise((resolve) => httpServer.listen({ port: 4000 }, resolve));

console.log(`🚀 Server ready at http://localhost:4000/`);
