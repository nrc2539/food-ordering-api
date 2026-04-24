import { config } from 'dotenv';
import { DataSource } from 'typeorm';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'db', // host name in docker-compose db service
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: ['dist/**/*.entity{.ts,.js}'], // ต้องชี้ไปยัง Entity ที่ compile แล้ว
  migrations: ['dist/migrations/*.js'], // ตำแหน่งที่เก็บไฟล์ migration
  synchronize: false,
});
