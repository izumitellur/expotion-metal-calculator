"use client";

import { CSSProperties, FormEvent, useEffect, useMemo, useState, ComponentType } from "react";

import { calculateWeight, defaultInput, ShapeId } from "../lib/calculator";
import { metalAlloys, metals, metalShapes } from "../lib/data";
import {
  BeamIcon,
  SquareBarIcon,
  RoundBarIcon,
  SheetIcon,
  FlatBarIcon,
  RoundTubeIcon,
  ProfileTubeIcon,
  MetalAngleIcon,
  MetalChannelIcon,
  HexBarIcon,
  LogoExp,
  LogoZai,
} from "./icons";
import { styles, colors, shadowStyles } from "./styles";
import { IsolatedRoot } from "./IsolatedRoot";

type FormState = Record<
  | "shapeId"
  | "metalId"
  | "alloyId"
  | "width"
  | "height"
  | "s"
  | "s2"
  | "diameter"
  | "quantity"
  | "length",
  string
>;

const visibleFields: Record<ShapeId, (keyof FormState)[]> = {
  1: ["width", "height", "s", "s2", "length"],
  2: ["width", "length"],
  3: ["diameter", "length"],
  4: ["width", "height", "s", "quantity"],
  5: ["width", "s", "length"],
  6: ["diameter", "s", "length"],
  7: ["width", "height", "s", "length"],
  8: ["width", "height", "s", "length"],
  9: ["width", "height", "s", "length"],
  10: ["diameter", "length"],
};

const labels: Record<keyof FormState, string> = {
  shapeId: "Форма",
  metalId: "Металл",
  alloyId: "Сплав",
  width: "a (ширина), мм",
  height: "b (высота), мм",
  s: "s (толщина), мм",
  s2: "s2 (толщина), мм",
  diameter: "d (диаметр), мм",
  quantity: "Количество листов, шт",
  length: "L (длина), м",
};

const shapeIcons: Record<ShapeId, ComponentType<{ style?: CSSProperties }>> = {
  1: BeamIcon,
  2: SquareBarIcon,
  3: RoundBarIcon,
  4: SheetIcon,
  5: FlatBarIcon,
  6: RoundTubeIcon,
  7: ProfileTubeIcon,
  8: MetalAngleIcon,
  9: MetalChannelIcon,
  10: HexBarIcon,
};

const toNumber = (value: string) => {
  if (!value) return 0;
  const normalized = value.replace(",", ".");
  const parsed = parseFloat(normalized);
  return Number.isFinite(parsed) ? parsed : 0;
};

const getDefaultState = (): FormState => ({
  shapeId: String(defaultInput.shapeId),
  metalId: String(defaultInput.metalId),
  alloyId: "0",
  width: "0",
  height: "0",
  s: "0",
  s2: "0",
  diameter: "0",
  quantity: "0",
  length: "0",
});

function useIsMobile(breakpoint = 960) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= breakpoint);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, [breakpoint]);
  return isMobile;
}

