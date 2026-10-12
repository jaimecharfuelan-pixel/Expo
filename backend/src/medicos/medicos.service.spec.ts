import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { PiedrazulStore } from '../piedrazul/piedrazul.store';
import { MedicosService } from './medicos.service';

describe('MedicosService', () => {
  let service: MedicosService;
  let store: PiedrazulStore;

  beforeEach(async () => {
    const modulo: TestingModule = await Test.createTestingModule({
      providers: [MedicosService, PiedrazulStore],
    }).compile();
    service = modulo.get(MedicosService);
    store = modulo.get(PiedrazulStore);
  });

  it('lista los médicos de demostración con su especialidad', () => {
    const medicos = service.listar();
    expect(medicos.map((medico) => medico.nombreCompleto)).toEqual([
      'Dra. Ana Pérez',
      'Ft. Carlos Muñoz',
    ]);
    expect(medicos[0].especialidad.nombre).toBe('Medicina General');
  });

  it('crea, actualiza, filtra y elimina un médico', () => {
    const pediatria = store.guardarEspecialidad({
      nombre: 'Pediatría',
      activa: true,
    });
    const creado = service.crear({
      nombreCompleto: 'Dra. Laura Méndez',
      telefono: '3007778899',
      especialidadId: pediatria.id,
      activo: true,
    });

    const actualizado = service.actualizar(creado.id, {
      nombreCompleto: 'Dra. Laura Méndez Ríos',
      activo: false,
    });
    expect(actualizado.nombreCompleto).toBe('Dra. Laura Méndez Ríos');
    expect(actualizado.activo).toBe(false);
    expect(actualizado.especialidad.id).toBe(pediatria.id);

    expect(service.listar(pediatria.id)).toHaveLength(1);
    expect(service.eliminar(creado.id).id).toBe(creado.id);
    expect(service.listar(pediatria.id)).toHaveLength(0);
  });

  it('no crea un médico en una especialidad inexistente', () => {
    expect(() =>
      service.crear({
        nombreCompleto: 'Dr. Sin Especialidad',
        telefono: '3000000000',
        especialidadId: 999,
      }),
    ).toThrow(NotFoundException);
  });
});
