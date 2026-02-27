// import {
//   ExecutionContext,
//   NestInterceptor,
//   Injectable,
//   CallHandler,
// } from '@nestjs/common';
// import { plainToClass } from 'class-transformer';

// @Injectable()
// export class SerializeInterceptor implements NestInterceptor {
//   constructor(private dto: any) {}

//   intercept(context: ExecutionContext, handler: CallHandler) {
//     return handler.handle().pipe(
//       map((data: any) => {
//         return plainToClass(this.dto, data, { excludeExtraneousValues: true });
//       }),
//     );
//   }
// }
// ``;
