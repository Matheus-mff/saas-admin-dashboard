import StatCard from "@/components/dashboard/StatCard/StatCard";

export default function DashboardPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold">
        Welcome back, Matheus 👋
      </h1>

      <p className="mt-2 text-gray-500">
        Here's what's happening today.
      </p>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <StatCard title="Users" value="1,245" />
        <StatCard title="Orders" value="328" />
        <StatCard title="Revenue" value="$42,350" />
        <StatCard title="Products" value="84" />
      </div>
    </div>
  );
}