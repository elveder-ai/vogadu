import * as logger from 'firebase-functions/logger';

export function log(message: any) {
    logger.log(message, { structuredData: true });
}

export function info(message: string) {
    logger.info(message, { structuredData: true });
}

export function error(message: any[]) {
    logger.error(message, { structuredData: true });
}