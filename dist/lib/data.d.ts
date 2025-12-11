export type MetalShape = {
    id: number;
    name: string;
};
export type Metal = {
    id: number;
    name: string;
    density: number;
};
export type MetalAlloy = {
    id: number;
    name: string;
    density: number;
    metalId: number;
};
export declare const metalShapes: MetalShape[];
export declare const metals: Metal[];
export declare const metalAlloys: MetalAlloy[];
