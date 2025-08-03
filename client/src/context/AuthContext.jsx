// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);


  useEffect(() => {
  const token = localStorage.getItem('token');
  
  //console.log('[로컬스토리지 토큰]', token);
  if (token) {
    try {
      const decoded = jwtDecode(token);
      
      //console.log('[디코딩된 유저]', decoded);
      setUser(decoded);
    } catch (err) {
      //console.error('토큰 디코딩 실패:', err);
    }
  }
}, []);

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
