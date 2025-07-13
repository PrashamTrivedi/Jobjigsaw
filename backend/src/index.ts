import { OpenAPIHono } from '@hono/zod-openapi'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { secureHeaders } from 'hono/secure-headers'
import { swaggerUI } from '@hono/swagger-ui'

import { Env } from './types'
import openapiApp from './openapi'

const app = new OpenAPIHono<{ Bindings: Env }>()

// Middleware
app.use('*', logger())
app.use('*', cors())
app.use('*', secureHeaders())





// Basic error handling
app.onError((err, c) => {
	console.error(`${err}`)
	return c.text('Internal Server Error', 500)
})

app.route('/', openapiApp)

app.doc('/openapi.json', {
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'My API',
	},
})

app.get(
	'/doc',
	swaggerUI({
		url: '/openapi.json',
	})
)

export default app