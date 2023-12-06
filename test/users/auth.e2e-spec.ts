import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../src/app.module';
import { DataSource } from 'typeorm';
import { setupDatabase } from '../setup';

describe('AuthController (e2e)', () => {

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

  it('should register a new user', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kolev';

    return await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword })
      .expect(201)
      .then(response => {

        const _username = response.body.username;
        expect(_username).toEqual(username);
      });
  });

  it('should throw an error when passwords do not match', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kilef';

    return await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword })
      .expect(400)
      .then(response => {

        const resObj = JSON.parse(response.text);
        const errorMessage = resObj.message;

        expect(errorMessage).toEqual('passwords do not match');
      });
  });

  it('should throw an error when trying to register an existing user', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kolev';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword })
      .expect(201);

    return await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword })
      .expect(400)
      .then(response => {

        const resObj = JSON.parse(response.text);
        const errorMessage = resObj.message;

        expect(errorMessage).toEqual('username is already in use');
      });
  });

  it('should login an existing user', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kolev';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword })
      .expect(201);

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(201)
      .then(response => {

        const _username = response.body.username;
        expect(_username).toEqual(username);
      });
  });

  it('should throw an error when trying to login with an inexisting user', async () => {

    const username = 'asdfghj';
    const password = 'asdfghj';

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password })
      .expect(404)
      .then(response => {

        const resObj = JSON.parse(response.text);
        const errorMessage = resObj.message;
        
        expect(errorMessage).toEqual('user not found');
      });
  });

  it('should throw an error when trying to log in with a wrong password', async () => {

    const username = 'kolev';
    const password = 'kolev';
    const confirmPassword = 'kolev';

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ username, password, confirmPassword })
      .expect(201);

    return await request(app.getHttpServer())
      .post('/auth/login')
      .send({ username, password: 'wrongPassword' })
      .expect(400)
      .then(response => {

        const resObj = JSON.parse(response.text);
        const errorMessage = resObj.message;
        
        expect(errorMessage).toEqual('wrong password');
      });
  });

  it('should return the currently logged in user', async () => {

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
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then(response => {

        const recievedUsername = response.body.username;

        expect(recievedUsername).toEqual(username);
      });
  });

  it('should successfully logout the user', async () => {

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

    await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200)
      .then(response => {

        const recievedUsername = response.body.username;

        expect(recievedUsername).toEqual(username);
      });

    return await request(app.getHttpServer())
      .get('/auth/logout')
      .expect(200)
      .then(response => {

        const recievedUsername = response.body.username;

        expect(recievedUsername).not.toBeDefined();
      });
  });
});