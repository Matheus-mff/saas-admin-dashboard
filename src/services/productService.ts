import { Product } from "@/types/product";

import { getApiErrorMessage } from "@/utils/getApiErrorMessage";
import { notifyDashboardDataChanged } from "@/utils/dashboardEvents";

export type ProductInput = {
  name: string;
  price: number;
  stock: number;
};

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products");

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to load products."
      )
    );
  }

  return response.json();
}

export async function createProduct(
  product: ProductInput
): Promise<Product> {
  const response = await fetch("/api/products", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to create product."
      )
    );
  }

  const newProduct: Product =
    await response.json();

  notifyDashboardDataChanged();

  return newProduct;
}

export async function updateProduct(
  id: number,
  product: ProductInput
): Promise<Product> {
  const response = await fetch(
    `/api/products/${id}`,
    {
      method: "PATCH",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(product),
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to update product."
      )
    );
  }

  const updatedProduct: Product =
    await response.json();

  notifyDashboardDataChanged();

  return updatedProduct;
}

export async function deleteProduct(
  id: number
): Promise<void> {
  const response = await fetch(
    `/api/products/${id}`,
    {
      method: "DELETE",
    }
  );

  if (!response.ok) {
    throw new Error(
      await getApiErrorMessage(
        response,
        "Unable to delete product."
      )
    );
  }

  notifyDashboardDataChanged();
}