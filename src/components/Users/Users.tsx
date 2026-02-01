import { useEffect, type ChangeEvent, type UIEvent } from "react";
import { useThrottle } from "../../hooks/useThrottle";
import { Alert, Input, Table } from "antd";
import { columns } from "./columns";
import styles from "./Users.module.css";

import { useAppDispatch, useAppSelector } from "../../store";
import { fetchUsers, incrementPage, selectFilteredUsers, setSearchQuery } from "../../store/slices/usersSlice";
import { PAGE_VALUES } from "../../lib/consts";

export const Users = () => {
  const dispatch = useAppDispatch();

  const { users, loading, error, searchQuery, currentPage, total } = useAppSelector((state) => state.users);

  const filteredUsers = useAppSelector(selectFilteredUsers);

  useEffect(() => {
    dispatch(fetchUsers({ page: currentPage, pageSize: PAGE_VALUES.page_size }));
  }, [dispatch, currentPage]);

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    dispatch(setSearchQuery(e.target.value));
  }

  const handleTableScroll = useThrottle((e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      if (!loading && users.length < total) {
        dispatch(incrementPage());
      }
    }
  }, 300);

  if (error) {
    return <Alert title={error} type="error" showIcon />;
  }

  return (
    <div className={styles.usersWrapper}>
      <Input
        id="search"
        placeholder="Search by name or email..."
        value={searchQuery}
        onChange={onInputChange}
      />
      <Table
        dataSource={filteredUsers}
        columns={columns}
        rowKey="id"
        pagination={false}
        loading={loading && users.length === 0}
        scroll={{ x: "max-content", y: 500 }}
        onScroll={handleTableScroll}
        tableLayout="fixed"
      />

      {loading && users.length > 0 && (
        <div>Loading...</div>
      )}
    </div>
  );
};
