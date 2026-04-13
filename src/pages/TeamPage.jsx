import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

export default function TeamPage() {
  const { content } = useContent();

  return (
    <section className="section">
      <SectionHeader
        eyebrow="Creative Team"
        title="The people shaping Red Dot productions"
        text="Each creative professional has room for their photo, role, and bio so the company can showcase the team behind the work."
      />
      <div className="team-grid">
        {content.team.map((member) => (
          <article key={member.id} className="team-card">
            <div
              className="team-card__photo"
              style={{ backgroundImage: `url(${member.photo})` }}
            />
            <div className="team-card__body">
              <p className="section-header__eyebrow">{member.role}</p>
              <h3>{member.name}</h3>
              <p>{member.bio}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
