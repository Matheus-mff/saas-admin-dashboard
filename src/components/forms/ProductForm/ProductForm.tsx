"use client";

import { useState } from "react";

import { Product } from "@/types/product";

type ProductFormProps = {
  product?: Product;

  onSubmit: (product: {
    name: string;
    price: number;
    stock: number;
  }) => void | Promise<void>;

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
      newErrors.price =
        "Price is required.";
    } else if (Number(price) <= 0) {
      newErrors.price =
        "Price must be greater than zero.";
    }

    if (!stock) {
      newErrors.stock =
        "Stock is required.";
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

    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      price: Number(price),
      stock: Number(stock),
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="mb-1 block font-medium">
          Name
        </label>

        <input
          value={name}
          onChange={(e) => {
            setName(e.target.value);

            if (errors.name) {
              setErrors((previous) => ({
                ...previous,
                name: "",
              }));
            }
          }}
          className={`w-full rounded-lg border px-3 py-2 ${errors.name
              ? "border-red-500"
              : ""
            }`}
        />

        {errors.name && (
          <p className="mt-1 text-sm text-red-500">
            {errors.name}
          </p>
        )}
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">
          Price
        </label>

        <input
          type="number"
          min="0"
          step="0.01"
          value={price}
          onChange={(e) => {
            setPrice(e.target.value);

            if (errors.price) {
              setErrors((previous) => ({
                ...previous,
                price: "",
              }));
            }
          }}
          className={`w-full rounded-lg border px-3 py-2 ${errors.price
              ? "border-red-500"
              : ""
            }`}
        />

        {errors.price && (
          <p className="mt-1 text-sm text-red-500">
            {errors.price}
          </p>
        )}
      </div>

      <div className="mb-6">
        <label className="mb-1 block font-medium">
          Stock
        </label>

        <input
          type="number"
          min="0"
          value={stock}
          onChange={(e) => {
            setStock(e.target.value);

            if (errors.stock) {
              setErrors((previous) => ({
                ...previous,
                stock: "",
              }));
            }
          }}
          className={`w-full rounded-lg border px-3 py-2 ${errors.stock
              ? "border-red-500"
              : ""
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
          className="rounded-lg border px-4 py-2"
        >
          Cancel
        </button>

        <button
          type="submit"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          Save Product
        </button>
      </div>
    </form>
  );
}