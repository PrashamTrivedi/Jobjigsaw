// Expressjs server
import express from 'express'
import {Request, Response} from 'express'
import {createServer} from 'http'
import dotenv from 'dotenv'
import morganMiddleware from "./utils/morganMiddleware"
import Logger from "./utils/logger"
import swaggerUi from "swagger-ui-express"
import apiSpec from "./utils/swagger"

dotenv.config()


const app = express()

app.use(morganMiddleware)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

/**
 * @swagger
 * /logger:
 *   get:
 *     description: Returns the hello world
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
    Logger.verbose('Hello World')

    res.send('Hello World')
})

const server = createServer(app)


server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})