import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()
async function main() {
    const classesToInsert = [
      '4º ano - Técnico em Informática',
      '3º ano - Técnico em Informática',
      '2º ano - Técnico em Informática',
      '1º ano - Técnico em Informática',
      '4º ano - Técnico em Química',
      '3º ano - Técnico em Química',
      '2º ano - Técnico em Química',
      '1º ano - Técnico em Química',
      '4º ano - Técnico em Meio Ambiente',
      '3º ano - Técnico em Meio Ambiente',
      '2º ano - Técnico em Meio Ambiente',
      '1º ano - Técnico em Meio Ambiente',
      '1º ano - Técnico em Administração',
    ];
  
    for (let i = 0; i < classesToInsert.length; i++) {
      const className = classesToInsert[i];
      await prisma.classes.upsert({
        where: { id: i + 1 },
        update: {},
        create: {
          className: className,
        },
      });
    }
  }
  
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })