import express from "express"
import { Community } from "../../../models/index.js"
import cleanUserInput from "../../../services/cleanUserInput.js";
import { ValidationError } from "objection";
import uploadImage from "../../../services/uploadImage.js";
import userCommunitiesRouter from "./userCommunitiesRouter.js"

const communitiesRouter = new express.Router()

communitiesRouter.use("/:communityId", userCommunitiesRouter)

communitiesRouter.get("/", async (req,res) => {
    try{
        const communities = await Community.query()
        return res.status(200).json({communityList: communities})
    } catch(error) {
        return res.status(500).json({ errors:error })
    }
})
communitiesRouter.get("/:id", async (req, res) => {
    const { id }= req.params
  
    try {
      const community = await Community.query().findById(id)
      return res.status(200).json({ community: community })
    }
    catch (err) {
      return res.status(500).json({ errors: err })
    }
  })

  communitiesRouter.post('/',uploadImage.single("image"), async (req, res) => {
    try {
        const { body, user } = req;
        const formInput = cleanUserInput(body);
        const data = {
            ...formInput,
            image: req.file?.location
        };
        const newCommunity = await Community.query().insertAndFetch(data);
        res.status(201).json({ community: newCommunity });
    } catch (error) {
        console.log(error);
        if (error instanceof ValidationError) {
            return res.status(422).json({ errors: error.data })
        }
        return res.status(500).json({ errors: error })
    }
});


export default communitiesRouter