import { PrismaClient, Prisma } from '@prisma/client'
import request from "supertest"
import app from "../../app.js"

async function cleanupDatabase() {
  const prisma = new PrismaClient();
  const modelNames = Prisma.dmmf.datamodel.models.map((model) => model.name);

  return Promise.all(
    modelNames.map((modelName) => prisma[modelName.toLowerCase()].deleteMany())
  );
}

describe("POST /users", () => {
  const user = {
    name: 'John',
    email: 'john9@example.com',
    password: 'insecure',
  }

  beforeAll(async () => {
    await cleanupDatabase()
  })

  afterAll(async () => {
    await cleanupDatabase()
  })

  it("with valid data should return 200", async () => {
    const newUser = {
      name: 'John',
      email: 'john1@example.com',
      password: 'insecure',
    }

    const response = await request(app)
      .post("/users")
      .send(newUser)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(200);
    expect(response.body.id).toBeTruthy;
    expect(response.body.name).toBe(newUser.name);
    expect(response.body.email).toBe(newUser.email);
    expect(response.body.password).toBe(undefined);
  });

  it("with same email should fail", async () => {
    const duplicateUser = {
      name: 'John',
      email: 'john2@example.com',
      password: 'insecure',
    }

    await request(app)
      .post("/users")
      .send(duplicateUser)
      .set('Accept', 'application/json')

    const response = await request(app)
      .post("/users")
      .send(duplicateUser)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('already taken');
  });

  it("with invalid password should fail", async () => {
    const userWithInvalidPassword = {
      email: user.email,
      password: "short"
    }

    const response = await request(app)
      .post("/users")
      .send(userWithInvalidPassword)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.password).toBe('should be at least 8 characters');
  });

  it("with invalid email should fail", async () => {
    const userWithInvalidEmail = {
      email: "wrongemail.com",
      password: user.password
    }

    const response = await request(app)
      .post("/users")
      .send(userWithInvalidEmail)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.email).toBe('Invalid Email');
  });

  it("blank user name should fail", async () => {
    const userWithBlankName = {
      name: "",
      email: user.email,
      password: user.password
    }

    user.name=""

    const response = await request(app)
      .post("/users")
      .send(userWithBlankName)
      .set('Accept', 'application/json')
    expect(response.statusCode).toBe(400);
    expect(response.body.error).toBeTruthy;
    expect(response.body.error.name).toBe('Cannot be blank');
  });
})

