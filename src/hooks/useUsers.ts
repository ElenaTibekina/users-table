import { useEffect, useState } from "react";
import { getUsers } from "../components/Users/api/index";
import type { User } from "../components/Users/api/types";

export const useUsers = (pageSize: number) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getUsers(currentPage, pageSize);
        if (result) {
          setUsers(prev => {
            const uniqueIncomingUsers = result.data.filter(
              (incomingUser) => !prev.some((existingUser) => existingUser.id === incomingUser.id)
            );
            return [...prev, ...uniqueIncomingUsers];
          });
          setTotal(result.total);
        }
      } catch (e) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, pageSize]);

  const loadMore = () => {
    if (!loading && users.length < total) {
      setCurrentPage(prev => prev + 1);
    }
  };

  return { users, loading, error, total, loadMore };
};
