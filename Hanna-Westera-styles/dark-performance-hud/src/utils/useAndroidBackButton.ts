import { useEffect, useRef } from 'react';
import { App as CapacitorApp } from '@capacitor/app';

// Registering a Capacitor 'backButton' listener hands JS full control of the
// Android back button/gesture, with no built-in OS fallback -- so this only
// subscribes while `active` is true, leaving the OS default (or another
// mounted screen's own listener) in effect the rest of the time.
//
// `onBack` is read from a ref rather than the effect's own dependency array,
// so a priority chain of several booleans (as in Header/ActiveWorkoutModal)
// can close over their latest values without tearing the listener down and
// re-registering it on every one of those state changes -- only transitions
// of `active` itself churn the subscription.
export function useAndroidBackButton(onBack: () => void, active: boolean) {
  const onBackRef = useRef(onBack);
  useEffect(() => {
    onBackRef.current = onBack;
  }, [onBack]);

  useEffect(() => {
    if (!active) return;
    const listenerPromise = CapacitorApp.addListener('backButton', () => onBackRef.current());
    return () => {
      listenerPromise.then((handle) => handle.remove());
    };
  }, [active]);
}
