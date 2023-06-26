"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fastifySwaggerUiOptions = exports.fastifySwaggerOptions = void 0;
exports.fastifySwaggerOptions = {
    swagger: {
        info: {
            title: "Test swagger",
            description: "Testing the Fastify swagger API",
            version: "0.1.0",
        },
        externalDocs: {
            url: "https://swagger.io",
            description: "Find more info here",
        },
        host: "localhost:8080",
        schemes: ["http"],
        consumes: ["application/json"],
        produces: ["application/json"],
        securityDefinitions: {
            apiKey: {
                type: "apiKey",
                name: "apiKey",
                in: "header",
            },
        },
    },
};
exports.fastifySwaggerUiOptions = {
    routePrefix: "/documentation",
    uiConfig: {
        deepLinking: false,
    },
    uiHooks: {
        onRequest: function (_request, _reply, next) {
            next();
        },
        preHandler: function (_request, _reply, next) {
            next();
        },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => {
        return swaggerObject;
    },
    transformSpecificationClone: true,
};
