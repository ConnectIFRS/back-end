import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  try {
    await prisma.comments.deleteMany({});
    await prisma.likes.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.followers.deleteMany({});
    await prisma.users.deleteMany({});
    await prisma.classes.deleteMany({});
    await prisma.preferences.deleteMany({});

    console.log('Limpeza concluída com sucesso.');
  } catch (error) {
    console.error('Erro ao limpar o banco de dados:', error);
    throw error; // Rejogando o erro para ser capturado no encadeamento de then/catch
  } finally {
    await prisma.$disconnect();
  }
}

cleanDatabase()
  .then(() => {
    process.exit(0); // Indica que a operação foi bem-sucedida
  })
  .catch((e) => {
    console.error(e);
    process.exit(1); // Indica que houve erro na operação
  });
