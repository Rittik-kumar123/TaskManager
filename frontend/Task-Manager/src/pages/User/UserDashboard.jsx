import React from 'react'
import { useUserAuth } from '../../hooks/useUserAuth'

const UserDashboard = () => {
  useUserAuth();
  return (
    <div>
      User DAshboard
    </div>
  )
}

export default UserDashboard
