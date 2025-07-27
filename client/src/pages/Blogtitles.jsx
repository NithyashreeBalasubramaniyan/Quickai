import { useState } from 'react';
import './Blogtitles.css';
import axios from 'axios';
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown'
import { PenBox, Sparkles, Edit } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';

export const Blogtitles = () => {
  const blogCategories = [
    'General',
    'Technology',
    'Business',
    'Health',
    'Lifestyle',
    'Education',
    'Traversal',
    'Food'
  ];

  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState(blogCategories[0]);
  const [loading,setLoading]=useState(false)
 const [content,setContent]=useState('')

 const {getToken}=useAuth()
 const submitHandler=async(e)=>{
  e.preventDefault();
  
  try{
    setLoading(true)
    const prompt = `Generate a blog title for the keyword ${topic} in category ${category}`;
    const token = await getToken();
    const {data} = await axios.post('/api/ai/generate-blog-title', { prompt }, {
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
    <div className='blog-title-section'>
      <div className='blog-title-container'>
        <div className='left-panel'>
          <form onSubmit={submitHandler}>
            <div className='section-header'>
              <span><Sparkles /></span>
              <h3>Blog Title Configuration</h3>
            </div>

            <p className='form-label'>Blog Topic</p>
            <input
              className='input-field'
              type='text'
              onChange={(e) => setTopic(e.target.value)}
              value={topic}
              placeholder='e.g., Future of Artificial Intelligence'
            />

            <p className='form-label'>Blog Category</p>
            <div className='category-options'>
              {blogCategories.map((cat, index) => (
                <span
                  key={index}
                  className={category === cat ? 'selected-category' : 'category-badge'}
                  onClick={() => setCategory(cat)}
                >
                  {cat}
                </span>
              ))}
            </div>

            <button type='submit' disabled={loading} className='generate-btn'>{loading?
              <span className='loader'></span> :
              <PenBox />} Generate Blog Title
            </button>
          </form>
        </div>

        <div className='right-panel'>
          {!content ? (
            <div className='empty-w-article-page'>
               <div className="generated-header">
                  <Edit className='icon-purple' />
                  <h3>Generated Blog Title</h3>
                  </div>
                  <div className="generated-output">
                    <Edit />
                    <p>Enter a topic and select a category to get started.</p>
                  </div>
              </div>
          ):(
            <div className='write-article-result-block'><ReactMarkdown>{content}</ReactMarkdown></div>
          )}
         
        </div>
      </div>
    </div>
  );
};
