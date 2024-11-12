export interface PositionWithChildren {
    id: string;
    name: string;
    description: string;
    createdAt: Date,
    modifiedAt: Date,
    parent_id?: string;
    children?: PositionWithChildren[];
}
