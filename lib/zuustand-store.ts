import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  isDropdownOpen: boolean;
  isWithdrawDropdownOpen: boolean;
  toggleSidebar: () => void;
  toggleDropdown: () => void;
  toggleWithdrawDropdown: () => void;
  setDropdownOpen: (isOpen: boolean) => void; // Added function to set dropdown state
  setWithdrawDropdownOpen: (isOpen: boolean) => void; // Added function to set withdraw dropdown state
}

const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: false,
  isDropdownOpen: false,
  isWithdrawDropdownOpen: false,
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
  toggleDropdown: () =>
    set((state) => ({ isDropdownOpen: !state.isDropdownOpen })),
  toggleWithdrawDropdown: () =>
    set((state) => ({
      isWithdrawDropdownOpen: !state.isWithdrawDropdownOpen,
    })),
  setDropdownOpen: (isOpen: boolean) => set({ isDropdownOpen: isOpen }),
  setWithdrawDropdownOpen: (isOpen: boolean) =>
    set({ isWithdrawDropdownOpen: isOpen }),
}));

export default useSidebarStore;

// lib/zustandStore.ts
import { InvestmentStatusEnum, InvestmentPlanName } from "@prisma/client";

interface DataTableStore {
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  sort: string;
  setSort: (sort: string) => void;
  order: string;
  setOrder: (order: string) => void;
  statusFilter: InvestmentStatusEnum | "";
  setStatusFilter: (status: InvestmentStatusEnum | "") => void;
  planFilter: InvestmentPlanName | "";
  setPlanFilter: (plan: InvestmentPlanName | "") => void;
}

export const useDataTableStore = create<DataTableStore>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
  page: 1,
  setPage: (page) => set({ page }),
  sort: "",
  setSort: (sort) => set({ sort }),
  order: "",
  setOrder: (order) => set({ order }),
  statusFilter: "",
  setStatusFilter: (status) => set({ statusFilter: status }),
  planFilter: "",
  setPlanFilter: (plan) => set({ planFilter: plan }),
}));

// lib/zustandStore.ts

interface UserDataTableStore {
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  sort: string;
  setSort: (sort: string) => void;
  order: string;
  setOrder: (order: string) => void;
}

export const useUserDataTableStore = create<UserDataTableStore>((set) => ({
  search: "",
  setSearch: (search) => set({ search }),
  page: 1,
  setPage: (page) => set({ page }),
  sort: "",
  setSort: (sort) => set({ sort }),
  order: "",
  setOrder: (order) => set({ order }),
}));

import { WithdrawalStatus } from "@prisma/client";

interface WithdrawalDataTableStore {
  search: string;
  setSearch: (search: string) => void;
  page: number;
  setPage: (page: number) => void;
  sort: string;
  setSort: (sort: string) => void;
  order: string;
  setOrder: (order: string) => void;
  statusFilter: WithdrawalStatus | "";
  setStatusFilter: (status: WithdrawalStatus | "") => void;
}

export const useWithdrawalDataTableStore = create<WithdrawalDataTableStore>(
  (set) => ({
    search: "",
    setSearch: (search) => set({ search }),
    page: 1,
    setPage: (page) => set({ page }),
    sort: "",
    setSort: (sort) => set({ sort }),
    order: "",
    setOrder: (order) => set({ order }),
    statusFilter: "",
    setStatusFilter: (status) => set({ statusFilter: status }),
  })
);

interface Notification {
  type: "Deposit" | "Withdrawal" | "Profit";
  description: string;
  icon: JSX.Element;
  classNames: string;
  color: string;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
    })),
}));

// import { persist, StorageValue } from "zustand/middleware";
// import superjson from "superjson";

// interface InvestmentData {
//   userBalance: number;
//   withdrawableBalance: number;
//   totalProfit: number;
//   totalWithdrawal: number;
//   profitLast24Hours: number;
// }

// interface CachedData {
//   data: InvestmentData;
//   timestamp: number;
//   cacheDuration: number;
// }

// interface CachedDataState {
//   cachedData: CachedData | null;
//   setCachedData: (data: InvestmentData, cacheDuration: number) => void;
//   clearCachedData: () => void;
// }

