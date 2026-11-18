import { useState, useEffect } from 'react';
import { saveData, loadData } from '../lib/storage';

export function usePersistedState(key, initialValue) {
  const [value, setValue] = useState(initialValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    loadData(key, initialValue).then((stored) => {
      setValue(stored);
      setLoaded(true);
    });
  }, []);

  useEffect(() => {
    if (loaded) saveData(key, value);
  }, [value, loaded]);

  return [value, setValue];
}
