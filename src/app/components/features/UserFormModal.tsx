import type { FormEvent } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import type { Role } from "../../types";

export type UserFormState = {
  username: string;
  password: string;
  role: Role;
};

interface UserFormModalProps {
  open: boolean;
  title: string;
  submitLabel: string;
  formState: UserFormState;
  onChange: (field: keyof UserFormState, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}

export function UserFormModal({
  open,
  title,
  submitLabel,
  formState,
  onChange,
  onSubmit,
  onClose,
}: UserFormModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#2b1d18]/40 p-4">
      <div className="w-full max-w-xl rounded-[30px] border border-[#eddcc3] bg-[#fffaf5] p-5 shadow-[0_40px_80px_rgba(43,29,24,0.18)]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#8d6d5a]">Admin</p>
            <h3 className="mt-1 text-xl font-semibold text-[#2b1d18]">{title}</h3>
          </div>
        </div>

        <form onSubmit={onSubmit} className="mt-5 space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Username</label>
            <Input
              value={formState.username}
              onChange={(event) => onChange("username", event.target.value)}
              placeholder="Masukkan username"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Password</label>
            <Input
              type="password"
              value={formState.password}
              onChange={(event) => onChange("password", event.target.value)}
              placeholder="Masukkan password"
              className="h-11 rounded-2xl border-[#ebdcc7] bg-[#f9f2ea] text-[#2b1d18]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#4d382f]">Role</label>
            <select
              value={formState.role}
              onChange={(event) => onChange("role", event.target.value as Role)}
              className="h-11 w-full rounded-2xl border border-[#ebdcc7] bg-[#f9f2ea] px-3 text-[#2b1d18] outline-none"
            >
              <option value="admin">Admin</option>
              <option value="kasir">Kasir</option>
              <option value="investor">Investor</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-[#e7d4ba] bg-[#fffaf5] px-4 py-2.5 text-sm font-medium text-[#4d382f]"
            >
              Batal
            </button>
            <Button type="submit" className="rounded-2xl bg-[#7c4a2d] px-4 text-[#fffaf5] hover:bg-[#6d3f2a]">
              {submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
