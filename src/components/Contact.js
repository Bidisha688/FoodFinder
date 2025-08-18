import React from "react";

export default function Contact() {
  return (
    <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-16">
      <div className="rounded-3xl bg-white dark:bg-zinc-900 ring-1 ring-black/5 shadow-sm p-8 sm:p-10">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Contact Us</h1>
        <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-300">
          Have questions, feedback, or just want to say hello? We’d love to hear from you!
        </p>

        <form className="mt-8 space-y-4">
          <input type="text" placeholder="Your Name" className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500" />
          <input type="email" placeholder="Your Email" className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500" />
          <textarea rows="5" placeholder="Your Message" className="block w-full rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm placeholder:text-zinc-400 focus:border-transparent focus:ring-2 focus:ring-indigo-500" />
          <button type="submit" className="inline-flex items-center rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900">
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}