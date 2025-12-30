/**
 * Performance monitoring utilities for tracking Core Web Vitals and performance metrics
 */

interface PerformanceMetric {
  name: string;
  value: number;
  rating: "good" | "needs-improvement" | "poor";
  delta?: number;
  id?: string;
}

/**
 * Get performance rating based on thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): "good" | "needs-improvement" | "poor" {
  if (value <= thresholds.good) return "good";
  if (value <= thresholds.poor) return "needs-improvement";
  return "poor";
}

/**
 * Report performance metric (can be extended to send to analytics)
 */
function reportMetric(metric: PerformanceMetric) {
  // Log to console in development
  if (import.meta.env.DEV) {
    console.log(`[Performance] ${metric.name}:`, {
      value: `${metric.value.toFixed(2)}ms`,
      rating: metric.rating,
    });
  }

  // TODO: Send to analytics service (e.g., Google Analytics, custom endpoint)
  // Example:
  // if (window.gtag) {
  //   window.gtag('event', metric.name, {
  //     value: Math.round(metric.value),
  //     metric_rating: metric.rating,
  //   });
  // }
}

/**
 * Measure Largest Contentful Paint (LCP)
 */
export function measureLCP() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      const lcp = {
        name: "LCP",
        value: lastEntry.renderTime || lastEntry.loadTime,
        rating: getRating(lastEntry.renderTime || lastEntry.loadTime, {
          good: 2500,
          poor: 4000,
        }),
      };

      reportMetric(lcp);
    });

    observer.observe({ entryTypes: ["largest-contentful-paint"] });
  } catch (error) {
    console.warn("LCP measurement not supported:", error);
  }
}

/**
 * Measure First Input Delay (FID)
 */
export function measureFID() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];
      entries.forEach((entry) => {
        const fid = {
          name: "FID",
          value: entry.processingStart - entry.startTime,
          rating: getRating(entry.processingStart - entry.startTime, {
            good: 100,
            poor: 300,
          }),
        };

        reportMetric(fid);
      });
    });

    observer.observe({ entryTypes: ["first-input"] });
  } catch (error) {
    console.warn("FID measurement not supported:", error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 */
export function measureCLS() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  let clsValue = 0;
  let clsEntries: any[] = [];

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];

      entries.forEach((entry: any) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
          clsEntries.push(entry);
        }
      });

      // Report CLS when page is about to unload
      if (document.visibilityState === "hidden") {
        const cls = {
          name: "CLS",
          value: clsValue,
          rating: getRating(clsValue, {
            good: 0.1,
            poor: 0.25,
          }),
        };

        reportMetric(cls);
      }
    });

    observer.observe({ entryTypes: ["layout-shift"] });
  } catch (error) {
    console.warn("CLS measurement not supported:", error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 */
export function measureFCP() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find(
        (entry) => entry.name === "first-contentful-paint"
      );

      if (fcpEntry) {
        const fcp = {
          name: "FCP",
          value: fcpEntry.startTime,
          rating: getRating(fcpEntry.startTime, {
            good: 1800,
            poor: 3000,
          }),
        };

        reportMetric(fcp);
      }
    });

    observer.observe({ entryTypes: ["paint"] });
  } catch (error) {
    console.warn("FCP measurement not supported:", error);
  }
}

/**
 * Measure Time to Interactive (TTI)
 */
export function measureTTI() {
  if (typeof window === "undefined" || !("PerformanceObserver" in window)) {
    return;
  }

  try {
    const navigation = performance.getEntriesByType(
      "navigation"
    )[0] as PerformanceNavigationTiming;

    if (navigation) {
      const tti =
        navigation.domInteractive - navigation.fetchStart;

      const ttiMetric = {
        name: "TTI",
        value: tti,
        rating: getRating(tti, {
          good: 3800,
          poor: 7300,
        }),
      };

      reportMetric(ttiMetric);
    }
  } catch (error) {
    console.warn("TTI measurement not supported:", error);
  }
}

/**
 * Initialize all performance monitoring
 */
export function initPerformanceMonitoring() {
  if (typeof window === "undefined") return;

  // Measure Core Web Vitals
  measureLCP();
  measureFID();
  measureCLS();
  measureFCP();
  measureTTI();

  // Report CLS when page is about to unload
  if (document.visibilityState === "hidden") {
    // Already handled in measureCLS
  } else {
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        // CLS will be reported in measureCLS
      }
    });
  }
}

/**
 * Get current bundle size information (if available)
 */
export function getBundleInfo() {
  if (typeof window === "undefined") return null;

  try {
    const resources = performance.getEntriesByType(
      "resource"
    ) as PerformanceResourceTiming[];

    const scripts = resources.filter(
      (r) => r.initiatorType === "script"
    );
    const totalSize = scripts.reduce((sum, script) => {
      return sum + (script.transferSize || 0);
    }, 0);

    return {
      scriptCount: scripts.length,
      totalSize,
      totalSizeKB: (totalSize / 1024).toFixed(2),
    };
  } catch (error) {
    console.warn("Bundle info not available:", error);
    return null;
  }
}
