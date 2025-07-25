import { useState, ReactNode } from 'react';
import { DictationContext } from './DictationContext';

export const DictationProvider = ({ children }: { children: ReactNode }) => {
  const [isDictationInProgress, setIsDictationInProgress] = useState(false);

  return (
    <DictationContext.Provider value={{ isDictationInProgress, setIsDictationInProgress }}>
      {children}
    </DictationContext.Provider>
  );
};