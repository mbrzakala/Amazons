/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';
import { execSync } from 'child_process';

async function bootstrap() {
  // Automatically execute database schema pushes on production startup
  if (process.env.NODE_ENV === 'production') {
    try {
      Logger.log('Executing automated Prisma schema push to database...');
      execSync('npx prisma db push --schema=prisma/schema.prisma --accept-data-loss', {
        stdio: 'inherit',
      });
      Logger.log('Automated database schema push completed successfully!');
    } catch (error: any) {
      Logger.error('Failed to push database schema on startup:', error.message);
    }
  }

  const app = await NestFactory.create(AppModule);

  // Validate and strip incoming payloads against the DTO classes globally.
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Scope CORS to the real frontend origin(s). Configure via CORS_ORIGIN
  // (comma-separated) in production; defaults to the local Angular dev server.
  const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:4200')
    .split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({
    origin: corsOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: false,
  });

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  // Swagger / OpenAPI docs at /api/docs.
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Amazons Problem-Solving API')
    .setDescription(
      'Solve problems with the TRIZ and Ideation ADK agents, browse history, and rate solutions.',
    )
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`${globalPrefix}/docs`, app, document);

  const port = process.env.PORT || 3000;
  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
  Logger.log(
    `📚 Swagger docs available at: http://localhost:${port}/${globalPrefix}/docs`,
  );
}

bootstrap();
