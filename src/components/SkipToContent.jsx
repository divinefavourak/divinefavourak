import React from "react";

const SkipToContent = () => {
    const skipToMain = (e) => {
        e.preventDefault();
        const mainContent = document.getElementById('home');
        if (mainContent) {
            mainContent.focus();
            mainContent.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <a
            href="#home"
            className="skip-to-content"
            onClick={skipToMain}
        >
            Skip to main content
        </a>
    );
};

export default SkipToContent;
