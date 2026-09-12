import React from 'react';
import {
  Cloud,
  Search,
  MapPin,
  Wind,
  Droplets,
  Thermometer,
  Navigation,
  CheckCircle,
  AlertCircle,
  RefreshCw
} from 'lucide-react';

export default function Dashboard({
  userName,
  searchQuery,
  setSearchQuery,
  weatherData,
  loading,
  error,
  successMessage,
  handleSearch,
  handleRefresh,
  formatTemperature,
  formatWindSpeed
}) {
  return (
    <div className="dashboard-screen">
      <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '24px 16px' }}>
        
        {/* Header Section */}
        {/* Header Section */}
        <header className="header" style={{
          marginBottom: '32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div className="greeting-box">
            <h1 className="greeting" style={{ fontSize: '28px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.5px', margin: 0 }}>
              Namaste, {userName}! 👋
            </h1>
            <p className="sub-greeting" style={{ fontSize: '15px', color: 'rgba(255, 255, 255, 0.7)', marginTop: '4px' }}>
              Here is your live weather overview
            </p>
          </div>

          {/* Clean Modern Search Form */}
          <form onSubmit={handleSearch} style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '16px',
            padding: '8px 14px',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            width: '100%',
            boxSizing: 'border-box'
          }}>
            <Search size={20} style={{ color: 'rgba(255, 255, 255, 0.7)', marginRight: '12px', flexShrink: 0 }} />
            <input
              type="text"
              placeholder="Search city (e.g., Delhi, Varanasi, Mumbai)..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              style={{
                flex: 1,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: '#ffffff',
                fontSize: '16px',
                padding: '6px 0',
                width: '100%'
              }}
            />
            <button type="submit" disabled={loading} aria-label="Search" style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              border: 'none',
              borderRadius: '12px',
              color: '#ffffff',
              padding: '10px 20px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
              flexShrink: 0,
              marginLeft: '8px'
            }}>
              <Search size={18} />
            </button>
          </form>
        </header>

        {/* Error Notification */}
        {error && (
          <div className="error-msg" style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#fca5a5',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <AlertCircle size={20} />
            <span style={{ fontSize: '14px' }}>{error}</span>
          </div>
        )}

        {/* Success Notification */}
        {successMessage && !error && (
          <div className="success-msg" style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#86efac',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <CheckCircle size={20} />
            <span style={{ fontSize: '14px' }}>{successMessage}</span>
          </div>
        )}

        {/* Loader Section */}
        {loading && (
          <div className="loader-container" style={{ textAlign: 'center', padding: '50px 0' }}>
            <div className="loader" style={{ margin: '0 auto' }}></div>
            <p className="loader-text" style={{ color: 'rgba(255, 255, 255, 0.7)', marginTop: '16px', fontSize: '15px' }}>
              Fetching latest weather data...
            </p>
          </div>
        )}

        {/* Weather Main Content */}
        {!loading && weatherData && (
          <div className="weather-display-center">
            <div className="glass-card current-weather-main" style={{
              background: 'rgba(255, 255, 255, 0.08)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '24px',
              padding: '30px',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)'
            }}>
              
              {/* Location Badge */}
              <div className="location-info" style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#ffffff',
                marginBottom: '20px'
              }}>
                <MapPin size={16} style={{ color: '#3b82f6' }} />
                <span>
                  {weatherData.name}
                  {weatherData.country && `, ${weatherData.country}`}
                </span>
              </div>

              {/* Main Temperature Hero */}
              <div className="main-temp-box" style={{ textAlign: 'center', marginBottom: '32px' }}>
                {weatherData.icon ? (
                  <img
                    src={weatherData.icon}
                    alt={weatherData.description || 'Weather icon'}
                    className="weather-icon-big"
                    style={{ width: '110px', height: '110px', filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.2))' }}
                  />
                ) : (
                  <Cloud size={90} color="#ffffff" style={{ opacity: 0.9 }} />
                )}

                <h1 className="huge-temp" style={{ fontSize: '64px', fontWeight: '800', color: '#ffffff', margin: '10px 0 0 0' }}>
                  {formatTemperature(weatherData.temp)}°C
                </h1>

                <p className="condition-text" style={{ fontSize: '18px', fontWeight: '600', color: '#ffffff', textTransform: 'capitalize', marginTop: '6px' }}>
                  {weatherData.description}
                </p>
                <p className="condition-sub" style={{ fontSize: '13px', color: 'rgba(255, 255, 255, 0.6)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '4px' }}>
                  {weatherData.condition}
                </p>
              </div>

              {/* Primary Stats Grid */}
              <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '14px' }}>
                <div className="stat-card" style={statCardStyle}>
                  <Droplets size={22} color="#3b82f6" />
                  <p style={statLabelStyle}>Humidity</p>
                  <strong style={statValueStyle}>{weatherData.humidity}%</strong>
                </div>

                <div className="stat-card" style={statCardStyle}>
                  <Wind size={22} color="#10b981" />
                  <p style={statLabelStyle}>Wind Speed</p>
                  <strong style={statValueStyle}>{formatWindSpeed(weatherData.wind)} m/s</strong>
                </div>

                <div className="stat-card" style={statCardStyle}>
                  <Thermometer size={22} color="#ef4444" />
                  <p style={statLabelStyle}>Feels Like</p>
                  <strong style={statValueStyle}>{formatTemperature(weatherData.feels_like)}°</strong>
                </div>
              </div>

              {/* Secondary Stats Grid */}
              <div className="secondary-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px', marginBottom: '28px' }}>
                <div className="stat-card" style={statCardStyle}>
                  <Navigation size={22} color="#8b5cf6" />
                  <p style={statLabelStyle}>Pressure</p>
                  <strong style={statValueStyle}>{weatherData.pressure || '--'} hPa</strong>
                </div>

                <div className="stat-card" style={statCardStyle}>
                  <Cloud size={22} color="#06b6d4" />
                  <p style={statLabelStyle}>Visibility</p>
                  <strong style={statValueStyle}>
                    {weatherData.visibility ? (weatherData.visibility / 1000).toFixed(1) : '--'} km
                  </strong>
                </div>

                <div className="stat-card" style={statCardStyle}>
                  <Wind size={22} color="#f59e0b" />
                  <p style={statLabelStyle}>Wind Dir</p>
                  <strong style={statValueStyle}>{weatherData.wind_direction || 0}°</strong>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-box" style={{ display: 'flex', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={loading}
                  className="primary-btn refresh-btn"
                  style={{
                    background: 'rgba(255, 255, 255, 0.12)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '14px',
                    color: '#ffffff',
                    padding: '12px 24px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    transition: 'background 0.2s ease',
                    width: '100%',
                    justifyContent: 'center'
                  }}
                >
                  <RefreshCw size={18} />
                  <span>Refresh Weather</span>
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && !weatherData && !error && (
          <div className="empty-state" style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255, 255, 255, 0.7)' }}>
            <Cloud size={64} style={{ marginBottom: '16px', opacity: 0.6 }} />
            <h2 style={{ fontSize: '22px', fontWeight: '600', color: '#ffffff', marginBottom: '8px' }}>Search a city</h2>
            <p style={{ fontSize: '14px', color: 'rgba(255, 255, 255, 0.6)' }}>Enter a city name above to check the current live weather.</p>
          </div>
        )}

      </div>
    </div>
  );
}

// Reusable inline style constants for clean stat cards
const statCardStyle = {
  background: 'rgba(255, 255, 255, 0.05)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  borderRadius: '16px',
  padding: '16px 12px',
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '6px'
};

const statLabelStyle = {
  fontSize: '12px',
  color: 'rgba(255, 255, 255, 0.6)',
  margin: 0,
  fontWeight: '500'
};

const statValueStyle = {
  fontSize: '16px',
  color: '#ffffff',
  fontWeight: '600'
};