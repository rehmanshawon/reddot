import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

export default function AboutPage() {
  const { content } = useContent();

  return (
    <section className="section two-column">
      <div className="panel">
        <SectionHeader
          eyebrow="About Red Dot"
          title={content.about.title}
          text={content.about.description}
        />
      </div>
      <div className="panel panel--accent">
        <h3>What we do</h3>
        <div className="stack-list">
          {content.about.points.map((point) => (
            <div key={point} className="stack-list__item">
              {point}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
