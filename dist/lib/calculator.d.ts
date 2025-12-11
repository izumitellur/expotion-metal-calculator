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
export declare const calculateWeight: (input: CalculatorInput) => CalculatorResult;
export declare const defaultInput: CalculatorInput;
