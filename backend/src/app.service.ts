import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  obtenerInfo() {
    return {
      aplicacion: 'PiedraAzul',
      descripcion: 'CRUD de especialidades y médicos para el agendamiento de citas',
      entidades: ['especialidades', 'medicos'],
    };
  }
}
