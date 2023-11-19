import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Account {
  profile: {
    colorA: string;
    colorB: string;
    icon: string;
  };
}

export type AccountWithToken = Account & {
  sessionId: string;
  userId: string;
  token: string;
  seed: string;
  deviceName: string;
};

interface AuthStore {
  account: null | AccountWithToken;
  backendUrl: null | string;
  proxySet: null | string[]; // TODO actually use these settings
  removeAccount(): void;
  setAccount(acc: AccountWithToken): void;
  updateDeviceName(deviceName: string): void;
  updateAccount(acc: Account): void;
}

export const useAuthStore = create(
  persist(
    immer<AuthStore>((set) => ({
      account: null,
      backendUrl: null,
      proxySet: null,
      setAccount(acc) {
        set((s) => {
          s.account = acc;
        });
      },
      removeAccount() {
        set((s) => {
          s.account = null;
        });
      },
      updateAccount(acc) {
        set((s) => {
          if (!s.account) return;
          s.account = {
            ...s.account,
            ...acc,
          };
        });
      },
      updateDeviceName(deviceName) {
        set((s) => {
          if (!s.account) return;
          s.account.deviceName = deviceName;
        });
      },
    })),
    {
      name: "__MW::auth",
    }
  )
);
