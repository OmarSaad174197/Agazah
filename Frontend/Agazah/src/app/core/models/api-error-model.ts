export interface ApiError {
    statusCode: number;

    message: string;

    errors?: string[];

    timestamp: string;
}
