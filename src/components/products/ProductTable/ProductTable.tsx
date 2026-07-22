import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Product } from "@/types/product";

type ProductTableProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left">
                ID
              </th>

              <th className="px-6 py-3 text-left">
                Name
              </th>

              <th className="px-6 py-3 text-left">
                Price
              </th>

              <th className="px-6 py-3 text-left">
                Stock
              </th>

              <th className="px-6 py-3 text-left">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  {product.id}
                </td>

                <td className="px-6 py-4 font-medium">
                  {product.name}
                </td>

                <td className="px-6 py-4">
                  ${product.price.toLocaleString()}
                </td>

                <td className="px-6 py-4">
                  {product.stock}
                </td>

                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        onEdit(product)
                      }
                      className="rounded-md p-2 transition hover:bg-gray-100"
                      aria-label="Edit product"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() =>
                        onDelete(product)
                      }
                      className="rounded-md p-2 transition hover:bg-red-100 hover:text-red-600"
                      aria-label="Delete product"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}