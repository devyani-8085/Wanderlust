const express = require("express");
const router = express.Router();
const Listing = require('../models/listing.js');
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn ,isOwner,validateListing  }  = require('../authMiddleware.js');
const listingController = require('../controllers/listing.js');
const multer = require('multer');
const { storage } = require('../cloudConfig.js'); // Import the Cloudinary storage configuration
const upload = multer({ storage }); // Configure multer to use Cloudinary storage


//index and create route
router.route('/')
.get( wrapAsync(listingController.index))
.post(
    isLoggedIn , 
    validateListing ,
    upload.single('listing[image]'), // Use multer middleware to handle file upload
    wrapAsync(listingController.createListing));

// NEW route
router.get("/new",isLoggedIn , listingController.newListing);

//show , update and delete route
router
.route('/:id')
.get(wrapAsync(listingController.showlisting))
.put(
    validateListing ,
    isLoggedIn ,
    isOwner ,
    upload.single('listing[image]'),
    wrapAsync(listingController.updateListing)
)
.delete(isLoggedIn ,isOwner , wrapAsync(listingController.destroyListing));



// Edit route
router.get("/:id/edit",isLoggedIn ,isOwner , wrapAsync(listingController.editListing));



module.exports = router;