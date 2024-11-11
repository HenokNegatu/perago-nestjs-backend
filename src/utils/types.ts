export interface PositionWithChildren {
    id: string;
    name: string;
    description: string;
    parent_id?: string;
    children?: PositionWithChildren[];
}
