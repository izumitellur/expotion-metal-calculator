const colors = {
    bg: "#0b0b0f",
    panel: "#111119",
    panel2: "#161620",
    border: "#252530",
    text: "#e9e9f0",
    muted: "#a1a1b5",
    accent: "#f0f0f5",
    accent2: "#8ae0ff",
    danger: "#ff6b6b",
    black: "#000000",
    inputBg: "#0f0f18",
    cardBg: "#18181b",
};
const fontFamily = `"IBM Plex Sans", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif`;
export const styles = {
    root: {
        fontFamily,
        colorScheme: "dark",
        boxSizing: "border-box",
        color: colors.text,
    },
    card: {
        width: "min(100%, 1200px)",
        background: colors.cardBg,
        border: `1px solid ${colors.border}`,
        borderRadius: 0,
        padding: 28,
        boxShadow: "0 20px 60px rgba(0, 0, 0, 0.45)",
    },
    shapeNav: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
        gap: 8,
        margin: "18px 0 12px",
    },
    shapeTab: {
        background: colors.black,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        color: colors.text,
        padding: "10px 12px",
        borderRadius: 0,
        cursor: "pointer",
        transition: "border-color 150ms ease, color 150ms ease, transform 150ms ease",
        minHeight: 52,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        fontFamily,
        fontSize: 14,
    },
    shapeTabActive: {
        borderColor: colors.accent,
        color: colors.accent,
    },
    body: {
        display: "grid",
        gridTemplateColumns: "1.1fr 1.4fr",
        gap: 20,
        alignItems: "stretch",
        marginTop: 12,
    },
    bodyMobile: {
        gridTemplateColumns: "1fr",
    },
    drawingPanel: {
        background: "rgba(255, 255, 255, 0.02)",
        border: `1px solid ${colors.border}`,
        borderRadius: 0,
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    drawingBox: {
        width: "100%",
        background: colors.black,
        border: `1px dashed ${colors.border}`,
        borderRadius: 0,
        padding: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    shapeIcon: {
        width: "100%",
        height: "auto",
        maxHeight: 520,
        objectFit: "contain",
    },
    formPanel: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
    },
    materialBlock: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 12,
    },
    fieldsBlock: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        background: "rgba(255, 255, 255, 0.02)",
        border: `1px solid ${colors.border}`,
        borderRadius: 0,
        padding: "10px 12px",
    },
    fieldCompact: {
        padding: "8px 10px",
    },
    label: {
        color: colors.muted,
        fontSize: 13,
    },
    input: {
        width: "100%",
        padding: "10px 12px",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: colors.border,
        borderRadius: 0,
        background: colors.inputBg,
        color: colors.text,
        fontSize: 15,
        fontFamily,
        outline: "none",
    },
    inputFocus: {
        outline: `1px solid ${colors.accent2}`,
        borderColor: colors.accent2,
    },
    resultBlock: {
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "flex-end",
    },
    weightCell: {
        display: "flex",
        flexDirection: "column",
        gap: 6,
        flex: 1,
    },
    weightDisplay: {
        minHeight: 56,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "12px 18px",
        border: `1px solid ${colors.border}`,
        background: colors.inputBg,
        color: colors.text,
        fontSize: 28,
        fontWeight: 700,
    },
    weightLabel: {
        color: colors.muted,
        fontSize: 13,
    },
    actions: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        justifyContent: "flex-end",
    },
    btn: {
        cursor: "pointer",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "transparent",
        borderRadius: 0,
        padding: "16px 20px",
        fontSize: 15,
        fontWeight: 600,
        fontFamily,
        transition: "transform 150ms ease, background 150ms ease, border-color 150ms ease",
        height: 56,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
    },
    btnPrimary: {
        background: colors.accent,
        color: "#0c0c10",
        borderColor: colors.accent,
    },
    btnGhost: {
        background: "transparent",
        color: colors.text,
        borderColor: colors.border,
    },
    errorPanel: {
        border: "1px solid rgba(255, 107, 107, 0.4)",
        background: "rgba(255, 107, 107, 0.05)",
        borderRadius: 0,
        padding: "14px 16px",
        color: colors.danger,
        fontSize: 14,
    },
    errorList: {
        margin: "6px 0 0 18px",
        padding: 0,
    },
    footerNote: {
        marginTop: 16,
        display: "flex",
        gap: 8,
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        color: "rgba(233, 233, 240, 0.6)",
        flexWrap: "wrap",
    },
    footerLogo: {
        height: 14,
        width: "auto",
        display: "inline-block",
        opacity: 0.8,
    },
    footerLink: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        color: "rgba(233, 233, 240, 0.8)",
        textDecoration: "none",
    },
};
export { colors };
/**
 * CSS-строка для инъекции в Shadow DOM.
 * Содержит reset и базовые стили для изоляции.
 */
export const shadowStyles = `
  :host {
    all: initial;
    display: block;
    font-family: "IBM Plex Sans", "Inter", "Segoe UI", system-ui, -apple-system, sans-serif;
    color: ${colors.text};
    color-scheme: dark;
    box-sizing: border-box;
  }
  
  *, *::before, *::after {
    box-sizing: inherit;
  }
  
  /* Reset наследуемых стилей */
  input, select, button, textarea {
    font: inherit;
    color: inherit;
  }
`;
