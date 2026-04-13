import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { defaultContent } from "../data/seedContent";
import { fetchContent, resetContent as resetContentRequest, updateContentSection } from "../lib/api";
import { useAuth } from "./AuthContext";

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const { token } = useAuth();
  const [content, setContent] = useState(defaultContent);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadContent() {
      try {
        setError("");
        const response = await fetchContent();
        if (!isCancelled) {
          setContent(response.content);
        }
      } catch (requestError) {
        if (!isCancelled) {
          setError(requestError.message);
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    loadContent();

    return () => {
      isCancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      content,
      error,
      isLoading,
      async refreshContent() {
        const response = await fetchContent();
        setContent(response.content);
        setError("");
        return response.content;
      },
      async saveSection(section, nextValue) {
        const response = await updateContentSection(section, nextValue, token);
        setContent(response.content);
        setError("");
        return response.content;
      },
      async resetContent() {
        const response = await resetContentRequest(token);
        setContent(response.content);
        setError("");
        return response.content;
      },
    }),
    [content, error, isLoading, token],
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  return useContext(ContentContext);
}
