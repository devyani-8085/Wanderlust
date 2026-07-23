const Listing = require('../models/listing');
const getCoordinates = require("../utils/geocode");

module.exports.index = async (req, res) => {
    const { category, search } = req.query;

    let filter = {};
    if (category) {
        filter.category = category;
    }
    if (search && search.trim()) {
        const regex = new RegExp(search.trim(), "i");
        filter.$or = [
            { title: regex },
            { location: regex },
            { country: regex },
        ];
    }

    const allListings = await Listing.find(filter);
    res.render("index.ejs", {
        allListings,
        category: category || "all",
        search: search || "",
    });
};

module.exports.newListing =  (req, res) => {

    res.render("listings/new.ejs");
};

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;

    const listing = await Listing.findById(id)
    .populate({
        path:"reviews",
        populate:{
        path:"author",
    }}).populate("owner");

    console.log("Show route listing:", listing);
    if(!listing){
        req.flash("error" , " Listing you requested does not exist!");
        res.redirect("/listings");
    }

    // If the listing doesn't have coordinates, generate and save them
    if (!listing.geometry?.coordinates?.length) {
    try {

        const geometry = await getCoordinates(listing.location);

        listing.geometry = geometry;

        await listing.save();

        console.log("Geometry added successfully!");

    } catch (err) {

        console.error(err);

    }
}

    let originalImageUrl = listing.image.url; // Store the original image URL
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250,h_300"); // Modify the URL to include resizing parameters
    res.render("listings/show.ejs", {
    listing,
    originalImageUrl,
    geoApiKey: process.env.GEOAPIFY_API_KEY
});
};

module.exports.createListing = async (req, res) => {

    let url = req.file.path;

    req.body.listing.image = {
        filename: req.file.filename,
        url: url
    };

    const geometry = await getCoordinates(req.body.listing.location);

    const newListing = new Listing(req.body.listing);

    newListing.geometry = geometry;

    newListing.owner = req.user._id;

    newListing.image = {
        filename: req.file.filename,
        url: url
    };

    await newListing.save();

    req.flash("success", "New Listing Created!");

    res.redirect("/listings");
};


module.exports.editListing = async (req, res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , " Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url; 
    originalImageUrl = originalImageUrl.replace("/upload", "/upload/w_250"); 
    res.render("listings/edit.ejs", {listing, originalImageUrl});
};

module.exports.updateListing = async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing);
    if (typeof req.file !== 'undefined') {
    let url = req.file.path;
    listing.image = {
        filename: req.file.filename,
        url: url
    };
    await listing.save();
}
    
    req.flash("success" , " Listing Updated!");
    res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
     req.flash("success" , " Listing Deleted!");
    res.redirect("/listings");
}