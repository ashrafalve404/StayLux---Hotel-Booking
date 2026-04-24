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
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dtos/create-booking.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('bookings')
export class BookingsController {
  constructor(private bookingsService: BookingsService) {}

  @Get()
  async findAll(
    @Query('userId') userId?: string,
    @Query('hotelId') hotelId?: string,
  ) {
    if (userId) {
      return this.bookingsService.findByUser(+userId);
    }
    if (hotelId) {
      return this.bookingsService.findByHotel(+hotelId);
    }
    return this.bookingsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Body() createBookingDto: CreateBookingDto, @Req() req) {
    createBookingDto.userId = req.user.id;
    return this.bookingsService.create(createBookingDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.bookingsService.findOne(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateData: Partial<CreateBookingDto>,
    @Req() req,
  ) {
    const booking = await this.bookingsService.findOne(+id);
    const isHotelOwner = booking.hotel?.ownerId === req.user.id;
    if (
      booking.userId !== req.user.id &&
      req.user.role !== 'admin' &&
      !isHotelOwner
    ) {
      throw new Error('Unauthorized');
    }
    return this.bookingsService.update(+id, updateData);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @Req() req,
  ) {
    const booking = await this.bookingsService.findOne(+id);
    if (
      booking.userId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      throw new Error('Unauthorized');
    }
    return this.bookingsService.remove(+id);
  }
}
