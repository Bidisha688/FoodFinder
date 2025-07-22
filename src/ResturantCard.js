const RestaurantCard = ({
    resName,
    cuisin,
    stars,
    delTime,
    costForTwo,
    location,
    offers,
    link,
  }) => (
    <div className="res-card">
      <img
        className="res-logo"
        alt={resName}
        src={link}
        onError={(e) =>
          (e.target.src = "https://via.placeholder.com/300x200?text=No+Image")
        }
      />
      <div className="res-info">
        <h3>{resName}</h3>
        <p><strong>Cuisine:</strong> {cuisin}</p>
        <p><strong>Rating:</strong> ⭐ {stars}</p>
        <p><strong>Delivery Time:</strong> {delTime}</p>
        <p><strong>Cost for Two:</strong> ₹{costForTwo}</p>
        <p><strong>Location:</strong> {location}</p>
        <p className="offer">{offers}</p>
      </div>
    </div>
  );
export default RestaurantCard;  