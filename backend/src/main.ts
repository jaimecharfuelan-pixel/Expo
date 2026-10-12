import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { configurarAplicacion } from './configurar-aplicacion';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configurarAplicacion(app);
  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
