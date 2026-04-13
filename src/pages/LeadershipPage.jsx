import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

export default function LeadershipPage() {
  const { content } = useContent();

  return (
    <section className="section">
      <SectionHeader
        eyebrow="Leadership"
        title="Messages from Red Dot leadership"
        text="This page gives the directors and managing directors a dedicated editorial space for their vision and voice."
      />
      <div className="leader-grid">
        {content.leadership.map((leader) => (
          <article key={leader.id} className="leader-card">
            <div
              className="leader-card__photo"
              style={{ backgroundImage: `url(${leader.photo})` }}
            />
            <div className="leader-card__body">
              <p className="section-header__eyebrow">{leader.role}</p>
              <h3>{leader.name}</h3>
              <p>{leader.message}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
