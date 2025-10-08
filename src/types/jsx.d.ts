/**
 * JSX type definitions for CropperJS 2.x web components
 * This allows TypeScript to recognize custom elements in React/JSX
 */

import type { CSSProperties } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'cropper-canvas': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          background?: boolean | undefined;
          class?: string | undefined;
          style?: CSSProperties | undefined;
          ref?: React.Ref<HTMLElement> | undefined;
        },
        HTMLElement
      >;
      'cropper-image': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          rotatable?: boolean | undefined;
          scalable?: boolean | undefined;
          skewable?: boolean | undefined;
          translatable?: boolean | undefined;
          ref?: React.Ref<HTMLElement> | undefined;
        },
        HTMLElement
      >;
      'cropper-selection': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          x?: number | undefined;
          y?: number | undefined;
          width?: number | undefined;
          height?: number | undefined;
          'aspect-ratio'?: number | undefined;
          'initial-aspect-ratio'?: number | undefined;
          'initial-coverage'?: number | undefined;
          movable?: boolean | undefined;
          resizable?: boolean | undefined;
          zoomable?: boolean | undefined;
          multiple?: boolean | undefined;
          outlined?: boolean | undefined;
          ref?: React.Ref<HTMLElement> | undefined;
        },
        HTMLElement
      >;
    }
  }
}
