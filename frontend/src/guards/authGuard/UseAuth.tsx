import { useContext } from 'react';
import { AuthContext } from '../jwt/JwtContex';
const useAuth = () => useContext(AuthContext);

export default useAuth;