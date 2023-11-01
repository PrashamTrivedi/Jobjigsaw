// Expressjs server
import express from 'express'
import {Request, Response} from 'express'
import {createServer} from 'http'
import dotenv from 'dotenv'
import morganMiddleware from "./utils/morganMiddleware"
import Logger from "./utils/logger"
import swaggerUi from "swagger-ui-express"
import apiSpec from "./utils/swagger"
import 'source-map-support/register'

dotenv.config()


const app = express()

app.use(morganMiddleware)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

/**
 * @swagger
 * /logger:
 *   get:
 *     description: Returns the hello world
 *     parameters:
 *       - in: query
 *         name: generateError
 *         schema:
 *           type: boolean
 *         description: The boolean flag to generate an error
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: hello world
 */
app.get('/logger', (req: Request, res: Response) => {
    Logger.info('Hello World')
    Logger.error('Hello World')
    Logger.warn('Hello World')
    Logger.debug('Hello World')

    if (req.query.generateError) {
        throw new Error('Error')
    }


    res.send('Hello World')
})

const server = createServer(app)


server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})