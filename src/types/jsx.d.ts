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
          scaleStep?: number | undefined;
          class?: string | undefined;
          style?: CSSProperties | undefined;
          ref?: React.Ref<HTMLElement> | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        },
        HTMLElement
      >;
      'cropper-image': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string | undefined;
          alt?: string | undefined;
          crossorigin?: 'anonymous' | 'use-credentials' | '' | undefined;
          rotatable?: boolean | undefined;
          scalable?: boolean | undefined;
          skewable?: boolean | undefined;
          translatable?: boolean | undefined;
          ref?: React.Ref<HTMLElement> | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
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
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        },
        HTMLElement
      >;
      'cropper-grid': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          role?: string | undefined;
          rows?: number | undefined;
          columns?: number | undefined;
          bordered?: boolean | undefined;
          covered?: boolean | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        },
        HTMLElement
      >;
      'cropper-crosshair': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          centered?: boolean | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        },
        HTMLElement
      >;
      'cropper-handle': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          action?: string | undefined;
          'theme-color'?: string | undefined;
          plain?: boolean | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        },
        HTMLElement
      >;
      'cropper-shade': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          x?: number | undefined;
          y?: number | undefined;
          width?: number | undefined;
          height?: number | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        }
      >;
      'cropper-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          /** CSS selector for the cropper-selection to observe. Defaults to closest ancestor. */
          selection?: string | undefined;
          /** How the viewer resizes to match the selection aspect ratio. */
          resize?: 'both' | 'horizontal' | 'vertical' | 'none' | undefined;
          shadowRootMode?: 'closed' | 'open' | undefined;
          slottable?: boolean | undefined;
          themeColor?: string | undefined;
        },
        HTMLElement
      >;
    }
  }
}
