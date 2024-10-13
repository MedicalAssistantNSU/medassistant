import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from './UseAuth';

const GuestGuard = ({ children }: any) => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return children;
};

export default GuestGuard;