import {
  Pencil,
  Trash2,
} from "lucide-react";

import { Product } from "@/types/product";

type ProductTableProps = {
  products: Product[];
  canManage: boolean;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
};

export default function ProductTable({
  products,
  canManage,
  onEdit,
  onDelete,
}: ProductTableProps) {
  return (
    <div className="table-container">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="table-header">
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

              {canManage && (
                <th className="px-6 py-3 text-left">
                  Actions
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {products.map(
              (product) => (
                <tr
                  key={product.id}
                  className="table-row"
                >
                  <td className="px-6 py-4">
                    {product.id}
                  </td>

                  <td className="px-6 py-4 font-medium">
                    {product.name}
                  </td>

                  <td className="px-6 py-4">
                    $
                    {product.price.toLocaleString()}
                  </td>

                  <td className="px-6 py-4">
                    {product.stock}
                  </td>

                  {canManage && (
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            onEdit(
                              product
                            )
                          }
                          className="icon-button"
                          aria-label={`Edit ${product.name}`}
                        >
                          <Pencil
                            size={18}
                          />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            onDelete(
                              product
                            )
                          }
                          className="icon-button danger-icon-button"
                          aria-label={`Delete ${product.name}`}
                        >
                          <Trash2
                            size={18}
                          />
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}