import { useState, useEffect } from "react";
import { useContent } from "../context/ContentContext";
import { useAuth } from "../context/AuthContext";
import { uploadFile } from "../lib/api";

export default function WorksEditor({ sectionName = "featuredWorks" }) {
  const { content, saveSection } = useContent();
  const { token } = useAuth();

  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingId, setUploadingId] = useState(null);
  const [newItem, setNewItem] = useState(null);

  // Sync with global content state on mount
  useEffect(() => {
    if (content && content[sectionName]) {
      setItems(content[sectionName]);
    }
  }, [content, sectionName]);

  const handleAdd = () => {
    setNewItem({
      id: `work-${Date.now()}`,
      title: "New Work",
      client: "",
      year: new Date().getFullYear().toString(),
      platform: "",
      description: "",
      poster: "",
      reelUrl: "",
      ...(sectionName === "worksArchive" ? { category: "" } : {}),
    });
  };

  const handleNewItemChange = (field, value) => {
    setNewItem((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddNewSave = async () => {
    setIsSaving(true);
    try {
      const updatedItems = [newItem, ...items];
      await saveSection(sectionName, updatedItems);
      setNewItem(null);
    } catch (error) {
      alert("Failed to add new item: " + error.message);
    } finally {
      setIsSaving(false);
    }
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
      handleChange(id, "poster", response.url);
    } catch (error) {
      alert("Upload failed: " + error.message);
    } finally {
      setUploadingId(null);
    }
  };

  const handleNewItemUpload = async (file) => {
    if (!file) return;
    setUploadingId("new");
    try {
      const response = await uploadFile(file, token);
      handleNewItemChange("poster", response.url);
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
      alert(
        `${sectionName === "featuredWorks" ? "Featured Works" : "Works Archive"} saved successfully!`,
      );
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
        <h2>
          {sectionName === "featuredWorks" ? "Featured Works" : "Works Archive"}
        </h2>
        <div>
          <button
            type="button"
            onClick={handleAdd}
            className="button button--ghost"
            style={{ marginRight: "1rem" }}
          >
            + Add New
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
                style={{ color: "red", cursor: "pointer" }}
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
                <strong>Client</strong>
                <input
                  type="text"
                  value={item.client || ""}
                  onChange={(e) =>
                    handleChange(item.id, "client", e.target.value)
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
                <strong>Platform</strong>
                <input
                  type="text"
                  value={item.platform || ""}
                  onChange={(e) =>
                    handleChange(item.id, "platform", e.target.value)
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
                <strong>Year</strong>
                <input
                  type="text"
                  value={item.year || ""}
                  onChange={(e) =>
                    handleChange(item.id, "year", e.target.value)
                  }
                />
              </label>
              {sectionName === "worksArchive" && (
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <strong>Category</strong>
                  <input
                    type="text"
                    value={item.category || ""}
                    onChange={(e) =>
                      handleChange(item.id, "category", e.target.value)
                    }
                  />
                </label>
              )}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong>Reel URL (YouTube/Vimeo)</strong>
                <input
                  type="url"
                  value={item.reelUrl || ""}
                  onChange={(e) =>
                    handleChange(item.id, "reelUrl", e.target.value)
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
                rows="3"
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
              <strong>Poster Image</strong>
              {item.poster && (
                <img
                  src={item.poster}
                  alt="Thumbnail preview"
                  style={{
                    height: "120px",
                    width: "fit-content",
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
      </div>

      {newItem && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
        >
          <div
            style={{
              backgroundColor: "#2a2a2a",
              color: "#fff",
              padding: "2rem",
              borderRadius: "12px",
              width: "100%",
              maxWidth: "700px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3 style={{ marginBottom: "1.5rem", marginTop: 0 }}>
              Add New Work
            </h3>

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
                  value={newItem.title || ""}
                  onChange={(e) => handleNewItemChange("title", e.target.value)}
                />
              </label>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong>Client</strong>
                <input
                  type="text"
                  value={newItem.client || ""}
                  onChange={(e) =>
                    handleNewItemChange("client", e.target.value)
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
                <strong>Platform</strong>
                <input
                  type="text"
                  value={newItem.platform || ""}
                  onChange={(e) =>
                    handleNewItemChange("platform", e.target.value)
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
                <strong>Year</strong>
                <input
                  type="text"
                  value={newItem.year || ""}
                  onChange={(e) => handleNewItemChange("year", e.target.value)}
                />
              </label>
              {sectionName === "worksArchive" && (
                <label
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "0.5rem",
                  }}
                >
                  <strong>Category</strong>
                  <input
                    type="text"
                    value={newItem.category || ""}
                    onChange={(e) =>
                      handleNewItemChange("category", e.target.value)
                    }
                  />
                </label>
              )}
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.5rem",
                }}
              >
                <strong>Reel URL (YouTube/Vimeo)</strong>
                <input
                  type="url"
                  value={newItem.reelUrl || ""}
                  onChange={(e) =>
                    handleNewItemChange("reelUrl", e.target.value)
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
                rows="3"
                value={newItem.description || ""}
                onChange={(e) =>
                  handleNewItemChange("description", e.target.value)
                }
              />
            </label>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
                marginBottom: "2rem",
              }}
            >
              <strong>Poster Image</strong>
              {newItem.poster && (
                <img
                  src={newItem.poster}
                  alt="Thumbnail preview"
                  style={{
                    height: "120px",
                    width: "fit-content",
                    objectFit: "cover",
                    borderRadius: "4px",
                  }}
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleNewItemUpload(e.target.files[0])}
                disabled={uploadingId === "new"}
              />
              {uploadingId === "new" && (
                <span style={{ fontSize: "0.875rem", color: "#ccc" }}>
                  Uploading image...
                </span>
              )}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "1rem",
              }}
            >
              <button
                type="button"
                onClick={() => setNewItem(null)}
                className="button button--ghost"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleAddNewSave}
                disabled={isSaving}
                className="button button--solid"
              >
                {isSaving ? "Saving..." : "Add Work"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
