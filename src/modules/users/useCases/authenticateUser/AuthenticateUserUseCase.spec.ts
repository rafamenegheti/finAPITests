import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"
let usersRepositorInMemory: InMemoryUsersRepository
let authenticateUserUseCase: AuthenticateUserUseCase
let createUserUseCase: CreateUserUseCase


describe("Authenticate User", () => {
    beforeEach(async () => {
        usersRepositorInMemory = new InMemoryUsersRepository()
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepositorInMemory)
        createUserUseCase = new CreateUserUseCase(usersRepositorInMemory)


    })
    it("Should be able to authenticate an user", async () => {

        const testUser = {
            name: "Robertinho",
            email: "robertinho@jeremias.com",
            password: "123456848548"
        }

        const user = await createUserUseCase.execute(testUser)

        const { email, password } = testUser

        const userAuthenticated = await authenticateUserUseCase.execute({ email, password })

        expect(userAuthenticated).toHaveProperty("token")
    })

    it("It should not be able to authenticate an user with the wrong email", () => {

        expect(async () => {
            const testUser = {
                name: "Robertinho",
                email: "robertinho@jeremias.com",
                password: "123456848548"
            }

            await createUserUseCase.execute(testUser)

            const { password } = testUser


            await authenticateUserUseCase.execute({ email: "wrongwmail.com.br", password })
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
    }),

        it("It should not be able to authenticate an user with the wrong password", () => {

            expect(async () => {
                const testUser = {
                    name: "Robertinho",
                    email: "robertinho@jeremias.com",
                    password: "123456848548"
                }

                await createUserUseCase.execute(testUser)

                const { email } = testUser


                await authenticateUserUseCase.execute({ email, password: "WrongPassword" })
            }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
        }),


        it("It should not be able to authenticate an inexistent user", () => {

            expect(async () => {
                await authenticateUserUseCase.execute({ email: "email.sla.com", password: "WrongPassword" })
            }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
        })

})