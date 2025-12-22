import { ChangeEvent, UIEvent } from "react";
import { useThrottle } from "../../hooks/useThrottle";
import { Alert, Input, Table } from "antd";
import { columns } from "./columns";
import { useUsers } from "../../hooks/useUsers";
import { useUsersSearch } from "../../hooks/useUsersSearch";
import styles from "./Users.module.css";

const pageSize = 5;

export const Users = () => {
  const { users, loading, error, loadMore } = useUsers(pageSize);
  const { searchQuery, setSearchQuery, filteredUsers } = useUsersSearch(users);

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
  }

  const handleTableScroll = useThrottle((e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight < 50) {
      loadMore();
    }
  }, 300);

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div className={styles.usersWrapper}>
      <Input
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
        scroll={{ y: 350 }}
        onScroll={handleTableScroll}
      />

      {loading && users.length > 0 && (
        <div>Loading...</div>
      )}
    </div>
  );
};
