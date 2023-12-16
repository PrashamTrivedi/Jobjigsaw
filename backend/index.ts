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
import router from "./routes"
import * as Sentry from "@sentry/node"
import {ProfilingIntegration} from "@sentry/profiling-node"
dotenv.config()


const app = express()

Sentry.init({
    dsn: "https://c8ff5d6d59483306a571fd7d9b4f1425@o4506404751867904.ingest.sentry.io/4506404757700608",
    integrations: [
        // enable HTTP calls tracing
        new Sentry.Integrations.Http({tracing: true}),
        // enable Express.js middleware tracing
        new Sentry.Integrations.Express({app}),
        new ProfilingIntegration(),
    ],
    // Performance Monitoring
    tracesSampleRate: 0.8, //  Capture 80% of the transactions
    // Set sampling rate for profiling - this is relative to tracesSampleRate
    profilesSampleRate: 1.0,
})

// The request handler must be the first middleware on the app
app.use(Sentry.Handlers.requestHandler())

// TracingHandler creates a trace for every incoming request
app.use(Sentry.Handlers.tracingHandler())
// parse application/json
app.use(express.json())

app.use(morganMiddleware)


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

app.use('/', router)



app.get("/api-docs/swagger.json", (req, res) => res.json(apiSpec))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiSpec))

// The error handler must be registered before any other error middleware and after all controllers
app.use(Sentry.Handlers.errorHandler())

const server = createServer(app)


server.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`)
})