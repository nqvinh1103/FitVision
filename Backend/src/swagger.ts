import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'FitVision AI — Backend API',
      version: '1.0.0',
      description:
        'REST API cho nền tảng FitVision AI. Kết nối Trainee và Trainer thông qua AI Form Check, Program Builder và Marketplace.',
    },
    servers: [
      { url: 'http://localhost:3000', description: 'Development' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Access token từ POST /auth/login',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Mô tả lỗi' },
          },
          required: ['error'],
        },
        UserResponse: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', nullable: true, example: 'Nguyen Van A' },
            role: { type: 'string', enum: ['TRAINEE', 'TRAINER', 'ADMIN'] },
            aiCredits: { type: 'integer', example: 2 },
            avatarUrl: { type: 'string', nullable: true, example: null },
            experienceLevel: {
              type: 'string',
              nullable: true,
              enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED'],
            },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        JobStatusResponse: {
          type: 'object',
          properties: {
            status: {
              type: 'string',
              enum: ['waiting', 'active', 'completed', 'failed', 'delayed'],
              example: 'completed',
            },
            reason: {
              type: 'string',
              nullable: true,
              description: 'Lý do thất bại, chỉ có khi status=failed',
              example: null,
            },
          },
          required: ['status'],
        },
      },
    },
  },
  apis: [path.join(__dirname, './routes/*.ts'), path.join(__dirname, './routes/*.js')],
};

export const swaggerSpec = swaggerJsdoc(options);
