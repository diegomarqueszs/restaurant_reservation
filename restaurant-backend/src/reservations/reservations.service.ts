import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservations.entity';
import { User } from '../auth/entities/user.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

    async createReservation(userId: number, restaurant: number, reservationDate: string, numberOfTables: number) {
        const reservation = this.reservationRepository.create({
            user: { id: userId },
            restaurant,
            reservationDate,
            numberOfTables,
        });

        await this.reservationRepository.save(reservation);
        return reservation;
    }
}