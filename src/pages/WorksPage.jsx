import MediaGallery from "../components/MediaGallery";
import { useContent } from "../context/ContentContext";

export default function WorksPage() {
  const { content } = useContent();

  return (
    <MediaGallery
      eyebrow="Works Archive"
      title="Every campaign film in one portfolio grid"
      text="This grid is designed to scale into a complete archive with filters, categories, and CMS-backed metadata once we connect the backend."
      items={content.worksArchive}
      imageKey="poster"
      compact
      metaBuilder={(item) => [item.client, item.category, item.year]}
    />
  );
}
