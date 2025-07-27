import './AiTools.css'
import { assets,AiToolsData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
export const AiTools = () => {
  const navigate=useNavigate()
  const {user}=useUser()
  return (
    <div className='ai-tools-explorer'>
        <h1 className='ai-tool-title'>Powerful AI Tools</h1>
        <p className='ai-tool-description'>Everything you need to create,enhance and optimize your content with cutting edge AI Technology</p>
        <div className='ai-blocks'>
        {AiToolsData.map((tool,index)=>{
            return(
           <div onClick={()=>user && navigate(tool.path)} className='ai-box' key={index}>
                <tool.Icon className='tool-icon' style={{background:`linear-gradient(to bottom,${tool.bg.from},${tool.bg.to})`}}/>
                <h3>{tool.title}</h3>
                <p className='tool-desc'>{tool.description}</p>
            </div>
            )
        })}
        </div>
    </div>
  )
}
