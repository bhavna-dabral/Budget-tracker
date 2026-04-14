import mongoose from 'mongoose'

export const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log('Db Connected')
    } catch (error) {
        console.error('DB Connection Error:', error.message)  // <-- show actual error
        throw error   // <-- prevent server from starting if DB fails
    }
}