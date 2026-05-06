import { useState, useEffect } from "react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { uploadFile } from "./api";

export default function BtsEditor() {
  const sectionName = "btsGallery";
  const { content, saveSection } = useContent();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);

  useEffect(() => {
    if (content && content[sectionName]) {
      setItems(content[sectionName]);
    }
  }, [content]);

  const handleAdd = () => {
    setItems([
      {
        id: `bts-${Date.now()}`,
        type: "still",
        title: "New BTS Shot",
        production: "",
        description: "",
        image: "",
        reelUrl: "",
      },
      ...items,
    ]);
  };

  const handleRemove = (id) => {
    if (window.confirm("Are you sure you want to remove this item?")) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setItems(
      items.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  };

  const handleUpload = async (id, file) => {
    if (!file) return;
    setUploadingId(id);
    try {
      const response = await uploadFile(file, token);
      handleChange(id, "image", response.url);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await saveSection(sectionName, items);
      alert("BTS Gallery saved successfully!");
    } catch (error) {
      alert("Failed to save: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      style={{
        marginBottom: "3rem",
        padding: "2rem",
        border: "1px solid #eee",
        borderRadius: "12px",
        background: "#fafafa",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1rem",
        }}
      >
        <h2>BTS Gallery</h2>
        <div>
          <button
            type="button"
            onClick={handleAdd}
            className="button button--ghost"
            style={{ marginRight: "1rem" }}
          >
            + Add New Image
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

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              border: "1px solid #ddd",
              padding: "1.5rem",
              borderRadius: "8px",
              background: "#fff",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "1rem",
              }}
            >
              <button
                type="button"
                onClick={() => handleRemove(item.id)}
                style={{
                  color: "red",
                  cursor: "pointer",
                  background: "none",
                  border: "none",
                }}
              >
                Remove Item
              </button>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1.5rem",
                marginBottom: "1rem",
              }}
            >
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong>Title</strong>
                <input
                  type="text"
                  value={item.title || ""}
                  onChange={(e) =>
                    handleChange(item.id, "title", e.target.value)
                  }
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong>Type</strong>
                <select
                  value={item.type || "still"}
                  onChange={(e) =>
                    handleChange(item.id, "type", e.target.value)
                  }
                  style={{
                    padding: "0.6rem",
                    borderRadius: "4px",
                    border: "1px solid #ddd",
                    background: "#fff",
                  }}
                >
                  <option value="still">BTS Still</option>
                  <option value="video">BTS Video</option>
                </select>
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong>Production / Client</strong>
                <input
                  type="text"
                  value={item.production || ""}
                  onChange={(e) =>
                    handleChange(item.id, "production", e.target.value)
                  }
                />
              </label>
            </div>

            <label
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "1.5rem",
              }}
            >
              <strong>Description</strong>
              <textarea
                rows="2"
                value={item.description || ""}
                onChange={(e) =>
                  handleChange(item.id, "description", e.target.value)
                }
              />
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              <strong>Photo</strong>
              {item.image && (
                <img
                  src={item.image}
                  alt="BTS preview"
                  style={{
                    height: "200px",
                    width: "100%",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(item.id, e.target.files[0])}
                disabled={uploadingId === item.id}
              />
              {uploadingId === item.id && (
                <span style={{ fontSize: "0.875rem", color: "#666" }}>
                  Uploading image...
                </span>
              )}
            </div>
          </div>
        ))}
        {items.length === 0 && <p>No BTS images added yet.</p>}
      </div>
    </div>
  );
}
