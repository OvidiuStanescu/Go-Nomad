const { response } = require("express")
const Comment = require("../models/Comment.model")
const { getPlaceInfo } = require("../services/places.service")
const placesService = require("../services/places.service")
const User = require("../models/User.model")
const router = require("express").Router()

const axios = require('axios')
const { isLoggedIn } = require("../middleware/session-guard")

// Places
router.get('/', (req, res) => {
    res.render('places/list')
})



// Places details
router.get('/details/:city', (req, res, next) => {
    let photos
    let name = ""
    let coords
    let place_id
    const { city: cityName } = req.params
    placesService
        .getPlaceInfo(cityName)
        .then(city => {
            place_id = city.data.results[0].place_id
            const detailsPromise = placesService.getPlaceDetails(place_id)
            const commentsPromise = Comment.find({ place_id }).populate("owner")
            return Promise.all([detailsPromise, commentsPromise])
        })
        .then(([details, comments]) => {
            coords = details.data.result.geometry.location
            name = details.data.result.name
            let photoReferences = details.data.result.photos.map(elm => elm.photo_reference)
            photos = photoReferences.map(ref => `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=${ref}&key=AIzaSyCWeFAP8xK0Ea5xMJjFlEDbq7C_twO-_so`)
            res.render('places/details', { name, photos, place_id, comments, cityName, coords })
        })
        .catch(err => next(new Error(err)))
})



// Restaurants list   
router.get('/details/restaurants/:city_name/list', (req, res, next) => {

    const { city_name } = req.params

    placesService
        .getTopRestaurants(city_name)
        .then(rest => {
            const result = rest.data.results
            res.render('places/restaurants-list', { result })
        })
        .catch(err => next(new Error(err)))
})



// Coworkings list   
router.get('/details/coworking/:city_name/list', (req, res, next) => {

    const { city_name } = req.params

    placesService
        .getTopCoworkings(city_name)
        .then(cowork => {
            const coworkRes = cowork.data.results
            res.render('places/coworking-list', { coworkRes })
        })
        .catch(err => next(new Error(err)))
})



// Clubs list   
router.get('/details/clubs/:city_name/list', (req, res, next) => {

    const { city_name } = req.params

    placesService
        .getTopClubs(city_name)
        .then(clubs => {
            const clubsRes = clubs.data.results
            res.render('places/clubs-list', { clubsRes })
        })
        .catch(err => next(new Error(err)))
})



// Places coworkings details
router.get('/coworkings/:id', (req, res) => {
    res.render('places/list')
})



// Restaurants details
router.get('/details/restaurants/:name', (req, res, next) => {

    const { name } = req.params

    placesService
        .getPlaceFullInfo(name)
        .then(restaurantInfo => res.render('places/restaurants', restaurantInfo))
        .catch(err => console.log(err))
})



// Clubs details
router.get('/details/clubs/:name', (req, res, next) => {

    const { name } = req.params

    placesService
        .getPlaceFullInfo(name)
        .then(clubsInfo => res.render('places/clubs', clubsInfo))
        .catch(err => console.log(err))
})



// Coworkings details  
router.get('/details/coworkings/:name', (req, res, next) => {

    const { name } = req.params

    placesService
        .getPlaceFullInfo(name)
        .then(coworkInfo => res.render('places/coworkings', coworkInfo))
        .catch(err => console.log(err))
})

router.post('/favorites/:city_name', isLoggedIn, (req, res) => {
    const { city_name } = req.params
    const { currentUser } = req.session
    console.log(city_name)

    User
        .findByIdAndUpdate(currentUser._id, { $push: { favorites: city_name } })
        .then(() => res.redirect('back'))
        .catch(err => res.redirect('back'))
})



module.exports = router
