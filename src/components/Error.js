import { useRouteError } from "react-router-dom";

export default function Error() {
  const err = useRouteError();
  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <h1 className="text-4xl font-bold tracking-tight">Oops!!!</h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">Something went wrong!!</p>
      <p className="mt-6 inline-flex items-center rounded-xl bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 ring-1 ring-red-200">
        {err?.status}: {err?.statusText}
      </p>
    </div>
  );
}