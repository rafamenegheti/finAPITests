import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetBalanceUseCase } from "./GetBalanceUseCase"
enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
  }

describe("List deposits operations with totals", () => {
    let usersRepository: InMemoryUsersRepository
    let statementsRepository: InMemoryStatementsRepository
    let createUserUseCase: CreateUserUseCase
    let createStatementUseCase: CreateStatementUseCase
    let getBalanceUseCase: GetBalanceUseCase

    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        createUserUseCase = new CreateUserUseCase(usersRepository)
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository)
    })

    it("Should be able to list all deposits operations with totals from the user", async () => {

        const testUser = {
            name: "Robertinho",
            email: "robertinho@jeremias.com",
            password: "123456848548"
        }

        const user = await createUserUseCase.execute(testUser)

        const statementConfig: ICreateStatementDTO = {
            amount: 500,
            description: "Statement 1",
            type: 'deposit' as OperationType,
            user_id: user.id as string,
        }

        const statementConfig2: ICreateStatementDTO = {
            amount: 250,
            description: "Statement 2",
            type: 'withdraw' as OperationType,
            user_id: user.id as string,
        }

        await createStatementUseCase.execute(statementConfig)
        await createStatementUseCase.execute(statementConfig2)

        const balance = await getBalanceUseCase.execute({ user_id: user.id as string }) 

        expect(balance.statement.length).toBe(2)
        expect(balance.balance).toBe(250)

    })
})