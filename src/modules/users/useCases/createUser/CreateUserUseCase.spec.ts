import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError"
import { CreateUserUseCase } from "./CreateUserUseCase"

describe("Create an user", () => {

    let usersRepositoryInMemory: InMemoryUsersRepository
    let createUserUseCase:CreateUserUseCase

    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
    })

    it("Should be able to create a new user", async () => {

        const testUser = {
            name: "Robertinho", 
            email: "robertinho@jeremias.com",
            password: "123456848548"
        }

        const user = await createUserUseCase.execute(testUser)

        expect(user).toEqual(expect.objectContaining({
            name: "Robertinho",
            email: "robertinho@jeremias.com"
        }))

    })

    it("Should not be able to create a user that already exists", () => {

        expect(async() => {
            const testUser = {
                name: "Robertinho", 
                email: "robertinho@jeremias.com",
                password: "123456848548"
            }
    
            await createUserUseCase.execute(testUser)
    
            await createUserUseCase.execute(testUser)
        }).rejects.toBeInstanceOf(CreateUserError)

    })
})