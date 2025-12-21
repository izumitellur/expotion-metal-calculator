# Изоляция стилей React-компонентов через Shadow DOM

## Проблема

При использовании сторонних React-компонентов (например, калькуляторов, виджетов) в Next.js приложении возникает утечка стилей:

1. **Inline styles** компонента устанавливают `font-family`, `font-size` и т.д.
2. При клиентской навигации (без перезагрузки) эти стили остаются в DOM
3. Компоненты хоста (кнопки, инпуты) наследуют эти стили через `inherit`
4. UI ломается — кнопки меняют размер, шрифты "плывут"

## Решение: Shadow DOM

Shadow DOM создаёт изолированное поддерево DOM со своим scope стилей:

- Стили внутри Shadow DOM не влияют на хост
- Стили хоста не влияют на Shadow DOM
- Работает во всех современных браузерах

## Реализация

### 1. Компонент-обёртка IsolatedRoot

```tsx
// components/IsolatedRoot.tsx
"use client";

import { useRef, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface IsolatedRootProps {
  children: ReactNode;
  /** Опциональные стили для инъекции в Shadow DOM */
  styles?: string;
}

export function IsolatedRoot({ children, styles }: IsolatedRootProps) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [shadowRoot, setShadowRoot] = useState<ShadowRoot | null>(null);

  useEffect(() => {
    if (hostRef.current && !hostRef.current.shadowRoot) {
      const shadow = hostRef.current.attachShadow({ mode: "open" });

      // Инъекция стилей если переданы
      if (styles) {
        const styleEl = document.createElement("style");
        styleEl.textContent = styles;
        shadow.appendChild(styleEl);
      }

      setShadowRoot(shadow);
    }
  }, [styles]);

  return (
    <div ref={hostRef}>{shadowRoot && createPortal(children, shadowRoot)}</div>
  );
}
```

### 2. Использование в пакете

```tsx
// MetalCalculator.tsx
"use client";

import { IsolatedRoot } from "./IsolatedRoot";
import { CalculatorInner } from "./CalculatorInner";

// Стили калькулятора как строка (можно импортировать из .css)
const calculatorStyles = `
  .emc-root {
    font-family: "IBM Plex Sans", sans-serif;
    color: #e9e9f0;
  }
  .emc-btn {
    padding: 16px 20px;
    font-size: 15px;
    /* ... остальные стили */
  }
`;

export function MetalCalculator() {
  return (
    <IsolatedRoot styles={calculatorStyles}>
      <CalculatorInner />
    </IsolatedRoot>
  );
}
```

### 3. Альтернатива: inline styles без inherit

Если Shadow DOM избыточен, можно убрать `inherit` из inline стилей:

```tsx
// ❌ Плохо — утекает в хост
const btnStyle = {
  fontFamily: "inherit", // наследует от родителя
  fontSize: "inherit",
};

// ✅ Хорошо — явные значения
const btnStyle = {
  fontFamily: '"IBM Plex Sans", sans-serif',
  fontSize: "15px",
};
```

## Сравнение подходов

| Подход         | Изоляция входящих | Изоляция исходящих | SSR       | Сложность |
| -------------- | ----------------- | ------------------ | --------- | --------- |
| Shadow DOM     | ✅ Полная         | ✅ Полная          | ⚠️ Клиент | Средняя   |
| CSS Modules    | ❌ Нет            | ✅ Классы          | ✅ Да     | Простая   |
| `all: initial` | ✅ Полная         | ❌ Нет             | ✅ Да     | Простая   |
| Явные стили    | ❌ Нет            | ✅ Частичная       | ✅ Да     | Простая   |

## Ограничения Shadow DOM

1. **SSR**: Shadow DOM создаётся только на клиенте. Контент появится после гидрации.

2. **CSS-in-JS**: Библиотеки типа styled-components требуют настройки `StyleSheetManager` для инъекции в Shadow DOM.

3. **Порталы**: React порталы (модалки) рендерятся вне Shadow DOM по умолчанию.

4. **Формы**: `<form>` внутри Shadow DOM не участвует в нативной валидации хоста.

## Рекомендации для пакетов

1. **Избегайте `inherit`** в inline стилях — используйте явные значения
2. **Префиксуйте классы** (`.emc-*`, `.calc-*`) для избежания коллизий
3. **Используйте CSS-переменные** с уникальным неймспейсом (`--emc-color`)
4. **Документируйте** требования к окружению
5. **Тестируйте** в SPA-режиме (клиентская навигация без перезагрузки)

## Пример: быстрый фикс без Shadow DOM

Если нужно быстро изолировать компонент на стороне хоста:

```tsx
// app/calculators/page.tsx
<div
  style={{
    contain: "layout style paint",
    isolation: "isolate",
  }}
>
  <MetalCalculator />
</div>
```

⚠️ `contain: style` поддерживается не во всех браузерах.

## Ссылки

- [MDN: Using Shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)
- [React Portal API](https://react.dev/reference/react-dom/createPortal)
- [CSS Containment](https://developer.mozilla.org/en-US/docs/Web/CSS/contain)
