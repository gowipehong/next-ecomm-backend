import { PrismaClient } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

describe('POST /users and POST /auth', () => {
  let prisma;
  const user = {
    name: 'John',
    email: 'john9@example.com',
    password: 'insecure',
  };

  //only called once, before all the test cases in a test suite
  beforeAll(async () => {
    //create new instance 
    prisma = new PrismaClient();
    await prisma.$connect();
  });

  //used to clean up any global resources or to tear down a database connection or a server instance that was set up in the beforeAll function
  afterAll(async () => {
    await prisma.$disconnect();
  });

  //called before each test case in a test suite. 
  beforeEach(async () => {
    // Create a new user using the users endpoint
    await request(app).post('/users').send(user);
  });

  //used to clean up any resources that were created in the beforeEach function
  afterEach(async () => {
    // Delete the user from the database after test
    await prisma.user.delete({
      where: { email: user.email },
    });
  });

  it('should return access token on successful signin', async () => {
    // Test the auth(sign-in) endpoint to ensure that access token is returned
    const response = await request(app)
      .post('/auth')
      .send({ email: user.email, password: user.password })
      .set('Accept', 'application/json')

    expect(response.status).toBe(200);
    expect(response.body.accessToken).toBeDefined();
  });

  it('wrong email should fail to sign in and doesnt return acessToken', async () => {
    // Test the auth(sign-in) endpoint with a wrong email
    const response = await request(app)
      .post('/auth')
      .send({ email: 'geyz@example.com', password: user.password })
      .set('Accept', 'application/json')

    expect(response.status).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe('Email address or password not valid');
    expect(response.status).toBe(401);
    expect(response.body.accessToken).toBeUndefined()
  });

  it('wrong password should fail to sign in ', async () => {
    // Test the auth(sign-in) endpoint with a wrong password
    const response = await request(app)
      .post('/auth')
      .send({ email: user.email, password: 'jrkehnf93485' })
      .set('Accept', 'application/json')

    expect(response.status).toBe(401);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error).toBe('Email address or password not valid');
  });
});
