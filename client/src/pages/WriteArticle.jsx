import { useState } from 'react'
import './WriteArticle.css'
import axios from 'axios'
import ReactMarkdown from 'react-markdown'
import {Edit, Pen, PenBox, Sparkle, SparkleIcon, Sparkles}from 'lucide-react'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

export const WriteArticle = () => {
 const articleLength=[
  {length:800,text:'short(500-800 words)' },
  {length:1200,text:'medium(800-1200 words)'},
  {length:1500,text:'long(1200+ words)'}
 ]
 const[input,setInput]=useState('')
 const [length,setLength]=useState(articleLength[0])
 const [loading,setLoading]=useState(false)
 const [content,setContent]=useState('')


 const {getToken}=useAuth()

 const submitHandler=async(e)=>{
  e.preventDefault();
  try{
    setLoading(true)
    const prompt=`write an article about ${input} in ${length.text}`
    const token = await getToken();
    const {data} = await axios.post('/api/ai/generate-article', {
      prompt,
      length: length.length
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if(data.success){
      setContent(data.content)
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
  return (
    <div className='write-article-section'>
        <div className='write-aritcle'>
          <div className='w-article-left-portion'>
            <form onSubmit={submitHandler}>
              <div className='w-article-title'><span><Sparkles /></span><h3>Article Configuration</h3></div>
              <p className='w-article-sub-title'>Article topic</p>
              <input className='length-input' type='text' onChange={(e)=>setInput(e.target.value)} value={input}  placeholder='the future of AI'/>
              <p className='w-article-sub-title'>Article length</p>
              <div className='length-option'>
                {articleLength.map((lengthoption,index)=>(
                  <span className={length.text===lengthoption.text?'selectedlength':'length-option-span'} onClick={(e)=>setLength(lengthoption)} key={index}>{lengthoption.text}</span>
                ))}
              </div>
              <button disabled={loading} type='submit' className='gen-article-btn'>{
                loading? <span className='loader'></span> :

              <PenBox/>}Generate Article </button>
              
            </form>
          </div>
          
          <div className='w-article-right-portion'>
            {!content?
             (
              <div className='empty-w-article-page'>
                <div className="generated-article">
                    <Edit className='edit-icon'/>
                    <h3>Generated Article</h3>
                </div>
                <div className="generated-content">
                  <Edit />
                  <p>Enter the Article topic and "click enter" to Get Started</p>

                </div>
            </div>
            ):
                (
                <div className='write-article-result-block'><ReactMarkdown>
                        {content}
                </ReactMarkdown>
              </div>
              )}

          </div>

        </div>
    </div>
  )
}
