import { useEffect, useState } from "react";
import { useContent } from "../context/ContentContext";

const identity = (items) => items;

export default function useSectionEditor(
  sectionName,
  mapContentItems = identity,
) {
  const { content, saveSection } = useContent();
  const [items, setItems] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (content?.[sectionName]) {
      setItems(mapContentItems(content[sectionName]));
    }
  }, [content, mapContentItems, sectionName]);

  function addItem(item, position = "end") {
    setItems((currentItems) =>
      position === "start" ? [item, ...currentItems] : [...currentItems, item],
    );
  }

  function removeItem(id) {
    setItems((currentItems) => currentItems.filter((item) => item.id !== id));
  }

  function updateItem(id, field, value) {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, [field]: value } : item,
      ),
    );
  }

  async function saveItems(nextItems = items) {
    setIsSaving(true);
    try {
      await saveSection(sectionName, nextItems);
    } finally {
      setIsSaving(false);
    }
  }

  return {
    addItem,
    isSaving,
    items,
    removeItem,
    saveItems,
    setItems,
    updateItem,
  };
}
