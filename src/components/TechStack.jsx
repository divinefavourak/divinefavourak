import React from "react";

const TechStack = () => {
    const technologies = [
        { icon: "fab fa-js", label: "JavaScript" },
        { icon: "fab fa-react", label: "React" },
        { icon: "fab fa-node", label: "Node.js" },
        { icon: "fab fa-python", label: "Python" },
        { icon: "fab fa-html5", label: "HTML5" },
        { icon: "fab fa-css3-alt", label: "CSS3" },
        { icon: "fab fa-git-alt", label: "Git" },
        { icon: "fab fa-github", label: "GitHub" }
    ];

    return (
        <div className="tech-grid">
            {technologies.map((tech, index) => (
                <div key={index} className="tech-item">
                    <i className={`${tech.icon} tech-icon`}></i>
                    <span className="tech-label">{tech.label}</span>
                </div>
            ))}
        </div>
    );
};

export default TechStack;
