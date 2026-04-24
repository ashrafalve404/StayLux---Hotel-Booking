import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Package } from './entities/package.entity';
import { CreatePackageDto } from './dtos/create-package.dto';

@Injectable()
export class PackagesService {
  constructor(
    @InjectRepository(Package)
    private packagesRepository: Repository<Package>,
  ) {}

  async create(createPackageDto: CreatePackageDto): Promise<Package> {
    const pkg = this.packagesRepository.create(createPackageDto);
    return this.packagesRepository.save(pkg);
  }

  async findAll(): Promise<Package[]> {
    return this.packagesRepository.find({
      relations: ['hotel'],
    });
  }

  async findByHotel(hotelId: number): Promise<Package[]> {
    return this.packagesRepository.find({
      where: { hotelId },
      relations: ['hotel'],
    });
  }

  async findOne(id: number): Promise<Package> {
    const pkg = await this.packagesRepository.findOne({
      where: { id },
      relations: ['hotel'],
    });
    if (!pkg) {
      throw new NotFoundException(`Package with id ${id} not found`);
    }
    return pkg;
  }

  async update(id: number, updateData: Partial<CreatePackageDto>): Promise<Package> {
    await this.packagesRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.packagesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Package with id ${id} not found`);
    }
  }
}
