import { useEffect, useState } from "react";

import {
  loadShareSettings,
  saveVisibility,
  regenerateShareToken,
} from "../services/shareApi";
import { buildShareUrl } from "../utils/shareHelpers";

// Owns Share page state: load current settings, switch visibility (optimistic
// with rollback), reset the private link, and copy the URL.
export function useShareSettings() {
  const [visibility, setVisibility] = useState("private");
  const [slug, setSlug] = useState("");
  const [shareToken, setShareToken] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const settings = await loadShareSettings();
        if (!isMounted) return;
        setVisibility(settings.visibility);
        setSlug(settings.slug);
        setShareToken(settings.shareToken);
      } catch (error) {
        console.error(error);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  async function changeVisibility(next) {
    if (next === visibility || saving) return;

    const previous = visibility;
    setVisibility(next); // optimistic
    setSaving(true);

    try {
      const settings = await saveVisibility(next);
      setVisibility(settings.visibility);
      setSlug(settings.slug);
      setShareToken(settings.shareToken);
    } catch (error) {
      console.error(error);
      setVisibility(previous); // roll back on failure
    } finally {
      setSaving(false);
    }
  }

  async function regenerate() {
    if (saving) return;
    setSaving(true);

    try {
      const { shareToken: token } = await regenerateShareToken();
      setShareToken(token);
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  const shareUrl = buildShareUrl({ visibility, slug, shareToken });

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  }

  return {
    loading,
    saving,
    visibility,
    shareUrl,
    copied,
    changeVisibility,
    regenerate,
    copy,
  };
}
