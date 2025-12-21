"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

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
export function IsolatedRoot({ children, styles, cssVars, fallback }: IsolatedRootProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (!hostRef.current) return;

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
  const hostStyle: React.CSSProperties = {
    display: "contents",
    ...(cssVars
      ? Object.fromEntries(
          Object.entries(cssVars).map(([k, v]) => [`--emc-${k}`, v])
        )
      : {}),
  };

  return (
    <div ref={hostRef} style={hostStyle}>
      {shadowRoot ? createPortal(children, shadowRoot) : fallback}
    </div>
  );
}

