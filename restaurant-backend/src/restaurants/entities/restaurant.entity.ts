/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable prettier/prettier */
import { BeforeInsert, Column, Entity, PrimaryColumn } from 'typeorm';

const { nanoid } = require("nanoid");

@Entity('restaurants')
export class Restaurant {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  location: string;

  @Column()
  date: string;

  @Column()
  tables: string;

  @Column()
  value: string;

  @Column('simple-array')
  images: string[];

  @Column()
  description: string;

  @BeforeInsert()
  generateId(){
    this.id = `res_${nanoid()}`
  }
}
