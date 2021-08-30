var {MongoClient} = require('mongodb');

const DATABASECONNECTION = process.env.MONGODB_URI || "mongodb+srv://testdb:testdb@cluster0.4ucbz.mongodb.net/teach-n-learn-db?retryWrites=true&w=majority"
const client = new MongoClient(DATABASECONNECTION);

module.exports = client;