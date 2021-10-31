import { DateTime } from 'luxon';
import { Console, ConsoleColor } from '../console';

export default class Logger {
  public static log (message: any, color: ConsoleColor = ConsoleColor.FgWhite): void {
    const dateString = Console.colorizedText(`[${DateTime.local().toFormat('yyyy-MM-dd HH:mm:ss')}] `, ConsoleColor.FgWhite);
    message = Console.colorizedText(message, color);
    Console.write(dateString + message, color);
  }
}
