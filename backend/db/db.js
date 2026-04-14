import mongoose from 'mongoose'

export const db = async () => {
    try {
        mongoose.set('strictQuery', false)
        
        // Check if the variable is actually loading
        if (!process.env.MONGO_URL) {
            throw new Error("MONGO_URL is not defined in .env file");
        }

        // Modern Mongoose doesn't need the options object anymore
        await mongoose.connect(process.env.MONGO_URL)
        
        console.log('✅ Db Connected')
    } catch (error) {
        // This will tell us if it's a DNS error or a missing variable
        console.error('❌ DB Connection Error:', error.message)
        throw error 
    }
}