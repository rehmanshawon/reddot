import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useContent } from "../context/ContentContext";
import WorksEditor from "../lib/WorksEditor";
import BtsEditor from "../lib/BtsEditor";
import StatsEditor from "../lib/StatsEditor";

function TextareaField({ label, value, onChange, rows = 4 }) {
  return (
    <label className="admin-form__field">
      <span>{label}</span>
      <textarea
        rows={rows}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
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
  const { user, logout } = useAuth();
  const { content, isLoading, error, saveSection, resetContent } = useContent();
  const [status, setStatus] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [siteDraft, setSiteDraft] = useState(content.site);
  const [aboutDraft, setAboutDraft] = useState(content.about);
  const [leadershipDraft, setLeadershipDraft] = useState("");
  const [teamDraft, setTeamDraft] = useState("");

  useEffect(() => {
    setSiteDraft(content.site);
  }, [content.site]);

  useEffect(() => {
    setAboutDraft(content.about);
  }, [content.about]);

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
      setStatus(
        requestError.message || `Could not save ${successLabel.toLowerCase()}.`,
      );
    } finally {
      setIsSaving(false);
    }
  }

  async function saveJsonSection(section, value, successLabel) {
    try {
      const parsed = JSON.parse(value);
      await saveSectionValue(section, parsed, successLabel);
    } catch {
      setStatus(
        `Could not save ${successLabel.toLowerCase()}. Please provide valid JSON.`,
      );
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
      <main className="admin-studio admin-studio--loading">
        <p>Loading Red Dot content...</p>
      </main>
    );
  }

  return (
    <main className="admin-studio">
      <aside className="admin-sidebar">
        <a className="admin-brand" href="/">
          RED DOT <span>Studio</span>
        </a>
        <nav className="admin-sidebar__nav" aria-label="Content sections">
          <a href="#overview">Overview</a>
          <a href="#homepage">Homepage</a>
          <a href="#about">About</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#people">People</a>
        </nav>
        <div className="admin-sidebar__footer">
          <a href="/" target="_blank" rel="noreferrer">
            View website
          </a>
          <button type="button" onClick={logout}>
            Sign out
          </button>
        </div>
      </aside>

      <section className="admin-workspace">
        <header className="admin-header" id="overview">
          <div>
            <p className="admin-kicker">Content management</p>
            <h1>Red Dot Studio</h1>
            <p>Manage the live editorial content for Red Dot.</p>
          </div>
          <div className="admin-user">
            <span>Signed in as</span>
            <strong>{user?.email}</strong>
          </div>
        </header>

        <div className="admin-grid">
          <div className="panel" id="homepage">
            <h3>Homepage copy</h3>
            <div className="admin-form">
              <InputField
                label="Hero tag"
                value={siteDraft.heroTag}
                onChange={(value) =>
                  setSiteDraft((current) => ({ ...current, heroTag: value }))
                }
              />
              <TextareaField
                label="Hero title"
                value={siteDraft.heroTitle}
                onChange={(value) =>
                  setSiteDraft((current) => ({ ...current, heroTitle: value }))
                }
                rows={3}
              />
              <TextareaField
                label="Hero text"
                value={siteDraft.heroText}
                onChange={(value) =>
                  setSiteDraft((current) => ({ ...current, heroText: value }))
                }
                rows={5}
              />
              <TextareaField
                label="Agency intro"
                value={siteDraft.agencyIntro}
                onChange={(value) =>
                  setSiteDraft((current) => ({
                    ...current,
                    agencyIntro: value,
                  }))
                }
                rows={4}
              />
              <button
                type="button"
                className="button button--solid"
                disabled={isSaving}
                onClick={() =>
                  saveSectionValue("site", siteDraft, "Homepage copy")
                }
              >
                Save homepage copy
              </button>
            </div>
          </div>

          <div className="panel" id="about">
            <h3>About page copy</h3>
            <div className="admin-form">
              <TextareaField
                label="About title"
                value={aboutDraft.title}
                onChange={(value) =>
                  setAboutDraft((current) => ({ ...current, title: value }))
                }
                rows={3}
              />
              <TextareaField
                label="About description"
                value={aboutDraft.description}
                onChange={(value) =>
                  setAboutDraft((current) => ({
                    ...current,
                    description: value,
                  }))
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
                onClick={() =>
                  saveSectionValue("about", aboutDraft, "About copy")
                }
              >
                Save about copy
              </button>
            </div>
          </div>

          <div className="admin-collections" id="portfolio">
            <WorksEditor sectionName="featuredWorks" />
            <WorksEditor sectionName="worksArchive" />
            <BtsEditor />
            <StatsEditor />
          </div>

          <div className="panel" id="people">
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
              onClick={() =>
                saveJsonSection("leadership", leadershipDraft, "Leadership")
              }
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
          <button
            type="button"
            className="button button--ghost"
            disabled={isSaving}
            onClick={resetAllContent}
          >
            Reset sample content
          </button>
          {status ? <p className="admin-status">{status}</p> : null}
          {!status && error ? <p className="admin-status">{error}</p> : null}
        </div>
      </section>
    </main>
  );
}
