import { Injectable, NestInterceptor, ExecutionContext, CallHandler} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'apps/cloudinary/src/cloudinary.service';
import { Observable } from 'rxjs';

@Injectable()
export class InventoryUploadInterceptor implements NestInterceptor {
  private readonly realInterceptor;

  constructor(private readonly cloudinaryService: CloudinaryService) {
    const { storage, fileFilter } = this.cloudinaryService.createInventoryStorage();

    
    this.realInterceptor = new (FilesInterceptor('images',10, {
      storage,
      fileFilter,
    }))();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.realInterceptor.intercept(context, next);
  }
}


