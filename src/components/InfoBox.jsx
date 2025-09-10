import React from "react";

function InfoBox({ icon, title, text }) {
  return (
    <div className="info-box">
      <div className="icon">
        <i className={icon}></i>
      </div>
      <div className="details">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

export default InfoBox;
