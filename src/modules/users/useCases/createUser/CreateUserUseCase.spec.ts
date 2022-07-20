import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able to create a new user", async () => {
    const user = await createUserUseCase.execute({
      name: "User test 1",
      email: "user1@test.com",
      password: "user1",
    });

    expect(user).toHaveProperty("id");
    expect(user.name).toEqual("User test 1");
  });

  it("Should not be able to create a new user with a exists email", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "User test 1",
        email: "user1@test.com",
        password: "user1",
      });
      await createUserUseCase.execute({
        name: "User test 3",
        email: "user1@test.com",
        password: "user1",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
