import { metalAlloys, metals } from "@/lib/data";

export type ShapeId = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type CalculatorInput = {
  shapeId: ShapeId;
  metalId: number;
  alloyId: number | null;
  width?: number;
  height?: number;
  s?: number;
  s2?: number;
  diameter?: number;
  quantity?: number;
  length?: number;
};

export type CalculatorResult = {
  weight: string;
  errors: string[];
};

type MeasurementField = "width" | "height" | "s" | "s2" | "diameter" | "quantity" | "length";

const fieldLabels: Record<keyof CalculatorInput, string> = {
  shapeId: "Форма проката",
  metalId: "Металл",
  alloyId: "Сплав",
  width: "Ширина",
  height: "Высота",
  s: "Толщина стенки",
  s2: "Толщина стенки s2",
  diameter: "Диаметр",
  quantity: "Количество листов",
  length: "Длина",
};

const requiredByShape: Record<ShapeId, MeasurementField[]> = {
  1: ["width", "height", "s", "s2", "length"], // Балка
  2: ["width", "length"], // Квадрат
  3: ["diameter", "length"], // Круг
  4: ["width", "height", "s", "quantity"], // Лист
  5: ["width", "s", "length"], // Полоса
  6: ["diameter", "s", "length"], // Труба
  7: ["width", "height", "s", "length"], // Труба профильная
  8: ["width", "height", "s", "length"], // Уголок
  9: ["width", "height", "s", "length"], // Швеллер
  10: ["diameter", "length"], // Шестигранник
};

const ensurePositive = (value: number, label: string, errors: string[]) => {
  if (!(value > 0)) {
    errors.push(`${label} должно быть больше нуля`);
  }
};

const getDensity = (metalId: number, alloyId: number | null) => {
  if (alloyId && alloyId > 0) {
    const alloy = metalAlloys.find((item) => item.id === alloyId);
    if (alloy) {
      return alloy.density;
    }
  }
  const metal = metals.find((item) => item.id === metalId);
  if (!metal) {
    throw new Error("Неизвестный металл");
  }
  return metal.density;
};

const round2 = (value: number) => Math.round(value * 100) / 100;

export const calculateWeight = (input: CalculatorInput): CalculatorResult => {
  const errors: string[] = [];

  const normalize = (value: number | undefined) => (Number.isFinite(value ?? NaN) ? Math.abs(value as number) : 0);

  const width = normalize(input.width);
  const height = normalize(input.height);
  const s = normalize(input.s);
  const s2 = normalize(input.s2);
  const diameter = normalize(input.diameter);
  const quantity = normalize(input.quantity);
  const length = normalize(input.length);

  // Проверяем обязательные поля
  requiredByShape[input.shapeId].forEach((field: MeasurementField) => {
    ensurePositive(
      {
        width,
        height,
        s,
        s2,
        diameter,
        quantity,
        length,
      }[field] ?? 0,
      fieldLabels[field],
      errors,
    );
  });

  if (errors.length) {
    return { weight: "0.00", errors };
  }

  let volume = 0;
  switch (input.shapeId) {
    case 1: // Балка
      if (width < s2) {
        errors.push(`Балка: ширина должна быть ≥ толщине стенки s2 (${width} < ${s2})`);
      }
      if (height < s * 2) {
        errors.push(`Балка: высота должна быть ≥ 2 × толщине стенки (${height} < ${s * 2})`);
      }
      if (!errors.length) {
        volume = (width * height - 2 * (height - 2 * s) * (width - s2) / 2) / 1_000_000 * length;
      }
      break;
    case 2: // Квадрат
      volume = (width ** 2) / 1_000_000 * length;
      break;
    case 3: // Круг
      volume = Math.PI * diameter ** 2 / 4 / 1_000_000 * length;
      break;
    case 4: // Лист
      volume = width * height / 1_000_000 * s * quantity / 1_000;
      break;
    case 5: // Полоса
      volume = width * length / 1_000_000 * s;
      break;
    case 6: // Труба круглая
      if (diameter < s * 2) {
        errors.push(`Труба: диаметр должен быть ≥ 2 × толщине стенки (${diameter} < ${s * 2})`);
      } else {
        volume = Math.PI * (diameter ** 2 - (diameter - s * 2) ** 2) / 4 / 1_000_000 * length;
      }
      break;
    case 7: // Труба профильная
      if (Math.min(width, height) < s * 2) {
        errors.push(`Профильная труба: стороны должны быть ≥ 2 × толщине стенки (min=${Math.min(width, height)}, требуется ≥ ${s * 2})`);
      } else {
        volume = (width * height - (width - s * 2) * (height - s * 2)) / 1_000_000 * length;
      }
      break;
    case 8: // Уголок
      if (Math.min(width, height) < s) {
        errors.push(`Уголок: стороны должны быть ≥ толщине стенки (min=${Math.min(width, height)}, требуется ≥ ${s})`);
      } else {
        volume = (width * s + (height - s) * s) / 1_000_000 * length;
      }
      break;
    case 9: // Швеллер
      if (width < s * 2 || height < s) {
        errors.push(
          `Швеллер: ширина ≥ 2 × стенке и высота ≥ стенке (width=${width}, height=${height}, wall=${s})`,
        );
      } else {
        volume = (width * s + (height - s) * s * 2) / 1_000_000 * length;
      }
      break;
    case 10: // Шестигранник
      volume = 2 * (3 ** 0.5) * (diameter / 2000) ** 2 * length;
      break;
    default:
      errors.push("Неизвестная форма");
  }

  if (errors.length) {
    return { weight: "0.00", errors };
  }

  const density = getDensity(input.metalId, input.alloyId);
  const weight = round2(volume * density).toFixed(2);

  return { weight, errors };
};

export const defaultInput: CalculatorInput = {
  shapeId: 1,
  metalId: 1,
  alloyId: null,
  width: 0,
  height: 0,
  s: 0,
  s2: 0,
  diameter: 0,
  quantity: 0,
  length: 0,
};
