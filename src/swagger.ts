import swaggerJsdoc from "swagger-jsdoc";
import { SwaggerUiOptions } from 'swagger-ui-express'

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Emprestaki API",
            version: "1.0.0",
            description: "API para gerenciamento de biblioteca com sistema de empréstimos",
            contact: {
                name: "Sua Equipe",
                email: "suporte@emprestaki.com"
            }
        },
        servers: [
            {
                url: "http://localhost:8888/api",
                description: "Servidor de Desenvolvimento"
            }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
            schemas: {
                User: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        name: { type: "string" },
                        email: { type: "string", format: "email" },
                        role: {
                            type: "string",
                            enum: ["LEITOR", "ADMINISTRADOR"]
                        }
                    }
                },
                Book: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        title: { type: "string" },
                        author: { type: "string" },
                        category: { type: "string" },
                        status: {
                            type: "string",
                            enum: ["DISPONIVEL", "EMPRESTADO", "RESERVADO"]
                        }
                    }
                },
                Loan: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        userId: { type: "integer" },
                        bookId: { type: "integer" },
                        loanDate: { type: "string", format: "date-time" },
                        returnDate: { type: "string", format: "date-time" },
                        status: {
                            type: "string",
                            enum: ["PENDENTE", "DEVOLVIDO", "ATRASADO"]
                        }
                    }
                },
                Payment: {
                    type: "object",
                    properties: {
                        id: { type: "integer" },
                        loanId: { type: "integer" },
                        amount: { type: "number", format: "double" },
                        paymentDate: { type: "string", format: "date - time" },
                        status: {
                            type: "string",
                            enum: ["PENDENTE", "CONCLUIDO", "CANCELADO"]
                        },
                    }
                },
                AuthToken: {
                    type: "object",
                    properties: {
                        access_token: { type: "string" }
                    },
                    example: {
                        access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                    }
                },
                ErrorResponse: {
                    type: "object",
                    properties: {
                        error: { type: "string" }
                    },
                    example: {
                        error: "Mensagem de erro detalhada"
                    }
                }
            },
            responses: {
                UnauthorizedError: {
                    description: "Token inválido ou ausente",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            }
                        }
                    }
                },
                NotFoundError: {
                    description: "Recurso não encontrado",
                    content: {
                        "application/json": {
                            schema: {
                                $ref: "#/components/schemas/ErrorResponse"
                            }
                        }
                    }
                }
            }
        },
        security: [{ bearerAuth: [] }],
        tags: [
            { name: "Auth", description: "Autenticação de usuários" },
            { name: "Users", description: "Gerenciamento de usuários" },
            { name: "Books", description: "Gerenciamento de livros" },
            { name: "Loans", description: "Gerenciamento de empréstimos" },
            { name: "Payments", description: "Gerenciamento de pagamentos" }
        ]
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
    customCss: `
        .swagger-ui .topbar { display: none }
        .information-container { margin: 20px }
    `,
    customfavIcon: "/public/favicon.ico",
    explorer: true
};

export { swaggerUiOptions, swaggerSpec };