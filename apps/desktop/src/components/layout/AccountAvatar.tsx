import React from 'react'
import { useAuthStore } from '../../core/store/authStore'

export const AccountAvatar = () => {
  const { user, logout } = useAuthStore()

  if (!user) return null

  return (
    <div className="account-avatar">
      <div className="user-info">
        {user.avatar_url && <img src={user.avatar_url} alt={user.name} className="avatar-img" />}
        <span className="username">{user.name}</span>
      </div>
      <button className="logout-link" onClick={logout}>Logout</button>

      <style>{`
        .account-avatar {
          display: flex;
          align-items: center;
          gap: 1rem;
        }
        .user-info {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        .avatar-img {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 0.5px solid rgba(255, 255, 255, 0.1);
        }
        .username {
          font-size: 0.75rem;
          color: #888888;
          font-family: 'Inter', sans-serif;
        }
        .logout-link {
          background: transparent;
          border: none;
          color: #444444;
          font-size: 0.6rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          padding: 0;
        }
        .logout-link:hover {
          color: #ff4444;
        }
      `}</style>
    </div>
  )
}
