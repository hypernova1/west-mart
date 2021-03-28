export interface PostDto {
    id: number;
    title: string,
    content: string,
    writer: string,
    regDate: Date
}

export interface PostListRequest {
    pageNo?: number,
    size?: number,
    keyword?: string,
}

export interface PostRequest {
    title: string,
    content: string,
    userId?: number,
}