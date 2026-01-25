import { createContext, type ReactNode } from "react";
import { useUsers } from "../hooks/useUsers";
import { useUsersSearch } from "../hooks/useUsersSearch";
import type { User } from "../components/Users/api/types";
import { PAGE_VALUES } from "../lib/consts";

interface UsersContextType {
  users: User[]; 
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  loadMore: () => void;
}

export const UsersContext = createContext<UsersContextType | null>(null);

export const UsersProvider = ({ children }: { children: ReactNode }) => {
  const pageSize = PAGE_VALUES.page_size;
  const { users, loading, error, loadMore } = useUsers(pageSize);
  const { searchQuery, setSearchQuery, filteredUsers } = useUsersSearch(users);

  return (
    <UsersContext.Provider value={{ 
      users, 
      filteredUsers, 
      loading, 
      error, 
      searchQuery, 
      setSearchQuery, 
      loadMore 
    }}>
      {children}
    </UsersContext.Provider>
  );
};