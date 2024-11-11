import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PositionsModule } from './../src/app.module';
import { PositionEntity } from '../src/entities/positions.entity';
import { UsersEntity } from '../src/entities/users.entity';
import { TypeOrmModule } from '@nestjs/typeorm';


describe('PositionController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'root',
        database: 'orga_structure',
        entities: [PositionEntity, UsersEntity],
        synchronize: true,
      }),PositionsModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {

    await app.close();

  });


  it('/positions (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/positions')
      .expect(200)
  });

  it('/positions/:id (GET) => should return bad request', async () => {
    

    const response = await request(app.getHttpServer())
      .get(`/api/positions/10`)
      .expect(404)
    
  });

  it('/positions/:id (GET) => should return CEO', async () => {
    const response = await request(app.getHttpServer())
    .get('/api/positions/1')
    .expect(200)
    expect(response.body).toEqual(
        {
            "id": 1,
            "name": "CEO",
            "description": "Chief Executive Officer",
            "parent_id": null
          }
    )
  })
});
