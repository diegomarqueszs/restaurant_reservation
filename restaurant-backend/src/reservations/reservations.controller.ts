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
        } else if (!restaurant) {
            throw new UnauthorizedException('Restaurante não encontrado.');
        } else if (!reservationDate) {
            throw new UnauthorizedException('Data inválida!');
        } else if (!numberOfTables || numberOfTables <= 0) {
            throw new UnauthorizedException('Número de mesas inválido.');
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


    // Rota para pegar quantas reservas já foram ocupadas no dia para o restaurate passado
    @Get('reserved-tables')
    async getReservedTables(@Query('restaurantId') restaurantId: string, @Query('date') date: string) {
        if (!restaurantId || !date) {
            throw new BadRequestException('Restaurante e data são obrigatórios');
        }

        return this.reservationService.getReservedTables(restaurantId, date);
    }
}
