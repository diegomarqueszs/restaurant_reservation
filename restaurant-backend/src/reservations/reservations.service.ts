import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reservation } from './entities/reservations.entity';

@Injectable()
export class ReservationService {
  constructor(
    @InjectRepository(Reservation)
    private reservationRepository: Repository<Reservation>,
  ) {}

  // Método para criar uma reserva
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

  // Método para obter as reservas do usuário
  async getUserReservations(userId: number): Promise<Reservation[]> {
    return this.reservationRepository.find({ where: { user: { id: userId } } });
  }
}