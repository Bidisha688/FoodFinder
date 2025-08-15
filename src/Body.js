import restaurantList from "./Utils/mockData";
import RestaurantCard from "./ResturantCard";
import Shimmer from "./Shimmer";
import { useState, useEffect } from "react";

const Body = () => {
  const [listOfRestaurants, setListOfRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListOfRestaurants(restaurantList);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return <Shimmer />;
  }

  return (
    <div className="body">
      {/* Search and Filter Buttons */}
      <div className="controls">
        <input
          type="text"
          className="search-box"
          placeholder="Search restaurants..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />
        <button
          className="search-btn"
          onClick={() => {
            const filteredRestaurants = restaurantList.filter((res) =>
              res.resName.toLowerCase().includes(searchText.toLowerCase())
            );
            setListOfRestaurants(filteredRestaurants);
          }}
        >
          Search
        </button>

        <button
          className="filter-btn"
          onClick={() => {
            const filteredList = restaurantList.filter(
              (res) => parseFloat(res.stars) > 4.5
            );
            setListOfRestaurants(filteredList);
          }}
        >
          Top Rated Restaurants
        </button>
      </div>

      {/* Restaurant Cards */}
      <div className="res-container">
        {listOfRestaurants.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </div>
  );
};

export default Body;
