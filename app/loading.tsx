export default function Loading() {
  return (
    <main className="app-shell py-20">
      <div className="text-center">
        <div className="w-6 h-6 mx-auto mb-6 rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin" />
        <p className="text-sm text-[var(--text-muted)]">Loading...</p>
      </div>
    </main>
  );
}