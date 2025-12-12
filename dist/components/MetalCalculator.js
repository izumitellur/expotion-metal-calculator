"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import clsx from "clsx";
import { calculateWeight, defaultInput } from "../lib/calculator";
import { metalAlloys, metals, metalShapes } from "../lib/data";
const visibleFields = {
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
const labels = {
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
const shapeSlug = {
    1: "beam",
    2: "square_bar",
    3: "round_bar",
    4: "sheet",
    5: "flat_bar",
    6: "round_tube",
    7: "profile_tube",
    8: "metal_angle",
    9: "metal_channel",
    10: "hex_bar",
};
const toNumber = (value) => {
    if (!value)
        return 0;
    const normalized = value.replace(",", ".");
    const parsed = parseFloat(normalized);
    return Number.isFinite(parsed) ? parsed : 0;
};
const getDefaultState = () => ({
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
    var _a;
    const [form, setForm] = useState(getDefaultState());
    const [weight, setWeight] = useState("0.00");
    const [errors, setErrors] = useState([]);
    const [ready, setReady] = useState(false);
    const shapeId = Number(form.shapeId);
    const metalId = Number(form.metalId);
    const alloyId = Number(form.alloyId);
    const alloysForMetal = useMemo(() => metalAlloys.filter((item) => item.metalId === metalId), [metalId]);
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
    const onSubmit = (event) => {
        event.preventDefault();
        runCalculation();
    };
    useEffect(() => {
        runCalculation();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [form]);
    const handleChange = (field) => (value) => {
        const cleanValue = value === "0" ? "" : value;
        setForm((prev) => ({
            ...prev,
            [field]: cleanValue,
            ...(field === "metalId" ? { alloyId: "0" } : null),
        }));
    };
    const fieldIsVisible = (field) => visibleFields[shapeId].includes(field);
    return (_jsx("div", { className: "emc-root", children: _jsxs("div", { className: "emc-card", children: [_jsx("nav", { className: "emc-shape-nav", children: metalShapes.map((shape) => (_jsx("button", { type: "button", className: clsx("emc-shape-tab", { "emc-active": shape.id === shapeId }), onClick: () => handleChange("shapeId")(String(shape.id)), children: shape.name }, shape.id))) }), _jsxs("div", { className: "emc-body", children: [_jsx("div", { className: "emc-drawing-panel", children: _jsx("div", { className: "emc-drawing-box", children: _jsx("img", { src: `/drawings/white/${shapeSlug[shapeId]}.svg`, alt: (_a = metalShapes.find((s) => s.id === shapeId)) === null || _a === void 0 ? void 0 : _a.name }) }) }), _jsxs("form", { className: "emc-form-panel", onSubmit: onSubmit, children: [_jsxs("section", { className: "emc-material-block", children: [_jsxs("div", { className: "emc-field", children: [_jsx("label", { htmlFor: "emc-metalId", children: labels.metalId }), _jsx("select", { id: "emc-metalId", value: form.metalId, onChange: (e) => handleChange("metalId")(e.target.value), children: metals.map((metal) => (_jsxs("option", { value: metal.id, children: [metal.name, " (", metal.density, " \u043A\u0433/\u043C\u00B3)"] }, metal.id))) })] }), _jsxs("div", { className: "emc-field", children: [_jsx("label", { htmlFor: "emc-alloyId", children: labels.alloyId }), _jsxs("select", { id: "emc-alloyId", value: form.alloyId, onChange: (e) => handleChange("alloyId")(e.target.value), children: [_jsx("option", { value: "0", children: "\u0411\u0435\u0437 \u0441\u043F\u043B\u0430\u0432\u0430" }), alloysForMetal.map((alloy) => (_jsxs("option", { value: alloy.id, children: [alloy.name, " (", alloy.density, " \u043A\u0433/\u043C\u00B3)"] }, alloy.id)))] })] })] }), _jsx("section", { className: "emc-fields-block", children: ["width", "height", "s", "s2", "diameter", "quantity", "length"].map((fieldKey) => fieldIsVisible(fieldKey) && (_jsxs("div", { className: "emc-field emc-compact", children: [_jsx("label", { htmlFor: `emc-${fieldKey}`, children: labels[fieldKey] }), _jsx("input", { id: `emc-${fieldKey}`, type: "number", inputMode: "decimal", min: "0", step: fieldKey === "s" || fieldKey === "s2" ? "0.1" : "1", value: form[fieldKey], onChange: (e) => handleChange(fieldKey)(e.target.value) })] }, fieldKey))) }), _jsxs("section", { className: "emc-result-block", children: [_jsxs("div", { className: "emc-weight-cell", children: [_jsx("div", { className: "emc-weight-label", children: "\u0412\u0435\u0441, \u043A\u0433" }), _jsx("div", { className: "emc-weight-display", "aria-label": "\u0412\u0435\u0441, \u043A\u0433", children: weight })] }), _jsxs("div", { className: "emc-actions", children: [_jsx("button", { type: "submit", className: "emc-btn emc-btn-primary", children: "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C" }), _jsx("button", { type: "button", className: "emc-btn emc-btn-ghost", onClick: () => {
                                                        setForm(getDefaultState());
                                                        setErrors([]);
                                                        setWeight("0.00");
                                                    }, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C" })] })] }), errors.length > 0 && (_jsxs("div", { className: "emc-error-panel", children: [_jsx("p", { children: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0432\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435:" }), _jsx("ul", { children: errors.map((err) => (_jsx("li", { children: err }, err))) })] }))] })] }), _jsxs("footer", { className: "emc-footer-note", children: [_jsx("span", { children: "expotion_metal_calc \u2014 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E" }), _jsxs("a", { href: "https://expotion.tech", target: "_blank", rel: "noreferrer", className: "emc-footer-link", children: [_jsx("img", { src: "/drawings/logo/exp.svg", alt: "expotion.tech" }), _jsx("span", { children: "expotion.tech" })] }), _jsx("span", { children: "\u00D7" }), _jsxs("a", { href: "https://zaitsv.dev", target: "_blank", rel: "noreferrer", className: "emc-footer-link", children: [_jsx("img", { src: "/drawings/logo/zai.svg", alt: "zaitsv.dev" }), _jsx("span", { children: "zaitsv.dev" })] }), _jsx("span", { children: "\u00D7 Ringil" })] })] }) }));
}
