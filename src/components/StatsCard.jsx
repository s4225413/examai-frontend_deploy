import './StatsCard.css';

export default function StatsCard({ icon, value, label, trend, trendDir, color = 'purple' }) {
  return (
    <div className="stats-card">
      <div className={`stats-card-icon ${color}`}>
        {icon}
      </div>
      <div className="stats-card-info">
        <div className="stats-card-value">{value}</div>
        <div className="stats-card-label">{label}</div>
        {trend && (
          <div className={`stats-card-trend ${trendDir || 'up'}`}>
            {trendDir === 'down' ? '↓' : '↑'} {trend}
          </div>
        )}
      </div>
    </div>
  );
}
