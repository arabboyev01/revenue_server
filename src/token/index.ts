import jwt from 'jsonwebtoken'

function generateToken(id: number, rememberMe = false) {
    const jwtSecret = process.env.JWT_SIGN || 'secret'
    let tokenExpiration = '1h'

    if (rememberMe) {
        tokenExpiration = '7d'
    }

    const token = jwt.sign({ user_id: id }, jwtSecret, {
        expiresIn: tokenExpiration
    });

    return token
}
export { generateToken }