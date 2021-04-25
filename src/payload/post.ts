export interface PostSummary {
    id: number;
    title: string;
    writer: string;
    regDate: Date;
}

export interface PostListRequest {
    pageNo?: number;
    size?: number;
    keyword?: string;
}

export interface PostForm {
    title: string;
    content: string;
    tags: Array<string>;
    categoryId: number;
}

export interface PostDetail {
    id: number;
    title: string;
    content: string;
    writerId: number;
    tags: Array<string>;
    writerName: string;
}

export interface PostListDto {
    postList: Array<PostSummary>,
    isExistNextPage: boolean,
}
