import {
  Controller,
  FileTypeValidator,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileUploadService } from './file-upload.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('file-upload')
export class FileUploadController {
  constructor(private readonly fileUploadService: FileUploadService) {}

  @Put(':productId')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 200000,
            message: 'Files must be max 200kb',
          }),
          new FileTypeValidator({
            fileType: /(jpg|jpeg|png|webp)/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Param('productId', ParseUUIDPipe) productId: string,
  ) {
    return this.fileUploadService.uploadImage(file, productId);
  }
}
