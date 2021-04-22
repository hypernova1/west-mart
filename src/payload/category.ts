export interface CategoryDto {
    id: number;
    sequence: number;
    name: string;
    managerId: number;
}

export interface CategoryForm {
    name: string;
    managerId: number;
}