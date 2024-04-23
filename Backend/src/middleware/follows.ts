import mongoose from "mongoose";
import { FollowModel } from "../db/collections.js";
import { Response, Request } from "express";
import { Follows } from "../db/interfaces.js";


const createFollower = async (req: Request, res: Response) => {
    try {
        const follower = new FollowModel<Follows>({
            _id: new mongoose.Types.ObjectId(),
            user_id: req.body.user_id,
            follower_id: req.body.follower_id,
            follower_username: req.body.username,
        })

        const response = await follower.save();

        return res.status(200).json({ data: response })

    } catch (e: any) {
        return res.status(401).json({ message: e.message })
    }
}

const getFollowers = async (req: Request, res: Response) => {
    try {
        const response = FollowModel.find({ user_id: req.params.user_id });
        return res.status(200).json(response);

    } catch (e: any) {
        return res.status(400).json({ message: e.message })
    }
}

const getFollowing = async (req: Request, res: Response) => {
    try {
        const response = FollowModel.find({ follower_id: req.params.follower_id });
        return res.status(200).json(response);
    } catch (e: any){
        return res.status(400).json({ message: e.message })
    }
}

const unfollow = async (req: Request, res: Response) => {
    try {
        const response = FollowModel.deleteOne({ _id: req.params._id })
        return res.status(200).json(response);
    } catch (e: any) {
        return res.status(400).json({ message: e.message })
    }
}


export default  { createFollower, getFollowers, getFollowing, unfollow }