import React, { createContext, useContext, useEffect, useRef } from "react";

const FocusManagerContext = createContext<
  ((element: HTMLElement | null) => void) | null
>(null);

type Props = React.PropsWithChildren<{
  dependencies?: any;
}>;

export const FocusManagerProvider: React.FC<Props> = ({
  children,
  dependencies,
}) => {
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  // Restore focus when dependencies change
  useEffect(() => {
    if (lastFocusedRef.current) {
      console.log("Restoring focus to:", lastFocusedRef.current);
      lastFocusedRef.current.focus();
    }
  }, [dependencies]);

  // Context value: set the element to focus
  const setFocusElement = (element: HTMLElement | null) => {
    lastFocusedRef.current = element;
  };

  return (
    <FocusManagerContext.Provider value={setFocusElement}>
      {children}
    </FocusManagerContext.Provider>
  );
};

export function useFocusManager() {
  const setFocusedElement = useContext(FocusManagerContext);
  if (!setFocusedElement) {
    throw new Error(
      "useFocusManager must be used within a FocusManagerProvider",
    );
  }
  return setFocusedElement;
}
