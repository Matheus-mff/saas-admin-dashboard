import { products as initialProducts } from "@/data/products";
import { Product } from "@/types/product";

type ProductInput = Omit<Product, "id">;

let productsDatabase: Product[] = [...initialProducts];

function simulateDelay() {
  return new Promise((resolve) => {
    setTimeout(resolve, 700);
  });
}

export async function getProducts(): Promise<Product[]> {
  await simulateDelay();

  return [...productsDatabase];
}

export async function createProduct(
  product: ProductInput
): Promise<Product> {
  await simulateDelay();

  const newProduct: Product = {
    id: Date.now(),
    ...product,
  };

  productsDatabase = [
    newProduct,
    ...productsDatabase,
  ];

  return newProduct;
}

export async function updateProduct(
  id: number,
  product: ProductInput
): Promise<Product> {
  await simulateDelay();

  const existingProduct = productsDatabase.find(
    (currentProduct) => currentProduct.id === id
  );

  if (!existingProduct) {
    throw new Error("Product not found.");
  }

  const updatedProduct: Product = {
    ...existingProduct,
    ...product,
  };

  productsDatabase = productsDatabase.map(
    (currentProduct) =>
      currentProduct.id === id
        ? updatedProduct
        : currentProduct
  );

  return updatedProduct;
}

export async function deleteProduct(
  id: number
): Promise<void> {
  await simulateDelay();

  productsDatabase = productsDatabase.filter(
    (product) => product.id !== id
  );
}