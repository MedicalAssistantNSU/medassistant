import { createContext, useEffect, useReducer } from 'react';

// utils
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import axios from 'src/utils/axios';
import { isValidToken, setSession } from './Jwt';
import toast from 'react-hot-toast';
import { resetStore } from 'src/store/Store';

// ----------------------------------------------------------------------
export interface InitialStateType {
  isAuthenticated: boolean;
  isInitialized?: boolean;
  user?: any | null | undefined;
}

const initialState: InitialStateType = {
  isAuthenticated: false,
  isInitialized: false,
  user: null,
};

const handlers: any = {
  INITIALIZE: (state: InitialStateType, action: any) => {
    const { isAuthenticated, user } = action.payload;

    return {
      ...state,
      isAuthenticated,
      isInitialized: true,
      user,
    };
  },
  LOGIN: (state: InitialStateType, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
    };
  },
  LOGOUT: (state: InitialStateType) => ({
    ...state,
    isAuthenticated: false,
    user: null,
  }),
  REGISTER: (state: InitialStateType, action: any) => {
    const { user } = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user,
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

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem('accessToken');

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await axios.get('/api/v1/account/my-account', {
            headers: {
                'Content-type': 'application/json',
                'Authorization': "Bearer " + accessToken,
            }});
          const user = response.data.user;
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: true,
              user: user,
            },
          });
        } else {
          dispatch({
            type: 'INITIALIZE',
            payload: {
              isAuthenticated: false,
              user: null,
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
          },
        });
      }
    };

    initialize();
  }, []);

  const signin = async (email: string, password: string) => {
    dispatch(resetStore())
    const response = await axios.post('/auth/sign-in', {
      "username": email,
      "password": password,
    });
    const { accessToken, user } = response.data;
    setSession(accessToken);
    toast.success("Добро пожаловать.")
    dispatch({
      type: 'LOGIN',
      payload: {
        user,
      },
    });
  };

  const signup = async (email: string, password: string, name: string) => {
    dispatch(resetStore())
    const response = await axios.post('/auth/sign-up', {
      "username": email,
      "name": name,
      "password": password,
    });
    const data = response.data;
    const user = data.user
    setSession(data.accessToken);
    toast.success("Добро пожаловать.")
    dispatch({
      type: 'REGISTER',
      payload: {
        user,
      },
    });
  };

  const logout = async () => {
    dispatch(resetStore())
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
