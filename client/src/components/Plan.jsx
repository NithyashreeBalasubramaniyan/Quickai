import './Plan.css'
import { PricingTable } from '@clerk/clerk-react'
export const Plan = () => {
  return (
    <div className='plan-container'>
        <h1>Choose your plan</h1>
        <p>start for free and scale up as you find perfect plan for your content creation needs</p>
        <div className="pricing-box">
                 <PricingTable />
        </div>
        
    </div>
  )
}
