import express from 'express'
import cors from 'cors'

const app = express()
const port = process.env.PORT || 8080

import login from './routes/login'
import signUp from './routes/sign-up'
import revenues from './routes/revenue'
import user from './routes/user'

app.use(express.json())
app.use(cors())

app.use('/v1/api/login', login)
app.use('/v1/api/register', signUp)
app.use('/v1/api/revenues', revenues)
app.use('/v1/api/user', user)

app.listen(port, () => console.log(`Server is running on port ${port}`))