import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // Ye user ko return hoga (safe)
    response.status(status).json({
      success: false,
      statusCode: status,
      message:
        status === 500
          ? 'Something went wrong, please try again later.'
          : exception.message || 'Error',
    });

    // Ye console mai show hoga developer ke liye
    console.error('INTERNAL ERROR:', exception);
  }
}
