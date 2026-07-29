import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { Pool } from "pg";

import {
  PrismaClient,
  UserRole,
  OrderStatus,
} from "../src/generated/prisma/client";

const connectionString =
  process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined."
  );
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const demoWorkspace =
    await prisma.workspace.create({
      data: {
        name: "Demo Workspace",
      },
    });

  const demoPasswordHash = await hash(
    "admin123",
    12
  );

  const users = [
    {
      name: "Demo Admin",
      email: "admin@email.com",
      role: UserRole.Admin,
      passwordHash: demoPasswordHash,
    },
    {
      name: "John Doe",
      email: "john.doe@email.com",
      role: UserRole.Admin,
    },
    {
      name: "Alice Smith",
      email: "alice.smith@email.com",
      role: UserRole.User,
    },
    {
      name: "Bob Wilson",
      email: "bob.wilson@email.com",
      role: UserRole.Manager,
    },
    {
      name: "Emma Brown",
      email: "emma.brown@email.com",
      role: UserRole.User,
    },
    {
      name: "Liam Johnson",
      email: "liam.johnson@email.com",
      role: UserRole.User,
    },
    {
      name: "Olivia Davis",
      email: "olivia.davis@email.com",
      role: UserRole.Manager,
    },
    {
      name: "Noah Miller",
      email: "noah.miller@email.com",
      role: UserRole.User,
    },
    {
      name: "Ava Anderson",
      email: "ava.anderson@email.com",
      role: UserRole.User,
    },
    {
      name: "Ethan Taylor",
      email: "ethan.taylor@email.com",
      role: UserRole.Admin,
    },
    {
      name: "Sophia Thomas",
      email: "sophia.thomas@email.com",
      role: UserRole.User,
    },
    {
      name: "Mason Moore",
      email: "mason.moore@email.com",
      role: UserRole.Manager,
    },
    {
      name: "Isabella Martin",
      email: "isabella.martin@email.com",
      role: UserRole.User,
    },
    {
      name: "Lucas Jackson",
      email: "lucas.jackson@email.com",
      role: UserRole.User,
    },
    {
      name: "Mia White",
      email: "mia.white@email.com",
      role: UserRole.Manager,
    },
    {
      name: "James Harris",
      email: "james.harris@email.com",
      role: UserRole.User,
    },
    {
      name: "Charlotte Clark",
      email: "charlotte.clark@email.com",
      role: UserRole.Admin,
    },
    {
      name: "Benjamin Lewis",
      email: "benjamin.lewis@email.com",
      role: UserRole.User,
    },
    {
      name: "Amelia Walker",
      email: "amelia.walker@email.com",
      role: UserRole.User,
    },
  ];

  await prisma.user.createMany({
    data: users.map((user) => ({
      ...user,
      workspaceId: demoWorkspace.id,
    })),
  });

  const products = [
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
  ];

  await prisma.product.createMany({
    data: products.map((product) => ({
      ...product,
      workspaceId: demoWorkspace.id,
    })),
  });

  const orders = [
    {
      customer: "John Doe",
      total: 79,
      status: OrderStatus.Completed,
    },
    {
      customer: "Alice Smith",
      total: 149,
      status: OrderStatus.Completed,
    },
    {
      customer: "Bob Wilson",
      total: 29,
      status: OrderStatus.Pending,
    },
    {
      customer: "Emma Brown",
      total: 299,
      status: OrderStatus.Processing,
    },
    {
      customer: "Liam Johnson",
      total: 118,
      status: OrderStatus.Completed,
    },
    {
      customer: "Olivia Davis",
      total: 59,
      status: OrderStatus.Pending,
    },
    {
      customer: "Noah Miller",
      total: 198,
      status: OrderStatus.Processing,
    },
    {
      customer: "Ava Anderson",
      total: 49,
      status: OrderStatus.Completed,
    },
    {
      customer: "Ethan Taylor",
      total: 328,
      status: OrderStatus.Completed,
    },
    {
      customer: "Sophia Thomas",
      total: 89,
      status: OrderStatus.Pending,
    },
    {
      customer: "Mason Moore",
      total: 149,
      status: OrderStatus.Processing,
    },
    {
      customer: "Isabella Martin",
      total: 39,
      status: OrderStatus.Completed,
    },
    {
      customer: "Lucas Jackson",
      total: 99,
      status: OrderStatus.Completed,
    },
    {
      customer: "Mia White",
      total: 188,
      status: OrderStatus.Pending,
    },
    {
      customer: "James Harris",
      total: 69,
      status: OrderStatus.Processing,
    },
    {
      customer: "Charlotte Clark",
      total: 299,
      status: OrderStatus.Completed,
    },
    {
      customer: "Benjamin Lewis",
      total: 108,
      status: OrderStatus.Completed,
    },
    {
      customer: "Amelia Walker",
      total: 29,
      status: OrderStatus.Pending,
    },
    {
      customer: "John Doe",
      total: 168,
      status: OrderStatus.Processing,
    },
    {
      customer: "Alice Smith",
      total: 59,
      status: OrderStatus.Completed,
    },
    {
      customer: "Bob Wilson",
      total: 99,
      status: OrderStatus.Pending,
    },
    {
      customer: "Emma Brown",
      total: 218,
      status: OrderStatus.Completed,
    },
    {
      customer: "Liam Johnson",
      total: 49,
      status: OrderStatus.Processing,
    },
    {
      customer: "Olivia Davis",
      total: 129,
      status: OrderStatus.Completed,
    },
    {
      customer: "Noah Miller",
      total: 79,
      status: OrderStatus.Pending,
    },
    {
      customer: "Ava Anderson",
      total: 388,
      status: OrderStatus.Completed,
    },
    {
      customer: "Ethan Taylor",
      total: 39,
      status: OrderStatus.Processing,
    },
    {
      customer: "Sophia Thomas",
      total: 148,
      status: OrderStatus.Completed,
    },
    {
      customer: "Mason Moore",
      total: 89,
      status: OrderStatus.Pending,
    },
    {
      customer: "Isabella Martin",
      total: 299,
      status: OrderStatus.Completed,
    },
  ];

  await prisma.order.createMany({
    data: orders.map((order) => ({
      ...order,
      workspaceId: demoWorkspace.id,
    })),
  });

  console.log(
    `Database seeded successfully. Demo workspace ID: ${demoWorkspace.id}`
  );
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