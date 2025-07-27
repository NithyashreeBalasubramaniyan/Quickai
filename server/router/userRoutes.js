import express from 'express'
import { getPublishedCreation, getUSerCreation, toggleLikeCreation } from '../controllers/creationController.js'
import { auth } from '../middleware/Auth.js'
const userRouter=express.Router()
userRouter.get('/get-user-creation',auth,getUSerCreation)
userRouter.get('/get-published-creations',auth,getPublishedCreation)
userRouter.post('/toggle-like-creation',auth,toggleLikeCreation)

export default userRouter
