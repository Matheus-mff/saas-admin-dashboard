"use client";

import { useState } from "react";

import { Product } from "@/types/product";

type ProductInput = {
  name: string;
  price: number;
  stock: number;
};

type ProductFormProps = {
  product?: Product;
  onSubmit: (
    product: ProductInput
  ) => void | Promise<void>;
  onCancel: () => void;
};

export default function ProductForm({
  product,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [name, setName] = useState(
    product?.name ?? ""
  );

  const [price, setPrice] = useState(
    product?.price.toString() ?? ""
  );

  const [stock, setStock] = useState(
    product?.stock.toString() ?? ""
  );

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [errors, setErrors] = useState({
    name: "",
    price: "",
    stock: "",
  });

  function validate() {
    const newErrors = {
      name: "",
      price: "",
      stock: "",
    };

    if (!name.trim()) {
      newErrors.name =
        "Product name is required.";
    }

    if (!price) {
      newErrors.price = "Price is required.";
    } else if (Number(price) <= 0) {
      newErrors.price =
        "Price must be greater than zero.";
    }

    if (!stock) {
      newErrors.stock = "Stock is required.";
    } else if (Number(stock) < 0) {
      newErrors.stock =
        "Stock cannot be negative.";
    }

    setErrors(newErrors);

    return !(
      newErrors.name ||
      newErrors.price ||
      newErrors.stock
    );
  }

  async function handleSubmit(
    e: React.SubmitEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (isSubmitting) return;
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      await onSubmit({
        name: name.trim(),
        price: Number(price),
        stock: Number(stock),
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label
          htmlFor="product-name"
          className="mb-1 block font-medium"
        >
          Name
        </label>

        <input
          id="product-name"
          type="text"
          value={name}
          disabled={isSubmitting}
          onChange={(e) => {
            setName(e.target.value);

            if (errors.name) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                name: "",
              }));
            }
          }}
          className={`form-control ${errors.name ? "form-control-error" : ""
            }`}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label
          htmlFor="product-price"
          className="mb-1 block font-medium"
        >
          Price
        </label>

        <input
          id="product-price"
          type="number"
          min="0"
          step="0.01"
          value={price}
          disabled={isSubmitting}
          onChange={(e) => {
            setPrice(e.target.value);

            if (errors.price) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                price: "",
              }));
            }
          }}
          className={`form-control ${errors.price ? "form-control-error" : ""
            }`}
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-500">
            {errors.price}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label
          htmlFor="product-stock"
          className="mb-1 block font-medium"
        >
          Stock
        </label>

        <input
          id="product-stock"
          type="number"
          min="0"
          step="1"
          value={stock}
          disabled={isSubmitting}
          onChange={(e) => {
            setStock(e.target.value);

            if (errors.stock) {
              setErrors((previousErrors) => ({
                ...previousErrors,
                stock: "",
              }));
            }
          }}
          className={`form-control ${errors.stock ? "form-control-error" : ""
            }`}
        />

        {errors.stock && (
          <p className="mt-1 text-sm text-red-500">
            {errors.stock}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="secondary-button"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="primary-button"
        >
          {isSubmitting
            ? "Saving..."
            : "Save Product"}
        </button>
      </div>
    </form>
  );
}