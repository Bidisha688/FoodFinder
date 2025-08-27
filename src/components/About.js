import React from "react";
import { Link } from "react-router-dom";

export default function About() {
  return (
    <section className="relative isolate">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <div className="rounded-3xl bg-gradient-to-br from-indigo-50 to-white dark:from-zinc-800 dark:to-zinc-900 p-10 sm:p-12 ring-1 ring-black/5 shadow-sm">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-zinc-900 dark:text-white">
            About Food Finder
          </h1>

          <p className="mt-6 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Welcome to{" "}
            <span className="font-semibold text-indigo-600 dark:text-indigo-400">
              Food Finder
            </span>{" "}
            — your trusted companion for discovering and ordering food with ease.
            Whether you’re in the mood for local favorites, quick snacks, or
            gourmet meals, Food Finder connects you with the best dining options
            around you.
          </p>

          <p className="mt-4 text-base leading-7 text-zinc-600 dark:text-zinc-300">
            Our mission is to make food discovery simple, fast, and enjoyable.
            With real-time updates, personalized recommendations, and a
            user-friendly experience, we ensure you always know where and what
            to eat — anytime, anywhere.
          </p>

          <div className="mt-8">
            <Link
              to="/"
              className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900"
            >
              Explore Restaurants
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
