import { app } from './app'
import { EnvSchema } from './schemas/env-schemas'

const env = EnvSchema.parse(process.env)
const port = env.PORT

app.listen(port, () => console.log(`Server running in ${port}`))
