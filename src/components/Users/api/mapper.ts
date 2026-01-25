import type { User, UserDTO } from "./types";

export function transformUser(dto: UserDTO): User {
  return {
    id: dto.id,
    name: `${dto.name} (@${dto.username})`,
    email: dto.email,
    address: `${dto.address.city}, ${dto.address.street}, ${dto.address.suite}`,
    phone: dto.phone,
    website: dto.website
  };
}
