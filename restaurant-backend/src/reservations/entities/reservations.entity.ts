import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';
import { User } from '../../auth/entities/user.entity';
import { Restaurant } from '../../restaurants/entities/restaurant.entity';

@Entity()
export class Reservation {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.reservations, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @Column()
    restaurant: string;

    @Column()
    reservationDate: Date;

    @Column()
    numberOfTables: number;

    @CreateDateColumn()
    createdAt: Date;
}