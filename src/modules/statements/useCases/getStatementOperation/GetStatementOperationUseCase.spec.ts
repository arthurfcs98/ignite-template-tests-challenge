import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUserRepository: IUsersRepository;
let inMemoryStatementRepository: IStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;
describe("Get Balance", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();
    inMemoryStatementRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUserRepository,
      inMemoryStatementRepository
    );
  });

  it("Should be able to get a statement operation", async () => {
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

    const statementOperation = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: statement.id as string,
    });

    console.log(statementOperation);

    expect(statementOperation).toHaveProperty("id");
    expect(statementOperation.type).toEqual(OperationType.DEPOSIT);
  });

  it("Should not be able to get a statement operation with a nonexistent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "sdfhjkgds",
        statement_id: "sdhfga",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("Should not be able to get a statement operation with a nonexistent statement", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        email: "test@email.com",
        name: "test",
        password: "test",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "test-id",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
