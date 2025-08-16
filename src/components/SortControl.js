// src/components/SortControl.js

export default function SortControl({ disabled, onSort }) {
    function handleChange(e) {
      onSort?.(e.target.value);
    }
  
    return (
      <div className="sort-control">
        <label htmlFor="sort" className="sort-label">Sort:</label>
        <select
          id="sort"
          className="sort-select"
          onChange={handleChange}
          disabled={disabled}
          defaultValue="relevance"
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
  