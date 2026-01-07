import React from "react";

const StatusBadge = ({ text = "Available for work!", variant = "success" }) => {
    return (
        <div className={`status-badge status-badge-${variant}`}>
            <span className="status-dot"></span>
            {text}
        </div>
    );
};

export default StatusBadge;
