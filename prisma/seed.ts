import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { hash } from "bcryptjs";
import { Pool } from "pg";

import { PrismaClient, SubscriptionStatus, UserRole } from "../src/generated/prisma/client";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not defined.");
}

const pool = new Pool({
  connectionString,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});

type TransactionSeed = {
  amount: number;
  status: "Pending" | "Paid" | "Failed" | "Refunded";
  subscriptionId: number;
  workspaceId: number;
  paidAt: Date | null;
  createdAt: Date;
};

async function main() {
  /*
    Delete records that depend on other models first.
  */
  await prisma.transaction.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workspace.deleteMany();

  const demoWorkspace = await prisma.workspace.create({
    data: {
      name: "Demo Workspace",
    },
  });

  const adminPasswordHash = await hash("AdminDemo2026!", 12);
  const managerPasswordHash = await hash("ManagerDemo2026!", 12);
  const userPasswordHash = await hash("UserDemo2026!", 12);

  /*
    Internal team members.

    The three Demo accounts are real database users with passwords so
    portfolio reviewers can test each permission level from the login page.

    The remaining emails intentionally use a few different corporate-style
    patterns so searching by email can be tested independently from names.
  */
  const users = [
    {
      name: "Demo Admin",
      email: "admin@email.com",
      role: UserRole.Admin,
      passwordHash: adminPasswordHash,
    },
    {
      name: "Demo Manager",
      email: "manager@email.com",
      role: UserRole.Manager,
      passwordHash: managerPasswordHash,
    },
    {
      name: "Demo User",
      email: "user@email.com",
      role: UserRole.User,
      passwordHash: userPasswordHash,
    },
    {
      name: "John Doe",
      email: "jdoe@demoworkspace.com",
      role: UserRole.Admin,
    },
    {
      name: "Emma Brown",
      email: "ebrown@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Liam Johnson",
      email: "ljohnson@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Olivia Davis",
      email: "odavis@demoworkspace.com",
      role: UserRole.Manager,
    },
    {
      name: "Noah Miller",
      email: "nmiller@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Ava Anderson",
      email: "aanderson@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Ethan Taylor",
      email: "etaylor@demoworkspace.com",
      role: UserRole.Admin,
    },
    {
      name: "Sophia Thomas",
      email: "sthomas@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Mason Moore",
      email: "mmoore@demoworkspace.com",
      role: UserRole.Manager,
    },
    {
      name: "Isabella Martin",
      email: "imartin@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Lucas Jackson",
      email: "ljackson@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Mia White",
      email: "mwhite@demoworkspace.com",
      role: UserRole.Manager,
    },
    {
      name: "James Harris",
      email: "jharris@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Charlotte Clark",
      email: "cclark@demoworkspace.com",
      role: UserRole.Admin,
    },
    {
      name: "Benjamin Lewis",
      email: "blewis@demoworkspace.com",
      role: UserRole.User,
    },
    {
      name: "Amelia Walker",
      email: "awalker@demoworkspace.com",
      role: UserRole.User,
    },
  ];

  await prisma.user.createMany({
    data: users.map((user) => ({
      ...user,
      workspaceId: demoWorkspace.id,
    })),
  });

  /*
    SaaS subscription plans.
  */
  const starterPlan = await prisma.plan.create({
    data: {
      name: "Starter",
      monthlyPrice: 29,
      workspaceId: demoWorkspace.id,
    },
  });

  const professionalPlan = await prisma.plan.create({
    data: {
      name: "Professional",
      monthlyPrice: 79,
      workspaceId: demoWorkspace.id,
    },
  });

  const businessPlan = await prisma.plan.create({
    data: {
      name: "Business",
      monthlyPrice: 149,
      workspaceId: demoWorkspace.id,
    },
  });

  const enterprisePlan = await prisma.plan.create({
    data: {
      name: "Enterprise",
      monthlyPrice: 299,
      workspaceId: demoWorkspace.id,
    },
  });

  /*
    Customers join throughout the historical period.

    Every customer is created before their
    subscription starts.
  */
  const customers = [
    {
      name: "Emily Carter",
      email: "ecarter@northstarlabs.com",
      company: "Northstar Labs",
      createdAt: new Date("2026-03-01T14:00:00Z"),
    },
    {
      name: "Daniel Brooks",
      email: "dbrooks@pixelbridge.io",
      company: "PixelBridge",
      createdAt: new Date("2026-03-13T15:30:00Z"),
    },
    {
      name: "Rachel Adams",
      email: "radams@brightpath.co",
      company: "BrightPath",
      createdAt: new Date("2026-03-29T11:00:00Z"),
    },
    {
      name: "Michael Turner",
      email: "mturner@cloudnest.io",
      company: "CloudNest",
      createdAt: new Date("2026-04-08T16:00:00Z"),
    },
    {
      name: "Jessica Reed",
      email: "jreed@orbitworks.com",
      company: "OrbitWorks",
      createdAt: new Date("2026-04-21T10:30:00Z"),
    },
    {
      name: "Andrew Collins",
      email: "acollins@novaforge.dev",
      company: "NovaForge",
      createdAt: new Date("2026-05-01T13:00:00Z"),
    },
    {
      name: "Laura Bennett",
      email: "lbennett@vertexlabs.io",
      company: "Vertex Labs",
      createdAt: new Date("2026-05-12T12:00:00Z"),
    },
    {
      name: "Christopher Hall",
      email: "chall@lumina.dev",
      company: "Lumina",
      createdAt: new Date("2026-05-23T15:00:00Z"),
    },
    {
      name: "Natalie Cooper",
      email: "ncooper@apexflow.io",
      company: "ApexFlow",
      createdAt: new Date("2026-05-28T09:30:00Z"),
    },
    {
      name: "Matthew Green",
      email: "mgreen@summitstack.com",
      company: "SummitStack",
      createdAt: new Date("2026-06-04T14:30:00Z"),
    },
    {
      name: "Samantha Baker",
      email: "sbaker@bluepeak.io",
      company: "BluePeak",
      createdAt: new Date("2026-06-12T11:30:00Z"),
    },
    {
      name: "Ryan Mitchell",
      email: "rmitchell@launchgrid.dev",
      company: "LaunchGrid",
      createdAt: new Date("2026-06-21T16:00:00Z"),
    },
    {
      name: "Hannah Parker",
      email: "hparker@clearwave.io",
      company: "ClearWave",
      createdAt: new Date("2026-06-28T13:30:00Z"),
    },
    {
      name: "Joshua Evans",
      email: "jevans@corelink.dev",
      company: "CoreLink",
      createdAt: new Date("2026-07-03T10:00:00Z"),
    },
    {
      name: "Nicole Edwards",
      email: "nedwards@nextlayer.io",
      company: "NextLayer",
      createdAt: new Date("2026-07-08T15:00:00Z"),
    },
    {
      name: "Brandon Scott",
      email: "bscott@quantumdesk.com",
      company: "QuantumDesk",
      createdAt: new Date("2026-07-15T12:00:00Z"),
    },
    {
      name: "Grace Morris",
      email: "gmorris@velocityhub.io",
      company: "VelocityHub",
      createdAt: new Date("2026-07-22T14:00:00Z"),
    },
    {
      name: "Kevin Rogers",
      email: "krogers@streamline.dev",
      company: "Streamline",
      createdAt: new Date("2026-07-28T11:00:00Z"),
    },
    {
      name: "Victoria Cook",
      email: "vcook@zenithapps.com",
      company: "Zenith Apps",
      createdAt: new Date("2026-07-30T15:00:00Z"),
    },
    {
      name: "Justin Morgan",
      email: "jmorgan@framebase.io",
      company: "FrameBase",
      createdAt: new Date("2026-08-01T10:30:00Z"),
    },
    {
      name: "Rebecca Bell",
      email: "rbell@signalcraft.dev",
      company: "SignalCraft",
      createdAt: new Date("2026-08-03T14:30:00Z"),
    },
    {
      name: "Aaron Murphy",
      email: "amurphy@elevatecloud.io",
      company: "Elevate Cloud",
      createdAt: new Date("2026-08-05T09:00:00Z"),
    },
    {
      name: "Megan Bailey",
      email: "mbailey@prismtech.dev",
      company: "PrismTech",
      createdAt: new Date("2026-08-07T13:00:00Z"),
    },
    {
      name: "Eric Rivera",
      email: "erivera@vectorlabs.io",
      company: "Vector Labs",
      createdAt: new Date("2026-08-09T16:00:00Z"),
    },
  ];

  const createdCustomers = await Promise.all(
    customers.map((customer) =>
      prisma.customer.create({
        data: {
          ...customer,
          workspaceId: demoWorkspace.id,
        },
      })
    )
  );

  /*
    Historical subscription acquisition:

    Mar: 2
    Apr: 3
    May: 3
    Jun: 4
    Jul: 5
    Aug: 7

    Total: 24
  */
  const subscriptionData = [
    // March
    {
      customer: createdCustomers[0],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-03-04T12:00:00Z"),
    },
    {
      customer: createdCustomers[1],
      plan: starterPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-03-18T12:00:00Z"),
    },

    // April
    {
      customer: createdCustomers[2],
      plan: businessPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-04-03T12:00:00Z"),
    },
    {
      customer: createdCustomers[3],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-04-14T12:00:00Z"),
    },
    {
      customer: createdCustomers[4],
      plan: starterPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-04-26T12:00:00Z"),
    },

    // May
    {
      customer: createdCustomers[5],
      plan: businessPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-05-05T12:00:00Z"),
    },
    {
      customer: createdCustomers[6],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-05-17T12:00:00Z"),
    },
    {
      customer: createdCustomers[7],
      plan: enterprisePlan,
      status: SubscriptionStatus.Canceled,
      startedAt: new Date("2026-05-28T12:00:00Z"),
      canceledAt: new Date("2026-07-08T12:00:00Z"),
    },

    // June
    {
      customer: createdCustomers[8],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-06-02T12:00:00Z"),
    },
    {
      customer: createdCustomers[9],
      plan: businessPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-06-09T12:00:00Z"),
    },
    {
      customer: createdCustomers[10],
      plan: starterPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-06-18T12:00:00Z"),
    },
    {
      customer: createdCustomers[11],
      plan: professionalPlan,
      status: SubscriptionStatus.Canceled,
      startedAt: new Date("2026-06-26T12:00:00Z"),
      canceledAt: new Date("2026-07-29T12:00:00Z"),
    },

    // July
    {
      customer: createdCustomers[12],
      plan: businessPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-07-02T12:00:00Z"),
    },
    {
      customer: createdCustomers[13],
      plan: starterPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-07-07T12:00:00Z"),
    },
    {
      customer: createdCustomers[14],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-07-13T12:00:00Z"),
    },
    {
      customer: createdCustomers[15],
      plan: enterprisePlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-07-20T12:00:00Z"),
    },
    {
      customer: createdCustomers[16],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-07-27T12:00:00Z"),
    },

    // August
    {
      customer: createdCustomers[17],
      plan: businessPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-08-01T12:00:00Z"),
    },
    {
      customer: createdCustomers[18],
      plan: starterPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-08-03T12:00:00Z"),
    },
    {
      customer: createdCustomers[19],
      plan: professionalPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-08-05T12:00:00Z"),
    },
    {
      customer: createdCustomers[20],
      plan: businessPlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-08-07T12:00:00Z"),
    },
    {
      customer: createdCustomers[21],
      plan: starterPlan,
      status: SubscriptionStatus.Trialing,
      startedAt: new Date("2026-08-09T12:00:00Z"),
    },
    {
      customer: createdCustomers[22],
      plan: professionalPlan,
      status: SubscriptionStatus.Trialing,
      startedAt: new Date("2026-08-10T12:00:00Z"),
    },
    {
      customer: createdCustomers[23],
      plan: enterprisePlan,
      status: SubscriptionStatus.Active,
      startedAt: new Date("2026-08-11T12:00:00Z"),
    },
  ];

  const createdSubscriptions = await Promise.all(
    subscriptionData.map(({ customer, plan, status, startedAt, canceledAt }) =>
      prisma.subscription.create({
        data: {
          customerId: customer.id,
          planId: plan.id,
          status,
          startedAt,
          canceledAt,
          workspaceId: demoWorkspace.id,
        },

        include: {
          plan: true,
        },
      })
    )
  );

  /*
    Generate recurring monthly payments.

    A subscription stores the current recurring price, while each transaction
    stores the amount that was actually charged for that specific billing event.

    To make the demo history more realistic, payments before July use older
    historical plan prices. One recent first payment also uses a 50% introductory
    discount. This makes Transaction.amount meaningfully different from the
    subscription's current monthly price without inventing random values.

    Trial subscriptions do not generate successful revenue yet.
  */
  const transactionData: TransactionSeed[] = [];

  const seedEndDate = new Date("2026-08-12T23:59:59Z");
  const currentPricingStartedAt = new Date("2026-07-01T00:00:00Z");

  const historicalPlanPrices: Record<string, number> = {
    Starter: 25,
    Professional: 69,
    Business: 129,
    Enterprise: 249,
  };

  createdSubscriptions.forEach((subscription, subscriptionIndex) => {
    if (subscription.status === SubscriptionStatus.Trialing) {
      return;
    }

    const billingDate = new Date(subscription.startedAt);
    const subscriptionEndDate = subscription.canceledAt ?? seedEndDate;

    while (billingDate <= subscriptionEndDate) {
      const isHistoricalCharge = billingDate < currentPricingStartedAt;
      const historicalPrice = historicalPlanPrices[subscription.plan.name];

      let amount =
        isHistoricalCharge && historicalPrice ? historicalPrice : subscription.plan.monthlyPrice;

      /*
        Justin Morgan's first Professional payment has a 50% introductory
        discount. The subscription is still $79/month; only this payment is $39.50.
      */
      const hasIntroductoryDiscount =
        subscriptionIndex === 19 && billingDate.getTime() === subscription.startedAt.getTime();

      if (hasIntroductoryDiscount) {
        amount = Math.round(amount * 0.5 * 100) / 100;
      }

      transactionData.push({
        amount,

        status: "Paid",

        subscriptionId: subscription.id,

        workspaceId: demoWorkspace.id,

        paidAt: new Date(billingDate),

        createdAt: new Date(billingDate),
      });

      billingDate.setUTCMonth(billingDate.getUTCMonth() + 1);
    }
  });

  /*
    Payment edge cases.
  */

  const pendingSubscription = createdSubscriptions[22];

  transactionData.push({
    amount: pendingSubscription.plan.monthlyPrice,

    status: "Pending",

    subscriptionId: pendingSubscription.id,

    workspaceId: demoWorkspace.id,

    paidAt: null,

    createdAt: new Date("2026-08-11T12:00:00Z"),
  });

  const failedSubscription = createdSubscriptions[14];

  transactionData.push({
    amount: failedSubscription.plan.monthlyPrice,

    status: "Failed",

    subscriptionId: failedSubscription.id,

    workspaceId: demoWorkspace.id,

    paidAt: null,

    createdAt: new Date("2026-08-06T12:00:00Z"),
  });

  const refundedSubscription = createdSubscriptions[6];

  transactionData.push({
    amount: refundedSubscription.plan.monthlyPrice,

    status: "Refunded",

    subscriptionId: refundedSubscription.id,

    workspaceId: demoWorkspace.id,

    paidAt: new Date("2026-07-18T12:00:00Z"),

    createdAt: new Date("2026-07-18T12:00:00Z"),
  });

  await prisma.transaction.createMany({
    data: transactionData,
  });

  console.log(`Database seeded successfully. Demo workspace ID: ${demoWorkspace.id}`);

  console.log(`Created ${createdCustomers.length} customers.`);

  console.log(`Created ${createdSubscriptions.length} subscriptions.`);

  console.log(`Created ${transactionData.length} transactions.`);
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
