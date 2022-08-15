const router = require("express").Router()

const User = require("../models/User.model")

const { isLoggedIn } = require("../middleware/session-guard")
const PlacesService = require('./../services/places.service')
const transporter = require('./../config/transporter.config')

// Home page
router.get("/", (req, res, next) => {
    res.render("pages/index", { layout: false })
})



// Input query search
router.post("/city-details", (req, res, next) => {
    const { cityName } = req.body

    PlacesService
        .getCity(cityName)
        .then(city => res.redirect(`places/details/${cityName}`))
        .catch(err => next(new Error(err)))
})



// About us
router.get("/about-us", (req, res) => {
    res.render("pages/about-us")
})



// Contact(get)
router.get("/contact", (req, res) => {
    res.render("pages/contact")
})

// Contact(post)
router.post("/contact", (req, res, next) => {

    let { email, subject, message } = req.body;
console.log(req.body)
    transporter.sendMail({
        from: email,
        to: '<ovidiuleonst@gmail.com>',
        subject: subject,
        text: message,
        html: `<b>${message}</b>`
    })
        .then(info => res.render('pages/message', { email, subject, message, info }))
        .catch(error => console.log(error));
})




// Profiles
router.get("/profiles", isLoggedIn, (req, res, next) => {

    User
        .find()
        .then(users => {
            res.render("user/list", { users })
        })
        .catch(err => next(new Error(err)))
})


module.exports = router