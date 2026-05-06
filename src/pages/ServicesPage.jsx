import { useState } from "react";
import FilmCard from "../components/FilmCard";
import ReelModal from "../components/ReelModal";
import SectionHeader from "../components/SectionHeader";
import { useContent } from "../context/ContentContext";

const serviceTabs = [
  { key: "videoProduction", label: "VIDEO PRODUCTION" },
  { key: "postProduction", label: "POST PRODUCTION" },
  { key: "event", label: "EVENT" },
  { key: "creative", label: "CREATIVE" },
];

const videoSubSections = [
  { key: "TVC", label: "TVC" },
  { key: "AV", label: "AV" },
  { key: "musicVideo", label: "MUSIC VIDEO" },
  { key: "liveContent", label: "LIVE CONTENT" },
  { key: "realityTV", label: "REALITY TV SHOW" },
];

export default function ServicesPage() {
  const { content } = useContent();
  const services = content.services || {};
  const [activeTab, setActiveTab] = useState("videoProduction");
  const [activeSubTab, setActiveSubTab] = useState("TVC");
  const [activeReel, setActiveReel] = useState(null);

  const videoData = services.videoProduction || {};
  const currentSub = videoData[activeSubTab];

  return (
    <section className="section section--padded">
      <SectionHeader
        eyebrow="SERVICES"
        title="Full-service advertising film production."
        text="From concept to final delivery, RED DOT offers end-to-end production capabilities across every screen and format."
      />

      {/* Service Tab Buttons */}
      <div className="service-tabs">
        {serviceTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`service-tab${activeTab === tab.key ? " service-tab--active" : ""}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="service-content">
        {/* VIDEO PRODUCTION */}
        {activeTab === "videoProduction" && (
          <>
            <div className="service-intro">
              <p>
                Our flagship division. We produce advertising films, brand
                content, music videos, live broadcasts, and reality programming
                — all with cinematic production values and platform-aware
                storytelling.
              </p>
            </div>

            {/* Sub-section buttons */}
            <div className="service-subtabs">
              {videoSubSections.map((sub) => (
                <button
                  key={sub.key}
                  type="button"
                  className={`service-subtab${activeSubTab === sub.key ? " service-subtab--active" : ""}`}
                  onClick={() => setActiveSubTab(sub.key)}
                >
                  {sub.label}
                </button>
              ))}
            </div>

            {/* Sub-section content */}
            {currentSub && (
              <div className="service-subcontent">
                <SectionHeader
                  title={currentSub.title}
                  text={currentSub.description}
                />
                <div className="gallery-grid">
                  {(currentSub.gallery || []).map((item) => (
                    <FilmCard
                      key={item.id}
                      item={item}
                      imageKey="poster"
                      onOpen={setActiveReel}
                      meta={[item.client, item.platform]}
                    />
                  ))}
                </div>
                {(currentSub.gallery || []).length === 0 && (
                  <p
                    style={{ color: "var(--text-muted)", textAlign: "center" }}
                  >
                    No work samples added yet.
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Placeholder tabs */}
        {activeTab === "postProduction" && (
          <div className="service-intro">
            <h3>POST PRODUCTION</h3>
            <p>
              Content coming soon. Editing, color grading, sound design, VFX,
              and finishing for TV and digital.
            </p>
          </div>
        )}

        {activeTab === "event" && (
          <div className="service-intro">
            <h3>EVENT</h3>
            <p>
              Content coming soon. Live event coverage, multi-camera setups, and
              broadcast production.
            </p>
          </div>
        )}

        {activeTab === "creative" && (
          <div className="service-intro">
            <h3>CREATIVE</h3>
            <p>
              Content coming soon. Concept development, scriptwriting,
              storyboarding, and creative direction.
            </p>
          </div>
        )}
      </div>

      <ReelModal
        item={activeReel}
        imageKey="poster"
        onClose={() => setActiveReel(null)}
      />
    </section>
  );
}
