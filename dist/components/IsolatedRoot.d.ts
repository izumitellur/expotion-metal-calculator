import { type ReactNode } from "react";
interface IsolatedRootProps {
    children: ReactNode;
    /** Опциональные стили для инъекции в Shadow DOM */
    styles?: string;
    /** CSS-переменные для кастомизации извне */
    cssVars?: Record<string, string>;
    /** Placeholder для SSR (показывается до гидрации) */
    fallback?: ReactNode;
}
/**
 * Изолирует children в Shadow DOM для предотвращения утечки стилей.
 * Стили калькулятора не влияют на хост, стили хоста не влияют на калькулятор.
 */
export declare function IsolatedRoot({ children, styles, cssVars, fallback }: IsolatedRootProps): import("react/jsx-runtime").JSX.Element;
export {};
