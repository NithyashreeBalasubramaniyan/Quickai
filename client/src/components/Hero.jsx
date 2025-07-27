import './Hero.css'
import {assets} from '../assets/assets'
import { useNavigate } from 'react-router-dom'
export const Hero = () => {
  const navigate=useNavigate()
  return (
    <div className='hero-section'>
    
        <h1 className='hero-section-title'>Create Amazing content<br/> with <b>AI Tools</b></h1>
         <p className='hero-section-description'>Trnasform your content creation with our suite of premium AI Tools.Write Articles,generate Images and enhance your workflow</p>
         <div className="hero-btn">
          <button onClick={()=>navigate('/ai')} className='start-btn'>Start creating Now</button>
          <button className='demo-btn'>watch Demo</button>
         </div>
         <div className="hero-bottom-section">
          <img src={assets.user_group} />
          <p>Used by 10K+ people</p>
         </div>
    </div>
  )
}
