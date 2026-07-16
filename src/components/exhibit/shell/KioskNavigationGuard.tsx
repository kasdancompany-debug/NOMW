"use client";

import { useEffect } from "react";
import { staffConfig } from "@/content/config/staff.config";
import type { ExhibitNavigationConfig } from "@/types/exhibit-shell";

type KioskNavigationGuardProps = {
  exhibitPath: string;
  navigation: ExhibitNavigationConfig;
};

function isAllowedHref(href: string): boolean {
  if (!href || href === "#") return true;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;

    const path = url.pathname;
    if (path === staffConfig.route) return true;
    if (path.startsWith("/exhibit/")) return true;
    if (path.startsWith("/dev/")) return true;
    if (path === "/" || path === "") return true;
    return false;
  } catch {
    return false;
  }
}

/**
 * Kiosk safety net: block external sites, new tabs, and window.open.
 * Guests may freely move between in-app exhibits.
 */
export function KioskNavigationGuard(_props: KioskNavigationGuardProps) {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      if (anchor.target === "_blank" || event.metaKey || event.ctrlKey || event.shiftKey) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (!isAllowedHref(href)) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    const onAuxClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      if (target?.closest?.("a")) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    document.addEventListener("click", onClick, true);
    document.addEventListener("auxclick", onAuxClick, true);

    const originalOpen = window.open;
    window.open = () => null;

    return () => {
      document.removeEventListener("click", onClick, true);
      document.removeEventListener("auxclick", onAuxClick, true);
      window.open = originalOpen;
    };
  }, []);

  return null;
}
