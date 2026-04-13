import { Link } from "react-router-dom";

export default function Hero({ site }) {
  return (
    <section className="hero">
      <div className="hero__copy">
        <p className="hero__eyebrow">{site.heroTag}</p>
        <h1>{site.heroTitle}</h1>
        <p className="hero__text">{site.heroText}</p>
        <div className="hero__actions">
          <Link to="/works" className="button button--solid">
            Explore Films
          </Link>
          <Link to="/about" className="button button--ghost">
            About Red Dot
          </Link>
        </div>
      </div>

      <div className="hero__visual">
        <div className="hero-card hero-card--large">
          <span>Television</span>
          <strong>Cinematic campaign production</strong>
        </div>
        <div className="hero-card hero-card--small">
          <span>YouTube</span>
          <strong>Story-first digital reels</strong>
        </div>
        <div className="hero-card hero-card--small alt">
          <span>Facebook</span>
          <strong>Social cuts built for attention</strong>
        </div>
      </div>
    </section>
  );
}
