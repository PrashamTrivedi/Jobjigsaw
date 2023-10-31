import swaggerJSDoc from "swagger-jsdoc"

const options = {
    swaggerDefinition: {
        info: {
            title: 'API',
            version: '1.0.0',
            description: 'API',
        },
        host: 'localhost:3000',
        basePath: '/',
    },
    apis: ['./src/index.ts'],
}

const openApiSpecification = swaggerJSDoc(options)

export default openApiSpecification