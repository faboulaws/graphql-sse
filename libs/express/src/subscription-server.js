"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.SubscriptionServer = void 0;
var graphql_helix_1 = require("graphql-helix");
var events_1 = require("events");
var uuid_1 = require("uuid");
var SubscriptionServer = /** @class */ (function () {
    function SubscriptionServer(options) {
        var _this = this;
        var app = options.app, schema = options.schema;
        app.post('/graphql-sub', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var request, _a, operationName, query, variables, result;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        request = {
                            body: req.body,
                            headers: req.headers,
                            method: req.method,
                            query: req.query
                        };
                        _a = graphql_helix_1.getGraphQLParameters(request), operationName = _a.operationName, query = _a.query, variables = _a.variables;
                        return [4 /*yield*/, graphql_helix_1.processRequest({
                                operationName: operationName,
                                query: query,
                                variables: variables,
                                request: req,
                                schema: schema
                            })];
                    case 1:
                        result = _b.sent();
                        if (result.type === 'RESPONSE') {
                            result.headers.forEach(function (_a) {
                                var name = _a.name, value = _a.value;
                                return res.setHeader(name, value);
                            });
                            res.status(result.status);
                            res.json(result.payload);
                        }
                        else if (result.type === 'PUSH') {
                            res.writeHead(200, {
                                'Content-Type': 'text/event-stream',
                                Connection: 'keep-alive',
                                'Cache-Control': 'no-cache'
                            });
                            result.subscribe(function (data) {
                                res.write("data: " + JSON.stringify(data) + "\n\n");
                            });
                            req.on('close', function () {
                                result.unsubscribe();
                            });
                        }
                        else {
                            // throw new Error('Only subscription requests are allowed');
                            res.json({ error: 'Only subscription requests are allowed' });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        var eventEmitter = new events_1.EventEmitter();
        app.post('/subscribe', function (req, res) { return __awaiter(_this, void 0, void 0, function () {
            var request, _a, operationName, query, variables, result, subscriptionId;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        request = {
                            body: req.body,
                            headers: req.headers,
                            method: req.method,
                            query: req.query
                        };
                        _a = graphql_helix_1.getGraphQLParameters(request), operationName = _a.operationName, query = _a.query, variables = _a.variables;
                        return [4 /*yield*/, graphql_helix_1.processRequest({
                                operationName: operationName,
                                query: query,
                                variables: variables,
                                request: req,
                                schema: schema
                            })];
                    case 1:
                        result = _b.sent();
                        subscriptionId = uuid_1.v4();
                        if (result.type === 'RESPONSE') {
                            result.headers.forEach(function (_a) {
                                var name = _a.name, value = _a.value;
                                return res.setHeader(name, value);
                            });
                            res.status(result.status);
                            res.json(result.payload);
                        }
                        else if (result.type === 'PUSH') {
                            result.subscribe(function (result) {
                                eventEmitter.emit("subscription/" + subscriptionId + "/data", result);
                            });
                            eventEmitter.on("unsubscribe/" + subscriptionId, function () {
                                result.unsubscribe();
                            });
                            res.json({ subscriptionId: subscriptionId });
                        }
                        else {
                            // throw new Error('Only subscription requests are allowed');
                            res.json({ error: 'Only subscription requests are allowed' });
                        }
                        return [2 /*return*/];
                }
            });
        }); });
        app.get('/subscriptions/:subscriptionId', function (request, response) {
            var subscriptionId = request.params.subscriptionId;
            response.writeHead(200, {
                'Content-Type': 'text/event-stream',
                Connection: 'keep-alive',
                'Cache-Control': 'no-cache'
            });
            eventEmitter.on("subscription/" + subscriptionId + "/data", function (data) {
                response.write("data: " + JSON.stringify(data) + "\n\n");
                console.log({ data: JSON.stringify(data) });
            });
            request.on('close', function () {
                eventEmitter.emit("unsubscribe/" + subscriptionId);
            });
        });
    }
    SubscriptionServer.create = function (options) {
        return new SubscriptionServer(options);
    };
    return SubscriptionServer;
}());
exports.SubscriptionServer = SubscriptionServer;
