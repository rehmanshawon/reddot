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
  const { content, isLoading, error, saveSection, resetContent } = useContent();
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [siteDraft, setSiteDraft] = useState(content.site);
  const [aboutDraft, setAboutDraft] = useState(content.about);
  const [statsDraft, setStatsDraft] = useState("");
  const [featuredWorksDraft, setFeaturedWorksDraft] = useState("");
  const [worksArchiveDraft, setWorksArchiveDraft] = useState("");
  const [btsGalleryDraft, setBtsGalleryDraft] = useState("");
  const [leadershipDraft, setLeadershipDraft] = useState("");
  const [teamDraft, setTeamDraft] = useState("");

  useEffect(() => {
    setSiteDraft(content.site);
  }, [content.site]);

  useEffect(() => {
    setAboutDraft(content.about);
  }, [content.about]);

  useEffect(() => {
    setStatsDraft(JSON.stringify(content.stats, null, 2));
  }, [content.stats]);

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

  async function saveSectionValue(section, value, successLabel) {
    setStatus("");
    setIsSaving(true);

    try {
      await saveSection(section, value);
      setStatus(`${successLabel} saved.`);
    } catch (requestError) {
      setStatus(requestError.message || `Could not save ${successLabel.toLowerCase()}.`);
    } finally {
      setIsSaving(false);
    }
  }

  async function saveJsonSection(section, value, successLabel) {
    try {
      const parsed = JSON.parse(value);
      await saveSectionValue(section, parsed, successLabel);
    } catch {
      setStatus(`Could not save ${successLabel.toLowerCase()}. Please provide valid JSON.`);
    }
  }

  async function resetAllContent() {
    setStatus("");
    setIsSaving(true);

    try {
      await resetContent();
      setStatus("Sample content restored.");
    } catch (requestError) {
      setStatus(requestError.message || "Could not reset content.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <section className="section admin-layout">
        <SectionHeader
          eyebrow="Admin Studio"
          title="Update website content from one dashboard"
          text="Loading saved content from the backend."
        />
      </section>
    );
  }

  return (
    <section className="section admin-layout">
      <SectionHeader
        eyebrow="Admin Studio"
        title="Update website content from one dashboard"
        text="These edits now save through the Node.js backend, so the live website can stay in sync with the admin dashboard."
      />

      <div className="admin-grid">
        <div className="panel">
          <h3>Homepage copy</h3>
          <div className="admin-form">
            <InputField
              label="Hero tag"
              value={siteDraft.heroTag}
              onChange={(value) => setSiteDraft((current) => ({ ...current, heroTag: value }))}
            />
            <TextareaField
              label="Hero title"
              value={siteDraft.heroTitle}
              onChange={(value) => setSiteDraft((current) => ({ ...current, heroTitle: value }))}
              rows={3}
            />
            <TextareaField
              label="Hero text"
              value={siteDraft.heroText}
              onChange={(value) => setSiteDraft((current) => ({ ...current, heroText: value }))}
              rows={5}
            />
            <TextareaField
              label="Agency intro"
              value={siteDraft.agencyIntro}
              onChange={(value) =>
                setSiteDraft((current) => ({ ...current, agencyIntro: value }))
              }
              rows={4}
            />
            <button
              type="button"
              className="button button--solid"
              disabled={isSaving}
              onClick={() => saveSectionValue("site", siteDraft, "Homepage copy")}
            >
              Save homepage copy
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>About page copy</h3>
          <div className="admin-form">
            <TextareaField
              label="About title"
              value={aboutDraft.title}
              onChange={(value) => setAboutDraft((current) => ({ ...current, title: value }))}
              rows={3}
            />
            <TextareaField
              label="About description"
              value={aboutDraft.description}
              onChange={(value) =>
                setAboutDraft((current) => ({ ...current, description: value }))
              }
              rows={6}
            />
            <TextareaField
              label="Service points (one per line)"
              value={aboutDraft.points.join("\n")}
              onChange={(value) =>
                setAboutDraft((current) => ({
                  ...current,
                  points: value
                    .split("\n")
                    .map((item) => item.trim())
                    .filter(Boolean),
                }))
              }
              rows={5}
            />
            <button
              type="button"
              className="button button--solid"
              disabled={isSaving}
              onClick={() => saveSectionValue("about", aboutDraft, "About copy")}
            >
              Save about copy
            </button>
          </div>
        </div>

        <div className="panel">
          <h3>Stats JSON</h3>
          <TextareaField label="Stats strip" value={statsDraft} onChange={setStatsDraft} rows={12} />
          <button
            type="button"
            className="button button--solid"
            disabled={isSaving}
            onClick={() => saveJsonSection("stats", statsDraft, "Stats")}
          >
            Save stats
          </button>
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
            disabled={isSaving}
            onClick={() => saveJsonSection("featuredWorks", featuredWorksDraft, "Featured works")}
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
            disabled={isSaving}
            onClick={() => saveJsonSection("worksArchive", worksArchiveDraft, "Works archive")}
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
            disabled={isSaving}
            onClick={() => saveJsonSection("btsGallery", btsGalleryDraft, "BTS gallery")}
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
            disabled={isSaving}
            onClick={() => saveJsonSection("leadership", leadershipDraft, "Leadership")}
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
            disabled={isSaving}
            onClick={() => saveJsonSection("team", teamDraft, "Team")}
          >
            Save team
          </button>
        </div>
      </div>

      <div className="admin-actions">
        <button type="button" className="button button--ghost" disabled={isSaving} onClick={resetAllContent}>
          Reset sample content
        </button>
        {status ? <p className="admin-status">{status}</p> : null}
        {!status && error ? <p className="admin-status">{error}</p> : null}
      </div>
    </section>
  );
}
