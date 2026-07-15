"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { staffConfig } from "@/content/config/staff.config";
import { useStationAssignment } from "@/components/station/StationProvider";
import {
  isPathAllowedForStation,
  stationExhibitPath,
} from "@/lib/kiosk/station";
import type { ExhibitNavigationConfig } from "@/types/exhibit-shell";

type KioskNavigationGuardProps = {
  exhibitPath: string;
  navigation: ExhibitNavigationConfig;
};

function isAllowedHref(
  href: string,
  exhibitPath: string,
  allowedPaths: string[],
  assignedPath: string | null,
): boolean {
  if (!href || href === "#") return true;
  if (href.startsWith("mailto:") || href.startsWith("tel:")) return false;

  try {
    const url = new URL(href, window.location.origin);
    if (url.origin !== window.location.origin) return false;

    const path = url.pathname;
    if (path === staffConfig.route) return true;
    if (path === exhibitPath || path.startsWith(`${exhibitPath}/`)) return true;
    if (assignedPath && (path === assignedPath || path.startsWith(`${assignedPath}/`))) {
      return true;
    }
    return allowedPaths.some(
      (allowed) => path === allowed || path.startsWith(`${allowed}/`),
    );
  } catch {
    return false;
  }
}

/**
 * Blocks outbound links, new tabs, and in-app routes outside this station's allow-list.
 * Station assignment (localStorage) is the source of truth across the shared build.
 */
export function KioskNavigationGuard({ exhibitPath, navigation }: KioskNavigationGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { assignment } = useStationAssignment();

  const lockedPath = assignment ? stationExhibitPath(assignment.stationId) : exhibitPath;
  const stationId = assignment?.stationId;

  useEffect(() => {
    if (pathname === staffConfig.route) return;

    if (stationId && !isPathAllowedForStation(pathname, stationId)) {
      router.replace(lockedPath);
      return;
    }

    const allowed = new Set([lockedPath, exhibitPath, ...navigation.allowedPaths]);

    if (
      pathname !== lockedPath &&
      pathname !== exhibitPath &&
      !pathname.startsWith(`${exhibitPath}/`) &&
      !pathname.startsWith(`${lockedPath}/`) &&
      ![...allowed].some((path) => pathname === path || pathname.startsWith(`${path}/`))
    ) {
      router.replace(lockedPath);
    }
  }, [pathname, exhibitPath, lockedPath, navigation.allowedPaths, router, stationId]);

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

      if (!isAllowedHref(href, exhibitPath, navigation.allowedPaths, lockedPath)) {
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
  }, [exhibitPath, lockedPath, navigation.allowedPaths]);

  return null;
}
