import { Controller, Post, Get, Body, Query, UnauthorizedException, BadRequestException} from '@nestjs/common';
import { ReservationService } from './reservations.service';

@Controller('reservations')
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

    // Rota para criar uma reserva
    @Post()
    async createReservation(@Body() body) {
        const { userId, restaurant, reservationDate, numberOfTables } = body;

        if (!userId) {
        throw new UnauthorizedException('Usuário não autenticado.');
        }

        return this.reservationService.createReservation(userId, restaurant, reservationDate, numberOfTables);
    }

    // Rota para obter as reservas do usuário logado
    @Get()
    async getReservations(@Query() query) {
        const { userId } = query;

        if (!userId) {
            throw new UnauthorizedException('Usuário não autenticado.');
        }

        return this.reservationService.getUserReservations(userId);
    }


    @Get('reserved-tables')
    async getReservedTables(@Query('restaurantId') restaurantId: string, @Query('date') date: string) {
        if (!restaurantId || !date) {
            throw new BadRequestException('Restaurante e data são obrigatórios');
        }

        return this.reservationService.getReservedTables(restaurantId, date);
    }
}
