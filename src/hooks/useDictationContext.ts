import { useContext } from 'react';
import { DictationContext } from '../contexts/DictationContext';

export const useDictationContext = () => {
  const context = useContext(DictationContext);
  if (context === undefined) {
    throw new Error('useDictationContext must be used within a DictationProvider');
  }
  return context;
};