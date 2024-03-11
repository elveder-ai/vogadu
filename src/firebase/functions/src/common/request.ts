const UNSUPPORTED_METHOD_ERROR = 'Unsupported method error';

export function parseGetParameters(request: any) {
    if(request.method != 'GET') {
        throw new Error(UNSUPPORTED_METHOD_ERROR);
    }

    return request.query;
}

export function parsePostData(request: any) {
    if(request.method != 'POST') {
        throw new Error(UNSUPPORTED_METHOD_ERROR);
    }
    
    return request.body;
}