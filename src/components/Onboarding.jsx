import React from 'react';
import { Cloud, LocateFixed, AlertCircle, Loader2 } from 'lucide-react';

export default function Onboarding({
  userName,
  setUserName,
  error,
  setError,
  loading,
  locationLoading,
  handleStart
}) {
  return (
    <div className="onboarding-screen" style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div className="onboarding-card-wrapper" style={{
        width: '100%',
        maxWidth: '420px',
        textAlign: 'center'
      }}>
        
        {/* Animated Icon Container */}
        <div className="icon-wrapper" style={{
          display: 'inline-flex',
          padding: '20px',
          background: 'rgba(255, 255, 255, 0.08)',
          borderRadius: '50%',
          backdropFilter: 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          marginBottom: '20px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.2)'
        }}>
          <Cloud size={56} className="icon-pulse" color="#ffffff" />
        </div>

        {/* Title & Subtitle */}
        <h1 className="title" style={{
          fontSize: '32px',
          fontWeight: '800',
          color: '#ffffff',
          letterSpacing: '-0.5px',
          marginBottom: '8px'
        }}>
          Aura Weather
        </h1>
        <p className="subtitle" style={{
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.7)',
          marginBottom: '28px',
          lineHeight: '1.5'
        }}>
          Smart live weather information based on your current location
        </p>

        {/* Glassmorphism Login Box */}
        <div className="glass-card login-box" style={{
          background: 'rgba(255, 255, 255, 0.08)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '30px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)'
        }}>
          <div className="input-group" style={{ marginBottom: '20px' }}>
            <input
              type="text"
              placeholder="Apna naam enter karein..."
              value={userName}
              onChange={(event) => {
                setUserName(event.target.value);
                if (error) setError('');
              }}
              className="custom-input"
              maxLength={50}
              autoComplete="name"
              style={{
                width: '100%',
                background: 'rgba(255, 255, 255, 0.07)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '14px',
                padding: '14px 18px',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                boxSizing: 'border-box',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          <button
            onClick={handleStart}
            disabled={loading || locationLoading}
            className="primary-btn"
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '14px',
              color: '#ffffff',
              padding: '14px 20px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)',
              transition: 'transform 0.2s ease'
            }}
          >
            {loading || locationLoading ? (
              <>
                <Loader2 size={18} className="spin" />
                <span>Locating & Fetching...</span>
              </>
            ) : (
              <>
                <LocateFixed size={18} />
                <span>Get My Weather</span>
              </>
            )}
          </button>

          {error && (
            <div className="error-container" style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px',
              padding: '12px 14px',
              color: '#fca5a5',
              marginTop: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              textAlign: 'left'
            }}>
              <AlertCircle size={18} style={{ flexShrink: 0 }} />
              <p className="error-small" style={{ fontSize: '13px', margin: 0 }}>{error}</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}