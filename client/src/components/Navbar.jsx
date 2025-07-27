import './Navbar.css'
import {assets} from '../assets/assets'
import { ArrowRight, User } from 'lucide-react'
import {useClerk,useUser,UserButton} from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

export const Navbar = () => {
    const {user}=useUser()
    const {openSignIn}=useClerk()
    const navigate=useNavigate()
  return (
    <div className='navbar'>
         <img onClick={()=>navigate('/')} className='navbar-logo' src={assets.logo} />
         {
            user? <UserButton/>
            :(
         <button onClick={openSignIn} className='navbar-btn'><p>Get started</p><ArrowRight className='right-arrow'></ArrowRight></button>
            )}
     </div>
  )
}
