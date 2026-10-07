import React from "react";

function AnalyticsCard({
  title,
  value,
  icon,
  color = "primary"
}) {
  return (
    <div className="col-md-4 col-lg-3 mb-4">
      <div
        className={`card border-${color} shadow-sm h-100`}
      >
        <div className="card-body text-center">

          <div
            className="display-4 mb-3"
            style={{ fontSize: "2.5rem" }}
          >
            {icon}
          </div>

          <h6 className="text-muted">
            {title}
          </h6>

          <h2
            className={`fw-bold text-${color}`}
          >
            {value}
          </h2>

        </div>
      </div>
    </div>
  );
}

export default AnalyticsCard;