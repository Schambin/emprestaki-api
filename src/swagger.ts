import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Emprestaki API",
            version: "1.0.0",
            description: "Library Management API"
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: [
        "./src/routes/*.ts",
        "./src/**/controllers/*.ts",
        "./src/schemas/**/*.ts",
        "./src/**/schemas/*.ts",
        "./src/**/types/*.ts",
    ],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerUiOptions: SwaggerUiOptions = {
    customSiteTitle: "Emprestaki API Docs",
    customCss: ".swagger-ui .topbar { display: none }",
};
export { swaggerUiOptions, swaggerSpec };