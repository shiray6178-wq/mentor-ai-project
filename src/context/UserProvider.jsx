import { UserContext } from './UserContext'

export default function UserProvider({ value, children }) {
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>
}
