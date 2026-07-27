import { Product } from "@/types/product";
import { getApiErrorMessage } from "@/utils/getApiErrorMessage";

type ProductInput = Omit<Product, "id">;

export async function getProducts(): Promise<Product[]> {
  const response = await fetch("/api/products", {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to load products."
    );

    throw new Error(message);
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
    const message = await getApiErrorMessage(
      response,
      "Unable to create product."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function updateProduct(
  id: number,
  product: ProductInput
): Promise<Product> {
  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify(product),
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to update product."
    );

    throw new Error(message);
  }

  return response.json();
}

export async function deleteProduct(
  id: number
): Promise<void> {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to delete product."
    );

    throw new Error(message);
  }
}