import {createContext} from 'react';
const LoadingContext = createContext({
  isLoading: false,
  setIsLoading: (value: boolean) => {},
});

export default LoadingContext;
