import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { ReservationService } from './reservations.service';

@Controller('reservations')
export class ReservationController {
    constructor(private readonly reservationService: ReservationService) {}

    @Post()
    async createReservation(@Body() body) {
        const { userId, restaurant, reservationDate, numberOfTables } = body;

        if (!userId) {
            throw new UnauthorizedException('Usuário não autenticado.');
        }

        return this.reservationService.createReservation(userId, restaurant, reservationDate, numberOfTables);
    }
}
