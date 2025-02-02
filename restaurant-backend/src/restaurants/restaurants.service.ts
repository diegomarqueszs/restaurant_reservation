import { Injectable } from '@nestjs/common';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(Restaurant)
    private readonly repository: Repository<Restaurant>,
  ) {}

  create(dto: CreateRestaurantDto) {
    const restaurant = this.repository.create(dto);
    return this.repository.save(restaurant);
  }

  findAll() {
    return this.repository.find();
  }

  findOne(id: string) {
    return this.repository.findOneBy({ id });
  }

  async update(id: string, dto: UpdateRestaurantDto) {
    const restaurant = await this.repository.findOneBy({ id });

    if (!restaurant) return null;
    this.repository.merge(restaurant, dto);
    return this.repository.save(restaurant);
  }

  async remove(id: string) {
    const restaurant = await this.repository.findOneBy({ id });
    if (!restaurant) return null;
    return this.repository.remove(restaurant);
  }

  async removeAll() {
    await this.repository.clear();
  }
}
