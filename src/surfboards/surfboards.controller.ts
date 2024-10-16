import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { SurfboardsService } from './surfboards.service';
import { CreateSurfboardDto } from './dto/create-surfboard.dto';
import { UpdateSurfboardDto } from './dto/update-surfboard.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { SurfboardsCategory } from '@prisma/client';
import { SellSurfboardDto } from './dto/sell-surfboard.dto';

@Controller('surfboards')
export class SurfboardsController {
  constructor(private readonly surfboardsService: SurfboardsService) { }

  @Post()
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  create(@Body() createSurfboardDto: CreateSurfboardDto) {
    return this.surfboardsService.create(createSurfboardDto);
  }

  @Get()
  findAll() {
    return this.surfboardsService.findAll();
  }

  @Get('category/:category')
  findByCategory(@Param('category') category: SurfboardsCategory) {
    return this.surfboardsService.findByCategory(category);
  }

  @Get('price')
  findByPrice(@Param('price') price: number) {
    return this.surfboardsService.findByPrice(price);
  }

  @Get('sold')
  findSoldSurfboards() {
    return this.surfboardsService.findSoldSurfboards();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.surfboardsService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  update(@Param('id') id: string, @Body() updateSurfboardDto: UpdateSurfboardDto) {
    return this.surfboardsService.update(+id, updateSurfboardDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('MASTER')
  remove(@Param('id') id: string) {
    return this.surfboardsService.remove(id);
  }

  @Patch(':id/sell')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('ADMIN', 'MASTER')
  sellSurfboard(@Param('id') id: string, @Body() sellSurfboardDto: SellSurfboardDto) {
    return this.surfboardsService.sellSurfboard(id, sellSurfboardDto.price);
  }
}