// export const useCachedDataStore = create<CachedDataState>()(
//   persist(
//     (set) => ({
//       cachedData: null,
//       setCachedData: (data, cacheDuration) => {
//         const timestamp = new Date().getTime();
//         const dataWithExpiry = { data, timestamp, cacheDuration };
//         const stringValue = superjson.stringify(dataWithExpiry);
//         sessionStorage.setItem("investment-data-storage", stringValue);
//         set({ cachedData: dataWithExpiry });
//       },
//       clearCachedData: () => {
//         sessionStorage.removeItem("investment-data-storage");
//         set({ cachedData: null });
//       },
//     }),
//     {
//       name: "investment-data-storage",
//       storage: {
//         getItem: (
//           name: string
//         ):
//           | StorageValue<CachedDataState>
//           | Promise<StorageValue<CachedDataState> | null>
//           | null => {
//           const item = sessionStorage.getItem(name);
//           if (item) {
//             const parsedItem = superjson.parse(
//               item
//             ) as StorageValue<CachedDataState> & {
//               timestamp: number;
//               cacheDuration: number;
//             };
//             const currentTime = new Date().getTime();
//             if (currentTime - parsedItem.timestamp > parsedItem.cacheDuration) {
//               sessionStorage.removeItem(name);
//               return null;
//             }
//             return parsedItem;
//           }
//           return null;
//         },
//         setItem: (name, value) => {
//           const stringValue = superjson.stringify(value);
//           sessionStorage.setItem(name, stringValue);
//         },
//         removeItem: (name) => {
//           sessionStorage.removeItem(name);
//         },
//       },
//     }
//   )
// );

import { StorageValue, persist } from "zustand/middleware";
import superjson from "superjson";

interface InvestmentData {
  userBalance: number;
  withdrawableBalance: number;
  totalProfit: number;
  totalWithdrawal: number;
  profitLast24Hours: number;
}

interface CachedData {
  data: InvestmentData;
  timestamp: number;
  cacheDuration: number;
  lastRedirectTime: number | null; // Timestamp of the last redirect
}

interface CachedDataState {
  cachedData: CachedData | null;
  setCachedData: (data: InvestmentData, cacheDuration: number) => void;
  clearCachedData: () => void;
  updateRedirectTime: (timestamp: number) => void;
}

export const useCachedDataStore = create<CachedDataState>()(
  persist(
    (set) => ({
      cachedData: null,
      setCachedData: (data, cacheDuration) => {
        const timestamp = new Date().getTime();
        const lastRedirectTime = null;
        const dataWithExpiry = {
          data,
          timestamp,
          cacheDuration,
          lastRedirectTime,
        };
        const stringValue = superjson.stringify(dataWithExpiry);
        localStorage.setItem("investment-data-storage", stringValue);
        set({ cachedData: dataWithExpiry });
      },
      clearCachedData: () => {
        localStorage.removeItem("investment-data-storage");
        set({ cachedData: null });
      },
      updateRedirectTime: (timestamp) => {
        set((state) => {
          if (state.cachedData) {
            const updatedData = {
              ...state.cachedData,
              lastRedirectTime: timestamp,
            };
            const stringValue = superjson.stringify(updatedData);
            localStorage.setItem("investment-data-storage", stringValue);
            return { cachedData: updatedData };
          }
          return state;
        });
      },
    }),
    {
      name: "investment-data-storage",
      storage: {
        getItem: (
          name: string
        ):
          | StorageValue<CachedDataState>
          | Promise<StorageValue<CachedDataState> | null>
          | null => {
          const item = localStorage.getItem(name);
          if (item) {
            const parsedItem = superjson.parse(
              item
            ) as StorageValue<CachedDataState> & {
              timestamp: number;
              cacheDuration: number;
              lastRedirectTime: number | null;
            };
            const currentTime = new Date().getTime();
            if (currentTime - parsedItem.timestamp > parsedItem.cacheDuration) {
              localStorage.removeItem(name);
              return null;
            }
            return parsedItem;
          }
          return null;
        },
        setItem: (name, value) => {
          const stringValue = superjson.stringify(value);
          localStorage.setItem(name, stringValue);
        },
        removeItem: (name) => {
          localStorage.removeItem(name);
        },
      },
    }
  )
);
