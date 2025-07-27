import { useState } from 'react';
import './RemoveObject.css';
import { Sparkles, FileImage, ImageOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import axios from 'axios'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;


export const RemoveObject = () => {
  const [file, setFile] = useState(null);
  const [objectDescription, setObjectDescription] = useState('');
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
    formdata.append("objectDescription", objectDescription)

    const {data} = await axios.post('/api/ai/remove-object',formdata, {
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
    <div className="remove-object-section">
      <div className="remove-object-container">
        {/* LEFT PANEL */}
        <form onSubmit={submitHandler} className="left-panel">
          <div className="section-header">
            <Sparkles className="icon-peacock" />
            <h3>Object Remover</h3>
          </div>

          <p className="subtext">Upload an image and describe the object to remove.</p>

          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />

          <textarea
            className="object-textarea"
            placeholder="Describe the object to remove.It should be only one (e.g., 'watch', 'car' ,etc) "
            value={objectDescription}
            onChange={(e) => setObjectDescription(e.target.value)}
            rows={4}
          />

          <button
            type='submit'
            className="remove-btn"
      
            disabled={!file || !objectDescription.trim()}
          >{loading?
              <span className='loader'></span> :
              <ImageOff className="icon-peacock-btn"  />}
         
            Remove Object
          </button>
        </form>

        {/* RIGHT PANEL */}
        <div className="right-panel">
          <div className="preview-header">
            <FileImage className="icon-peacock" />
            <h3>Uploaded File Preview</h3>
          </div>
          <div className="preview-box">
            {content? (
              <embed src={content} type={file?.type} width="100%" height="100%" />
            ) : (
              <p className="no-file-text"><FileImage className='file-img'/>No file uploaded yet.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
