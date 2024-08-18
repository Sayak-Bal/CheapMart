const mongoose = require("mongoose");
const Review = require("./review.js");
const User = require("./user.js");

const listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    image: {
        url:String,
        filename:String,
    },//imgs.search.brave.com/0q9d97K5GRcsw97-D5xonQ59jVFUBGFyChqTBGvPCLk/rs:fit:860:0:0/g:ce/aHR0cHM6Ly9jZG4ucGl4YWJheS5jb20vcGhvdG8vMjAyMy8wMi8wNi8xNy81Mi9h/aS1nZW5lcmF0ZWQtNzc3MjQ2OV8xMjgwLmpwZw" : v,
    
    price: {
        type: Number,
        min: 100,
    },
    location: {
        type: String,
    },
    country: {
        type: String,
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review',
        },
    ],
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    
});

// mongoose middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
