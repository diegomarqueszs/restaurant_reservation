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
  async createReservation(userId: number, restaurant: string, reservationDate: string, numberOfTables: number) {
    const receivedDate = new Date(reservationDate);
    const formattedDate = receivedDate.toISOString().split("T")[0]; // "YYYY-MM-DD"

    const reservation = this.reservationRepository.create({
      user: { id: userId },
      restaurant,
      reservationDate: formattedDate,  // Agora é só a data, sem horário
      numberOfTables,
    });

    await this.reservationRepository.save(reservation);
    return reservation;
  }

  // Método para obter as reservas do usuário
  async getUserReservations(userId: number) {
    const reservations = await this.reservationRepository
      .createQueryBuilder("reservation")
      .where("reservation.userId = :userId", { userId })
      .select([
        "reservation.restaurant AS restaurant",
        "DATE(reservation.reservationDate) AS reservationDate",
        "SUM(reservation.numberOfTables) AS numberOfTables" // Soma o número de mesas
      ])
      .groupBy("reservation.restaurant, DATE(reservation.reservationDate)")
      .orderBy("reservationDate", "ASC")
      .addOrderBy("reservation.restaurant", "ASC")
      .getRawMany();

    return reservations;
  }


  async getReservedTables(restaurantId: string, date: string): Promise<{ reserved: number }> {
    const reservationDate = new Date(date);
    reservationDate.setHours(0, 0, 0, 0); // Normaliza a data

    const reservations = await this.reservationRepository.find({
      where: {
        restaurant: restaurantId,
        reservationDate: reservationDate,
      },
    });

    // Soma as mesas já reservadas
    const reservedTables = reservations.reduce((sum, res) => sum + res.numberOfTables, 0);

    return { reserved: reservedTables };
  }
}