import { useEffect, useState } from "react";

import {
  createProduct,
  deleteProduct,
  getProducts,
  updateProduct,
} from "@/services/productService";

import { Product } from "@/types/product";

type ProductInput = Omit<Product, "id">;

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadProducts() {
    try {
      setLoading(true);
      setError("");

      const data = await getProducts();

      setProducts(data);
    } catch {
      setError("Unable to load products.");
    } finally {
      setLoading(false);
    }
  }

  async function addProduct(
    product: ProductInput
  ) {
    const newProduct =
      await createProduct(product);

    setProducts((previousProducts) => [
      newProduct,
      ...previousProducts,
    ]);
  }

  async function editProduct(
    id: number,
    product: ProductInput
  ) {
    const updatedProduct =
      await updateProduct(id, product);

    setProducts((previousProducts) =>
      previousProducts.map((currentProduct) =>
        currentProduct.id === id
          ? updatedProduct
          : currentProduct
      )
    );
  }

  async function removeProduct(id: number) {
    await deleteProduct(id);

    setProducts((previousProducts) =>
      previousProducts.filter(
        (product) => product.id !== id
      )
    );
  }

  useEffect(() => {
    loadProducts();
  }, []);

  return {
    products,
    loading,
    error,
    retry: loadProducts,
    addProduct,
    editProduct,
    removeProduct,
  };
}