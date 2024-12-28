// /**
//  * The function `generateUsersAndInvestments` creates users with random data and assigns them
//  * investment plans with statuses using Faker.js and Prisma in TypeScript.
//  */
// import { faker } from "@faker-js/faker";
// import { PrismaClient, InvestmentStatusEnum, UserRole } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function generateUsersAndInvestments() {
//   console.log("Fetching investment plans...");
//   const investmentPlans = await prisma.investmentPlan.findMany();
//   console.log("Investment plans fetched:", investmentPlans);

//   for (let i = 0; i < 10; i++) {
//     console.log(`Creating user ${i + 1}...`);
//     const user = await prisma.user.create({
//       data: {
//         email: faker.internet.email(),
//         firstName: faker.person.firstName(),
//         userName: faker.internet.userName(),
//         fullName: `${faker.person.firstName()} ${faker.person.lastName()}`,
//         imageUrl: faker.image.url(),
//         role: UserRole.user,
//       },
//     });
//     console.log(`User ${i + 1} created:`, user);

//     for (let j = 0; j < 20; j++) {
//       console.log(`Creating investment ${j + 1} for user ${i + 1}...`);
//       const plan = faker.helpers.arrayElement(investmentPlans);
//       console.log("Selected investment plan:", plan);

//       const createdAt = faker.date.between({
//         from: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
//         to: new Date(),
//       });
//       console.log("Generated createdAt:", createdAt);

//       const investment = await prisma.investment.create({
//         data: {
//           userId: user.id,
//           planId: plan.id,
//           createdAt,
//           updatedAt: createdAt,
//         },
//       });
//       console.log(`Investment ${j + 1} created for user ${i + 1}:`, investment);

//       const status = faker.helpers.arrayElement(
//         Object.values(InvestmentStatusEnum)
//       );
//       console.log("Generated investment status:", status);

//       await prisma.investmentStatus.create({
//         data: {
//           status,
//           investmentId: investment.id,
//           createdAt,
//           updatedAt: createdAt,
//         },
//       });
//       console.log(
//         `Investment status created for investment ${j + 1} of user ${i + 1}`
//       );
//     }

//     console.log(`Finished creating investments for user ${i + 1}`);
//   }

//   console.log("Users and investments generation completed.");
// }
