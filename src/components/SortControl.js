export default function SortControl({ disabled, onSort }) {
  function handleChange(e) {
    onSort?.(e.target.value);
  }
  return (
    <div className="inline-flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-zinc-700 dark:text-zinc-300">Sort:</label>
      <select
        id="sort"
        onChange={handleChange}
        disabled={disabled}
        defaultValue="relevance"
        className="rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 px-3 py-2 text-sm shadow-sm focus:border-transparent focus:ring-2 focus:ring-indigo-500"
      >
        <option value="relevance">Relevance (Default)</option>
        <option value="rating_desc">Rating: High → Low</option>
        <option value="rating_asc">Rating: Low → High</option>
        <option value="delivery">Delivery Time: Fastest</option>
        <option value="distance">Distance: Nearest</option>
        <option value="cost_asc">Cost: Low → High</option>
        <option value="cost_desc">Cost: High → Low</option>
      </select>
    </div>
  );
}