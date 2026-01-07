import React, { useEffect, useState } from "react";

const SectionIndicator = () => {
    const [activeSection, setActiveSection] = useState('home');

    const sections = ['home', 'about', 'projects', 'contact'];

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: '-50% 0px -50% 0px',
            threshold: 0
        };

        const observerCallback = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveSection(entry.target.id);
                }
            });
        };

        const observer = new IntersectionObserver(observerCallback, observerOptions);

        sections.forEach((section) => {
            const element = document.getElementById(section);
            if (element) {
                observer.observe(element);
            }
        });

        return () => {
            sections.forEach((section) => {
                const element = document.getElementById(section);
                if (element) {
                    observer.unobserve(element);
                }
            });
        };
    }, []);

    const handleClick = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="section-indicator-container" role="navigation" aria-label="Section navigation">
            {sections.map((section) => (
                <div
                    key={section}
                    className={`section-indicator-dot ${activeSection === section ? 'active' : ''}`}
                    onClick={() => handleClick(section)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            handleClick(section);
                        }
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Go to ${section.charAt(0).toUpperCase() + section.slice(1)} section`}
                    aria-current={activeSection === section ? 'true' : 'false'}
                    title={section.charAt(0).toUpperCase() + section.slice(1)}
                />
            ))}
        </div>
    );
};

export default SectionIndicator;
