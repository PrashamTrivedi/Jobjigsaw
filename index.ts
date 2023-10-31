// Expressjs server
import express from 'express'
import {Request, Response} from 'express'
import {createServer} from 'http'
import dotenv from 'dotenv'

dotenv.config()


const app = express()

app.get('/', (req: Request, res: Response) => {
    res.send('Hello World')
})

const server = createServer(app)


server.listen(process.env.PORT || 3000, () => {
    console.log('Server is running')
})