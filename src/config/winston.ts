import { createLogger, transports, format } from 'winston';

interface TransformableInfo {
    level: string;
    message: string;
    [key: string]: any;
}

const logger = createLogger({
    transports: [
        new transports.Console({
            level: 'debug',
            format: format.combine(
                format.label({ label: '' }),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),

                format.colorize({ all: true }),
                format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`),
            ),
        }),
        new transports.File({
            filename: 'logs/log.log',
            level: 'debug',
            format: format.combine(
                format.label({ label: '' }),
                format.timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                format.printf((info: TransformableInfo) => `${info.timestamp} - ${info.level}: ${info.label} ${info.message}`),
            ),
        }),
    ]
});

export default logger;