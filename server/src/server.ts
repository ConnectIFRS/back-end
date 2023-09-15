import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import multipart from '@fastify/multipart'
import 'dotenv/config'
import fastify from 'fastify'
import { resolve } from 'node:path'
import { authRoutes } from './routes/authentication'


const app = fastify()

app.register(cors, {
  origin: true,
})

app.register(jwt, {
  secret: 'connectif',
})
// other modules register
app.register(multipart)
app.register(require('@fastify/static'), {
  root: resolve(__dirname, '../uploads'),
  prefix: '/uploads',
})

app.register(authRoutes);
app.listen({
    port: 3333,
    host: '0.0.0.0',
  })
  .then(() => {
    console.log('running server on http://localhost:3333')
  })
  .catch((err) => console.error(err))