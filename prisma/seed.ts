import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

import { PrismaClient } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.createMany({
    data: [
      {
        name: "John Doe",
        email: "john.doe@email.com",
        role: "Admin",
      },
      {
        name: "Alice Smith",
        email: "alice.smith@email.com",
        role: "User",
      },
      {
        name: "Bob Wilson",
        email: "bob.wilson@email.com",
        role: "Manager",
      },
      {
        name: "Emma Brown",
        email: "emma.brown@email.com",
        role: "User",
      },
      {
        name: "Liam Johnson",
        email: "liam.johnson@email.com",
        role: "User",
      },
      {
        name: "Olivia Davis",
        email: "olivia.davis@email.com",
        role: "Manager",
      },
      {
        name: "Noah Miller",
        email: "noah.miller@email.com",
        role: "User",
      },
      {
        name: "Ava Anderson",
        email: "ava.anderson@email.com",
        role: "User",
      },
      {
        name: "Ethan Taylor",
        email: "ethan.taylor@email.com",
        role: "Admin",
      },
      {
        name: "Sophia Thomas",
        email: "sophia.thomas@email.com",
        role: "User",
      },
      {
        name: "Mason Moore",
        email: "mason.moore@email.com",
        role: "Manager",
      },
      {
        name: "Isabella Martin",
        email: "isabella.martin@email.com",
        role: "User",
      },
      {
        name: "Lucas Jackson",
        email: "lucas.jackson@email.com",
        role: "User",
      },
      {
        name: "Mia White",
        email: "mia.white@email.com",
        role: "Manager",
      },
      {
        name: "James Harris",
        email: "james.harris@email.com",
        role: "User",
      },
      {
        name: "Charlotte Clark",
        email: "charlotte.clark@email.com",
        role: "Admin",
      },
      {
        name: "Benjamin Lewis",
        email: "benjamin.lewis@email.com",
        role: "User",
      },
      {
        name: "Amelia Walker",
        email: "amelia.walker@email.com",
        role: "User",
      },
    ],
  });

  await prisma.product.createMany({
    data: [
      {
        name: "Starter Plan",
        price: 29,
        stock: 120,
      },
      {
        name: "Professional Plan",
        price: 79,
        stock: 85,
      },
      {
        name: "Business Plan",
        price: 149,
        stock: 62,
      },
      {
        name: "Enterprise Plan",
        price: 299,
        stock: 18,
      },
      {
        name: "Analytics Add-on",
        price: 39,
        stock: 75,
      },
      {
        name: "Priority Support",
        price: 59,
        stock: 40,
      },
      {
        name: "Team Collaboration",
        price: 49,
        stock: 94,
      },
      {
        name: "Advanced Reports",
        price: 69,
        stock: 53,
      },
      {
        name: "Cloud Storage 100 GB",
        price: 19,
        stock: 140,
      },
      {
        name: "Cloud Storage 1 TB",
        price: 99,
        stock: 67,
      },
      {
        name: "Custom Branding",
        price: 89,
        stock: 31,
      },
      {
        name: "API Access",
        price: 129,
        stock: 24,
      },
    ],
  });

  await prisma.order.createMany({
    data: [
      {
        customer: "John Doe",
        total: 79,
        status: "Completed",
      },
      {
        customer: "Alice Smith",
        total: 149,
        status: "Completed",
      },
      {
        customer: "Bob Wilson",
        total: 29,
        status: "Pending",
      },
      {
        customer: "Emma Brown",
        total: 299,
        status: "Processing",
      },
      {
        customer: "Liam Johnson",
        total: 118,
        status: "Completed",
      },
      {
        customer: "Olivia Davis",
        total: 59,
        status: "Pending",
      },
      {
        customer: "Noah Miller",
        total: 198,
        status: "Processing",
      },
      {
        customer: "Ava Anderson",
        total: 49,
        status: "Completed",
      },
      {
        customer: "Ethan Taylor",
        total: 328,
        status: "Completed",
      },
      {
        customer: "Sophia Thomas",
        total: 89,
        status: "Pending",
      },
      {
        customer: "Mason Moore",
        total: 149,
        status: "Processing",
      },
      {
        customer: "Isabella Martin",
        total: 39,
        status: "Completed",
      },
      {
        customer: "Lucas Jackson",
        total: 99,
        status: "Completed",
      },
      {
        customer: "Mia White",
        total: 188,
        status: "Pending",
      },
      {
        customer: "James Harris",
        total: 69,
        status: "Processing",
      },
      {
        customer: "Charlotte Clark",
        total: 299,
        status: "Completed",
      },
      {
        customer: "Benjamin Lewis",
        total: 108,
        status: "Completed",
      },
      {
        customer: "Amelia Walker",
        total: 29,
        status: "Pending",
      },
      {
        customer: "John Doe",
        total: 168,
        status: "Processing",
      },
      {
        customer: "Alice Smith",
        total: 59,
        status: "Completed",
      },
      {
        customer: "Bob Wilson",
        total: 99,
        status: "Pending",
      },
      {
        customer: "Emma Brown",
        total: 218,
        status: "Completed",
      },
      {
        customer: "Liam Johnson",
        total: 49,
        status: "Processing",
      },
      {
        customer: "Olivia Davis",
        total: 129,
        status: "Completed",
      },
      {
        customer: "Noah Miller",
        total: 79,
        status: "Pending",
      },
      {
        customer: "Ava Anderson",
        total: 388,
        status: "Completed",
      },
      {
        customer: "Ethan Taylor",
        total: 39,
        status: "Processing",
      },
      {
        customer: "Sophia Thomas",
        total: 148,
        status: "Completed",
      },
      {
        customer: "Mason Moore",
        total: 89,
        status: "Pending",
      },
      {
        customer: "Isabella Martin",
        total: 299,
        status: "Completed",
      },
    ],
  });

  console.log("Database seeded successfully.");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (error) => {
    console.error(error);

    await prisma.$disconnect();
    await pool.end();

    process.exit(1);
  });