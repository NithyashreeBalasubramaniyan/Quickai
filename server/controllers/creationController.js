import sql from "../config/db.js"

export const getUSerCreation=async(req,res)=>{
    try{
        const {userId}=req.auth()
        const creations=await sql `SELECT * FROM creations WHERE user_id=${userId} ORDER BY created_at DESC`
        res.json({success:true,creations})

    }
    catch(error){
        res.json({success:true,message:error.message})

    }
}
export const getPublishedCreation=async(req,res)=>{
    try{
        
        const creations=await sql `SELECT * FROM creations WHERE publish=true ORDER BY created_at DESC`
        res.json({success:true,creations})

    }
    catch(error){
        res.json({success:true,message:error,message})

    }
}

export const toggleLikeCreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;
    
    const [creation] = await sql`SELECT * FROM creations WHERE id = ${id}`;
    if (!creation) {
      return res.json({ success: false, message: 'creation not found' });
    }

    const currentlikes = creation.likes; // or creation.currentlikes if that's your column
    const userIdStr = userId.toString();

    let updateLikes;
    let message;

    if (currentlikes.includes(userIdStr)) {
      updateLikes = currentlikes.filter(user => user !== userIdStr);
      message = 'creation Unliked';
    } else {
      updateLikes = [...currentlikes, userIdStr];
      message = 'creation Liked';
    }

    const formatedArray = `{${updateLikes.join(',')}}`;

    await sql`UPDATE creations SET likes = ${formatedArray}::text[] WHERE id = ${id}`;

    res.json({ success: true, message });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
