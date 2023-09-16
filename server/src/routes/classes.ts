/* eslint-disable prettier/prettier */
import axios from 'axios'
import { compare, hash } from 'bcrypt'
import { FastifyInstance } from 'fastify'
import { randomInt } from 'node:crypto'
import { z } from 'zod'
import { prisma } from '../lib/prisma'


export async function classesRoutes(app: FastifyInstance) { 

    app.get('/classes', async() => { 
        const classes = await prisma.classes.findMany({ 
            orderBy: { 
                id : 'asc',
            },
        })
        return classes
    })

        

    app.post('/classes', async(request) => { 
        const bodySchema = z.object({ 
            class: z.string(),
        })
        const classe = bodySchema.parse(request.body)

        const classes = await prisma.classes.create({
            data: {
                class : classe.class
            }
        })

        return classes
    })
    
    

    app.put('/classes', async() => { 
        
    })

    app.delete('/classes', async() => { 
        
    })

}