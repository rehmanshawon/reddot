import MediaGallery from "../components/MediaGallery";
import { useContent } from "../context/ContentContext";

export default function BtsPage() {
  const { content } = useContent();

  return (
    <MediaGallery
      eyebrow="Behind The Shoot"
      title="Production stills that connect process to the final reel"
      text="Each BTS image opens the related advertising reel, giving the site a deeper production-house feel."
      items={content.btsGallery}
      imageKey="image"
      compact
      metaBuilder={(item) => [item.production]}
    />
  );
}
