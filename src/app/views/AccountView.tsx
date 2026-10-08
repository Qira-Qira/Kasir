import { ChevronLeft, ChevronRight, Search, Users } from "lucide-react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import type { UserAccount } from "../types";

interface AccountViewProps {
  systemUsers: UserAccount[];
  userSearch: string;
  setUserSearch: (value: string) => void;
  userPage: number;
  setUserPage: (value: number) => void;
  handleStartEditUser: (user: UserAccount) => void;
  setUserDeleteUsername: (value: string) => void;
  setIsAddUserModalOpen: (value: boolean) => void;
}

export function AccountView({
  systemUsers,
  userSearch,
  setUserSearch,
  userPage,
  setUserPage,
  handleStartEditUser,
  setUserDeleteUsername,
  setIsAddUserModalOpen,
}: AccountViewProps) {
  const userQuery = userSearch.trim().toLowerCase();
  const filteredUsersList = systemUsers.filter((user) => {
    if (!userQuery) return true;
    return user.username.toLowerCase().includes(userQuery) || user.role.toLowerCase().includes(userQuery) || user.name.toLowerCase().includes(userQuery);
  });

  const userTotalPages = Math.max(1, Math.ceil(filteredUsersList.length / 9));
  const safeUserPage = Math.min(userPage, userTotalPages);
  const paginatedUsers = filteredUsersList.slice((safeUserPage - 1) * 9, safeUserPage * 9);

  return (
    <div className="flex min-h-0 flex-col overflow-hidden rounded-[22px] border border-[#eddcc3] bg-[#fffaf5] p-4 shadow-[0_12px_24px_rgba(88,63,46,0.04)] sm:rounded-[24px] sm:p-5">
      <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-[#f3e9dc] p-2 text-[#5d4235]">
            <Users className="h-4 w-4" />
          </div>
          <h3 className="text-base font-semibold text-[#2b1d18] sm:text-lg">Kelola Akun</h3>
        </div>
        <span className="w-fit rounded-full bg-[#edf3ef] px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
          {filteredUsersList.length} user
        </span>
      </div>

      <div className="mt-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a6a52]" />
          <Input
            value={userSearch}
            onChange={(event) => {
              setUserSearch(event.target.value);
              setUserPage(1);
            }}
            placeholder="Cari akun..."
            className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] pl-10 text-[#2b1d18] placeholder:text-[#9a8479]"
          />
        </div>
        <Button type="button" onClick={() => setIsAddUserModalOpen(true)} className="h-11 rounded-2xl bg-[#7c4a2d] text-[#fffaf5] hover:bg-[#6d3f2a]">
          Tambah Akun
        </Button>
      </div>

      <div className="mt-5 min-h-0 flex-1 overflow-hidden rounded-2xl border border-[#ebdcc7] bg-[#f8f0e7]">
        <div className="h-full max-h-[560px] overflow-y-auto overflow-x-auto">
          <table className="w-full min-w-[420px] table-fixed text-left text-sm text-[#2b1d18]">
            <thead className="sticky top-0 z-10 bg-[#f1e4d6] text-[#5d4235]">
              <tr>
                <th className="w-[38%] px-4 py-3 text-left font-semibold">Username</th>
                <th className="w-[30%] px-4 py-3 text-left font-semibold">Role</th>
                <th className="w-[32%] px-4 py-3 text-left font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length > 0 ? (
                paginatedUsers.map((user) => (
                  <tr key={`${user.role}-${user.username}`} className="border-t border-[#ebdcc7] align-middle">
                    <td className="px-4 py-3 font-medium align-middle">{user.username}</td>
                    <td className="px-4 py-3 align-middle">
                      <span className="inline-flex rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-[#2d5b45]">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 align-middle">
                      <div className="flex flex-wrap gap-2">
                        <button type="button" onClick={() => handleStartEditUser(user)} className="rounded-full bg-[#edf3ef] px-2 py-1 text-[10px] font-semibold text-[#2d5b45]">
                          Edit
                        </button>
                        <button type="button" onClick={() => setUserDeleteUsername(user.username)} disabled={user.username === "admin"} className="rounded-full bg-[#f8d7d7] px-2 py-1 text-[10px] font-semibold text-[#9b3b34] disabled:cursor-not-allowed disabled:opacity-50">
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3} className="px-4 py-4 text-sm text-[#7d685f]">Akun tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredUsersList.length > 9 && (
          <div className="flex items-center justify-between border-t border-[#ebdcc7] bg-[#f7efe8] p-3">
            <button type="button" onClick={() => setUserPage(Math.max(1, userPage - 1))} disabled={safeUserPage === 1} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#f3e7d9] text-[#5d4235] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Halaman pengguna sebelumnya">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm font-medium text-[#4d382f]">Halaman {safeUserPage} / {userTotalPages}</span>
            <button type="button" onClick={() => setUserPage(Math.min(userTotalPages, userPage + 1))} disabled={safeUserPage === userTotalPages} className="flex h-9 w-9 items-center justify-center rounded-full bg-[#7c4a2d] text-[#fffaf5] disabled:cursor-not-allowed disabled:opacity-50" aria-label="Halaman pengguna berikutnya">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
