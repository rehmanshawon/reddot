import { useState, useEffect } from "react";
import { useContent } from "../context/ContentContext";

export default function StatsEditor() {
  const sectionName = "stats";
  const { content, saveSection } = useContent();

  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content && content[sectionName]) {
      // Add a local ID for React mapping since the seed JSON array doesn't have IDs for stats
      setItems(
        content[sectionName].map((item, index) => ({
          ...item,
          id: item.id || `stat-${index}-${Date.now()}`,
        })),
      );
    }
  }, [content]);

  const handleAdd = () => {
    setItems([
      ...items,
      {
        id: `stat-${Date.now()}`,
        label: "New Stat",
        value: "100+",
      },
    ]);
  };

  const handleRemove = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const handleChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Clean up the local IDs before saving to keep the database JSON clean
      const cleanItems = items.map(({ id, ...rest }) => rest);
      await saveSection(sectionName, cleanItems);
      alert("Stats saved successfully!");
    } catch (error) {
      alert("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
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
