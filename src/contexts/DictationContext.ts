import { createContext } from 'react';

export const DictationContext = createContext<{
  isDictationInProgress: boolean;
  setIsDictationInProgress: (inProgress: boolean) => void;
} | undefined>(undefined);