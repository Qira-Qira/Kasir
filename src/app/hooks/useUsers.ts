import { useState } from "react";
import type { UserAccount, NewUser, UserDraft } from "../types";
import { USER_ACCOUNTS } from "../constants";

export const useUsers = () => {
  const [systemUsers, setSystemUsers] = useState<UserAccount[]>(USER_ACCOUNTS);
  const [editingUserUsername, setEditingUserUsername] = useState<string | null>(null);
  const [userDraft, setUserDraft] = useState<UserDraft>({
    username: "",
    password: "",
    role: "kasir",
  });
  const [newUser, setNewUser] = useState<NewUser>({
    username: "",
    password: "",
    role: "kasir",
  });
  const [userDeleteUsername, setUserDeleteUsername] = useState<string | null>(null);
  const [userPage, setUserPage] = useState(1);

  const handleStartEditUser = (user: UserAccount) => {
    setEditingUserUsername(user.username);
    setUserDraft({
      username: user.username,
      password: user.password,
      role: user.role,
    });
  };

  const handleCloseEditUser = () => {
    setEditingUserUsername(null);
    setUserDraft({ username: "", password: "", role: "kasir" });
  };

  const handleSaveUserEdit = (currentUsername: string) => {
    if (!userDraft.username || !userDraft.password) return;

    setSystemUsers((prev) =>
      prev.map((user) =>
        user.username === currentUsername
          ? {
              ...user,
              username: userDraft.username,
              password: userDraft.password,
              role: userDraft.role,
            }
          : user
      )
    );
    handleCloseEditUser();
  };

  const handleAddUser = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!newUser.username || !newUser.password) return;

    const userExists = systemUsers.some((u) => u.username === newUser.username);
    if (userExists) {
      alert("Username sudah terdaftar!");
      return;
    }

    const user: UserAccount = {
      username: newUser.username,
      password: newUser.password,
      role: newUser.role,
      name: `${newUser.role} ${Date.now()}`,
    };

    setSystemUsers((prev) => [...prev, user]);
    setNewUser({ username: "", password: "", role: "kasir" });
  };

  const handleDeleteUser = (username: string) => {
    if (username === "admin") {
      alert("Tidak bisa menghapus admin!");
      return;
    }
    setSystemUsers((prev) => prev.filter((u) => u.username !== username));
    setUserDeleteUsername(null);
  };

  return {
    systemUsers,
    setSystemUsers,
    editingUserUsername,
    setEditingUserUsername,
    userDraft,
    setUserDraft,
    newUser,
    setNewUser,
    userDeleteUsername,
    setUserDeleteUsername,
    userPage,
    setUserPage,
    handleStartEditUser,
    handleCloseEditUser,
    handleSaveUserEdit,
    handleAddUser,
    handleDeleteUser,
  };
};
