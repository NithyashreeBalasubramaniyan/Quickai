import express from 'express'
import { auth } from '../middleware/Auth.js'
import { upload } from '../config/multer.js'
import { Blogtitle, generateArticle, GenerateImg, removeBgImage, removeObject, reviewResume } from '../controllers/aiController.js'


const airoute=express.Router()
airoute.post('/generate-article',auth,generateArticle)
airoute.post('/generate-blog-title',auth,Blogtitle)
airoute.post('/generate-image',auth ,GenerateImg)
airoute.post('/remove-background',upload.single('image'),auth ,removeBgImage)
airoute.post('/remove-object',upload.single('image'),auth ,removeObject)
airoute.post('/resume-review',upload.single('resume'),auth ,reviewResume)

export default airoute