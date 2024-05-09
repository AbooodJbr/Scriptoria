import express from "express";
import Account from "../models/account.js"
import sendMail from "../emails/sendMail.js"
import authentication from "../middleware/authentication.js";
import jwt from "jsonwebtoken"
import Follow from "../models/follow.js";
import Like from "../models/like.js";
import Comment from '../models/comment.js'
import bcrypt from 'bcryptjs'
import { converImgToBuffer } from "../utils/image.js";
import Rating from "../models/rating.js";
import ReadingList from "../models/readingList.js";
import Story from "../models/story.js";
import Writers from "../models/writers.js";

const router = new express.Router()

router.post("/SignUp", async (req, res) => {
    if (req?.body?.profilePicture) {
        req.body.profilePicture = await converImgToBuffer(req.body.profilePicture);
    }
    const user = new Account(req.body);
    try {
        await user.save();
        const { accessToken, refreshToken } = await user.generateAuthToken();
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(201).send({ user, token: accessToken, refreshToken });
    } catch (error) {
        res.status(400).send(error);
    }
})

router.post('/signIn', async (req, res) => {
    try {
        const user = await Account.findByCredentials(req.body.email, req.body.password)
        const { accessToken, refreshToken } = await user.generateAuthToken();
        res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.status(200).send({ user, token: accessToken, refreshToken });
    } catch (error) {
        res.status(400).send()
    }
})

router.get("/refresh", async (req, res) => {
    const refreshToken = req.cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true });
    res.clearCookie('flag');
    if (!refreshToken) {
        return res.status(400).send({ error: 'Refresh token is required' });
    }
    try {
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await Account.findOne({ _id: decoded._id });
        if (!user) {
            throw new Error();
        }
        user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
        await user.save();
        const accessToken = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET, { expiresIn: "20s" });

        const newRefreshToken = jwt.sign(
            { _id: user._id.toString() },
            process.env.JWT_REFRESH_SECRET,
            { expiresIn: '60m' }
        );
        user.tokens = user.tokens.concat({ token: newRefreshToken });
        await user.save();
        res.cookie('jwt', newRefreshToken, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
        res.cookie('flag', true);
        res.send({ accessToken, userName: user.userName, refreshToken: newRefreshToken, userInfo: user });
    } catch (error) {
        res.status(401).send({ error: 'Invalid refresh token' });
    }
});

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

router.post("/user/find", async (req, res) => {
    try {
        const user = await Account.findOne(req.body);
        if (!user) {
            return res.send({ message: false });
        }
        res.send({ message: true, _id: user._id, user });
    } catch (error) {
        res.status(500).send({ error: "Server error" })
    }
})

router.post('/account/recovery', async (req, res) => {
    try {
        sendMail(req.body.email, req.body.codeGenerated)
        res.status(200).send({ status: true })
    } catch (error) {
        res.status(500).send({ status: false })
    }
})

router.get('/find/email/:email', async (req, res) => {
    try {
        const user = await Account.findOne({ email: req.params.email })
        if (!user) {
            return res.status(404).send({ error: "Email not found" })
        }
        res.status(200).send(user)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.post('/account/recovery', async (req, res) => {
    try {
        sendMail(req.body.email, req.body.codeGenerated)
        res.status(200).send({ status: true })
    } catch (error) {
        res.status(500).send({ status: false })
    }
})

router.patch('/reset/password', async (req, res) => {
    try {

        const user = await Account.findOne({ email: req.body.email })
        if (!user) {
            return res.status(404).send("User not found");
        }

        user.password = req.body.password
        await user.save()

        res.status(200).send({ status: true })
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: false })
    }
})

router.post('/confirm/password', async (req, res) => {

    const { userName, confirmedPassword } = req.body

    try {
        const account = await Account.findOne({ userName }).select('password');

        if (!account) {
            res.status(404).send()
        }

        const passwordMatch = await bcrypt.compare(confirmedPassword, account.password)

        if (!passwordMatch) {
            return res.status(401).send({ message: false })
        }
        res.status(200).send({ message: true })

    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/account/logoutAll", async (req, res) => {

    try {
        const refreshToken = req.cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true });
        if (!refreshToken) {
            return res.status(400).send({ error: 'Refresh token is required' });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await Account.findOne({ _id: decoded._id });
        user.tokens = []
        if (!user) {
            throw new Error();
        }
        await user.save();
        res.send({ status: true });
    } catch (error) {
        res.status(500).send(error)
    }
})

router.post("/account/logout", async (req, res) => {
    try {
        const refreshToken = req.cookies.jwt;
        res.clearCookie('jwt', { httpOnly: true });
        if (!refreshToken) {
            return res.status(400).send({ error: 'Refresh token is required' });
        }
        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await Account.findOne({ _id: decoded._id });
        user.tokens = user.tokens.filter((token) => token.token !== refreshToken);
        if (!user) {
            throw new Error();
        }
        await user.save();
        res.send({ status: true });
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch("/account/update", async (req, res) => {
    const _id = req.body._id;
    delete req.body._id;
    const updates = Object.keys(req.body);
    try {
        if (updates[0] === "profilePicture") {
            try {
                const buffer = await converImgToBuffer(req.body.profilePicture);
                req.body.profilePicture = buffer;
            } catch (error) {
                console.error("Error fetching or processing image:", error);
            }
        }

        const user = await Account.findById(_id);
        updates.forEach((update) => user[update] = req.body[update]);
        await user.save();
        if (!user) {
            return res.status(404).send({ error: "Not Found" });
        }
        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
})

router.delete("/account/delete", async (req, res) => {
    try {
        const { userName } = req.body
        const id = await Account.findOne({ userName })

        await Like.deleteMany({ AccountId: id });
        await Comment.deleteMany({ accountId: id });
        await Rating.deleteMany({ AccountId: id });
        await ReadingList.deleteMany({ accountId: id });
        await Follow.deleteMany({ account: id });
        await Follow.deleteMany({ follow: id });


        const writers = await Writers.find({ AccountId: id });
        for (const writer of writers) {
            const count = await Writers.countDocuments({ StoryId: writer.StoryId })

            if (count === 1) {
                await Story.findByIdAndDelete(writer.StoryId)
            }

            await Writers.findByIdAndDelete(writer._id)
        }

        const account = await Account.findOneAndDelete(id)

        if (!account) {
            res.status(400).send()
        }
        res.status(200).send(account)
    } catch (error) {
        res.status(500).send(error)
    }
})
router.get('/getFriends/:userId', async (req, res) => {
    const userId = req.params.userId
    try {
        const myfollowing = await Follow.find({ account: userId })
        if (myfollowing.length > 0) {
            const myfollowingId = myfollowing.map(following => { return following.follow });
            const users = await Follow.find({ account: { $in: myfollowingId }, follow: userId })
            const usersId = users.map(following => { return following.account });
            const friends = await Account.find({ _id: { $in: usersId } })
            return res.status(200).send({ message: true, friends })
        }
        return res.status(400).send({ message: false })
    } catch (error) {
        return res.status(500).send({ message: false, error })
    }
})

export default router
