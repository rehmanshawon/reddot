import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import MediaGallery from "../components/MediaGallery";
import SectionHeader from "../components/SectionHeader";
import StatStrip from "../components/StatStrip";
import { useContent } from "../context/ContentContext";

export default function HomePage() {
  const { content } = useContent();

  return (
    <>
      <Hero site={content.site} />
      <StatStrip stats={content.stats} />

      <section className="section intro-panel">
        <SectionHeader
          eyebrow="Agency Profile"
          title="A visual production partner for brands that need films with reach and craft."
          text={content.site.agencyIntro}
        />
      </section>

      <MediaGallery
        eyebrow="Latest Work"
        title="Recent advertising films"
        text="Open any work to view its reel. Replace these sample posters and reel links with your real portfolio when ready."
        items={content.featuredWorks}
        imageKey="poster"
        metaBuilder={(item) => [item.client, item.year, item.platform]}
      />

      <section className="section spotlight-grid">
        <div className="spotlight-card">
          <p className="section-header__eyebrow">Full Archive</p>
          <h3>Browse every advertising film Red Dot has produced.</h3>
          <p>
            The works archive page presents the full portfolio in a searchable-style grid layout
            ready to be connected to backend content later.
          </p>
          <Link to="/works" className="button button--solid">
            View All Works
          </Link>
        </div>
        <div className="spotlight-card">
          <p className="section-header__eyebrow">Behind The Shoot</p>
          <h3>Show the craft behind the finished campaign.</h3>
          <p>
            BTS stills can open the related reel so visitors see both the production atmosphere and
            the final output.
          </p>
          <Link to="/bts" className="button button--ghost">
            Explore BTS Gallery
          </Link>
        </div>
      </section>
    </>
  );
}
