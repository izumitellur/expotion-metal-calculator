import { CSSProperties } from "react";
declare const colors: {
    bg: string;
    panel: string;
    panel2: string;
    border: string;
    text: string;
    muted: string;
    accent: string;
    accent2: string;
    danger: string;
    black: string;
    inputBg: string;
    cardBg: string;
};
export declare const styles: Record<string, CSSProperties>;
export { colors };
/**
 * CSS-строка для инъекции в Shadow DOM.
 * Содержит reset и базовые стили для изоляции.
 */
export declare const shadowStyles: string;
