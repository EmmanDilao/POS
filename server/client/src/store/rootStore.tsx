import { createContext, useContext } from "react";
import AuthStore from "./authStore";
import CustomerStore from "./customerStore";
import DialogStore from "./DialogStore";

if (import.meta.env.MODE === "development") {
  import("mobx-logger").then(({ enableLogging }) => {
    enableLogging();
  });
}

export interface IRootStore {
  authStore: AuthStore;
  customerStore: CustomerStore;
  dialogStore: DialogStore;
  handleError: Function;
}

export class RootStore implements IRootStore {
  authStore: AuthStore;
   customerStore: CustomerStore;
   dialogStore: DialogStore;
  constructor() {
    console.log("RootStore");
    this.authStore = new AuthStore(this);
    this.customerStore = new CustomerStore(this);
    this.dialogStore = new DialogStore(this);
  }

  public handleError = (
    errorCode: number | null = null,
    errorMessage: string,
    errorData: any
  ) => {
    console.error("HandleError: ", errorData);
    if (errorCode === 403) {
      this.authStore.setIsAuthenticated(false);
      return null;
    }
  };
}

const rootStoreContext = createContext({
  rootStore: new RootStore(),
});

export const useStore = () => useContext(rootStoreContext);
