import { useState } from "react";
import EditorStatus from "../components/EditorStatus";
import { captureException } from "./errorReporting";
import useSectionEditor from "./useSectionEditor";

function mapStats(contentItems) {
  return contentItems.map((item, index) => ({
    ...item,
    id: item.id || `stat-${index}-${Date.now()}`,
  }));
}

export default function StatsEditor() {
  const sectionName = "stats";
  const { addItem, isSaving, items, removeItem, saveItems, updateItem } =
    useSectionEditor(sectionName, mapStats);
  const [status, setStatus] = useState(null);

  const handleAdd = () => {
    addItem({
      id: `stat-${Date.now()}`,
      label: "New Stat",
      value: "100+",
    });
  };

  const handleRemove = (id) => {
    removeItem(id);
  };

  const handleChange = (id, field, value) => {
    updateItem(id, field, value);
  };

  const handleSave = async () => {
    try {
      // Clean up the local IDs before saving to keep the database JSON clean
      const cleanItems = items.map((item) => ({
        label: item.label,
        value: item.value,
      }));
      await saveItems(cleanItems);
      setStatus({ type: "success", message: "Stats saved successfully!" });
    } catch (error) {
      captureException(error, { action: "save-stats" });
      setStatus({ type: "error", message: "Failed to save: " + error.message });
    }
  };

  return (
    <div style={{ marginBottom: "3rem" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>Company Stats</h2>
        <div>
          <button
            type="button"
            onClick={handleAdd}
            className="button button--ghost"
            style={{ marginRight: "1rem" }}
          >
            + Add Stat
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="button button--solid"
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      <EditorStatus status={status} />

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr auto",
              gap: "1.5rem",
              alignItems: "end",
              border: "1px solid #ddd",
              padding: "1.5rem",
              borderRadius: "8px",
            }}
          >
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <strong>Label (e.g., 'Brands Served')</strong>
              <input
                type="text"
                value={item.label || ""}
                onChange={(e) => handleChange(item.id, "label", e.target.value)}
              />
            </label>
            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <strong>Value (e.g., '70+')</strong>
              <input
                type="text"
                value={item.value || ""}
                onChange={(e) => handleChange(item.id, "value", e.target.value)}
              />
            </label>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              style={{
                color: "red",
                cursor: "pointer",
                background: "none",
                border: "none",
                paddingBottom: "5px",
              }}
            >
              Remove
            </button>
          </div>
        ))}
        {items.length === 0 && <p>No stats added yet.</p>}
      </div>
    </div>
  );
}
