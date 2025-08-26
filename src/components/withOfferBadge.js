import React from "react";
import OfferBadge from "./OfferBadge";

/**
 * Wrap any card to show an offer ribbon.
 * Usage:
 *   const CardWithOffer = withOfferBadge(RestaurantCard);
 *   <CardWithOffer offers="₹125 OFF ABOVE ₹249" {...props} />
 */
export default function withOfferBadge(WrappedComponent) {
  function WithOfferBadge(props) {
    const { offers } = props;
    return (
      <div className="relative">
        {/* Badge overlays the card */}
        <OfferBadge text={offers} />
        {/* IMPORTANT: render the wrapped component as an element */}
        <WrappedComponent {...props} />
      </div>
    );
  }

  WithOfferBadge.displayName = `withOfferBadge(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return WithOfferBadge;
}
