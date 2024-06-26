import { Request, Response } from 'express'
import { UserModel } from '../models/userModel';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt';


export async function loginUser(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });

    if (user == null) return res.status(404).send(`User not found`);

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) return res.status(404).send(`Password did not match!`);
    if (process.env.JWT_SECRET == null) throw new Error(`ENVIRONMENT VARIABLE : JWT_SECRET not set properly.`);

    const token = jwt.sign({ _id: user._id, name: user.username }, process.env.JWT_SECRET, {
        expiresIn: '2 days',
    });

    return res.status(200).send({
        user: {
            _id: user._id,
            username: user.username,
        }, token: token
    });
}


export async function registerUser(req: Request, res: Response) {
    const { username, password } = req.body;
    const user = await UserModel.findOne({ username });
    if (user != null) return res.status(404).send(`User already exists!`);
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    await UserModel.create({ username, password: hashedPassword });
    res.status(201).send("User created successfully!");
}
