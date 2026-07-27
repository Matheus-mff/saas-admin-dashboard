import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

type UpdateProductBody = {
  name?: unknown;
  price?: unknown;
  stock?: unknown;
};

type ProductRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

function parseProductId(id: string): number | null {
  const parsedId = Number(id);

  if (
    !Number.isInteger(parsedId) ||
    parsedId <= 0
  ) {
    return null;
  }

  return parsedId;
}

function parseNumber(value: unknown): number | null {
  if (
    typeof value !== "number" ||
    !Number.isFinite(value)
  ) {
    return null;
  }

  return value;
}

export async function PATCH(
  request: Request,
  { params }: ProductRouteContext
) {
  try {
    const { id } = await params;
    const productId = parseProductId(id);

    if (!productId) {
      return NextResponse.json(
        {
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    const body =
      (await request.json()) as UpdateProductBody;

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const price = parseNumber(body.price);
    const stock = parseNumber(body.stock);

    if (!name) {
      return NextResponse.json(
        {
          message: "Product name is required.",
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

    const updatedProduct =
      await prisma.product.update({
        where: {
          id: productId,
        },

        data: {
          name,
          price,
          stock,
        },
      });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error(
      "PATCH /api/products/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to update product.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function DELETE(
  _request: Request,
  { params }: ProductRouteContext
) {
  try {
    const { id } = await params;
    const productId = parseProductId(id);

    if (!productId) {
      return NextResponse.json(
        {
          message: "Invalid product ID.",
        },
        {
          status: 400,
        }
      );
    }

    const existingProduct =
      await prisma.product.findUnique({
        where: {
          id: productId,
        },
      });

    if (!existingProduct) {
      return NextResponse.json(
        {
          message: "Product not found.",
        },
        {
          status: 404,
        }
      );
    }

    await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    return new Response(null, {
      status: 204,
    });
  } catch (error) {
    console.error(
      "DELETE /api/products/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        message: "Unable to delete product.",
      },
      {
        status: 500,
      }
    );
  }
}