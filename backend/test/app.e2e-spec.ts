import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configurarAplicacion } from './../src/configurar-aplicacion';

describe('CRUD PiedraAzul (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    configurarAplicacion(app);
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api describe la aplicación', () => {
    return request(app.getHttpServer())
      .get('/api')
      .expect(200)
      .expect((respuesta) => {
        expect(respuesta.body.aplicacion).toBe('PiedraAzul');
      });
  });

  it('recorre crear, listar, actualizar y eliminar en ambas entidades', async () => {
    const servidor = app.getHttpServer();

    const listado = await request(servidor).get('/api/especialidades').expect(200);
    expect(listado.body).toHaveLength(3);

    const pediatria = await request(servidor)
      .post('/api/especialidades')
      .send({ nombre: 'Pediatría' })
      .expect(201);
    expect(pediatria.body.nombre).toBe('Pediatría');
    expect(pediatria.body.activa).toBe(true);

    await request(servidor)
      .post('/api/especialidades')
      .send({ nombre: 'pediatría' })
      .expect(409);

    const laura = await request(servidor)
      .post('/api/medicos')
      .send({
        nombreCompleto: 'Dra. Laura Méndez',
        telefono: '3007778899',
        especialidadId: pediatria.body.id,
      })
      .expect(201);
    expect(laura.body.especialidad.nombre).toBe('Pediatría');

    const editada = await request(servidor)
      .patch(`/api/medicos/${laura.body.id}`)
      .send({ nombreCompleto: 'Dra. Laura Méndez Ríos', activo: false })
      .expect(200);
    expect(editada.body.nombreCompleto).toBe('Dra. Laura Méndez Ríos');
    expect(editada.body.activo).toBe(false);

    const filtrados = await request(servidor)
      .get('/api/medicos')
      .query({ especialidadId: pediatria.body.id })
      .expect(200);
    expect(filtrados.body).toHaveLength(1);

    await request(servidor)
      .delete(`/api/especialidades/${pediatria.body.id}`)
      .expect(409);

    await request(servidor).delete(`/api/medicos/${laura.body.id}`).expect(200);
    await request(servidor)
      .delete(`/api/especialidades/${pediatria.body.id}`)
      .expect(200);

    const medicina = listado.body.find(
      (especialidad: { id: number; nombre: string }) =>
        especialidad.nombre === 'Medicina General',
    );
    if (!medicina) {
      throw new Error('Falta Medicina General en el listado inicial');
    }
    const renombrada = await request(servidor)
      .patch(`/api/especialidades/${medicina.id}`)
      .send({ nombre: 'Medicina familiar' })
      .expect(200);
    expect(renombrada.body.nombre).toBe('Medicina familiar');

    const ana = await request(servidor).get('/api/medicos/1').expect(200);
    expect(ana.body.especialidad.nombre).toBe('Medicina familiar');
  });

  it('valida el cuerpo de un médico', () => {
    return request(app.getHttpServer())
      .post('/api/medicos')
      .send({ nombreCompleto: 'Ana', telefono: 'abc', especialidadId: 1 })
      .expect(400);
  });
});
