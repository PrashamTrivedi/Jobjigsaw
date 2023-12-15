import swaggerJSDoc from "swagger-jsdoc"
import fs from "fs"

// Get today's date in ddmmyyyy format
const today = new Date().toISOString().slice(0, 10).split("-").reverse().join("")

const options = {
    swaggerDefinition: {
        info: {
            title: 'Jobjigsaw API',
            version: `1.0.1-${today}`,
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
0
const openApiSpecification = swaggerJSDoc(options)
console.log("Writing spec ")
fs.writeFileSync("./dist/swagger.json", JSON.stringify(openApiSpecification, null, 2))

export default openApiSpecification