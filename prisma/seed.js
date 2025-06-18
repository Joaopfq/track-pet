import { PrismaClient, PostType, Species, Gender, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  let user = await prisma.user.findFirst();
  if (!user) {
    user = await prisma.user.create({
      data: {
        name: 'Seed User',
        username: 'seeduser',
        email: 'seeduser@example.com',
      },
    });
  }

  const posts = Array.from({ length: 30 }).map((_, i) => ({
    userId: user.id,
    type: i % 2 === 0 ? PostType.MISSING : PostType.FOUND,
    status: PostStatus.ACTIVE,
    postedAt: new Date(Date.now() - i * 1000 * 60 * 60 * 24), // spread dates
    petName: i % 5 === 0 ? `Pet${i}` : undefined,
    species: [Species.DOG, Species.CAT, Species.OTHER][i % 3],
    breed: i % 3 === 0 ? 'Mixed' : i % 3 === 1 ? 'Labrador' : 'Siamese',
    color: i % 2 === 0 ? 'Brown' : 'Black',
    gender: i % 3 === 0 ? Gender.MALE : i % 3 === 1 ? Gender.FEMALE : Gender.UNKNOWN,
    ageApprox: `${2 + (i % 10)} years`,
    specialCharacteristics: [`Characteristic ${i}`, `Unique Marking ${i}`],
    description: `This is a sample description for post #${i + 1}.`,
    photo: `https://place-puppy.com/puppy/y:${200 + (i % 10) * 10}/x:${300 + (i % 10) * 10}`,
    locationLat: -23.5 + Math.random(),
    locationLng: -46.6 + Math.random(),
    city: 'São Paulo',
    neighborhood: i % 4 === 0 ? 'Centro' : i % 4 === 1 ? 'Zona Sul' : i % 4 === 2 ? 'Zona Leste' : 'Zona Norte',
    missingDate: i % 2 === 0 ? new Date(Date.now() - (i + 2) * 1000 * 60 * 60 * 24) : null,
  }));

  await prisma.post.createMany({
    data: posts,
  });

  console.log('Seeded posts!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });