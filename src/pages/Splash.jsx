import Hyperspeed from '../components/Hyperspeed';
import { hyperspeedPresets } from '../constants/hyperspeedPresets';

export default function Splash({ onEnter }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
      }}
    >
      {/* Three.js background */}
      <Hyperspeed effectOptions={hyperspeedPresets.one} />

      {/* Overlay gradient */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.5) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'Courier New', Courier, monospace",
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <p style={{ color: '#888', letterSpacing: '0.5em', fontSize: '0.75rem', marginBottom: '1rem' }}>
          &gt; BOOT_SEQUENCE_LOADER
        </p>

        <h1
          style={{
            color: '#ffffff',
            fontSize: 'clamp(2rem, 6vw, 4.5rem)',
            letterSpacing: '0.25em',
            margin: 0,
            fontWeight: 400,
            textShadow: '0 0 40px rgba(255,255,255,0.4)',
          }}
        >
          DIVINE-FAVOUR
        </h1>

        <p
          style={{
            color: '#888888',
            fontSize: 'clamp(0.7rem, 1.5vw, 0.9rem)',
            letterSpacing: '0.6em',
            marginTop: '0.75rem',
            marginBottom: '3rem',
          }}
        >
          FRONTEND_DEV · UI/UX_DEV · NG
        </p>

        <button
          onClick={onEnter}
          style={{
            fontFamily: "'Courier New', Courier, monospace",
            color: '#ffffff',
            background: 'transparent',
            border: '1px solid rgba(255,255,255,0.6)',
            padding: '0.8rem 2.5rem',
            letterSpacing: '0.35em',
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'background 0.25s, color 0.25s, border-color 0.25s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.color = '#000000';
            e.currentTarget.style.borderColor = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.6)';
          }}
        >
          KNOW_ME
        </button>

        <p style={{ color: '#333', fontSize: '0.65rem', letterSpacing: '0.3em', marginTop: '4rem' }}>
          [ CLICK TO INITIALIZE ]
        </p>
      </div>
    </div>
  );
}
