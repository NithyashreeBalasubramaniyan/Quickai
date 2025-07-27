import { useState } from 'react';
import './ReviewResume.css';
import { FileUp, ScrollText } from 'lucide-react';
import ReactMarkdown from 'react-markdown'
import axios from 'axios'
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

export const ReviewResume = () => {
  const [resumeFile, setResumeFile] = useState(null);
  const [loading,setLoading]=useState(false)
  const [content,setContent]=useState('')

  const handleResumeUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const {getToken}=useAuth()

  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
    setLoading(true)

    const token = await getToken();
    const formdata=new FormData()
    formdata.append('resume',resumeFile)
   

    const {data} = await axios.post('/api/ai/resume-review',formdata, {
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
    <div className="resume-review-section">
      <div className="resume-review-container">
        {/* LEFT PANEL */}
        <form onSubmit={submitHandler} className="left-panel">
          <div className="section-header">
            <FileUp className="icon-pink" />
            <h3>Resume Review Tool</h3>
          </div>

          <p className="subtext">Upload your resume and provide any notes or context.</p>

          <input
            type="file" name='file'
            accept=".pdf,.doc,.docx"
            onChange={handleResumeUpload}
            className="file-input"
          />


          <button
            type="submit"
            className="review-btn"
         
            disabled={!resumeFile}
          >{loading?
              <span className='loader'></span> :
              <ScrollText className="icon-pink-btn"  />}
           
            Review Resume
          </button>
        </form>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="preview-header">
            <ScrollText className="icon-pink" />
            <h3>Resume Preview</h3>
          </div>
          {content ?(
             <div className="reviewed-box">
             
               <div className='reviewed-box'><ReactMarkdown>{content}</ReactMarkdown></div>
             </div>)
            : (
              <div className='preview-box'>
                <p className="no-file-text"><FileUp className='fileup'/><br></br>No resume uploaded yet.</p>
              </div>
              
            )}
       
        </div>
      </div>
    </div>
  );
};
