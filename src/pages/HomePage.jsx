import { Link } from "react-router-dom";
import HeroVideo from "../components/HeroVideo";
import MediaGallery from "../components/MediaGallery";
import SectionHeader from "../components/SectionHeader";
import StatStrip from "../components/StatStrip";
import { useContent } from "../context/ContentContext";

export default function HomePage() {
  const { content } = useContent();

  return (
    <>
      <HeroVideo />

      <div className="home-section">
        <StatStrip stats={content.stats} />
      </div>

      <div className="home-section home-section--dark">
        <SectionHeader
          eyebrow="AGENCY PROFILE"
          title="A visual production partner for brands that need films with reach and craft."
          text={content.site.agencyIntro}
        />
      </div>

      <div className="home-section">
        <MediaGallery
          eyebrow="LATEST WORK"
          title="Recent advertising films"
          text="Open any work to view its reel."
          items={content.featuredWorks}
          imageKey="poster"
          metaBuilder={(item) => [item.client, item.year, item.platform]}
        />
      </div>

      <div className="home-section">
        <div className="spotlight-grid">
          <div className="spotlight-card">
            <p className="section-header__eyebrow">FULL ARCHIVE</p>
            <h3>Browse every advertising film RED DOT has produced.</h3>
            <p>
              The works archive page presents the full portfolio in a grid
              layout.
            </p>
            <Link to="/works" className="button button--solid">
              VIEW ALL WORKS
            </Link>
          </div>
          <div className="spotlight-card">
            <p className="section-header__eyebrow">BEHIND THE SHOOT</p>
            <h3>Show the craft behind the finished campaign.</h3>
            <p>
              BTS stills open the related reel so visitors see both the
              production atmosphere and the final output.
            </p>
            <Link to="/bts" className="button button--ghost">
              EXPLORE BTS GALLERY
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
