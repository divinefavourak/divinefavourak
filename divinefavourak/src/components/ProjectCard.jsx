import React from "react";

function ProjectCard({ image, title, description, link, live }) {
  return (
    <div className="project-card">
      <div className="project-preview">
        {live ? (
          <iframe
            src={live}
            title={title}
            className="project-iframe"
            loading="lazy"
          ></iframe>
        ) : (
          <img src={image} alt={title} />
        )}
      </div>

      <div className="project-content">
        <h3>{title}</h3>
        <p>{description}</p>
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary"
        >
          View Project
        </a>
      </div>
    </div>
  );
}

export default ProjectCard;
