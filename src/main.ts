import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: [
      'https://frontend-k64t9gv3o-shijilan27s-projects.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe());

  // app.useStaticAssets(join(__dirname, '..', 'uploads'), {
  //   prefix: '/uploads/',
  // });

  const port = process.env.PORT || 3000;
  console.log('About to listen on port', port);
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
}

bootstrap();