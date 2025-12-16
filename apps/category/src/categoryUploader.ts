import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'apps/cloudinary/src/cloudinary.service';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryUploadInterceptor implements NestInterceptor {
  private readonly realInterceptor;

  constructor(private readonly cloudinaryService: CloudinaryService) {
    const { storage, fileFilter } =
      this.cloudinaryService.createCategoryStorage();

    this.realInterceptor = new (FileInterceptor('image', {
      storage,
      fileFilter,
    }))();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.realInterceptor.intercept(context, next);
  }
}
