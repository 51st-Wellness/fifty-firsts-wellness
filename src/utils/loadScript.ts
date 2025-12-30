/**
 * Dynamically loads a script and returns a promise that resolves when loaded
 */
export function loadScript(src: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if script is already loaded
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    // Check if script with same src already exists
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.defer = true;
    
    if (id) {
      script.id = id;
    }

    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Failed to load script: ${src}`));

    document.head.appendChild(script);
  });
}

/**
 * Dynamically loads a stylesheet and returns a promise that resolves when loaded
 */
export function loadStylesheet(href: string, id?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if stylesheet is already loaded
    if (id && document.getElementById(id)) {
      resolve();
      return;
    }

    // Check if stylesheet with same href already exists
    const existingLink = document.querySelector(`link[href="${href}"]`);
    if (existingLink) {
      resolve();
      return;
    }

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.type = "text/css";
    
    if (id) {
      link.id = id;
    }

    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load stylesheet: ${href}`));

    document.head.appendChild(link);
  });
}

/**
 * Load Royal Mail AddressNow scripts (for checkout/address pages)
 */
export async function loadRoyalMailScripts(): Promise<void> {
  const royalMailKey = import.meta.env.VITE_ROYAL_MAIL_KEY;
  if (!royalMailKey) {
    console.warn("Royal Mail key not found in environment variables");
    return;
  }

  try {
    await loadStylesheet(
      `https://api.addressnow.co.uk/css/addressnow-2.30.min.css?key=${royalMailKey}`,
      "royal-mail-css"
    );
    await loadScript(
      `https://api.addressnow.co.uk/js/addressnow-2.30.min.js?key=${royalMailKey}`,
      "royal-mail-js"
    );
  } catch (error) {
    console.error("Failed to load Royal Mail scripts:", error);
  }
}

/**
 * Load Mux Player script (for podcast/video pages)
 */
export async function loadMuxPlayerScript(): Promise<void> {
  try {
    await loadScript(
      "https://cdn.jsdelivr.net/npm/@mux/mux-player",
      "mux-player"
    );
  } catch (error) {
    console.error("Failed to load Mux Player script:", error);
  }
}
