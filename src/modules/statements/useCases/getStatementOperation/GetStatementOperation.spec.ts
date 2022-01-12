import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { ICreateStatementDTO } from "../createStatement/ICreateStatementDTO"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
    DEPOSIT = 'deposit',
    WITHDRAW = 'withdraw',
}


describe("Get a statement", () => {

    let usersRepository: InMemoryUsersRepository
    let statementsRepository: InMemoryStatementsRepository
    let createUserUseCase: CreateUserUseCase
    let getStatementUseCase: GetStatementOperationUseCase
    let createStatementUseCase: CreateStatementUseCase
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository()
        statementsRepository = new InMemoryStatementsRepository()
        createUserUseCase = new CreateUserUseCase(usersRepository)
        getStatementUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository)
        createStatementUseCase = new CreateStatementUseCase(usersRepository, statementsRepository)
    })

    
    it("Should be able to get a statement", async() => {

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

        const listedStatement = await getStatementUseCase.execute({ user_id: user.id as string, statement_id: statement.id as string  })

        expect(listedStatement).toEqual(expect.objectContaining({
            type: 'deposit',
            amount: 500,
            description: 'Statement 1'
        }))
        
        expect(listedStatement.amount).toEqual(500)

    }),

    it("Should be able to get a inexistent statement", () => {

        expect(async() => {

            const testUser = {
                name: "Robertinho",
                email: "robertinho@jeremias.com",
                password: "123456848548"
            }
    
            const user = await createUserUseCase.execute(testUser)

            const listedStatement = await getStatementUseCase.execute({ user_id: user.id as string, statement_id: "inexistent statement id"  })
    
    
        }).rejects.toBeInstanceOf(GetStatementOperationError)

    }),

    it("Should be able to get a statement from a inexistent user", () => {

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
                type: 'deposit' as OperationType,
                user_id: user.id as string,
            }
    
            const statement = await createStatementUseCase.execute(statementConfig)
    
            await getStatementUseCase.execute({ user_id: "Inexistent user", statement_id: statement.id as string  })
    
    
        }).rejects.toBeInstanceOf(GetStatementOperationError)

    })
})