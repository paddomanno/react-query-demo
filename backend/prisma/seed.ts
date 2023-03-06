import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();
async function main() {
  let allAvailableTags = [];

  for (let i = 0; i < 20; i++) {
    if (Math.random() > 0.5) {
      allAvailableTags.push(faker.hacker.adjective());
    } else {
      allAvailableTags.push(faker.company.catchPhraseAdjective());
    }
  }

  console.log(allAvailableTags);

  let usersCreated = 0;
  while (usersCreated < 20) {
    try {
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      const email = faker.internet.email(firstName, lastName);
      const website = faker.internet.url();
      const bio = `I'm a ${faker.name.jobTitle} at ${faker.company.name} where I ${faker.company.bs}.`;
      const username = faker.internet.userName(firstName, lastName);

      const createdUser = await prisma.user.create({
        data: {
          email: email,
          website: website,
          bio: bio,
          username: username,
          realname: `${firstName} ${lastName}`,
        },
      });
      usersCreated++;
      console.log(`Created user #${createdUser.id}: ${username}`);

      // Create posts for this user
      for (let i = 0; i < 5; i++) {
        // Choose random tags for this post
        const tags = faker.helpers.arrayElements(allAvailableTags);
        await prisma.post.create({
          data: {
            title: faker.company.catchPhrase(),
            content: faker.lorem.paragraphs(3),
            createdDate: faker.date.recent(10),
            author: {
              connect: {
                id: createdUser.id,
              },
            },
            tags: {
              connectOrCreate: tags.map((tagName) => {
                return {
                  where: { name: tagName },
                  create: { name: tagName },
                };
              }),
            },
          },
        });
      }
    } catch (error) {
      continue;
    }
  }
  console.log('All done!');
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
