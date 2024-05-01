import swaggerJSDoc from 'swagger-jsdoc';

// Swagger definition
const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Job Seeker API',
        version: '1.0.0',
        description: 'This is a REST API application made with Express. It retrieves data on job seekers.',
    },
    tags: [{
        name: 'Job Seeker',
        description: 'API for job seekers in the system'
    }],
    servers: [
        {
            url: 'http://localhost:3000',
            description: 'Development server',
        },
    ],
};

// Options for the swagger docs
const options = {
    // Import swaggerDefinitions
    swaggerDefinition,
    // Path to the API docs
    apis: ['src/routes/*.ts']
};

// Initialize swagger-jsdoc
export const swaggerSpec = swaggerJSDoc(options);
