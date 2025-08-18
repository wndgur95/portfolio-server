import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { ResponseEntity } from '@libs/common/network/response-entity';
import { ContextProvider } from '@libs/common/provider/context.provider';
import { isNumber } from '@nestjs/common/utils/shared.utils';
import { INTERNAL_ERROR_CODE } from '@libs/common/constants/internal-error-code.constants';

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const isServerErrorException =
      exception.response && isNumber(exception.response);

    const httpStatusCode = isServerErrorException
      ? HttpStatus.OK
      : (exception?.response?.statusCode ?? HttpStatus.INTERNAL_SERVER_ERROR);

    const errorCode = isServerErrorException
      ? exception.response
      : INTERNAL_ERROR_CODE.UNKNOWN_FATAL_ERROR;

    const message = exception?.message;

    const body = isServerErrorException
      ? ResponseEntity.error(errorCode, message)
      : {
          code: errorCode,
          timestamp: ContextProvider.getNow()?.toISOString() ?? new Date(),
          path: httpAdapter.getRequestUrl(ctx.getRequest()),
          error: exception.name,
          message: message,
        };

    httpAdapter.reply(ctx.getResponse(), body, httpStatusCode);

    const requestContext = ctx.getRequest();
    // logging
    const request = {
      url: requestContext.url,
      method: requestContext.method,
      headers: requestContext.headers,
      body: requestContext.body,
    };

    const errorMessage = {
      request: request,
      session: undefined,
      exception: isServerErrorException
        ? exception
        : // unknown error
          {
            ...body,
            ...(exception?.stack ? { stack: exception.stack } : {}),
          },
    };

    Logger.error(errorMessage);

    // send to sentry
    // Sentry.captureException(exception);
  }
}
