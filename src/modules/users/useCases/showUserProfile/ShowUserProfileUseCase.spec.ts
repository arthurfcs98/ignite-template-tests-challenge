import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let inMemoryUsersRepository: IUsersRepository;
let createUserUseCase: CreateUserUseCase;
let showUserProfileUseCase: ShowUserProfileUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );
  });

  it("Should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      email: "root@email.com",
      name: "test",
      password: "root",
    });
    const result = await showUserProfileUseCase.execute(user.id as string);

    expect(result).toHaveProperty("id");
    expect(result.name).toEqual("test");
  });

  it("Should not be able to show an nonexistent user profile", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "root@email.com",
        name: "test",
        password: "root",
      });

      await showUserProfileUseCase.execute("32714832ghuasfghkd");
    }).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
