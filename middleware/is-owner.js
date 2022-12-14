const isOwnerOrAdmin = (req, res, next) => {
    if ( req.params.id === req.session.currentUser._id || req.session.currentUser.role === "ADMIN" ) {
        next()
    }
    else {
        res.render('auth/login', { errorMessage: 'Unauthorized access' })
    }
}

module.exports = { isOwnerOrAdmin }