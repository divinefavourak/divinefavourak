// SimpleSocialLinks.jsx - Create this new component
import React from "react";

function SimpleSocialLinks() {
  const socials = [
    { name: "GitHub", url: "https://github.com/divinefavourak" },
    { name: "LinkedIn", url: "https://linkedin.com/in/divine-favour-akanbi-999b5b385/" },
    { name: "X", url: "https://x.com/akcodex1" },
    { name: "CodePen", url: "https://codepen.io/akcodex" },
  ];

  return (
    <div style={{ marginTop: "2rem" }}>
      <p style={{ color: "var(--dim-color)", marginBottom: "0.5rem" }}>
        &gt; Available on:
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
        {socials.map((social, index) => (
          <a 
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "var(--primary-color)",
              border: "1px solid var(--dim-color)",
              padding: "0.2rem 0.8rem",
              fontSize: "0.8rem",
              textDecoration: "none"
            }}
          >
            [{social.name}]
          </a>
        ))}
      </div>
    </div>
  );
}

export default SimpleSocialLinks;