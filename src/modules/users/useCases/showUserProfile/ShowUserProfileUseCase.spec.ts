import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { AuthenticateUserUseCase } from "../authenticateUser/AuthenticateUserUseCase"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { ShowUserProfileError } from "./ShowUserProfileError"
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase"

describe("Get authenticated user info", () => {
  
    let usersRepositoryInMemory: InMemoryUsersRepository
    let createUserUseCase:CreateUserUseCase
    let authenticateUserUseCase: AuthenticateUserUseCase
    let showUserProfileUseCase: ShowUserProfileUseCase


    beforeEach(() => {
        usersRepositoryInMemory = new InMemoryUsersRepository()
        createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory)
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepositoryInMemory)
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositoryInMemory)
    })

    it("Should be able to get the info of the user", async() => {
        const testUser = {
            name: "Robertinho", 
            email: "robertinho@jeremias.com",
            password: "123456848548"
        }

        const user = await createUserUseCase.execute(testUser)
        
        const { id } = user

        const userInfo = await showUserProfileUseCase.execute(id as string)

        expect(userInfo).toEqual(expect.objectContaining({
            email: 'robertinho@jeremias.com',
            name: 'Robertinho',
        }))
    }),

    it("Should be able to get the info of an inexistent user", () => {
        expect(async () => {
            await showUserProfileUseCase.execute("id as string")
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
})