import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r min-h-screen p-4">
      <nav>
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard">
              Dashboard
            </Link>
          </li>

          <li>
            <Link href="/users">
              Users
            </Link>
          </li>

          <li>
            <Link href="/products">
              Products
            </Link>
          </li>

          <li>
            <Link href="/orders">
              Orders
            </Link>
          </li>

          <li>
            <Link href="/settings">
              Settings
            </Link>
          </li>
        </ul>
      </nav>
    </aside>
  );
}