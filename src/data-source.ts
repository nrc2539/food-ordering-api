import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: ['dist/modules/**/*.entity{.ts,.js}'], // ต้องชี้ไปยัง Entity ที่ compile แล้ว
  migrations: ['dist/migrations/*.js'], // ตำแหน่งที่เก็บไฟล์ migration
  synchronize: false,
});
