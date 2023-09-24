import { FastifyInstance } from 'fastify'
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
                className : classe.class
            }
        })

        return classes
    })
    
    

    app.put('/classes', async() => { 
        
    })

    app.delete('/classes', async() => { 
        
    })

}