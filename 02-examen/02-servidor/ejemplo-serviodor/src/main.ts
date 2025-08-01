import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as sessionFileStore from 'session-file-store';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express'; // NUEVO

async function bootstrap() {
  // Cambiar esta línea para usar NestExpressApplication
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Configuración de sesiones (ya existente)
  const FileStore = sessionFileStore(session);
  app.use(
    session({
      secret: 'secreto-seguro',
      resave: false,
      saveUninitialized: false,
      store: new FileStore({
        path: './sessions',
        ttl: 3600,
      }),
      cookie: {
        maxAge: 3600000,
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
      },
    }),
  );

  // Configuración del motor de renderizado (CORREGIDO)
  app.setViewEngine('ejs'); // Cambiar de app.set a app.setViewEngine
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.useStaticAssets(join(__dirname, '..', 'public'));

  await app.listen(3000);
}
bootstrap();
