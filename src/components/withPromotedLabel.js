// withPromotedLabel.js
import React from "react";

export default function withPromotedLabel(WrappedComponent) {
  return function EnhancedComponent(props) {
    return (
      <div className="relative">
        {props.promoted && (
          <span className="absolute top-2 left-2 inline-flex items-center rounded-md bg-indigo-600/90 px-2.5 py-1 text-xs font-medium text-white shadow">
            PROMOTED
          </span>
        )}
        <WrappedComponent {...props} />
      </div>
    );
  };
}
