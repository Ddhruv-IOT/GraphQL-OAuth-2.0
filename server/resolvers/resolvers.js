import { users } from "../data/data.js";
import { secretCode } from "../data/data.js";

import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const SECRET_KEY = process.env.SECRET_KEY;

export const resolvers = {
  Query: {
    test: () => "Hello, GraphQL! This is test page, without any Auth!",

    currentUser: (parent, args, context) => {
      // Check if user is authenticated
      if (!context.user) {
        throw new Error("Authentication required");
      }
      // return User
      return context.user;
    },

    secretcode: (parent, args, context) => {
      if (!context.user) {
        throw new Error("Authentication required");
      }
      console.log(context.user.id);
      const userSecret = secretCode.filter(
        (code) => code.id === context.user.id
      );
      console.log(userSecret);
      return userSecret;
    },
  },
  Mutation: {
    login: (parent, { username, password }, context, info) => {
      // Find user by username
      const user = users.find((user) => user.username === username);
      if (!user) {
        throw new Error("User not found");
      }

      // Verify password (for POC, we're not hashing passwords)
      if (user.password !== password) {
        throw new Error("Incorrect password");
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user.id }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return token;
    },
  },
};
