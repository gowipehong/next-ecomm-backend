import { PrismaClient } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

describe('POST /users and POST /sign-in', () => {
  let prisma;
  let user;

  //only called once, before all the test cases in a test suite
  beforeAll(async () => {
    //create new instance 
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  //called before each test case in a test suite. 
  beforeEach(async () => {
    // Create a new user using the users endpoint
    user = {
      name: 'John',
      email: 'john9@example.com',
      password: 'insecure',
    };
    await request(app).post('/users').send(user);
  });

  afterEach(async () => {
    // Delete the user from the database after test
    await prisma.user.delete({
      where: { email: user.email },
    });
  });

  it('should return access token on successful signin', async () => {
    // Test the sign-in endpoint to ensure that access token is returned
    const response = await request(app)
      .post('/sign-in')
      .send({ email: user.email, password: user.password })
      .set('Accept', 'application/json')

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  it('wrong email should fail to sign in and doesnt return acessToken', async () => {
    // Test the sign-in endpoint with a wrong email
    const response = await request(app)
      .post('/sign-in')
      .send({ email: 'geyz@example.com', password: user.password})
      .set('Accept', 'application/json')

    expect(response.status).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe('Email address or password not valid');
    expect(response.status).toBe(401);
    expect(response.body.accessToken).toBeUndefined()
  });

  it('wrong password should fail to sign in ', async () => {
    // Test the sign-in endpoint with a wrong password
    const response = await request(app)
      .post('/sign-in')
      .send({ email: user.email, password: 'jrkehnf93485' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe('Email address or password not valid');
  });
});
