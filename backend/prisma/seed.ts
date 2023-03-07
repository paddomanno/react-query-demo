import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

/**
 * Run with 'npx prisma db seed'
 */

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
      const bio = `I'm a ${faker.name.jobTitle()} at ${faker.company.name()} where I ${faker.company.bs()}.`;
      const username = faker.internet.userName(firstName, lastName);
      const imgUrl = faker.internet.avatar();

      const createdUser = await prisma.user.create({
        data: {
          email: email,
          website: website,
          bio: bio,
          username: username,
          realname: `${firstName} ${lastName}`,
          imgUrl: imgUrl,
        },
      });
      usersCreated++;
      console.log(`Created user #${createdUser.id}: ${username}`);

      // Create posts for this user
      for (let i = 0; i < 5; i++) {
        // Choose random tags for this post
        const tagsAmount = Math.floor(Math.random() * 3) + 2; // min 2, max 5
        const tags = faker.helpers.arrayElements(
          allAvailableTags,
          tagsAmount
        );
        const imgCategory = faker.helpers.arrayElement([
          'abstract',
          'animals',
          'business',
          'city',
          'nightlife',
          'technics',
          'transport',
        ]);
        await prisma.post.create({
          data: {
            title: faker.company
              .catchPhrase()
              .concat(' ', faker.internet.emoji()),
            imgUrl: faker.image.imageUrl(640, 480, imgCategory, true),
            content: faker.lorem.paragraphs(6, '<br/>\n'),
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
