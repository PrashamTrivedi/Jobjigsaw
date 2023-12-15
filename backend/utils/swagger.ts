import swaggerJSDoc from "swagger-jsdoc"
import fs from "fs"

const options = {
    swaggerDefinition: {
        info: {
            title: 'Jobjigsaw API',
            version: `1.0.1-${Date.now()}`,
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
console.log("Writing spec")
fs.writeFileSync("./dist/swagger.json", JSON.stringify(openApiSpecification, null, 2))

export default openApiSpecification