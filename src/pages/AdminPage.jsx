import { useEffect, useState } from "react";
import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

function TextareaField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="admin-form__field">
      <span>{label}</span>
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function InputField({ label, value, onChange }) {
  return (
    <label className="admin-form__field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export default function AdminPage() {
  const { content, updateContent, resetContent } = useContent();
  const [status, setStatus] = useState("");
  const [featuredWorksDraft, setFeaturedWorksDraft] = useState("");
  const [worksArchiveDraft, setWorksArchiveDraft] = useState("");
  const [btsGalleryDraft, setBtsGalleryDraft] = useState("");
  const [leadershipDraft, setLeadershipDraft] = useState("");
  const [teamDraft, setTeamDraft] = useState("");

  useEffect(() => {
    setFeaturedWorksDraft(JSON.stringify(content.featuredWorks, null, 2));
  }, [content.featuredWorks]);

  useEffect(() => {
    setWorksArchiveDraft(JSON.stringify(content.worksArchive, null, 2));
  }, [content.worksArchive]);

  useEffect(() => {
    setBtsGalleryDraft(JSON.stringify(content.btsGallery, null, 2));
  }, [content.btsGallery]);

  useEffect(() => {
    setLeadershipDraft(JSON.stringify(content.leadership, null, 2));
  }, [content.leadership]);

  useEffect(() => {
    setTeamDraft(JSON.stringify(content.team, null, 2));
  }, [content.team]);

  const saveJsonSection = (section, value) => {
    try {
      updateContent(section, JSON.parse(value));
      setStatus(`${section} updated.`);
    } catch {
      setStatus(`Could not update ${section}. Please provide valid JSON.`);
    }
  };

  return (
    <section className="section admin-layout">
      <SectionHeader
        eyebrow="Admin Studio"
        title="Update website content from one dashboard"
        text="For now, edits are stored in browser local storage. This structure is ready to be connected to a NestJS API and database later."
      />

      <div className="admin-grid">
        <div className="panel">
          <h3>Homepage copy</h3>
          <div className="admin-form">
            <InputField
              label="Hero tag"
              value={content.site.heroTag}
              onChange={(value) => updateContent("site", { ...content.site, heroTag: value })}
            />
            <TextareaField
              label="Hero title"
              value={content.site.heroTitle}
              onChange={(value) => updateContent("site", { ...content.site, heroTitle: value })}
              rows={3}
            />
            <TextareaField
              label="Hero text"
              value={content.site.heroText}
              onChange={(value) => updateContent("site", { ...content.site, heroText: value })}
              rows={5}
            />
            <TextareaField
              label="Agency intro"
              value={content.site.agencyIntro}
              onChange={(value) => updateContent("site", { ...content.site, agencyIntro: value })}
              rows={4}
            />
          </div>
        </div>

        <div className="panel">
          <h3>About page copy</h3>
          <div className="admin-form">
            <TextareaField
              label="About title"
              value={content.about.title}
              onChange={(value) => updateContent("about", { ...content.about, title: value })}
              rows={3}
            />
            <TextareaField
              label="About description"
              value={content.about.description}
              onChange={(value) =>
                updateContent("about", { ...content.about, description: value })
              }
              rows={6}
            />
            <TextareaField
              label="Service points (one per line)"
              value={content.about.points.join("\n")}
              onChange={(value) =>
                updateContent("about", {
                  ...content.about,
                  points: value.split("\n").filter(Boolean),
                })
              }
              rows={5}
            />
          </div>
        </div>

        <div className="panel">
          <h3>Featured works JSON</h3>
          <TextareaField
            label="Featured works"
            value={featuredWorksDraft}
            onChange={setFeaturedWorksDraft}
            rows={16}
          />
          <button
            type="button"
            className="button button--solid"
            onClick={() => saveJsonSection("featuredWorks", featuredWorksDraft)}
          >
            Save featured works
          </button>
        </div>

        <div className="panel">
          <h3>Works archive JSON</h3>
          <TextareaField
            label="Works archive"
            value={worksArchiveDraft}
            onChange={setWorksArchiveDraft}
            rows={16}
          />
          <button
            type="button"
            className="button button--solid"
            onClick={() => saveJsonSection("worksArchive", worksArchiveDraft)}
          >
            Save works archive
          </button>
        </div>

        <div className="panel">
          <h3>BTS gallery JSON</h3>
          <TextareaField
            label="BTS gallery"
            value={btsGalleryDraft}
            onChange={setBtsGalleryDraft}
            rows={16}
          />
          <button
            type="button"
            className="button button--solid"
            onClick={() => saveJsonSection("btsGallery", btsGalleryDraft)}
          >
            Save BTS gallery
          </button>
        </div>

        <div className="panel">
          <h3>Leadership JSON</h3>
          <TextareaField
            label="Leadership profiles"
            value={leadershipDraft}
            onChange={setLeadershipDraft}
            rows={16}
          />
          <button
            type="button"
            className="button button--solid"
            onClick={() => saveJsonSection("leadership", leadershipDraft)}
          >
            Save leadership
          </button>
        </div>

        <div className="panel">
          <h3>Creative team JSON</h3>
          <TextareaField
            label="Team members"
            value={teamDraft}
            onChange={setTeamDraft}
            rows={16}
          />
          <button
            type="button"
            className="button button--solid"
            onClick={() => saveJsonSection("team", teamDraft)}
          >
            Save team
          </button>
        </div>
      </div>

      <div className="admin-actions">
        <button type="button" className="button button--ghost" onClick={resetContent}>
          Reset sample content
        </button>
        {status ? <p className="admin-status">{status}</p> : null}
      </div>
    </section>
  );
}
