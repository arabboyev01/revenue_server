import bcrypt from 'bcrypt'

const hashingPassword = async function (password: string): Promise<string> {
    const saltRounds = 10
    return bcrypt.hashSync(password, saltRounds)
}

const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
    return bcrypt.compare(plainPassword, hashedPassword)
}

export { hashingPassword, comparePassword }