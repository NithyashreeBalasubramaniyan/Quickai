import OpenAI from "openai";
import sql from "../config/db.js";
import FormData from 'form-data';
import { Buffer } from 'buffer'
import { clerkClient } from "@clerk/express";
import axios from "axios";
import { v2 as cloudinary} from 'cloudinary'

import fs from 'fs'
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
  apiKey: process.env.GEMINI_API,
  baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/",
});

export const generateArticle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, length } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: 'Limit usage reached, please upgrade your plan.',
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: length,
    });

   

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'article')
    `;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("AI generation error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


export const Blogtitle = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt } = req.body;
    const plan = req.plan;
    const free_usage = req.free_usage;

    if (plan !== 'premium' && free_usage >= 10) {
      return res.json({
        success: false,
        message: 'Limit usage reached, please upgrade your plan.',
      });
    }

    const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens:100,
    });

    // ✅ Logging after response is defined
    console.log(response.choices[0].message);

    const content = response.choices[0].message.content;

    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES (${userId}, ${prompt}, ${content}, 'blog-title')
    `;

    if (plan !== 'premium') {
      await clerkClient.users.updateUserMetadata(userId, {
        privateMetadata: {
          free_usage: free_usage + 1,
        },
      });
    }

    res.json({ success: true, content });

  } catch (error) {
    console.error("AI generation error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


export const GenerateImg = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { prompt, publish } = req.body;
    const plan = req.plan;

    // Check user plan
    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'Limit usage reached, please upgrade your plan.',
      });
    }

    // Create form with prompt
    const form = new FormData();
    form.append('prompt', prompt);

    // Make API request to ClipDrop
    const { data } = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
      headers: {
        'x-api-key': process.env.CLIPDROP_API_KEY,
        ...form.getHeaders(), // <-- Required for multipart/form-data
      },
      responseType: 'arraybuffer', // to receive image data
    });

    // Convert binary to base64
    const base64Img = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

    // Upload to Cloudinary
    const { secure_url } = await cloudinary.uploader.upload(base64Img);

    // Insert into database
    await sql`
      INSERT INTO creations(user_id, prompt, content, type, publish)
      VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})
    `;

    // Send response
    return res.json({ success: true, content: secure_url });

  } catch (error) {
    console.error("AI generation error:", error.response?.data || error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const removeBgImage= async (req, res) => {
  try {
    const { userId } = req.auth();
    const  image  = req.file;
    const plan = req.plan;
   

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'Limit usage reached, please upgrade your plan.',
      });
    }

    const { secure_url } = await cloudinary.uploader.upload(image.path,{
      transformation:[
        {
          effect:'background_removal',
          background_removal: 'cloudinary_ai'
        }
      ]
    });

    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES (${userId},'remove background from the image', ${secure_url}, 'image')
    `;

    return res.json({ success: true, content:secure_url });

  } catch (error) {
    console.error("AI generation error:", error.message);
    res.json({ success: false, message: error.message });
  }
};


export const removeObject = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { objectDescription } = req.body; // <-- FIXED HERE
    const image = req.file;
    const plan = req.plan;

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'Limit usage reached, please upgrade your plan.',
      });
    }

    const { public_id } = await cloudinary.uploader.upload(image.path);
    const imgurl = cloudinary.url(public_id, {
      transformation: [
        {
          effect: `gen_remove:${objectDescription}`, // <-- USED HERE
        },
      ],
      resource_type: 'image',
    });

    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES (${userId}, ${`removed ${objectDescription} from image`}, ${imgurl}, 'image')
    `;

    return res.json({ success: true, content: imgurl });

  } catch (error) {
    console.error("AI generation error:", error.message);
    res.json({ success: false, message: error.message });
  }
};




export const reviewResume= async (req, res) => {
  try {
    const { userId } = req.auth();
 
    const  resume  = req.file;
    const plan = req.plan;
   

    if (plan !== 'premium') {
      return res.json({
        success: false,
        message: 'Limit usage reached, please upgrade your plan.',
      });
    }

    if(resume.size>5*1024*1024){
      return res.json({success:false,message:"resume file size exceeds allowed size (5MB)."})
    }
    const dataBuffer=fs.readFileSync(resume.path)
    const pdfData=await pdf(dataBuffer)

    const prompt=`Review the following resume and provide constructive feedback on its strengths,weekness,and areas for improvement. Resume content :\n\n ${pdfData.text}`

        const response = await AI.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const content=response.choices[0].message.content
    await sql`
      INSERT INTO creations(user_id, prompt, content, type)
      VALUES (${userId},'Reviewed the uploaded resume', ${content}, 'resume-review')
    `;

    return res.json({ success: true, content });

  } catch (error) {
    console.error("AI generation error:", error.message);
    res.json({ success: false, message: error.message });
  }
};















