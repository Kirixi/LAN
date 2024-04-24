import mongoose from "mongoose";
import { FollowModel, UserModel } from "../db/collections.js";
import { Response, Request } from "express";
import { Follows } from "../db/interfaces.js";
import user from "./user.js";


const createFollower = async (req: Request, res: Response) => {
    try {
        const follower = new FollowModel<Follows>({
            _id: new mongoose.Types.ObjectId(),
            user_id: req.body.user_id,
            follower_id: req.body.follower_id,
            follower_username: req.body.username,
        })

        const response = await follower.save();

        return res.status(200).json({ message: "User followed!" , data: response })

    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const getFollowers = async (req: Request, res: Response) => {
    try {
        const response = await FollowModel.find({ user_id: req.params.id });
        return res.status(200).json({data: response});

    } catch (e: any) {
        console.log(e.message)
        return res.status(400).json({ message: e.message })
    }
}

const getUnfollowAccounts = async (req: Request, res: Response) => {
    try {
        const follows = await FollowModel.find({ follower_id: req.params.id });
        const users = await UserModel.find({ _id: { $ne: req.params.id} }, {password: 0});
        const response =[];

        for(var i = 0; i < users.length; i++) {
            if (!follows.some(follow => follow.user_id === users[i]._id.toString())){
                response.push(users[i]);
            }
        }

        return res.status(200).json(response);

    } catch (e: any) {
        return res.status(400).json({ message: e.message })
    }
}

const getFollowing = async (req: Request, res: Response) => {
    try {
        const response = await FollowModel.find({ follower_id: req.params.id });
        return res.status(200).json(response);
    } catch (e: any){
        console.log(e.message)
        return res.status(400).json({ message: e.message })
    }
}

const unfollow = async (req: Request, res: Response) => {
    try {
        const response = await FollowModel.deleteOne({ _id: req.params.id })
        return res.status(200).json(response);
    } catch (e: any) {
        return res.status(400).json({  message: "User unfollowed!" })
    }
}


export default  { createFollower, getFollowers, getFollowing, unfollow, getUnfollowAccounts }