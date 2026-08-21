export default function SettingsSkeleton() {
  return (
    <div className="space-y-5" aria-busy="true" aria-label="Loading settings">
      <section className="card overflow-hidden">
        <div className="p-6">
          <div className="skeleton-block h-5 w-24 rounded" />
          <div className="skeleton-block mt-2 h-4 w-64 max-w-full rounded" />

          <div className="mt-6 grid gap-6 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>
                <div className="skeleton-block mb-2 h-3.5 w-16 rounded" />
                <div className="skeleton-block h-[42px] rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="border-t p-6">
          <div className="skeleton-block h-5 w-28 rounded" />
          <div className="skeleton-block mt-2 h-4 w-72 max-w-full rounded" />

          <div className="mt-6">
            <div className="skeleton-block mb-2 h-3.5 w-28 rounded" />
            <div className="skeleton-block h-[42px] rounded-lg" />
          </div>
        </div>

        <div className="settings-card-footer flex justify-end px-6 py-4">
          <div className="skeleton-block h-10 w-32 rounded-lg" />
        </div>
      </section>

      <section className="card overflow-hidden">
        <div className="p-6">
          <div className="skeleton-block h-5 w-24 rounded" />
          <div className="skeleton-block mt-2 h-4 w-64 max-w-full rounded" />

          <div className="mt-6">
            <div className="skeleton-block mb-2 h-3.5 w-32 rounded" />
            <div className="skeleton-block h-[42px] rounded-lg" />
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index}>
                <div className="skeleton-block mb-2 h-3.5 w-28 rounded" />
                <div className="skeleton-block h-[42px] rounded-lg" />
              </div>
            ))}
          </div>
        </div>

        <div className="settings-card-footer flex justify-end px-6 py-4">
          <div className="skeleton-block h-10 w-36 rounded-lg" />
        </div>
      </section>
    </div>
  );
}
