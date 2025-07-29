import { useState } from 'react';
import './RemoveBackground.css';
import { Sparkles, FileImage, ImageOff, Eraser } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;

export const RemoveBackground = () => {
  const [file, setFile] = useState(null);
  const [loading,setLoading]=useState(false)
  const [content,setContent]=useState('')

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      setFile(selected);
   
    }
  };

  const {getToken}=useAuth()

  const submitHandler=async(e)=>{
    e.preventDefault();
   try{
    setLoading(true)

    const token = await getToken();
    const formdata=new FormData()
    formdata.append('image',file)
    const {data} = await axios.post('/api/ai/remove-background',formdata, {
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
    <div className="remove-bg-section">
      <div className="remove-bg">
        {/* LEFT PANEL */}
        <form onSubmit={submitHandler} className="rbg-left-portion">
          <div className="rbg-title">
            <span><Sparkles className="rbg-icon" /></span>
            <h3>Background Remover</h3>
          </div>

          <p className="rbg-sub-title">
            Upload an image, PDF, or supported file. We'll remove the background for compatible types.
          </p>

          <input
            type="file"
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="rbg-input"
          />

          <button
            type="submit"
            className="rbg-btn"
            disabled={!file}
          >{loading?
              <span className='loader'></span> :
              <ImageOff className="rbg-icon"  />}
            Remove Background
          </button>
        </form>

        {/* RIGHT PANEL */}
        <div className="rbg-right-portion">
          <div className="rbg-preview">
            <FileImage className="rbg-icon" />
            <h3>Uploaded File Preview</h3>
          </div>
          <div className="rbg-preview-area">
            {content ? (
                <a href={content} target="_blank" rel="noopener noreferrer">
                  <img src={content}  width="100%" height="100%" className="rbg-preview-image" />
                </a>
              ) : (
                <p><Eraser className='eraser-icon'/><br /> No file uploaded yet</p>
              )}

           </div>
        </div>
      </div>
    </div>
  );
};
