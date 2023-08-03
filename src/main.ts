import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    // Kích hoạt CORS
    app.enableCors();

    // Thêm tiền tố api
    app.setGlobalPrefix('/api');

    // Định vị URL để load tài nguyên
    app.use(express.static('.'));

    // swagger
    const config = new DocumentBuilder()
        .setTitle('Irelax Booking Room')
        .addBearerAuth(
            {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                name: 'JWT',
                description: 'Nhập JWT token',
                in: 'header',
            },
            'JWT-auth',
        )
        .build();
    const document = SwaggerModule.createDocument(app, config);
    // Khởi tạo end point truy cập vào swagger
    SwaggerModule.setup('swagger', app, document); //  localhost:8080/swagger

    await app.listen(8080);
}
bootstrap();
