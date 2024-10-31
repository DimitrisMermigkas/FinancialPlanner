// main.ts
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Financial Planner API')
    .setDescription('API for managing balance, funds, and transactions')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Enable CORS for requests from the React frontend
  app.enableCors({
    origin: 'http://localhost:4200', // Specify the frontend URL
  });
  // app.setGlobalPrefix('api'); // This will prefix all routes with "/api"
  await app.listen(4000);
  console.log(`Application is running on: http://localhost:4000`);
}

bootstrap();
