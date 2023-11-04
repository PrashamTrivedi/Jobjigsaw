import swaggerJSDoc from "swagger-jsdoc"

const options = {
    swaggerDefinition: {
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API',
        },
        host: process.env.API_HOST,
        basePath: '/',
    },
    apis: ['**/*.ts'],
}

const openApiSpecification = swaggerJSDoc(options)

export default openApiSpecification