import React from 'react'
import { Link } from 'react-router-dom'
import ROOT_PATH from '../rootPath'

const Repo = ({ repo, owner }) => {
  const { login } = owner
  const { name, description } = repo

  return (
    <div className="Repo">
      <h3>
        <Link to={`${ROOT_PATH}${login}/${name}`}>
          {name}
        </Link>
        {' by '}
        <Link to={`${ROOT_PATH}${login}`}>
          {login}
        </Link>
      </h3>
      {description &&
        <p>{description}</p>
      }
    </div>
  )
}

export default Repo
