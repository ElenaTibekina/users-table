import { useContext, type ChangeEvent, type UIEvent } from "react";
import { useThrottle } from "../../hooks/useThrottle";
import { Alert, Input, Table } from "antd";
import { columns } from "./columns";
import styles from "./Users.module.css";
import { UsersContext } from "../../store/UsersContext";

export const Users = () => {
  const usersCtx = useContext(UsersContext);

  if (!usersCtx) return null;

  const { users, loading, error, loadMore, searchQuery, setSearchQuery, filteredUsers } = usersCtx;

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setSearchQuery(value);
  }

  const handleTableScroll = useThrottle((e: UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = e.currentTarget;
    if (scrollHeight - scrollTop - clientHeight <= 250) {
      loadMore();
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
