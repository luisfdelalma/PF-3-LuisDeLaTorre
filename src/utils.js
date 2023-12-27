import bcrypt from "bcrypt"
import passport from "passport"
import crypto from "crypto"

export function createHash(password) { return bcrypt.hashSync(password, bcrypt.genSaltSync(10)) };

export function isValidatedPassword(user, password) { return bcrypt.compareSync(password, user.password) };

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err)
            if (!user) {
                return res.status(401).send({ error: info.messages ? info.messages : info.toString() })
            }
            req.user = user
            next()
        })(req, res, next)
    }
}

export const authorization = (role) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "Unauthorized" })
        if (req.user.role != role) return res.status(403).send({ error: "No tiene permisos" })
        next()
    }
}

export const ticketCode = () => {
    const buffer = crypto.randomBytes(8)
    return buffer.toString("hex")
}