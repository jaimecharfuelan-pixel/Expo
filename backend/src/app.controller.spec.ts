import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('info', () => {
    it('describe el CRUD de PiedraAzul', () => {
      expect(appController.obtenerInfo()).toEqual({
        aplicacion: 'PiedraAzul',
        descripcion:
          'CRUD de especialidades y médicos para el agendamiento de citas',
        entidades: ['especialidades', 'medicos'],
      });
    });
  });
});
