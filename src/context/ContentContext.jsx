import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { seedContent } from "../data/seedContent";

const ContentContext = createContext(null);
const CONTENT_KEY = "red-dot-content";

function readStoredContent() {
  const saved = window.localStorage.getItem(CONTENT_KEY);
  if (!saved) {
    return seedContent;
  }

  try {
    return JSON.parse(saved);
  } catch {
    return seedContent;
  }
}

export function ContentProvider({ children }) {
  const [content, setContent] = useState(seedContent);

  useEffect(() => {
    setContent(readStoredContent());
  }, []);

  useEffect(() => {
    window.localStorage.setItem(CONTENT_KEY, JSON.stringify(content));
  }, [content]);

  const value = useMemo(
    () => ({
      content,
      updateContent: (section, nextValue) => {
        setContent((current) => ({
          ...current,
          [section]: nextValue,
        }));
      },
      resetContent: () => setContent(seedContent),
    }),
    [content],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
