import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'

// Simple test to identify schema issues
const app = new OpenAPIHono()

const testRoute = createRoute({
	method: 'get',
	path: '/test',
	responses: {
		200: {
			content: {
				'application/json': {
					schema: z.object({
						message: z.string()
					})
				}
			},
			description: 'Test endpoint'
		}
	}
})

app.openapi(testRoute, (c) => {
	return c.json({ message: 'Hello' })
})

app.doc('/doc', {
	openapi: '3.0.0',
	info: {
		version: '1.0.0',
		title: 'Test API'
	}
})

export default app