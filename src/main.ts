import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { setupAdminPanel } from './admin-panel/admin-panel.plugin';


async function bootstrap() {
  const appOptions = {cors: true};
  const app = await NestFactory.create(ApplicationModule, appOptions);
  app.setGlobalPrefix('api');

  const options = new DocumentBuilder()
    .setTitle('Be project swagger')
    .setDescription('The Realworld API description')
    .setVersion('1.0')
    .setBasePath('api')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('/docs', app, document);

  /** Setup Admin panel */
  await setupAdminPanel(app);

  console.log(process.env.PORT);
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
