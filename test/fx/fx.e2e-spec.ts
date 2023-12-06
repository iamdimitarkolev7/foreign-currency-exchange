import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { setupDatabase } from '../../test/setup';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

describe('FxController (e2e)', () => {

  let app: INestApplication;
  let dataSource: DataSource;

  beforeEach(async () => {

      dataSource = await setupDatabase();

      const module: TestingModule = await Test.createTestingModule({
        imports: [
          AppModule
        ]
      })
      .overrideProvider(DataSource)
      .useValue(dataSource)
      .compile();
  
      app = module.createNestApplication();
      await app.init();
  });

  it('should return fx data', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kolev';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password });

    const cookie = loginResponse.get('Set-Cookie');

    return await request(app.getHttpServer())
      .get('/fx')
      .set('Cookie', cookie)
      .expect(200)
      .then(response => {

        const { eur_to_usd, usd_to_eur } = response.body;

        expect(usd_to_eur).toBeDefined();
        expect(eur_to_usd).toBeDefined();
      });
  });

});