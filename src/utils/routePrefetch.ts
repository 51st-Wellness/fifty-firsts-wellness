/**
 * Route prefetching utilities for improving perceived performance
 */

/**
 * Prefetch a route component
 */
export function prefetchRoute(routePath: string): void {
  // Prefetch the route by creating a link element
  const link = document.createElement("link");
  link.rel = "prefetch";
  link.href = routePath;
  link.as = "document";
  document.head.appendChild(link);
}

/**
 * Prefetch route on hover/focus
 */
export function prefetchOnHover(
  element: HTMLElement,
  routePath: string
): () => void {
  let prefetched = false;

  const handleHover = () => {
    if (!prefetched) {
      prefetchRoute(routePath);
      prefetched = true;
    }
  };

  element.addEventListener("mouseenter", handleHover);
  element.addEventListener("focus", handleHover);

  return () => {
    element.removeEventListener("mouseenter", handleHover);
    element.removeEventListener("focus", handleHover);
  };
}

/**
 * Prefetch critical routes on page load
 */
export function prefetchCriticalRoutes(): void {
  // Prefetch likely next routes
  const criticalRoutes = [
    "/marketplace",
    "/about",
    "/services/personal-wellness",
  ];

  // Use requestIdleCallback if available, otherwise setTimeout
  const schedulePrefetch = (callback: () => void) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 2000);
    }
  };

  schedulePrefetch(() => {
    criticalRoutes.forEach((route) => {
      prefetchRoute(route);
    });
  });
}
