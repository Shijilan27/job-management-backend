import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { config } from 'dotenv';

config();

const {
  POSTGRES_HOST,
  POSTGRES_PORT = '5432',
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_DB,
  NODE_ENV = 'development'
} = process.env;

// Validate required environment variables
if (!POSTGRES_HOST || !POSTGRES_USER || !POSTGRES_PASSWORD || !POSTGRES_DB) {
  throw new Error('Missing required database configuration. Please check your .env file.');
}

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: POSTGRES_HOST,
  port: parseInt(POSTGRES_PORT, 10),
  username: POSTGRES_USER,
  password: POSTGRES_PASSWORD,
  database: POSTGRES_DB,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  synchronize: NODE_ENV === 'development', // Set to false in production
  logging: true, // Enable logging
  ssl: {
    rejectUnauthorized: false
  }
}; 