import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";
let inMemoryUserRepository: IUsersRepository;
let inMemoryStatementRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
  });

  it("Shoul be able to create a new statement", async () => {
    const user = await createUserUseCase.execute({
      email: "test@email.com",
      name: "test",
      password: "test",
    });

    const statement = await createStatementUseCase.execute({
      user_id: user.id as string,
      amount: 900.0,
      description: "salary",
      type: OperationType.DEPOSIT,
    });

    expect(statement).toHaveProperty("id");
    expect(statement.amount).toEqual(900);
  });

  it("Shoul not be able to create a new statement with a nonexistent user", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@email.com",
        name: "test",
        password: "test",
      });

      const statement = await createStatementUseCase.execute({
        user_id: "sdfhja",
        amount: 900.0,
        description: "salary",
        type: OperationType.DEPOSIT,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be able to create a new withdraw statement with insufficient fuds", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@email.com",
        name: "test",
        password: "test",
      });

      const statement = await createStatementUseCase.execute({
        user_id: user.id as string,
        amount: 900.0,
        description: "salary",
        type: OperationType.WITHDRAW,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
