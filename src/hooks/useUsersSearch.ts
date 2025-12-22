import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import type { User } from "../components/Users/api/types";

export const useUsersSearch = (users: User[]) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);

  const handleSearch = useDebounce((query: string) => {
    const lowerQuery = query.toLowerCase();
    const filtered = users.filter(user =>
      user.name.toLowerCase().includes(lowerQuery) ||
      user.email.toLowerCase().includes(lowerQuery)
    );
    setFilteredUsers(filtered);
  }, 500);

  useEffect(() => {
    handleSearch(searchQuery);
  }, [users, searchQuery, handleSearch]);

  return { searchQuery, setSearchQuery, filteredUsers };
};
