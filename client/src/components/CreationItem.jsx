import { useState } from 'react'
import './CreationItem.css'
import ReactMarkdown from 'react-markdown'
export const CreationItem = ({item}) => {
    const [expand,setExpand]=useState(false)

  return (
    <div>
    <div onClick={()=>setExpand(!expand)} className='creationitem'>
        <div className="creation-item-info">
            <p className='creation-item-prompt'>{item.prompt}</p>
            <p className='creation-item-type'>{item.type}-{new Date(item.created_at).toLocaleDateString()}</p>
        </div>
        <button className='creation-item-btn'>{item.type}</button>
    </div>
      {expand && (
          <div className='prompt-content-box'>
           {item.type==='image'?
           <img className='image-item' src={item.content} /> :
           <div className='prompt-content'>
            <ReactMarkdown   components={{
                  ul: ({ node, ...props }) => (
                    <ul style={{ listStyleType: 'none', paddingLeft: 0 }} {...props} />
                  ),
                   p: ({ node, ...props }) => (
                    <p style={{ lineHeight: '1.8', marginBottom: '12px' }} {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol style={{ listStyleType: 'none', paddingLeft: 0 }} {...props} />
                  ),
                }}>
                  {item.content}
              </ReactMarkdown></div>
           }
          </div>
       )}
       </div>
  )
}
