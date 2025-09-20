import { applyDecorators, UseGuards } from '@nestjs/common';
import { WebSocketAuthGuard } from '../guard/websocket-auth.guard';

export function WebSocketAuth(): MethodDecorator {
  return applyDecorators(
    UseGuards(WebSocketAuthGuard),
  );
}
