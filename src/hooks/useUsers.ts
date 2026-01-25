import { useCallback, useEffect, useState } from "react";
import { getUsers } from "../components/Users/api/index";
import type { User } from "../components/Users/api/types";
import { generateFakeUsers } from "../lib/generateUsers";
import { PAGE_VALUES } from "../lib/consts";

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
        
        setUsers(prev => {
          let lastId = prev.length > 0 
            ? Math.max(...prev.map(u => Number(u.id))) 
            : 0;

          const incomingData = result?.data || [];
          
          const uniqueIncoming = incomingData.filter(
            (newU) => !prev.some((existing) => existing.id === newU.id)
          );

          uniqueIncoming.forEach(u => {
            lastId = Math.max(lastId, Number(u.id));
          });

          const fakes = generateFakeUsers(PAGE_VALUES.page_size, lastId);

          return [...prev, ...uniqueIncoming, ...fakes];
        });

        if (result) {
          setTotal(result.total + PAGE_VALUES.fake_users_count); 
        }
      } catch (e) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, pageSize]);

  const loadMore = useCallback(() => {
    if (!loading && users.length < total) {
      setCurrentPage(prev => prev + 1);
    }
  }, [loading, users.length, total]);

  return { users, loading, error, total, loadMore };
};