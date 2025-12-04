import React from "react";

function SocialLinks() {
  const socials = [
    { 
      icon: "fab fa-github", 
      url: "https://github.com/divinefavourak",
      label: "GitHub"
    },
    { 
      icon: "fab fa-linkedin-in", 
      url: "https://linkedin.com/in/divine-favour-akanbi-999b5b385/",
      label: "LinkedIn"
    },
    { 
      icon: "fab fa-x-twitter", 
      url: "https://x.com/akcodex1",
      label: "X/Twitter"
    },
    { 
      icon: "fab fa-codepen", 
      url: "https://codepen.io/divinefavourak",
      label: "CodePen"
    },
    { 
      icon: "fab fa-instagram", 
      url: "https://instagram.com/ak.codex",
      label: "Instagram"
    }
  ];

  return (
    <div className="social-links">
      <h3 style={{ color: "var(--dim-color)", marginBottom: "1rem", fontSize: "1rem" }}>
        &gt; Social_Channels
      </h3>
      <div className="links" style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {socials.map((social, index) => (
          <a 
            key={index}
            href={social.url} 
            target="_blank" 
            rel="noopener noreferrer"
            style={{
              border: "1px solid var(--dim-color)",
              padding: "0.5rem 1rem",
              color: "var(--primary-color)",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              fontSize: "0.9rem",
              transition: "all 0.3s"
            }}
            onMouseOver={(e) => {
              e.target.style.background = "var(--primary-color)";
              e.target.style.color = "var(--bg-color)";
            }}
            onMouseOut={(e) => {
              e.target.style.background = "transparent";
              e.target.style.color = "var(--primary-color)";
            }}
          >
            <i className={social.icon}></i>
            {social.label}
          </a>
        ))}
      </div>
    </div>
  );
}

export default SocialLinks;
