import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import { json } from 'body-parser';
import express from 'express';
import process from 'process';

// const express_graphql = require('express-graphql');
// const schema = require('./schema.js');
const { readFileSync } = require('fs');
var AWS = require("aws-sdk");

AWS.config.update({
    region: "us-west-2",
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
    // Security keys, tokens, etc, will need setup and stored securely for the connection.
});

var docClient = new AWS.DynamoDB.DocumentClient()

const typedefs = readFileSync(require.resolve('./schema.graphql')).toString('utf-8');
const resolvers = readFileSync(require.resolve('./resolvers.graphql')).toString('utf-8');

const app = express();

// Note you must call `start()` on the `ApolloServer`
// instance before passing the instance to `expressMiddleware`
const server = new ApolloServer({ typedefs, resolvers });
await server.start();

// Specify the path where we'd like to mount our server
app.use('/graphql', cors(), json(), expressMiddleware(server));

app.listen(5000, () => console.log("server is up"));
