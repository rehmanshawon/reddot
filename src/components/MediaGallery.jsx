import { useState } from "react";
import FilmCard from "./FilmCard";
import ReelModal from "./ReelModal";
import SectionHeader from "./SectionHeader";

export default function MediaGallery({
  eyebrow,
  title,
  text,
  items,
  imageKey,
  metaBuilder,
  compact = false,
}) {
  const [activeItem, setActiveItem] = useState(null);

  return (
    <section className="section">
      <SectionHeader eyebrow={eyebrow} title={title} text={text} />
      <div className={compact ? "gallery-grid gallery-grid--compact" : "gallery-grid"}>
        {items.map((item) => (
          <FilmCard
            key={item.id}
            item={item}
            imageKey={imageKey}
            onOpen={setActiveItem}
            meta={metaBuilder(item)}
          />
        ))}
      </div>
      <ReelModal item={activeItem} imageKey={imageKey} onClose={() => setActiveItem(null)} />
    </section>
  );
}
