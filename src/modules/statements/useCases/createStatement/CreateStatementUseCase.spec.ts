import { exec } from "child_process"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"
import { ICreateStatementDTO } from "./ICreateStatementDTO"


enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}

describe("Create a new statement", () => {
    let usersRepository: InMemoryUsersRepository
    let statementsRepository: InMemoryStatementsRepository
    let createUserUseCase: CreateUserUseCase
    let createStatementUseCase: CreateStatementUseCase


    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        createUserUseCase = new CreateUserUseCase(usersRepository)
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)

    })

    it("Should be able to create a new statement", async () => {
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

        const statement = await createStatementUseCase.execute(statementConfig)

        expect(statement).toEqual(expect.objectContaining({
            type: 'deposit',
            amount: 500,
            description: 'Statement 1'
        }))

        expect(statement.amount).toBe(500)
    }),

    


    it("Should not be able to create a new statement if the user have no left balance", () => {

        expect(async() => {
            const testUser = {
                name: "Robertinho",
                email: "robertinho@jeremias.com",
                password: "123456848548"
            }
    
            const user = await createUserUseCase.execute(testUser)
    
            const statementConfig: ICreateStatementDTO = {
                amount: 500,
                description: "Statement 1",
                type: 'withdraw' as OperationType,
                user_id: user.id as string,
            }
    
            await createStatementUseCase.execute(statementConfig)
        }).rejects.toBeInstanceOf(CreateStatementError)
    
    })

})