import { NextFunction, Request, Response } from 'express';
import { DateTime } from 'luxon';
import { Console, ConsoleColor } from '../console';

export default class RequestLoggerMiddleware {
	public static async logRequest (req: Request, res: Response, next: NextFunction): Promise<void> {
		const start = Date.now();

		req.on('end', () => {
			const dateString = DateTime.local().toFormat('yyyy.MM-dd HH:mm:ss');
			let method = req.method;

			switch (method) {
			case 'GET': method = Console.colorizedText(method, ConsoleColor.FgGreen); break;
			case 'POST': method = Console.colorizedText(method, ConsoleColor.FgYellow); break;
			case 'PUT': method = Console.colorizedText(method, ConsoleColor.FgBlue); break;
			case 'DELETE': method = Console.colorizedText(method, ConsoleColor.FgRed); break;
			}

			let status: string = '' + req.res?.statusCode;
			if (res.statusCode >= 200 && res.statusCode < 300) {
				status = Console.colorizedText(status, ConsoleColor.FgGreen);
			} else if (res.statusCode >= 400 && res.statusCode < 500) {
				status = Console.colorizedText(status, ConsoleColor.FgYellow);
			} else if (res.statusCode >= 500) {
				status = Console.colorizedText(status, ConsoleColor.FgRed);
			}

			const loadTime = Date.now() - start;

			let log = `${Console.colorizedText(`[${dateString}]`, ConsoleColor.FgMagenta)}\t${Console.colorizedText(method, ConsoleColor.Bright)}\t${req.path}\t${status}\t${Console.colorizedText(loadTime + 'ms', ConsoleColor.Dim)}`;

			if (['POST', 'PUT'].includes(req.method)) {
				log += `\t\t${Console.colorizedText(JSON.stringify(req.body), ConsoleColor.FgCyan)}`;
			}

			Console.write(log);
		});

		return next();
	}
}
