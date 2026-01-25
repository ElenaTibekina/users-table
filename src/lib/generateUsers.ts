import { faker } from '@faker-js/faker';
import type { User } from '../components/Users/api/types';

export const generateFakeUsers = (count: number, startIndex: number): User[] => {
  return Array.from({ length: count }, (_, index) => ({
    id: startIndex + index + 1,
    name: faker.person.fullName(),
    email: faker.internet.email(),
    address: `${faker.location.streetAddress()}`,
    phone: faker.phone.number(),
    website: faker.internet.url(),
  }));
};
