import React from 'react';
import LogoLoop from './LogoLoop';
import {
  SiJavascript, SiTypescript, SiPython,
  SiHtml5, SiReact, SiNodedotjs,
  SiTailwindcss, SiThreedotjs, SiExpo,
  SiVite, SiGit, SiGithub, SiGooglecloud, SiVercel,
} from 'react-icons/si';

const CLogo = () => (
  <svg viewBox="0 0 128 128" style={{ width: '1em', height: '1em' }}>
    <path fill="currentColor" d="M125 50c-4-32-24-50-62-50C29 0 3 24 3 64c0 39 24 64 64 64 32 0 55-19 58-50H87c-2 11-8 20-20 20-21 0-24-16-24-33 0-23 8-35 22-35 13 0 20 7 22 20z" />
  </svg>
);

const Css3Logo = () => (
  <svg viewBox="0 0 128 128" style={{ width: '1em', height: '1em' }}>
    <path fill="currentColor" d="M8.76 1l10.055 112.883 45.118 12.58 45.244-12.626L119.24 1H8.76zm89.591 25.862l-3.347 37.605.01.203-.014.467v-.004l-2.378 26.294-.262 2.336L64 101.607v.001l-.022.019-28.311-7.888L33.75 72h13.883l.985 11.054 15.386 4.17-.004.008v-.002l15.443-4.229L81.075 65H48.792l-.277-3.043-.631-7.129L47.553 51h34.749l1.264-14H30.64l-.277-3.041-.63-7.131L29.401 23h69.281l-.331 3.862z" />
  </svg>
);

const techLogos = [
  { node: <SiJavascript />,  title: 'JavaScript'   },
  { node: <SiTypescript />,  title: 'TypeScript'   },
  { node: <SiPython />,      title: 'Python'        },
  { node: <CLogo />,         title: 'C'             },
  { node: <SiHtml5 />,       title: 'HTML5'         },
  { node: <Css3Logo />,      title: 'CSS3'          },
  { node: <SiReact />,       title: 'React'         },
  { node: <SiReact />,       title: 'React Native'  },
  { node: <SiNodedotjs />,   title: 'Node.js'       },
  { node: <SiTailwindcss />, title: 'TailwindCSS'   },
  { node: <SiThreedotjs />,  title: 'Three.js'      },
  { node: <SiExpo />,        title: 'Expo'          },
  { node: <SiVite />,        title: 'Vite'          },
  { node: <SiGit />,         title: 'Git'           },
  { node: <SiGithub />,      title: 'GitHub'        },
  { node: <SiGooglecloud />, title: 'Google Cloud'  },
  { node: <SiVercel />,      title: 'Vercel'        },
];

const TechStack = () => {
  return (
    <div style={{ height: '100px', position: 'relative', overflow: 'hidden' }}>
      <LogoLoop
        logos={techLogos}
        speed={60}
        direction="left"
        logoHeight={56}
        gap={48}
        hoverSpeed={0}
        scaleOnHover
        fadeOut
        fadeOutColor="#000000"
        ariaLabel="Tech stack"
        useCustomRender={false}
      />
    </div>
  );
};

export default TechStack;
