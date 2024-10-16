import { PartialType } from '@nestjs/mapped-types';
import { CreateSurfboardDto } from './create-surfboard.dto';

export class UpdateSurfboardDto extends PartialType(CreateSurfboardDto) {}
