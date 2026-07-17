export default function Header() {
  return (
    <header className="flex h-16 items-center justify-between border-b bg-white px-6">
      <h1 className="text-xl font-semibold">
        Dashboard
      </h1>

      <div className="flex items-center gap-5">
        <button className="cursor-pointer text-xl">
          🔔
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 font-semibold text-white">
            M
          </div>

          <span className="font-medium">
            Matheus
          </span>
        </div>
      </div>
    </header>
  );
}