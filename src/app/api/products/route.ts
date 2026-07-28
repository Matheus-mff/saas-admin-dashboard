import { NextResponse } from "next/server";

import {
  requireAdmin,
  requireAuthenticatedUser,
} from "@/lib/apiAuth";

import { prisma } from "@/lib/prisma";

type CreateProductBody = {
  name?: unknown;
  price?: unknown;
  stock?: unknown;
};

function parseNumber(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return value;
}

export async function GET() {
  const authResult =
    await requireAuthenticatedUser();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const products =
      await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return NextResponse.json(products);
  } catch (error) {
    console.error(
      "GET /api/products failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to load products.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  const authResult = await requireAdmin();

  if (authResult.response) {
    return authResult.response;
  }

  try {
    const body =
      (await request.json()) as CreateProductBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const price = parseNumber(body.price);
    const stock = parseNumber(body.stock);

    if (!name) {
      return NextResponse.json(
        {
          message:
            "Product name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (price === null || price <= 0) {
      return NextResponse.json(
        {
          message:
            "Price must be greater than zero.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      stock === null ||
      !Number.isInteger(stock) ||
      stock < 0
    ) {
      return NextResponse.json(
        {
          message:
            "Stock must be a non-negative whole number.",
        },
        {
          status: 400,
        }
      );
    }

    const newProduct =
      await prisma.product.create({
        data: {
          name,
          price,
          stock,
        },
      });

    return NextResponse.json(newProduct, {
      status: 201,
    });
  } catch (error) {
    console.error(
      "POST /api/products failed:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Unable to create product.",
      },
      {
        status: 500,
      }
    );
  }
}