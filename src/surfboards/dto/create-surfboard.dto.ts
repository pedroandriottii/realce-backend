import {
    IsArray,
    IsBoolean,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString
} from "@nestjs/class-validator";
import { SurfboardsCategory } from "@prisma/client";

export class CreateSurfboardDto {
    @IsString()
    @IsNotEmpty()
    title: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNumber()
    @IsNotEmpty()
    price: number;

    @IsArray()
    @IsString({ each: true })
    @IsNotEmpty()
    image: string[];

    @IsOptional()
    @IsString()
    model?: string;

    @IsOptional()
    @IsNumber()
    volume?: number;

    @IsOptional()
    @IsString()
    size?: string;

    @IsOptional()
    @IsBoolean()
    is_new: boolean;

    @IsOptional()
    @IsEnum(SurfboardsCategory)
    category?: SurfboardsCategory;

    @IsString()
    @IsNotEmpty()
    coverImage: string;
}
