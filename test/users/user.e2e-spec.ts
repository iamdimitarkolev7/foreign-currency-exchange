import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import * as request from 'supertest';

describe('UsersController (e2e)', () => {

  let app: INestApplication;

  beforeEach(async () => {

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        AppModule
      ]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true
      })
    );

    await app.init();
    await app.listen(3000);
    
  });

  it('should return user\'s data', async () => {

    const authUsername = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kolev';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username: authUsername, password, confirmPassword });

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username: authUsername, password });

    const cookie = loginResponse.get('Set-Cookie');

    const whoamiResponse = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    const {id, username} = whoamiResponse.body;

    console.log(id, username);

    return await request(app.getHttpServer())
      .get('/users/' + id)
      .expect(200)
      .then(response => {

        const responseUsername = response.body.username;

        expect(responseUsername).toEqual(username);
      });
  });
});