export function MetalCalculator() {
  const [form, setForm] = useState<FormState>(getDefaultState());
  const [weight, setWeight] = useState("0.00");
  const [errors, setErrors] = useState<string[]>([]);
  const [, setReady] = useState(false);
  const [hoveredTab, setHoveredTab] = useState<number | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [hoveredBtn, setHoveredBtn] = useState<string | null>(null);

  const isMobile = useIsMobile();

  const shapeId = Number(form.shapeId) as ShapeId;
  const metalId = Number(form.metalId);
  const alloyId = Number(form.alloyId);

  const alloysForMetal = useMemo(
    () => metalAlloys.filter((item) => item.metalId === metalId),
    [metalId],
  );

  const runCalculation = () => {
    const visibleFieldsList = visibleFields[shapeId];
    const anyZero = visibleFieldsList.some((fieldKey) => toNumber(form[fieldKey]) <= 0);
    if (anyZero) {
      setReady(false);
      setErrors([]);
      setWeight("0.00");
      return;
    }

    const result = calculateWeight({
      shapeId,
      metalId,
      alloyId: alloyId || null,
      width: toNumber(form.width),
      height: toNumber(form.height),
      s: toNumber(form.s),
      s2: toNumber(form.s2),
      diameter: toNumber(form.diameter),
      quantity: toNumber(form.quantity),
      length: toNumber(form.length),
    });
    setErrors(result.errors);
    setWeight(result.weight);
    setReady(true);
  };

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    runCalculation();
  };

  useEffect(() => {
    runCalculation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form]);

  const handleChange = (field: keyof FormState) => (value: string) => {
    const cleanValue = value === "0" ? "" : value;
    setForm((prev) => ({
      ...prev,
      [field]: cleanValue,
      ...(field === "metalId" ? { alloyId: "0" } : null),
    }));
  };

  const fieldIsVisible = (field: keyof FormState) => visibleFields[shapeId].includes(field);

  const getTabStyle = (id: number): CSSProperties => ({
    ...styles.shapeTab,
    ...(id === shapeId ? styles.shapeTabActive : {}),
    ...(hoveredTab === id && id !== shapeId
      ? { borderColor: colors.accent2, transform: "translateY(-1px)" }
      : {}),
  });

  const getInputStyle = (id: string): CSSProperties => ({
    ...styles.input,
    ...(focusedInput === id ? styles.inputFocus : {}),
  });

  const getBtnStyle = (type: "primary" | "ghost", id: string): CSSProperties => ({
    ...styles.btn,
    ...(type === "primary" ? styles.btnPrimary : styles.btnGhost),
    ...(hoveredBtn === id ? { transform: "translateY(-1px)" } : {}),
    ...(hoveredBtn === id && type === "ghost"
      ? { borderColor: colors.accent2, color: colors.accent2 }
      : {}),
  });

  const Icon = shapeIcons[shapeId];

  return (
    <IsolatedRoot styles={shadowStyles}>
      <div style={styles.root}>
        <div style={isMobile ? { ...styles.card, padding: 20 } : styles.card}>
          <nav style={styles.shapeNav}>
            {metalShapes.map((shape) => (
              <button
                key={shape.id}
                type="button"
                style={getTabStyle(shape.id)}
                onMouseEnter={() => setHoveredTab(shape.id)}
                onMouseLeave={() => setHoveredTab(null)}
                onClick={() => handleChange("shapeId")(String(shape.id))}
              >
                {shape.name}
              </button>
            ))}
          </nav>

          <div style={isMobile ? { ...styles.body, ...styles.bodyMobile } : styles.body}>
            <div style={styles.drawingPanel}>
              <div style={styles.drawingBox}>
                <Icon style={styles.shapeIcon} />
              </div>
            </div>

            <form style={styles.formPanel} onSubmit={onSubmit}>
              <section style={styles.materialBlock}>
                <div style={styles.field}>
                  <label style={styles.label} htmlFor="emc-metalId">
                    {labels.metalId}
                  </label>
                  <select
                    id="emc-metalId"
                    style={getInputStyle("metalId")}
                    value={form.metalId}
                    onFocus={() => setFocusedInput("metalId")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => handleChange("metalId")(e.target.value)}
                  >
                    {metals.map((metal) => (
                      <option key={metal.id} value={metal.id}>
                        {metal.name} ({metal.density} кг/м³)
                      </option>
                    ))}
                  </select>
                </div>

                <div style={styles.field}>
                  <label style={styles.label} htmlFor="emc-alloyId">
                    {labels.alloyId}
                  </label>
                  <select
                    id="emc-alloyId"
                    style={getInputStyle("alloyId")}
                    value={form.alloyId}
                    onFocus={() => setFocusedInput("alloyId")}
                    onBlur={() => setFocusedInput(null)}
                    onChange={(e) => handleChange("alloyId")(e.target.value)}
                  >
                    <option value="0">Без сплава</option>
                    {alloysForMetal.map((alloy) => (
                      <option key={alloy.id} value={alloy.id}>
                        {alloy.name} ({alloy.density} кг/м³)
                      </option>
                    ))}
                  </select>
                </div>
              </section>

              <section style={styles.fieldsBlock}>
                {(
                  ["width", "height", "s", "s2", "diameter", "quantity", "length"] as (keyof FormState)[]
                ).map(
                  (fieldKey) =>
                    fieldIsVisible(fieldKey) && (
                      <div key={fieldKey} style={{ ...styles.field, ...styles.fieldCompact }}>
                        <label style={styles.label} htmlFor={`emc-${fieldKey}`}>
                          {labels[fieldKey]}
                        </label>
                        <input
                          id={`emc-${fieldKey}`}
                          type="number"
                          inputMode="decimal"
                          min="0"
                          step={fieldKey === "s" || fieldKey === "s2" ? "0.1" : "1"}
                          style={getInputStyle(fieldKey)}
                          value={form[fieldKey]}
                          onFocus={() => setFocusedInput(fieldKey)}
                          onBlur={() => setFocusedInput(null)}
                          onChange={(e) => handleChange(fieldKey)(e.target.value)}
                        />
                      </div>
                    ),
                )}
              </section>

              <section style={styles.resultBlock}>
                <div style={styles.weightCell}>
                  <div style={styles.weightLabel}>Вес, кг</div>
                  <div style={styles.weightDisplay} aria-label="Вес, кг">
                    {weight}
                  </div>
                </div>
                <div style={styles.actions}>
                  <button
                    type="submit"
                    style={getBtnStyle("primary", "submit")}
                    onMouseEnter={() => setHoveredBtn("submit")}
                    onMouseLeave={() => setHoveredBtn(null)}
                  >
                    Рассчитать
                  </button>
                  <button
                    type="button"
                    style={getBtnStyle("ghost", "reset")}
                    onMouseEnter={() => setHoveredBtn("reset")}
                    onMouseLeave={() => setHoveredBtn(null)}
                    onClick={() => {
                      setForm(getDefaultState());
                      setErrors([]);
                      setWeight("0.00");
                    }}
                  >
                    Сбросить
                  </button>
                </div>
              </section>

              {errors.length > 0 && (
                <div style={styles.errorPanel}>
                  <p>Проверьте введённые данные:</p>
                  <ul style={styles.errorList}>
                    {errors.map((err) => (
                      <li key={err}>{err}</li>
                    ))}
                  </ul>
                </div>
              )}
            </form>
          </div>

          <footer style={styles.footerNote}>
            <span>expotion_metal_calc — разработано</span>
            <a href="https://expotion.tech" target="_blank" rel="noreferrer" style={styles.footerLink}>
              <LogoExp style={styles.footerLogo} />
              <span>expotion.tech</span>
            </a>
            <span>×</span>
            <a href="https://zaitsv.dev" target="_blank" rel="noreferrer" style={styles.footerLink}>
              <LogoZai style={styles.footerLogo} />
              <span>zaitsv.dev</span>
            </a>
            <span>× Ringil</span>
          </footer>
        </div>
      </div>
    </IsolatedRoot>
  );
}
