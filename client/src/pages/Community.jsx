import { useEffect, useState } from 'react';
import './Community.css';
import { Heart } from 'lucide-react';

import {useUser} from '@clerk/clerk-react'
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;


export const Community = () => {
  const [creations, setCreations] = useState([]);
  const {user}=useUser()
  const [loading,setLoading]=useState(true)
  
  const {getToken}=useAuth()
   const fetchCreations = async () => {
    try{
       const token = await getToken();
       const {data}=await axios.get('api/user/get-published-creations', 
      { headers: { Authorization: `Bearer ${token}` } })
      if(data.success){
        setCreations(data.creations)
      }
      else{
          toast.error(data.message)
      }
         
    }
    catch(error){
        toast.error(error.message)

      }
    setLoading(false)
  }  
  useEffect(() => {
    if(user){
         fetchCreations();
    }
  }, [user]);


  const  imgtoggleLike=async(id)=>{
    try{
        const token = await getToken();
        const {data}=await axios.post('api/user/toggle-like-creation',{id},
          { headers: { Authorization: `Bearer ${token}` } } )
        if(data.success){
          toast.success(data.message)
          await fetchCreations()
        }
        else{
          toast.error(data.message)
        }
      }
       catch(error){
        toast.error(error.message)

      } 
  }

  return (
   
      <>
      {!loading ?
      (
         <div className="community-section">
         <h2 className="community-title">Creations</h2>
        <div className="community-gallery">
          {creations.map(item => (
            <div className="community-card" key={item.id}>
              <img src={item.content} className="community-img" alt="AI creation" />
              <div className="community-overlay">
                <p className="community-description">{item.prompt}</p>
                <div className="community-likes">
                  <Heart onClick={()=>imgtoggleLike(item.id)}  className={`heart-icon ${item.likes.includes(user.id)?'fill-color':''}`}/>
                  {item.likes.length}
                </div>
              </div>
              </div>
        ))}
      </div>
      </div>

      ):(
        <div className='community-section-loading'>
          <span className='loader'></span>
        </div>

      )}
      
</>
  )
}
