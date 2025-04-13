import { Catch, WsExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@Catch(WsException)
export class WebsocketExceptionFilter implements WsExceptionFilter {
  private readonly logger = new Logger(WebsocketExceptionFilter.name);

  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const error = exception.getError();
    
    this.logger.error(`WebSocket error: ${error}`, exception.stack);

    client.emit('error', {
      status: 'error',
      message: error,
      timestamp: new Date().toISOString(),
    });
  }
} 