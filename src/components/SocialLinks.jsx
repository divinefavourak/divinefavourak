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
      icon: "fab fa-twitter",
      url: "https://x.com/akcodex1",
      label: "X/Twitter"
    },
    {
      icon: "fab fa-instagram",
      url: "https://instagram.com/ak.codex",
      label: "Instagram"
    }
  ];

  return (
    <div className="social-links">
      <h3>&gt; Connect_With_Me</h3>
      <div className="social-icons">
        {socials.map((social, index) => (
          <a
            key={index}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-btn"
            aria-label={social.label}
            title={social.label}
          >
            <i className={social.icon}></i>
          </a>
        ))}
      </div>
    </div>
  );
}

export default SocialLinks;
