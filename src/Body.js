import restaurantList from "./Utils/mockData";
import RestaurantCard from "./ResturantCard";

const Body = () => (
    <div className="body">
      <div className="search">🍽️ Explore Restaurants</div>
      <div className="res-container">
        {restaurantList.map((restaurant) => (
          <RestaurantCard key={restaurant.id} {...restaurant} />
        ))}
      </div>
    </div>
  );
  export default Body;