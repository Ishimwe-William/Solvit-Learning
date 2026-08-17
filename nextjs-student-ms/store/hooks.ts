import { RootState, AppDispatch, initialRootState } from "./store";

// Placeholder hooks for Redux state
export const useAppSelector = <T>(selector: (state: RootState) => T): T => {
  return selector(initialRootState);
};

export const useAppDispatch = (): AppDispatch => {
  return (action: any) => action;
};
