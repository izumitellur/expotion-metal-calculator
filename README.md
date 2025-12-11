# expotion-metal-calculator

Калькулятор массы металлопроката на Next.js 15.5.7 и TypeScript 5.9.2 со встроенными данными (металлы, сплавы, профили, плотности). Проект пересобран под Next из пакета Ringil (Django-версия), лицензия MIT.


## Использование в вашем проекте (npm)

Установите пакет:
```bash
npm install expotion-metal-calculator
```
Импортируйте компонент:
```tsx
import { MetalCalculator } from "expotion-metal-calculator";
```
Вставьте в вашу страницу/компонент:
```tsx
export default function Page() {
  return <MetalCalculator />;
}
```

## Описание (для npm и git)
- **Что это:** UI-компонент и демо-приложение для расчёта теоретического веса металлопроката (балка, труба, лист и т.д.) с моментальным перерасчётом и проверкой размеров.
- **Данные:** встроенные русские наименования металлов/сплавов/профилей и их плотности.
- **Технологии:** Next.js 15.5.7, TypeScript 5.9.2.
- **Происхождение:** пересобрано под Next из пакета Ringil (Django), лицензия MIT.
- **Репозиторий:** https://github.com/izumitellur/expotion-metal-calculator.git

## Копирайт и лицензия

- Copyright © 2022 Ringil (оригинальный Django-пакет).
- Copyright © 2024 expotion_metal_calc.
- Лицензия: MIT (см. `LICENCE`).
- Ссылки: [expotion.tech](https://expotion.tech) · [zaitsv.dev](https://zaitsv.dev)
