export type CreateTaskDTO = {
    name?: string;
    taskName?: string;
    description?: string; 
};
    
export type taskModel = {
    "id": number;
    "name": string;
    "description": string;
    "status": EStatuses;
}

export enum EStatuses {
    'PENDING' = 'pending',
    'COMPLETED' = 'completed',
    'CANCELLED' = 'cancelled'
}

export enum HttpStatus {
        OK = 200,
        CREATED = 201,
        NO_CONTENT = 204,
        METHOD_NOT_ALLOWED = 405,
        BAD_REQUEST = 400,
        NOT_FOUND = 404,
        INTERNAL_SERVER_ERROR = 500
    }