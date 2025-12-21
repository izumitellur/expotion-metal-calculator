"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useState } from "react";
import { calculateWeight, defaultInput } from "../lib/calculator";
import { metalAlloys, metals, metalShapes } from "../lib/data";
import { BeamIcon, SquareBarIcon, RoundBarIcon, SheetIcon, FlatBarIcon, RoundTubeIcon, ProfileTubeIcon, MetalAngleIcon, MetalChannelIcon, HexBarIcon, LogoExp, LogoZai, } from "./icons";
import { styles, colors, shadowStyles } from "./styles";
import { IsolatedRoot } from "./IsolatedRoot";
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
const shapeIcons = {
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
    const [form, setForm] = useState(getDefaultState());
    const [weight, setWeight] = useState("0.00");
    const [errors, setErrors] = useState([]);
    const [, setReady] = useState(false);
    const [hoveredTab, setHoveredTab] = useState(null);
    const [focusedInput, setFocusedInput] = useState(null);
    const [hoveredBtn, setHoveredBtn] = useState(null);
    const isMobile = useIsMobile();
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
    const getTabStyle = (id) => ({
        ...styles.shapeTab,
        ...(id === shapeId ? styles.shapeTabActive : {}),
        ...(hoveredTab === id && id !== shapeId
            ? { borderColor: colors.accent2, transform: "translateY(-1px)" }
            : {}),
    });
    const getInputStyle = (id) => ({
        ...styles.input,
        ...(focusedInput === id ? styles.inputFocus : {}),
    });
    const getBtnStyle = (type, id) => ({
        ...styles.btn,
        ...(type === "primary" ? styles.btnPrimary : styles.btnGhost),
        ...(hoveredBtn === id ? { transform: "translateY(-1px)" } : {}),
        ...(hoveredBtn === id && type === "ghost"
            ? { borderColor: colors.accent2, color: colors.accent2 }
            : {}),
    });
    const Icon = shapeIcons[shapeId];
    return (_jsx(IsolatedRoot, { styles: shadowStyles, children: _jsx("div", { style: styles.root, children: _jsxs("div", { style: isMobile ? { ...styles.card, padding: 20 } : styles.card, children: [_jsx("nav", { style: styles.shapeNav, children: metalShapes.map((shape) => (_jsx("button", { type: "button", style: getTabStyle(shape.id), onMouseEnter: () => setHoveredTab(shape.id), onMouseLeave: () => setHoveredTab(null), onClick: () => handleChange("shapeId")(String(shape.id)), children: shape.name }, shape.id))) }), _jsxs("div", { style: isMobile ? { ...styles.body, ...styles.bodyMobile } : styles.body, children: [_jsx("div", { style: styles.drawingPanel, children: _jsx("div", { style: styles.drawingBox, children: _jsx(Icon, { style: styles.shapeIcon }) }) }), _jsxs("form", { style: styles.formPanel, onSubmit: onSubmit, children: [_jsxs("section", { style: styles.materialBlock, children: [_jsxs("div", { style: styles.field, children: [_jsx("label", { style: styles.label, htmlFor: "emc-metalId", children: labels.metalId }), _jsx("select", { id: "emc-metalId", style: getInputStyle("metalId"), value: form.metalId, onFocus: () => setFocusedInput("metalId"), onBlur: () => setFocusedInput(null), onChange: (e) => handleChange("metalId")(e.target.value), children: metals.map((metal) => (_jsxs("option", { value: metal.id, children: [metal.name, " (", metal.density, " \u043A\u0433/\u043C\u00B3)"] }, metal.id))) })] }), _jsxs("div", { style: styles.field, children: [_jsx("label", { style: styles.label, htmlFor: "emc-alloyId", children: labels.alloyId }), _jsxs("select", { id: "emc-alloyId", style: getInputStyle("alloyId"), value: form.alloyId, onFocus: () => setFocusedInput("alloyId"), onBlur: () => setFocusedInput(null), onChange: (e) => handleChange("alloyId")(e.target.value), children: [_jsx("option", { value: "0", children: "\u0411\u0435\u0437 \u0441\u043F\u043B\u0430\u0432\u0430" }), alloysForMetal.map((alloy) => (_jsxs("option", { value: alloy.id, children: [alloy.name, " (", alloy.density, " \u043A\u0433/\u043C\u00B3)"] }, alloy.id)))] })] })] }), _jsx("section", { style: styles.fieldsBlock, children: ["width", "height", "s", "s2", "diameter", "quantity", "length"].map((fieldKey) => fieldIsVisible(fieldKey) && (_jsxs("div", { style: { ...styles.field, ...styles.fieldCompact }, children: [_jsx("label", { style: styles.label, htmlFor: `emc-${fieldKey}`, children: labels[fieldKey] }), _jsx("input", { id: `emc-${fieldKey}`, type: "number", inputMode: "decimal", min: "0", step: fieldKey === "s" || fieldKey === "s2" ? "0.1" : "1", style: getInputStyle(fieldKey), value: form[fieldKey], onFocus: () => setFocusedInput(fieldKey), onBlur: () => setFocusedInput(null), onChange: (e) => handleChange(fieldKey)(e.target.value) })] }, fieldKey))) }), _jsxs("section", { style: styles.resultBlock, children: [_jsxs("div", { style: styles.weightCell, children: [_jsx("div", { style: styles.weightLabel, children: "\u0412\u0435\u0441, \u043A\u0433" }), _jsx("div", { style: styles.weightDisplay, "aria-label": "\u0412\u0435\u0441, \u043A\u0433", children: weight })] }), _jsxs("div", { style: styles.actions, children: [_jsx("button", { type: "submit", style: getBtnStyle("primary", "submit"), onMouseEnter: () => setHoveredBtn("submit"), onMouseLeave: () => setHoveredBtn(null), children: "\u0420\u0430\u0441\u0441\u0447\u0438\u0442\u0430\u0442\u044C" }), _jsx("button", { type: "button", style: getBtnStyle("ghost", "reset"), onMouseEnter: () => setHoveredBtn("reset"), onMouseLeave: () => setHoveredBtn(null), onClick: () => {
                                                            setForm(getDefaultState());
                                                            setErrors([]);
                                                            setWeight("0.00");
                                                        }, children: "\u0421\u0431\u0440\u043E\u0441\u0438\u0442\u044C" })] })] }), errors.length > 0 && (_jsxs("div", { style: styles.errorPanel, children: [_jsx("p", { children: "\u041F\u0440\u043E\u0432\u0435\u0440\u044C\u0442\u0435 \u0432\u0432\u0435\u0434\u0451\u043D\u043D\u044B\u0435 \u0434\u0430\u043D\u043D\u044B\u0435:" }), _jsx("ul", { style: styles.errorList, children: errors.map((err) => (_jsx("li", { children: err }, err))) })] }))] })] }), _jsxs("footer", { style: styles.footerNote, children: [_jsx("span", { children: "expotion_metal_calc \u2014 \u0440\u0430\u0437\u0440\u0430\u0431\u043E\u0442\u0430\u043D\u043E" }), _jsxs("a", { href: "https://expotion.tech", target: "_blank", rel: "noreferrer", style: styles.footerLink, children: [_jsx(LogoExp, { style: styles.footerLogo }), _jsx("span", { children: "expotion.tech" })] }), _jsx("span", { children: "\u00D7" }), _jsxs("a", { href: "https://zaitsv.dev", target: "_blank", rel: "noreferrer", style: styles.footerLink, children: [_jsx(LogoZai, { style: styles.footerLogo }), _jsx("span", { children: "zaitsv.dev" })] }), _jsx("span", { children: "\u00D7 Ringil" })] })] }) }) }));
}
