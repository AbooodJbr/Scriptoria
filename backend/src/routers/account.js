import express from "express";
import Account from "../models/account.js"
const router = new express.Router()

router.post("/SignUp", async (req, res) => {
    const user = new Account(req.body);
    try {
        await user.save();
        const token = await user.generateAuthToken();
        res.status(201).send({ user, token })
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/signIn', async (req, res) => {
    try {
        const user = await Account.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.status(200).send({ user, token })
    } catch (error) {
        res.status(400).send()
    }
})
router.get('/find/userName/:userName', async (req, res) => {
    try {
        const user = await Account.findOne({ userName: req.params.userName })
        if (!user) {
            return res.status(404).send({ error: "Username not found" })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})

export default router
