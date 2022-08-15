const router = require("express").Router()

const Comment = require('../models/Comment.model')

const fileUploader = require('../config/cloudinary.config')

const { checkRole } = require('./../middleware/roles-checker')

const { isLoggedIn } = require("../middleware/session-guard")
const { isOwnerOrAdmin } = require("../middleware/is-owner")



router.post('/write/:place_id', isLoggedIn, (req, res, next) => {
    const { title, review } = req.body
    const { place_id } = req.params
    const { _id: owner } = req.session.currentUser

    Comment
        .create({ title, review, owner, place_id })
        .then(() => {
            res.redirect('back')
        })
        .catch(err => next(new Error(err)))
})



router.get('/update/:id/:city', isOwnerOrAdmin, isLoggedIn, (req, res, next) => {

    const { id, city } = req.params

    Comment
        .findById(id)
        .then(comm => res.render('review/edit-form', { comm, city }))
        .catch(err => next(new Error(err)))

})


router.post('/update/:id/:city', isOwnerOrAdmin, isLoggedIn, (req, res, next) => {

    const { id, city } = req.params
    const { title, review, owner } = req.body

    Comment
        .findByIdAndUpdate(id, { title, review, owner })
        .then(() => res.redirect(`/places/details/${city}`)) // FALTA LLEVAR ATRAS
        .catch(err => next(new Error(err)))
})

router.post('/delete/:id/', isLoggedIn, (req, res, next) => {
    const { id } = req.params

    Comment
        .findByIdAndDelete(id)
        .then(() => res.redirect('back'))
        .catch(err => console.log(err))
})

module.exports = router



