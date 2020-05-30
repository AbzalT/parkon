const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/UserModel')
const keys = require('../config/keys')
const errorHandler = require('../utils/errorHandler')
const mailer = require('../controllers/MailController')

module.exports.login = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate){
        const passwordResult = bcrypt.compareSync(req.body.password, candidate.password)
        if(passwordResult){
            const token = jwt.sign({
                email: candidate.email,
                userId: candidate._id
            }, keys.jwt, {expiresIn: 3600})
            res.status(200).json({
                token: `Bearer ${token}`
            });
            console.log('User logged in!');
        } else {
            res.status(401).json({
                message: "Неверный пароль."
            })
        }
    } else {
        res.status(404).json({
            message: "Такой пользователь не существует."
        })
    }
}
module.exports.register = async function (req, res) {
    const candidate = await User.findOne({email: req.body.email})
    if (candidate){
        res.status(409).json({
            message: "Такой пользователь уже существует."
        })
    } else {
        const salt = bcrypt.genSaltSync(10)
        const password = req.body.password
        const user = new User({
            email: req.body.email,
            password: bcrypt.hashSync(password, salt)
        })
        try {
            await user.save().then(() => console.log('User created!'))
            await mailer.notification(req.body.email, req.body.password);
            res.status(201).json(user)
        }
        catch (e) {
            errorHandler(res, e)
        }

    }
}