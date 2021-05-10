export interface CommentForm {
    content: string;
    postId: number;
}

export interface CommentDetail {
    id: number;
    content: string;
    writer: string;
    createdAt: string;
}

export interface CommentResponse {
    commentList: Array<CommentDetail>,
    totalCount: number,
}