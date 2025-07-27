import './Dashboard.css'

import { useEffect, useState } from 'react'
import { Sparkle,Gem } from 'lucide-react'

import { CreationItem } from '../components/CreationItem'

import {Protect, useUser} from '@clerk/clerk-react'
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;


export const Dashboard = () => {
  const [creation,setCreation]=useState([]) 
  const [loading,setLoading]=useState(true)
   const {user}=useUser()
  const {getToken}=useAuth()


  const getDashboard=async()=>{
     try{
       const token = await getToken();
       const {data}=await axios.get('api/user/get-user-creation', 
      { headers: { Authorization: `Bearer ${token}` } })
      if(data.success){
        setCreation(data.creations)
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



  useEffect(()=>{
    getDashboard()
  },[user])
 
  return (
    <div className='dashboard'>
      <div className="dashboard-head">
        <div className="dashboard-comp">
          <div className="dashboard-comp-head">
                     <p className='dashboard-title'>Total Creation</p>
                     <p className='dashboard-info'>{creation.length}</p>
          </div>
          <Sparkle className='sparkle' />
          
        </div>
        <div className="dashboard-comp">
          <div className="dashboard-comp-head">
                     <p className='dashboard-title'>Active Plan</p>
                     <p className='dashboard-info'>
                      <Protect plan='premium' fallback='free'>Premium</Protect>
                      </p>
          </div>
          <Gem className='gem' />
          
        </div>
      </div>
      <div className='recent-creation-block' >
        {!loading?(
          <div> <p className='recent-creation-title'>Recent Creations</p>
        {creation.map((item)=>(
          <CreationItem key={item.id} item={item}/>
        ))}</div>
        ):(<div className='loader-in-dashboard'>
          <span className='loader'></span>
        </div>)}
       
      </div>
    </div>
  )
}
