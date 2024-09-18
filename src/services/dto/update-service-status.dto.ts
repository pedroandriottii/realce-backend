import { PartialType } from '@nestjs/mapped-types';
import { CreateServiceDto } from './create-service.dto';

export class UpdateServiceStatusDto extends PartialType(CreateServiceDto) { }
