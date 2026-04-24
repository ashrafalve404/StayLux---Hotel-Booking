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
import { HotelsService } from './hotels.service';
import { CreateHotelDto } from './dtos/create-hotel.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('hotels')
export class HotelsController {
  constructor(private hotelsService: HotelsService) {}

  @Get()
  async findAll(
    @Query('city') city?: string,
    @Query('ownerId') ownerId?: string,
  ) {
    if (ownerId) {
      return this.hotelsService.findByOwner(+ownerId);
    }
    let hotels = await this.hotelsService.findAll();
    if (city) {
      hotels = hotels.filter((h) => h.city.toLowerCase() === city.toLowerCase());
    }
    return hotels;
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createHotelDto: CreateHotelDto, @Req() req) {
    createHotelDto.ownerId = req.user.id;
    return this.hotelsService.create(createHotelDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.hotelsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateHotelDto>,
    @Req() req,
  ) {
    const hotel = await this.hotelsService.findOne(+id);
    if (hotel.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.hotelsService.update(+id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    const hotel = await this.hotelsService.findOne(+id);
    if (hotel.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.hotelsService.remove(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/rooms')
  async createRoom(
    @Param('id') id: string,
    @Body() roomData: any,
    @Req() req,
  ) {
    const hotel = await this.hotelsService.findOne(+id);
    if (hotel.ownerId !== req.user.id && req.user.role !== 'admin') {
      throw new Error('Unauthorized');
    }
    return this.hotelsService.createRoom(+id, roomData);
  }

  @Get(':id/rooms')
  async getRooms(@Param('id') id: string) {
    return this.hotelsService.getRooms(+id);
  }
}
