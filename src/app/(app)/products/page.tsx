"use client";

import { useState } from "react";

import ProductForm from "@/components/forms/ProductForm/ProductForm";
import ProductTable from "@/components/products/ProductTable/ProductTable";
import Button from "@/components/ui/Button/Button";
import ConfirmModal from "@/components/ui/ConfirmModal/ConfirmModal";
import EmptyState from "@/components/ui/EmptyState/EmptyState";
import ErrorState from "@/components/ui/ErrorState/ErrorState";
import Modal from "@/components/ui/Modal/Modal";
import TableSkeleton from "@/components/ui/Skeleton/TableSkeleton";
import Toast from "@/components/ui/Toast/Toast";

import { useCurrentUser } from "@/contexts/CurrentUserContext";

import { useProducts } from "@/hooks/useProducts";
import { useToast } from "@/hooks/useToast";

import { Product } from "@/types/product";

export default function ProductsPage() {
  const { canManageOperations } =
    useCurrentUser();

  const [search, setSearch] =
    useState("");

  const [
    selectedProduct,
    setSelectedProduct,
  ] = useState<Product | undefined>();

  const [
    productToDelete,
    setProductToDelete,
  ] = useState<Product | undefined>();

  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const {
    toastMessage,
    toastType,
    showToast,
  } = useToast();

  const {
    products,
    loading,
    error,
    retry,
    addProduct,
    editProduct,
    removeProduct,
  } = useProducts();

  const normalizedSearch = search
    .trim()
    .toLowerCase();

  const filteredProducts =
    products.filter((product) =>
      product.name
        .toLowerCase()
        .includes(normalizedSearch)
    );

  function closeProductModal() {
    setSelectedProduct(undefined);
    setIsModalOpen(false);
  }

  if (loading) {
    return <TableSkeleton />;
  }

  if (error) {
    return (
      <ErrorState
        message={error}
        onRetry={retry}
      />
    );
  }

  const hasProducts =
    products.length > 0;

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            Products
          </h1>

          <p className="mt-2 muted-text">
            {canManageOperations
              ? "Manage the products available in your workspace."
              : "View the products available in your workspace."}
          </p>
        </div>

        {canManageOperations && (
          <Button
            onClick={() => {
              setSelectedProduct(
                undefined
              );

              setIsModalOpen(true);
            }}
          >
            Add Product
          </Button>
        )}
      </div>

      {hasProducts && (
        <input
          type="search"
          placeholder="Search products..."
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          className="form-control mt-8"
        />
      )}

      <div className="mt-6">
        {products.length === 0 ? (
          <EmptyState
            title="No products yet"
            description={
              canManageOperations
                ? "Create your first product to start tracking inventory."
                : "This workspace does not have any products yet."
            }
          />
        ) : filteredProducts.length ===
          0 ? (
          <EmptyState
            title="No products found"
            description="Try another search term."
          />
        ) : (
          <ProductTable
            products={
              filteredProducts
            }
            canManage={
              canManageOperations
            }
            onEdit={(product) => {
              setSelectedProduct(
                product
              );

              setIsModalOpen(true);
            }}
            onDelete={(product) => {
              setProductToDelete(
                product
              );
            }}
          />
        )}
      </div>

      {canManageOperations && (
        <>
          <Modal
            open={isModalOpen}
            title={
              selectedProduct
                ? "Edit Product"
                : "Add Product"
            }
            onClose={
              closeProductModal
            }
          >
            <ProductForm
              product={
                selectedProduct
              }
              onCancel={
                closeProductModal
              }
              onSubmit={async (
                product
              ) => {
                try {
                  if (
                    selectedProduct
                  ) {
                    await editProduct(
                      selectedProduct.id,
                      product
                    );

                    showToast(
                      "Product updated successfully."
                    );
                  } else {
                    await addProduct(
                      product
                    );

                    showToast(
                      "Product created successfully."
                    );
                  }

                  closeProductModal();
                } catch (error) {
                  const message =
                    error instanceof Error
                      ? error.message
                      : "Something went wrong.";

                  showToast(
                    message,
                    "error"
                  );
                }
              }}
            />
          </Modal>

          <ConfirmModal
            open={Boolean(
              productToDelete
            )}
            title="Delete Product"
            message={`Are you sure you want to delete "${productToDelete?.name}"?`}
            onCancel={() =>
              setProductToDelete(
                undefined
              )
            }
            onConfirm={async () => {
              if (!productToDelete) {
                return;
              }

              try {
                await removeProduct(
                  productToDelete.id
                );

                showToast(
                  "Product deleted successfully."
                );

                setProductToDelete(
                  undefined
                );
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : "Unable to delete product.";

                showToast(
                  message,
                  "error"
                );
              }
            }}
          />
        </>
      )}

      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
        />
      )}
    </div>
  );
}