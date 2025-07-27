import { Routes,Route} from "react-router-dom"
import {Home} from '../src/pages/Home'
import {Layout} from '../src/pages/Layout'
import {Dashboard} from '../src/pages/Dashboard'
import {WriteArticle} from '../src/pages/WriteArticle'
import {RemoveBackground} from '../src/pages/RemoveBackground'
import {RemoveObject} from '../src/pages/RemoveObject'
import {GenerateImage} from '../src/pages/GenerateImage'
import {Community} from '../src/pages/Community'
import {Blogtitles} from '../src/pages/Blogtitles'
import {ReviewResume} from '../src/pages/ReviewResume'
import { useAuth } from "@clerk/clerk-react"
import { useEffect } from "react"
import {Toaster} from 'react-hot-toast'

function App() {
  
  return (
    <>
    <Toaster/>
    <Routes>
      <Route path='/' element={<Home />} />
      <Route path='/ai' element={<Layout />}>
        <Route index element={<Dashboard/>}/>
        <Route path='write-article' element={<WriteArticle />}/>
        <Route path='blog-titles' element={<Blogtitles/> }/>
        <Route path='generate-images' element={<GenerateImage />}/>
        <Route path='remove-background' element={<RemoveBackground />}/>
        <Route path='remove-object' element={<RemoveObject />}/>
        <Route path='review-resume' element={<ReviewResume />}/>
         <Route path='community' element={<Community />}/>

      </Route>

    </Routes>
   
    </>
  )
}

export default App
