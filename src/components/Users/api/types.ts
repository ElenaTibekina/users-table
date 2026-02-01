type Address = {
  street: string;
  suite: string;
  city: string;
}

export interface UserDTO {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  address: string;
  phone: string;
  website: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface UsersState {
  users: User[];
  loading: boolean;
  error: string | null;
  total: number;
  currentPage: number;
  searchQuery: string;
}
