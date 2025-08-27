import React from "react";
import { Link } from "react-router-dom";

export default function ThankYou() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-24 text-center">
      <div className="rounded-3xl bg-white dark:bg-zinc-900 ring-1 ring-black/5 shadow-sm p-12">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
          🎉 Thank You for Contacting Us!
        </h1>
        <p className="mt-6 text-lg text-zinc-600 dark:text-zinc-300">
          We’ve received your message and our team will get back to you shortly.
          We appreciate you reaching out and look forward to helping you.
        </p>

        <div className="mt-10">
          <Link
            to="/"
            className="inline-flex items-center rounded-xl bg-indigo-600 px-6 py-3 text-base font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </section>
  );
}
