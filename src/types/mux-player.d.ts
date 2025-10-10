import React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "mux-player": {
        "stream-type"?: "on-demand" | "live";
        "playback-id"?: string;
        "metadata-video-title"?: string;
        "metadata-viewer-user-id"?: string;
        controls?: boolean;
        style?: React.CSSProperties;
        autoplay?: boolean;
        muted?: boolean;
        loop?: boolean;
      };
    }
  }
}
