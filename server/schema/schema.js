export const typeDefs = `#graphql
type Query {
    test: String
    currentUser: User
    secretcode: [secretCode]
    # secretCode: [secretCode]
    # secretcode(id: ID!): secretCode
  }

  type Mutation {
    login(username: String!, password: String!): String
  }

  type secretCode {
    secret: String
    id: ID
  }

  type User {
    id: ID!
    username: String!
  }
`;
