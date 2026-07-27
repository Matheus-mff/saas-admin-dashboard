import { users as initialUsers } from "@/data/users";
import { User } from "@/types/user";
import { delay } from "@/utils/delay";

type UserInput = Omit<User, "id">;

// This acts as our temporary in-memory database.
let usersDatabase: User[] = [...initialUsers];

export async function getUsers(): Promise<User[]> {
  await delay(700);

  const shouldFail = Math.random() < 0.1;

  if (shouldFail) {
    throw new Error("Unable to load users.");
  }

  return [...usersDatabase];
}

export async function createUser(user: UserInput): Promise<User> {
  await delay(700);

  const newUser: User = {
    id: Date.now(),
    ...user,
  };

  usersDatabase = [newUser, ...usersDatabase];

  return newUser;
}

export async function updateUser(
  id: number,
  user: UserInput
): Promise<User> {
  await delay(700);

  const existingUser = usersDatabase.find(
    (currentUser) => currentUser.id === id
  );

  if (!existingUser) {
    throw new Error("User not found.");
  }

  const updatedUser: User = {
    ...existingUser,
    ...user,
  };

  usersDatabase = usersDatabase.map((currentUser) =>
    currentUser.id === id ? updatedUser : currentUser
  );

  return updatedUser;
}

export async function deleteUser(id: number): Promise<void> {
  await delay(700);

  usersDatabase = usersDatabase.filter((user) => user.id !== id);
}