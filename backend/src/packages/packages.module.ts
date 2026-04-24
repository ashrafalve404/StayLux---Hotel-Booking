import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Package } from './entities/package.entity';
import { PackagesService } from './packages.service';
import { PackagesController } from './packages.controller';
import { HotelsModule } from '../hotels/hotels.module';

@Module({
  imports: [TypeOrmModule.forFeature([Package]), HotelsModule],
  providers: [PackagesService],
  controllers: [PackagesController],
})
export class PackagesModule {}
