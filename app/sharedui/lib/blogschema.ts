

export const blogtypeDef = `
type Book {
    id: ID!
    title: String!
    author: String!
    year: Int!
  }
  type author {
     id:ID!
    username:String
    email:String
    password:String
  }

  

  type Blog {
    id: ID!
    title: String!
    content: String!
    category: String!
    author:String
    blogcover:String
  }

  
  input BookInput {
    title: String!
    author: String!
    year: Int!
  }

  
  input blogInput {
    title: String!
    content: String!
    category: String!
    author:String!
    blogcover:String
   }


  type totalBlog {
    allblog: [Blog!]!
    totalNum: Int!
  }

  type Query {
   book:[Book!]
   onebook(id:ID!):Book
   getallblog(id: ID!, page: Int!, limit: Int!): totalBlog!
  }
   
   type Mutation{
    addBook(input:BookInput):Book
    editBook(input:BookInput):Book
    deleteBook(id:ID):Book
    addBlog(input:blogInput):Blog
   }

`