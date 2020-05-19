const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const User = mongoose.model("User")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config/keys')
const requiredLogin = require('../middleware/requireLogin')
// const nodemailer=require('nodemailer')
// const sendgridTransport=require('nodemailer-sendgrid-transport')


// const transporter=nodemailer.createTransport(sendgridTransport({
//     auth:{
//         api_key:"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"
//     }
// }))

router.post('/signup', (req, res) => {
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please add all the fields" })
    }
    User.findOne({ email: email })
        .then((savedUser) => {
            if (savedUser) {
                return res.status(422).json({ error: "the email id already exist" })
            }
            bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email,
                        password: hashedPassword,
                        name,
                        pic
                    })
                    user.save()
                        .then(user => {
                            // transporter.sendMail({
                            //     to:user.email,
                            //     from:"no-reply@instaclone.com",
                            //     subject:"signup-success",
                            //     html:"<h1>Welcome to InstaClone Application</h1>"
                            // })
                            res.json({ message: "saved successfuly" })
                        })
                        .catch(err => {
                            console.log(err)
                        })
                })
        })
        .catch(err => {
            console.log(err)
        })
})

router.post('/signin', (req, res) => {
    const { email, password } = req.body
    if (!email || !password) {
        return res.status(422).json({ error: "please add email or password" })
    }
    User.findOne({ email: email })
        .then(savedUser => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Email ID or password" })
            }
            bcrypt.compare(password, savedUser.password)
                .then(doMatch => {
                    if (doMatch) {
                        //res.json({ message: "Successfully signed in" })
                        const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)
                        const { _id, name, email, followers, following, pic } = savedUser
                        res.json({ token, user: { _id, name, email, followers, following, pic } })
                    }
                    else {
                        return res.status(422).json({ error: "Invalid Email ID or password" })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        })
})

// router.post('/resetpassword', (req, res) => {
//     crypto.randomBytes(32, (err, buffer) => {
//         if (err) {
//             console.log(err)
//         }
//         const token = buffer.toString("hex")
//         User.findOneAndRemove({ email: req.body.email })
//             .then(user => {
//                 if (!user) {
//                     return res.status(422).json({ error: "User doesn't eist with this email" })
//                 }
//                 user.resetToken = token
//                 user.expireToken = Date.now() + 3600000
//                 user.save().then(result => {
//                     transporter.sendMail({
//                         to: user.email,
//                         from: "no-reply@instaclone02.com",
//                         subject: "password-reset",
//                         html: `
//                         <p>You requested for a password reset</p>
//                         <h5>click in this <a href="http://localhost:3000/reset/${token}">link</a> to reset the password </h5>`
//                     })
//                     res.json({ message: "check your email" })
//                 })
//             })
//     })
// })


// router.post('/newpassword', (req, res) => {
//     const newPassword = req.body.password
//     const sentToken = req.body.token
//     User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
//         .then(user => {
//             if (!user) {
//                 return res.status(422).json({ error: "Try again session expired" })
//             }
//             bcrypt.hash(newPassword, 12).then(hashedpassword => {
//                 user.password = hashedpassword
//                 user.resetToken = undefined
//                 user.expireToken = undefined
//                 user.save().then((saveduser) => {
//                     res.json({ message: "password updated success" })
//                 })
//             })
//         }).catch(err => {
//             console.log(err)
//         })
// })

module.exports = router 