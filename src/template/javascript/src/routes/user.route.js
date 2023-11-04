import {Router} from 'express';
import User from '../models/User.model.js';

const userRouter = Router();

userRouter.get('/', async (req, res) => {
    const users = await User.find();
    res.send(users);
})

export default userRouter;