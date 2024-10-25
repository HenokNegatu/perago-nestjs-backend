export interface PositionWithChildren {
    id: number;
    name: string;
    description: string;
    parent_id?: number;
    children?: PositionWithChildren[];
}

export type Position = {
    name: string;
    description: string;
    parent_id: number;
}