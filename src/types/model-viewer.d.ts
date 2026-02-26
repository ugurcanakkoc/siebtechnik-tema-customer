import { DetailedHTMLProps, HTMLAttributes } from "react";

declare global {
    namespace JSX {
        interface IntrinsicElements {
            "model-viewer": DetailedHTMLProps<
                HTMLAttributes<HTMLElement> & {
                    src?: string;
                    alt?: string;
                    "auto-rotate"?: boolean;
                    "camera-controls"?: boolean;
                    "shadow-intensity"?: string;
                    "environment-image"?: string;
                    exposure?: string;
                    loading?: string;
                    "ar-modes"?: string;
                    "reveal"?: string;
                    poster?: string;
                },
                HTMLElement
            >;
        }
    }
}
