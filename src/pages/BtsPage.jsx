import { useState } from "react";
import FilmCard from "../components/FilmCard";
import ReelModal from "../components/ReelModal";
import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

export default function BtsPage() {
  const { content } = useContent();
  const [activeItem, setActiveItem] = useState(null);

  const btsItems = content.btsGallery || [];
  const btsStills = btsItems.filter((item) => item.type !== "video");
  const btsVideos = btsItems.filter((item) => item.type === "video");

  return (
    <>
      <section className="section section--padded">
        <SectionHeader
          eyebrow="BEHIND THE SHOOT"
          title="Production stills and videos that connect process to the final reel."
          text="Each BTS image/video opens the related advertising reel, giving the site a deeper production-house feel."
        />
      </section>

      {/* BTS STILLS */}
      <section className="section section--padded">
        <SectionHeader
          eyebrow="BTS STILLS"
          title="On-set photography"
          text="Stills captured during production that reveal the craft behind each frame."
        />
        <div className="gallery-grid gallery-grid--compact">
          {btsStills.map((item) => (
            <FilmCard
              key={item.id}
              item={item}
              imageKey="image"
              onOpen={setActiveItem}
              meta={[item.production]}
            />
          ))}
        </div>
        {btsStills.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            No BTS stills added yet.
          </p>
        )}
      </section>

      {/* BTS VIDEOS */}
      <section className="section section--padded">
        <SectionHeader
          eyebrow="BTS VIDEOS"
          title="Behind-the-scenes footage"
          text="Video clips from set that show the production in motion."
        />
        <div className="gallery-grid gallery-grid--compact">
          {btsVideos.map((item) => (
            <FilmCard
              key={item.id}
              item={item}
              imageKey="image"
              onOpen={setActiveItem}
              meta={[item.production]}
            />
          ))}
        </div>
        {btsVideos.length === 0 && (
          <p style={{ color: "var(--text-muted)", textAlign: "center" }}>
            No BTS videos added yet.
          </p>
        )}
      </section>

      <ReelModal
        item={activeItem}
        imageKey="image"
        onClose={() => setActiveItem(null)}
      />
    </>
  );
}
