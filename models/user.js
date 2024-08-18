const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Define the User schema
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true // Ensure email is unique
    }
});

// Add the passport-local-mongoose plugin to the schema
userSchema.plugin(passportLocalMongoose);

// Export the User model
module.exports = mongoose.model("User", userSchema);
