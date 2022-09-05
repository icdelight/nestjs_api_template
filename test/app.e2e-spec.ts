import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { prisma } from '@prisma/client';
import * as pactum from 'pactum';
import { AuthDto } from '../src/auth/dto';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true,
    }));
    await app.init();
    await app.listen('3333');
    prisma = app.get(PrismaService);
    // await prisma.cleanDB();
    pactum.request.setBaseUrl('http://localhost:3333');
  });

  afterAll(() => {
    app.close();
  })

  it.todo('should pass');
  const dto: AuthDto = {user: 'imamChan2', pass: '1234'};
  describe('Auth', () => {
    describe('Signup', () => {
      it('should error on empty user', () => {
        return pactum.spec().post('/auth/signup').withBody({pass: dto.pass}).expectStatus(400);
      });
      it('should error on empty pass', () => {
        return pactum.spec().post('/auth/signup').withBody({user: dto.user}).expectStatus(400);
      });
      it('should error on empty user n pass', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum.spec().post('/auth/signup').withBody(dto).expectStatus(200);
      });
    });
    describe('Signin', () => {
      it('should error on empty user', () => {
        return pactum.spec().post('/auth/signin').withBody({pass: dto.pass}).expectStatus(400);
      });
      it('should error on empty pass', () => {
        return pactum.spec().post('/auth/signin').withBody({user: dto.user}).expectStatus(400);
      });
      it('should error on empty user n pass', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum.spec().post('/auth/signin').withBody(dto).expectStatus(200).stores('userToken','access_token');
      });
    });
  });

  describe('User', () => {
    describe('Who me', () => {
      it('should get current user', () => {
        return pactum.spec().get('/users/whome').withHeaders({Authorization: 'Bearer $S{userToken}'}).expectStatus(200).inspect();
      });
    }); 
    describe('Edit user', () => {});
    describe('Del user', () => {});
  });

  describe('Role', () => {
    describe('Add role', () => {});
    describe('Edit role', () => {});
    describe('Del role', () => {});
  });
});
