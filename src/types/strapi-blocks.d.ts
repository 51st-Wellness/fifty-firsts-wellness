declare module "@strapi/blocks-react-renderer" {
  import * as React from "react";
  export type BlocksContent = any;
  export interface BlocksRendererProps {
    content: BlocksContent;
    blocks?: Record<string, any>;
    modifiers?: Record<string, any>;
  }
  export const BlocksRenderer: React.FC<BlocksRendererProps>;
}
