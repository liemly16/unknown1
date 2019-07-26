
class UserMiddleware {
    constructor() {

    }

    isLogged(req, res, next) {
        if (req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect('/');
        }
    }

    isLogout(req, res, next) {
        if (!req.isAuthenticated()) {
            next();
        }
        else {
            res.redirect('/home');
        }
    }


}

module.exports = new UserMiddleware();