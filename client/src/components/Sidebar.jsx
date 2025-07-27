import { Eraser, FileText, Hash, House, Icon, Image, LogOut, Scissors, SquarePen, User } from 'lucide-react'
import './Sidebar.css'
import { useUser,useClerk, Protect } from '@clerk/clerk-react'
import { NavLink } from 'react-router-dom'
export const Sidebar = ({show}) => {
    const {user}=useUser()
     const {openUserProfile,signOut}=useClerk()
    const navItems=[
        {to:'/ai', label:'Dashboard',Icon:House},
        {to:'/ai/write-article', label:'Write Articles',Icon:SquarePen},
        {to:'/ai/blog-titles', label:'Blog titles',Icon:Hash},
         {to:'/ai/generate-images', label:'Image Generate',Icon:Image},
         {to:'/ai/remove-background', label:'Background removal',Icon:Eraser},
        {to:'/ai/remove-object', label:'Object removal',Icon:Scissors},
         {to:'/ai/review-resume', label:'Resume review',Icon:FileText},
          {to:'/ai/community', label:'Community',Icon:User}
    ]
    
  return user ? (
  <div className={`sidebar ${show ? 'show-sidebar' : ''}`}>
    <div>
      <div className="user-info">
          <img onClick={openUserProfile} className="user-img" src={user.imageUrl} />
          <p className="user-fullname">{user.fullName}</p>
      </div>

      <div className="navitem-container">
      {navItems.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/ai'}
          className={({ isActive }) =>
            `navlink-items ${isActive ? 'active-box' : ''}`
          }
        >
          <Icon />
          <p>{label}</p>
        </NavLink>
      ))}
      </div>
    </div> 
 

    <div className="sidebar-footer">
      <img className="user-img" src={user.imageUrl} />
      <div className="flex-col">
        <p className="sidebar-footer-user-name">{user.firstName}</p>
        <div className="flex-row">
          <p className="plan-status">
              {user?.publicMetadata?.plan || 'Free'} plan
          </p>
          <LogOut className="logout-icon" onClick={signOut} />
        </div>
      </div>
    </div>
  </div>

  ) : null
}