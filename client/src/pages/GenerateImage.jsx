import { useState } from 'react';
import './GenerateImage.css';
import { ImagePlus, Sparkles, Image } from 'lucide-react';
import { useAuth } from '@clerk/clerk-react';
import toast from 'react-hot-toast';
import axios from 'axios'
axios.defaults.baseURL=import.meta.env.VITE_BASE_URL;


export const GenerateImage = () => {
  const imageStyles = [
    'Realistic', 'Ghibli Style', 'Cartoon Style',
    'Anime Style', 'Fantasy', '3D Style', 'Portrait'
  ];
 
  const [promptinp, setPromptinp] = useState('');
  const [style, setStyle] = useState(imageStyles[0]);
  const [isPublic, setIsPublic] = useState(false);
  const [loading,setLoading]=useState(false)
  const [content,setContent]=useState('')
   
  
  const {getToken}=useAuth()

  const submitHandler=async(e)=>{
    e.preventDefault();
    try{
    setLoading(true)
    const prompt = `Generate a image for the prompt- ${promptinp} in the style ${style}`;
    const token = await getToken();
    const {data} = await axios.post('/api/ai/generate-image', { prompt,publish: isPublic }, {
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
    <div className='generate-img-section'>
      <div className='generate-img-container'>
        <div className='generate-img-left-panel'>
          <form onSubmit={submitHandler}>
            <div className='generate-img-header'>
              <span><Sparkles /></span>
              <h3>Image Generation Settings</h3>
            </div>

            <p className='generate-img-label'>Describe your Image</p>
            <textarea
              className='generate-img-textarea'
              rows="4"
              placeholder='e.g., A futuristic city with flying cars and neon lights...'
              value={promptinp}
              onChange={(e) => setPromptinp(e.target.value)}
            />

            <p className='generate-img-label'>Select Style</p>
            <div className='generate-img-style-options'>
              {imageStyles.map((styleOption, index) => (
                <span
                  key={index}
                  className={
                    style === styleOption
                      ? 'generate-img-style-selected'
                      : 'generate-img-style-badge'
                  }
                  onClick={() => setStyle(styleOption)}
                >
                  {styleOption}
                </span>
              ))}
            </div>

            {/* Toggle Switch */}
            <div className='toggle-container'>
              <label className='toggle-label'>
                <input
                  type='checkbox'
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                />
                <span className='slider'></span>
                <span className='toggle-text'>
                  {isPublic ? 'Public Image' : 'Private Image'}
                </span>
              </label>
            </div>

            <button type='submit' className='generate-img-btn'>{loading?
              <span className='loader'></span> :
              <ImagePlus />}
               Generate Image
            </button>
          </form>
        </div>

        <div className='generate-img-right-panel'>
          {!content?(
            <div className='empty-w-article-page'> 
                <div className="generate-img-result-header">
                <Image className='generate-img-icon' />
                <h3>Generated Image</h3>
                </div>
                <div className="generate-img-output">
                <Image />
                <p>Describe a scene and choose a style to begin!</p>
              </div>
          </div>

          ):(
            <div className='write-article-result-block'>
                <a href={content} target="_blank" rel="noopener noreferrer">

                    <img className='output-img' src={content} />
                </a>
            </div>

          )}
          
        </div>
      </div>
    </div>
  );
};

