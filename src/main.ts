import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.setGlobalPrefix('api');

  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);

  console.log(`Server listening at http://localhost:${port}`);
}
bootstrap().catch((error) => {
  console.error('Application failed to start:', error);
  process.exit(1);
});
