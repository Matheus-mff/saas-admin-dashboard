"use client";

import { useEffect, useState } from "react";

import ProductForm from "@/components/forms/ProductForm/ProductForm";
import ProductTable from "@/components/products/ProductTable/ProductTable";
import Button from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedProduct, setSelectedProduct] = useState<Product | undefined>();
  const [productToDelete, setProductToDelete] = useState<Product | undefined>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const {
    products,
    loading,
    error,
    retry,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    return () => clearTimeout(timeout);
  }, [toastMessage]);

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={retry} />;
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="mt-2 text-gray-500">
            Manage the products available in your application.
          </p>
        </div>

        <Button
          onClick={() => {
            setSelectedProduct(undefined);
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mt-8 w-full rounded-lg border px-4 py-2"
      />

      <div className="mt-6">
        {filteredProducts.length === 0 ? (
          <EmptyState
            title="No products found"
            description="Try another search term."
          />
        ) : (
          <ProductTable
            products={filteredProducts}
            onEdit={(product) => {
              setSelectedProduct(product);
              setIsModalOpen(true);
            }}
            onDelete={(product) => {
              setProductToDelete(product);
            }}
          />
        )}
      </div>

      <Modal
        open={isModalOpen}
        title={selectedProduct ? "Edit Product" : "Add Product"}
        onClose={() => {
          setSelectedProduct(undefined);
          setIsModalOpen(false);
        }}
      >
        <ProductForm
          product={selectedProduct}
          onCancel={() => {
            setSelectedProduct(undefined);
            setIsModalOpen(false);
          }}
          onSubmit={async (product) => {
            try {
              if (selectedProduct) {
                await editProduct(selectedProduct.id, product);

                setToastMessage("Product updated successfully.");
              } else {
                await addProduct(product);

                setToastMessage("Product created successfully.");
              }

              setToastType("success");
              setSelectedProduct(undefined);
              setIsModalOpen(false);
            } catch {
              setToastType("error");
              setToastMessage("Something went wrong.");
            }
          }}
        />
      </Modal>

      <ConfirmModal
        open={!!productToDelete}
        title="Delete Product"
        message={`Are you sure you want to delete "${productToDelete?.name}"?`}
        onCancel={() => setProductToDelete(undefined)}
        onConfirm={async () => {
          if (!productToDelete) return;

          try {
            await removeProduct(productToDelete.id);

            setToastType("success");
            setToastMessage("Product deleted successfully.");
            setProductToDelete(undefined);
          } catch {
            setToastType("error");
            setToastMessage("Unable to delete product.");
          }
        }}
      />

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}