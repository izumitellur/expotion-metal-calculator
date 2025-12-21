"use client";
import { jsx as _jsx } from "react/jsx-runtime";
import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
/**
 * Изолирует children в Shadow DOM для предотвращения утечки стилей.
 * Стили калькулятора не влияют на хост, стили хоста не влияют на калькулятор.
 */
export function IsolatedRoot({ children, styles, cssVars, fallback }) {
    const hostRef = useRef(null);
    const [shadowRoot, setShadowRoot] = useState(null);
    useEffect(() => {
        if (!hostRef.current)
            return;
        // Если shadow уже создан — используем его
        if (hostRef.current.shadowRoot) {
            setShadowRoot(hostRef.current.shadowRoot);
            return;
        }
        const shadow = hostRef.current.attachShadow({ mode: "open" });
        // Инъекция базовых стилей
        if (styles) {
            const styleEl = document.createElement("style");
            styleEl.textContent = styles;
            shadow.appendChild(styleEl);
        }
        setShadowRoot(shadow);
    }, [styles]);
    // Применяем CSS-переменные к хосту
    const hostStyle = {
        display: "contents",
        ...(cssVars
            ? Object.fromEntries(Object.entries(cssVars).map(([k, v]) => [`--emc-${k}`, v]))
            : {}),
    };
    return (_jsx("div", { ref: hostRef, style: hostStyle, children: shadowRoot ? createPortal(children, shadowRoot) : fallback }));
}
