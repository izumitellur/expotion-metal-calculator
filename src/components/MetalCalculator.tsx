"use client";

import { FormEvent, useEffect, useMemo, useState, ComponentType } from "react";
import clsx from "clsx";

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

const shapeIcons: Record<ShapeId, ComponentType<{ className?: string }>> = {
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

export function MetalCalculator() {
  const [form, setForm] = useState<FormState>(getDefaultState());
  const [weight, setWeight] = useState("0.00");
  const [errors, setErrors] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

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

  return (
    <div className="emc-root">
      <div className="emc-card">
        <nav className="emc-shape-nav">
          {metalShapes.map((shape) => (
            <button
              key={shape.id}
              type="button"
              className={clsx("emc-shape-tab", { "emc-active": shape.id === shapeId })}
              onClick={() => handleChange("shapeId")(String(shape.id))}
            >
              {shape.name}
            </button>
          ))}
        </nav>

        <div className="emc-body">
          <div className="emc-drawing-panel">
            <div className="emc-drawing-box">
              {(() => {
                const Icon = shapeIcons[shapeId];
                return <Icon className="emc-shape-icon" />;
              })()}
            </div>
          </div>

          <form className="emc-form-panel" onSubmit={onSubmit}>
            <section className="emc-material-block">
              <div className="emc-field">
                <label htmlFor="emc-metalId">{labels.metalId}</label>
                <select
                  id="emc-metalId"
                  value={form.metalId}
                  onChange={(e) => handleChange("metalId")(e.target.value)}
                >
                  {metals.map((metal) => (
                    <option key={metal.id} value={metal.id}>
                      {metal.name} ({metal.density} кг/м³)
                    </option>
                  ))}
                </select>
              </div>

              <div className="emc-field">
                <label htmlFor="emc-alloyId">{labels.alloyId}</label>
                <select
                  id="emc-alloyId"
                  value={form.alloyId}
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

            <section className="emc-fields-block">
              {(["width", "height", "s", "s2", "diameter", "quantity", "length"] as (keyof FormState)[]).map(
                (fieldKey) =>
                  fieldIsVisible(fieldKey) && (
                    <div key={fieldKey} className="emc-field emc-compact">
                      <label htmlFor={`emc-${fieldKey}`}>{labels[fieldKey]}</label>
                      <input
                        id={`emc-${fieldKey}`}
                        type="number"
                        inputMode="decimal"
                        min="0"
                        step={fieldKey === "s" || fieldKey === "s2" ? "0.1" : "1"}
                        value={form[fieldKey]}
                        onChange={(e) => handleChange(fieldKey)(e.target.value)}
                      />
                    </div>
                  ),
              )}
            </section>

            <section className="emc-result-block">
              <div className="emc-weight-cell">
                <div className="emc-weight-label">Вес, кг</div>
                <div className="emc-weight-display" aria-label="Вес, кг">
                  {weight}
                </div>
              </div>
              <div className="emc-actions">
                <button type="submit" className="emc-btn emc-btn-primary">Рассчитать</button>
                <button
                  type="button"
                  className="emc-btn emc-btn-ghost"
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
              <div className="emc-error-panel">
                <p>Проверьте введённые данные:</p>
                <ul>
                  {errors.map((err) => (
                    <li key={err}>{err}</li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>

        <footer className="emc-footer-note">
          <span>expotion_metal_calc — разработано</span>
          <a href="https://expotion.tech" target="_blank" rel="noreferrer" className="emc-footer-link">
            <LogoExp className="emc-footer-logo" />
            <span>expotion.tech</span>
          </a>
          <span>×</span>
          <a href="https://zaitsv.dev" target="_blank" rel="noreferrer" className="emc-footer-link">
            <LogoZai className="emc-footer-logo" />
            <span>zaitsv.dev</span>
          </a>
          <span>× Ringil</span>
        </footer>
      </div>
    </div>
  );
}
