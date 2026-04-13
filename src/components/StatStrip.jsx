export default function StatStrip({ stats }) {
  return (
    <section className="stat-strip">
      {stats.map((stat) => (
        <div key={stat.label} className="stat-card">
          <strong>{stat.value}</strong>
          <span>{stat.label}</span>
        </div>
      ))}
    </section>
  );
}
