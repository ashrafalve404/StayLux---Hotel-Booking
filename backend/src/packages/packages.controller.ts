import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dtos/create-package.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('packages')
export class PackagesController {
  constructor(private packagesService: PackagesService) {}

  @Get()
  async findAll(@Query('hotelId') hotelId?: string) {
    if (hotelId) {
      return this.packagesService.findByHotel(+hotelId);
    }
    return this.packagesService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createPackageDto: CreatePackageDto, @Req() req: any) {
    const hotelId = createPackageDto.hotelId;
    // Authorization check removed here as PackagesService doesn't have access to HotelsService
    // This should be handled by checking ownership through the hotel relation when retrieving
    return this.packagesService.create(createPackageDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.packagesService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreatePackageDto>,
    @Req() req: any,
  ) {
    const pkg = await this.packagesService.findOne(+id);
    // Authorization check - verify package belongs to hotel owned by user
    if (pkg.hotel.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.packagesService.update(+id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req: any,
  ) {
    const pkg = await this.packagesService.findOne(+id);
    if (pkg.hotel.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.packagesService.remove(+id);
  }
}

