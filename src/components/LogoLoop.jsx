import React, { useState } from 'react';

const LogoLoop = ({
  logos = [],
  speed = 100,
  direction = 'left',
  logoHeight = 60,
  gap = 60,
  hoverSpeed = 20,
  scaleOnHover = false,
  fadeOut = false,
  fadeOutColor = '#000000',
  ariaLabel = 'Logo marquee',
  useCustomRender = true,
}) => {
  const [hovered, setHovered] = useState(false);

  const isHorizontal = direction === 'left' || direction === 'right';
  const isReverse = direction === 'right' || direction === 'down';

  const doubled = [...logos, ...logos];

  const itemSize = logoHeight + gap;
  const totalSize = logos.length * itemSize;

  const effectiveSpeed = hovered && hoverSpeed > 0 ? hoverSpeed : speed;
  const isPaused = hovered && hoverSpeed === 0;
  const duration = totalSize / effectiveSpeed;

  const translateProp = isHorizontal ? 'translateX' : 'translateY';
  const translateEnd = isReverse ? '50%' : '-50%';
  const keyframeName = `logoLoop_${direction}`;

  const keyframes = `
    @keyframes ${keyframeName} {
      from { transform: ${translateProp}(0); }
      to   { transform: ${translateProp}(${translateEnd}); }
    }
  `;

  return (
    <>
      <style>{keyframes}</style>
      <div
        aria-label={ariaLabel}
        role="marquee"
        style={{ position: 'relative', overflow: 'hidden', width: '100%' }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {fadeOut && (
          <>
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px',
              background: `linear-gradient(to right, ${fadeOutColor}, transparent)`,
              zIndex: 2, pointerEvents: 'none',
            }} />
            <div style={{
              position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px',
              background: `linear-gradient(to left, ${fadeOutColor}, transparent)`,
              zIndex: 2, pointerEvents: 'none',
            }} />
          </>
        )}

        <div
          style={{
            display: 'flex',
            flexDirection: isHorizontal ? 'row' : 'column',
            alignItems: 'center',
            animation: `${keyframeName} ${duration}s linear infinite`,
            animationPlayState: isPaused ? 'paused' : 'running',
            willChange: 'transform',
          }}
        >
          {doubled.map((logo, i) => {
            const content = logo.node ? logo.node : logo.src ? (
              <img
                src={logo.src}
                alt={logo.alt || ''}
                style={{ height: `${logoHeight}px`, width: 'auto', objectFit: 'contain' }}
              />
            ) : null;

            const itemStyle = {
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: `${logoHeight}px`,
              width: `${logoHeight}px`,
              marginRight: isHorizontal ? `${gap}px` : 0,
              marginBottom: !isHorizontal ? `${gap}px` : 0,
              fontSize: `${logoHeight * 0.7}px`,
              color: 'inherit',
              flexShrink: 0,
              textDecoration: 'none',
              transition: 'transform 0.2s ease',
            };

            return useCustomRender && logo.href ? (
              <a
                key={i}
                href={logo.href}
                target="_blank"
                rel="noopener noreferrer"
                title={logo.title || logo.alt}
                aria-label={logo.title || logo.alt}
                tabIndex={i >= logos.length ? -1 : 0}
                style={itemStyle}
                onMouseEnter={scaleOnHover ? (e) => { e.currentTarget.style.transform = 'scale(1.2)'; } : undefined}
                onMouseLeave={scaleOnHover ? (e) => { e.currentTarget.style.transform = 'scale(1)'; } : undefined}
              >
                {content}
              </a>
            ) : (
              <span
                key={i}
                title={logo.title || logo.alt}
                aria-hidden={i >= logos.length}
                style={itemStyle}
                onMouseEnter={scaleOnHover ? (e) => { e.currentTarget.style.transform = 'scale(1.2)'; } : undefined}
                onMouseLeave={scaleOnHover ? (e) => { e.currentTarget.style.transform = 'scale(1)'; } : undefined}
              >
                {content}
              </span>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default LogoLoop;
