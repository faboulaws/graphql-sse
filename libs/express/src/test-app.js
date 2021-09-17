"use strict";
exports.__esModule = true;
var schema_1 = require("@graphql-tools/schema");
var http_1 = require("http");
var express = require("express");
var graphql_subscriptions_1 = require("graphql-subscriptions");
var subscription_server_1 = require("./subscription-server");
var app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
var httpServer = http_1.createServer(app);
var typeDefs = "\n        type Query {\n            greeting: String\n        } \n        \n        type Subscription {\n            whatTimeNow: Time\n        }\n\n        type Time {\n            value: String\n        }\n        ";
var pubsub = new graphql_subscriptions_1.PubSub();
var resolvers = {
    Subscription: {
        whatTimeNow: {
            subscribe: function () { return pubsub.asyncIterator(['TIME_UPDATED']); }
        }
    }
};
var schema = schema_1.makeExecutableSchema({
    typeDefs: typeDefs,
    resolvers: resolvers
});
subscription_server_1.SubscriptionServer.create({ app: app, schema: schema });
setInterval(function () {
    pubsub.publish('TIME_UPDATED', {
        whatTimeNow: {
            value: new Date().toISOString()
        }
    });
}, 5000);
var PORT = 4000;
httpServer.listen(PORT, function () {
    return console.log("Server is now running on http://localhost:" + PORT + "/graphql");
});
