/* eslint-disable prettier/prettier */
import axios from 'axios'
import { compare, hash } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../lib/prisma'

export async function authRoutes(app: FastifyInstance) {
    app.post('/users', async (request, reply) => {
        const bodySchema = z.object({
            name: z.string(),
            login: z.string(),
            password: z.string(),
            class: z.number()
            // avatarUrl: z.string()
        })

        const { name, login, password, class: userClass } = bodySchema.parse(request.body)


        let user = await prisma.users.findUnique({
            where: {
              login,
            },
          })

        if (!user) {
            const randomSalt = randomInt(10, 16)
            const passwordHash = await hash(password, randomSalt)
            user = await prisma.users.create({
                data: {
                    login,
                    name,
                    password: passwordHash,
                    classId: userClass,
                }
            })
        }
        const token = app.jwt.sign(
            {
                name: user.name,
            },
            {
                sub: user.id,
                expiresIn: '15 days'
            }
        )
        return {token}
    });

    app.post('/login', async (request, reply) => {
        const bodySchema = z.object({
            login: z.string(),
            password: z.string(),
        })

        const { login, password } = bodySchema.parse(request.body)

        let user = await prisma.users.findUnique({
            where: {
              login,
            },
          })
          if (user) {

            const isValidPassword = await compare(password, user.password)
            if (isValidPassword) {
                const token = app.jwt.sign(
                    {
                        name: user.name,
                    },
                    {
                        sub: user.id,
                        expiresIn: '15 days'
                    }
                )
                return {token}
            } else {
                reply.status(401).send('Login ou senha informados incorretamente')
            }
          }
    })

    app.put('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user

    const paramsSchema = z.object({
      id: z.string().uuid(),
    })

    const { id } = paramsSchema.parse(request.params)

    const bodySchema = z.object({
        name: z.string(),
        // login: z.string(),
        // password: z.string(),
        // avatarUrl: z.string()
    })

        const { name } = bodySchema.parse(request.body)


        let user = await prisma.users.findUniqueOrThrow({
            where: {
              id,
            },
          })

          if (userId !== id) {
            return reply.status(401).send()
          }
            user = await prisma.users.update({
                where: {
                    id
                },
                data: {
                    name,
                }
            })
        const token = app.jwt.sign(
            {
                name: user.name,
            },
            {
                sub: user.id,
                expiresIn: '15 days'
            }
        )
        return {token}
    });

    app.delete('/users/:id', async (request, reply) => {
        const { sub: userId } = request.user

        const paramsSchema = z.object({
          id: z.string().uuid(),
        })
    
        const { id } = paramsSchema.parse(request.params)

        const user = await prisma.users.findUniqueOrThrow({
            where: {
                id
            }
        })

        if (userId !== id) {
            return reply.status(401).send()
        }

        await prisma.users.delete({
            where: {
                id
            }
        })
    })
}