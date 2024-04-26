import {createContext} from 'react';

const UserContext = createContext({
  user: {},
  setUser: (user: any) => {},
});

export default UserContext;
