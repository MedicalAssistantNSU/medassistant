import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './UseAuth';

const AuthGuard = ({ children }: any) => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return children;
};

export default AuthGuard;