import swaggerJSDoc from "swagger-jsdoc"

const options = {
    swaggerDefinition: {
        info: {
            title: 'Jobjigsaw API',
            version: '1.0.0',
            description: 'Jobjigsaw API',

        },
        host: process.env.API_HOST,
        basePath: '',
        swaggerOptions: {
            url: "/api-docs/swagger.json",
        },
    },
    apis: ['**/*.ts'],
}

const openApiSpecification = swaggerJSDoc(options)

export default openApiSpecification