import { createContext, useEffect, useReducer } from 'react';

import axios from 'src/utils/axios';
import { isValidToken, setSession } from './Jwt';
import { UserType } from 'src/types/apps/user';
import useAuth from '../authGuard/UseAuth';

// ----------------------------------------------------------------------
export interface InitialStateType {
    isAuthenticated: boolean;
    isInitialized?: boolean;
    user?: any | null | undefined;
    role?: any | null | undefined;
}

const initialState: InitialStateType = {
    isAuthenticated: false,
    isInitialized: false,
    user: null,
    role: null,
};

const handlers: any = {
    INITIALIZE: (state: InitialStateType, action: any) => {
        const { isAuthenticated, user, role } = action.payload;

        return {
            ...state,
            isAuthenticated,
            isInitialized: true,
            user,
            role,
        };
    },
    LOGIN: (state: InitialStateType, action: any) => {
        const { user, role } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
            role,
        };
    },
    LOGOUT: (state: InitialStateType) => ({
        ...state,
        isAuthenticated: false,
        user: null,
    }),
    REGISTER: (state: InitialStateType, action: any) => {
        const { user, role } = action.payload;

        return {
            ...state,
            isAuthenticated: true,
            user,
            role,
        };
    },

    UPDATE_ROLE: (state: InitialStateType, action: any) => {
        const { user, role } = action.payload;

        return {
            ...state,
            user,
            role,
        };
    },
};

const reducer = (state: InitialStateType, action: any) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;

const AuthContext = createContext<any | null>({
    ...initialState,
    platform: 'JWT',
    signup: () => Promise.resolve(),
    signin: () => Promise.resolve(),
    logout: () => Promise.resolve(),
});

function AuthProvider({ children }: { children: React.ReactElement }) {
    const [state, dispatch] = useReducer(reducer, initialState);

    const initialize = async () => {
        try {
            const accessToken = window.localStorage.getItem('accessToken');

            if (accessToken && isValidToken(accessToken)) {
                setSession(accessToken);

                const response = await axios.get('api/v1/account/my-account', {
                    headers: {
                        'Content-type': 'application/json',
                    },
                });

                const user = response.data;
                console.log(user);


                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: true,
                        user,
                    },
                });
            } else {
                dispatch({
                    type: 'INITIALIZE',
                    payload: {
                        isAuthenticated: false,
                        user: null,
                        role: null,
                    },
                });
            }
        } catch (err) {
            console.error(err);
            dispatch({
                type: 'INITIALIZE',
                payload: {
                    isAuthenticated: false,
                    user: null,
                    role: null,
                },
            });
        }
    };

    useEffect(() => {
        initialize();
    }, []);

    const signin = async (email: string, password: string) => {
        const response = await axios.post('/auth/sign-in', {
            email,
            password,
        });
        const { user, access_token } = response.data;
        setSession(access_token);

        dispatch({
            type: 'LOGIN',
            payload: {
                user,
                role: resp.data,
            },
        });
    };

    const signup = async (email: string, password: string) => {
        const data = JSON.stringify({
            email: email,
            password: password,
            role: 'STUDENT',
        });
        const response1 = await axios.post('/auth/sign-up', data, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { access_token, user } = response1.data;

        window.localStorage.setItem('accessToken', access_token);
        

        dispatch({
            type: 'REGISTER',
            payload: {
                user,
                role: resp.data,
            },
        });
    };

    const logout = async () => {
        setSession(null);
        dispatch({ type: 'LOGOUT' });
    };

    return (
        <AuthContext.Provider
            value={{
                ...state,
                method: 'jwt',
                signin,
                logout,
                signup,
                update_student,
                update_teacher,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };