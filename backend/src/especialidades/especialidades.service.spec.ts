import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PiedrazulStore } from '../piedrazul/piedrazul.store';
import { EspecialidadesService } from './especialidades.service';

describe('EspecialidadesService', () => {
  let service: EspecialidadesService;

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [EspecialidadesService, PiedrazulStore],
    }).compile();
    service = modulo.get(EspecialidadesService);
  });

  it('lista las especialidades de demostración de PiedraAzul', () => {
    const nombres = service.listar().map((especialidad) => especialidad.nombre);
    expect(nombres).toEqual([
      'Medicina General',
      'Fisioterapia',
      'Odontología',
    ]);
  });

  it('crea, actualiza y elimina una especialidad sin médicos', () => {
    const creada = service.crear({ nombre: 'Pediatría', activa: true });
    expect(creada.id).toBeGreaterThan(0);

    const actualizada = service.actualizar(creada.id, {
      nombre: 'Pediatría infantil',
      activa: false,
    });
    expect(actualizada).toMatchObject({
      id: creada.id,
      nombre: 'Pediatría infantil',
      activa: false,
    });

    expect(service.eliminar(creada.id).id).toBe(creada.id);
    expect(service.listar().some((item) => item.id === creada.id)).toBe(false);
  });

  it('rechaza un nombre duplicado sin importar mayúsculas', () => {
    expect(() => service.crear({ nombre: 'medicina general' })).toThrow(
      ConflictException,
    );
  });

  it('no elimina una especialidad que todavía tiene médicos', () => {
    const medicina = service
      .listar()
      .find((especialidad) => especialidad.nombre === 'Medicina General');
    expect(medicina).toBeDefined();
    expect(() => service.eliminar(medicina!.id)).toThrow(ConflictException);
  });
});
