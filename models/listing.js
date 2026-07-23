const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = require("./review.js");
const listingSchema = new Schema({
    title: {
        type :String,
        required: true
    },
    description: String,
    image: {
        url: String,
        filename: {
            type: String,
            default: "listingimage"
        }
    },
    price :{
      type: Number,
      required: true
    },
    location: 
    { type:String
    },

    country: {
    type: String
},

geometry: {
    type: {
        type: String,
        enum: ["Point"],
        default: "Point"
    },
    coordinates: {
        type: [Number],
        required: true
    }
},
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: "Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref : "User",
    },
    category:{
        type: String,
        enum: ["Beach", "Mountains", "City", "Countryside", "Desert", "Forest", "Island", "Other"],
        default: "Other"
    }

});

listingSchema.post("findOneAndDelete", async  (listing) => {
      if(listing){
        await Review.deleteMany({_id : {$in : listing.reviews}});

      } });
const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;