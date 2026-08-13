export interface ErrorDetail {
    code?: number;
    message?: string;
}

export interface Data {
    error?: ErrorDetail;
}

export interface ErrorType {
    status?: number | string;
    data?: Data;
    error?: string;
}

export interface ExceptionPageProps {
    error?: ErrorType | unknown;
}
