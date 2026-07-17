import { users } from "@/data/users";
import { User } from "@/types/user";

export async function getUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {

      const shouldFail = Math.random() < 0.3;

      if (shouldFail) {
        reject(new Error("Unable to load users."));
        return;
      }

      resolve(users);

    }, 1500);
  });
}