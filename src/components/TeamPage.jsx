import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

export default function TeamPage() {
  const { content } = useContent();

  return (
    <>
      {/* LEADERSHIP SECTION */}
      <section className="section section--padded">
        <SectionHeader
          eyebrow="LEADERSHIP"
          title="Messages from RED DOT leadership"
          text="The directors and managing directors share their vision and voice."
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

      {/* CREATIVE TEAM SECTION */}
      <section className="section section--padded">
        <SectionHeader
          eyebrow="CREATIVE TEAM"
          title="The people shaping RED DOT productions"
          text="Each creative professional brings their craft to every project."
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
    </>
  );
}
