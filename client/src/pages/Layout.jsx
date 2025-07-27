import './Layout.css'
import { Outlet, useNavigate } from 'react-router-dom'
import { Sidebar } from '../components/Sidebar'
import { assets } from '../assets/assets'
import { Menu } from 'lucide-react'
import { useState } from 'react'
export const Layout = () => {
  const [show,setShow]=useState(false)
  const navigate=useNavigate()
  return (
    <>
    <div className="layout-header">
      <Menu onClick={()=>setShow(!show)} className='menu-icon'/>
      <img onClick={()=>navigate('/')} className='logo-layout' src={assets.logo}/>
     

    </div>
    
    <div className='layout-main'>
    <Sidebar show={show} />  
    <Outlet/>
       
    </div>
    </>

  )
}
