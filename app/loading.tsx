import LoadingSpinner from "./components/ui/LoadingSpinner";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}