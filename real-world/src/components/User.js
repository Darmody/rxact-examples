import React from 'react'
import { Link } from 'react-router-dom'
import ROOT_PATH from '../rootPath'

const User = ({ user }) => {
  const { login, avatarUrl, name } = user

  return (
    <div className="User">
      <Link to={`${ROOT_PATH}${login}`}>
        <img src={avatarUrl} alt={login} width="72" height="72" />
        <h3>
          {login} {name && <span>({name})</span>}
        </h3>
      </Link>
    </div>
  )
}

export default User
