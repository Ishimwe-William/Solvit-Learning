export interface ErrorDetail {
    code?: number;
    message?: string;
}

export interface Data {
    error?: ErrorDetail;
}

export interface ErrorType {
    status?: number | string;
    data?: Data | null | undefined;
    error?: string;
}

export interface ExceptionPageProps {
    error?: ErrorType | unknown;
}

