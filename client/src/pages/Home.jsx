import { AiTools } from '../components/AiTools'
import Footer from '../components/Footer'
import { Hero } from '../components/Hero'
import { Navbar } from '../components/Navbar'
import { Plan } from '../components/Plan'
import { Testimonial } from '../components/Testimonial'
import './Home.css'

export const Home = () => {
  return (
    <>
    <div className='overall-header'>
       <Navbar/>
       <Hero/>

    </div>
   
    <AiTools/>
    <Testimonial/>
    <Plan/>
    <Footer/>
    </>
  )
}
