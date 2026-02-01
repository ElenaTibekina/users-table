import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import type { UsersState } from "../../components/Users/api/types";
import { getUsers } from '../../components/Users/api';
import { generateFakeUsers } from '../../lib/generateUsers';
import { PAGE_VALUES } from '../../lib/consts';
import type { RootState } from '..';

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  total: 0,
  currentPage: 1,
  searchQuery: '',
};

export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async ({ page, pageSize }: { page: number; pageSize: number }) => {
    const result = await getUsers(page, pageSize);
    return result;
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    incrementPage: (state) => {
      state.currentPage += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        const prev = state.users;
        const incomingData = action.payload?.data || [];
        let lastId = prev.length > 0 ? Math.max(...prev.map(u => Number(u.id))) : 0;
        const uniqueIncoming = incomingData.filter(
          (newU) => !prev.some((existing) => existing.id === newU.id)
        );
        
        uniqueIncoming.forEach(u => {
          lastId = Math.max(lastId, Number(u.id));
        });

        const fakes = generateFakeUsers(PAGE_VALUES.page_size, lastId);

        state.users = [...prev, ...uniqueIncoming, ...fakes];
        
        if (action.payload) {
          state.total = action.payload.total + PAGE_VALUES.fake_users_count;
        }
      })
      .addCase(fetchUsers.rejected, (state) => {
        state.loading = false;
        state.error = "Users fetch failed";
      });
  },
});

export const selectFilteredUsers = (state: RootState) => {
  const { users, searchQuery } = state.users;
  if (!searchQuery) return users;
  
  const lowerQuery = searchQuery.toLowerCase();
  return users.filter(user =>
    user.name.toLowerCase().includes(lowerQuery) ||
    user.email.toLowerCase().includes(lowerQuery)
  );
};

export const { setSearchQuery, incrementPage } = usersSlice.actions;
export default usersSlice.reducer;