import { useDeferredValue, useMemo, useState } from "react";
import { useGetManagementUsersQuery } from "@/queries/managementQuery";

const Users = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [roleId, setRoleId] = useState<number | "">("");
  const [status, setStatus] = useState<number | "">("");
  const deferredSearch = useDeferredValue(search);

  const query = useMemo(
    () => ({
      page,
      per_page: 10,
      search: deferredSearch.trim() || undefined,
      role_id: roleId,
      status,
    }),
    [deferredSearch, page, roleId, status],
  );

  const { data, isLoading, isFetching, isError } = useGetManagementUsersQuery(query);
  const users = data?.data || [];
  const pagination = data?.pagination;
  const roleOptions = data?.filters.roles || [];
  const statusOptions = data?.filters.statuses || [];

  return (
    <div className="min-h-screen w-full bg-slate-50">
      <div className="mx-auto flex min-h-screen w-full max-w-107.5 flex-col bg-white pb-24">
        <div className="bg-[#07277F] px-5 py-5 text-white">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-200">
            Mobile admin
          </p>
          <h1 className="mt-1 text-xl font-black">Users List</h1>
          <p className="mt-1 text-xs text-blue-100">
            Search, filter, and review user records
          </p>
        </div>

        <div className="space-y-4 p-5">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              search
            </span>
            <input
              type="search"
              inputMode="search"
              value={search}
              onChange={(event) => {
                setPage(1);
                setSearch(event.target.value);
              }}
              placeholder="Search by name, UID, email, phone"
              className="h-12 w-full rounded-2xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-semibold text-slate-800 outline-none focus:border-[#07277F]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <label className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Role
              </span>
              <select
                value={roleId}
                onChange={(event) => {
                  setPage(1);
                  setRoleId(event.target.value ? Number(event.target.value) : "");
                }}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#07277F]"
              >
                <option value="">All roles</option>
                {roleOptions.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400">
                Status
              </span>
              <select
                value={status}
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value ? Number(event.target.value) : "");
                }}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-700 outline-none focus:border-[#07277F]"
              >
                <option value="">All statuses</option>
                {statusOptions.map((option) => (
                  <option key={String(option.value)} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {pagination && (
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-2xl bg-blue-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total
                </p>
                <p className="mt-2 text-xl font-black text-[#07277F]">
                  {pagination.total}
                </p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Page
                </p>
                <p className="mt-2 text-xl font-black text-emerald-700">
                  {pagination.current_page}
                </p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Showing
                </p>
                <p className="mt-2 text-xl font-black text-amber-700">
                  {users.length}
                </p>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-[#07277F]">
              Loading users...
            </div>
          )}

          {isError && (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
              Could not load users.
            </div>
          )}

          {!isLoading && !isError && users.length === 0 && (
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No users found.
            </div>
          )}

          <section className="space-y-3">
            {users.map((user) => (
              <article
                key={user.id}
                className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
              >
                <div className="grid grid-cols-[auto_1fr] items-start gap-3">
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt={user.name || "User"}
                      className="h-12 w-12 rounded-2xl border border-slate-200 object-cover"
                    />
                  ) : (
                    <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#07277F] text-base font-black text-white">
                      {(user.name || "U").slice(0, 1).toUpperCase()}
                    </div>
                  )}

                  <div className="min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate text-base font-black text-slate-900">
                          {user.name || "Unnamed user"}
                        </h2>
                        <p className="mt-1 truncate text-xs font-semibold text-slate-500">
                          {user.uid || "No UID"} {user.email ? `· ${user.email}` : ""}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-black ${
                          user.status === 1
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {user.status_label}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="font-bold text-slate-500">Role</p>
                        <p className="mt-1 font-black text-[#07277F]">
                          {user.role_name || user.designation || "N/A"}
                        </p>
                      </div>
                      <div className="rounded-xl bg-slate-50 p-3">
                        <p className="font-bold text-slate-500">Joined</p>
                        <p className="mt-1 font-black text-slate-900">
                          {user.joined_at || "N/A"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 rounded-xl bg-blue-50 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-slate-500">
                        Contact
                      </p>
                      <p className="mt-1 text-sm font-bold text-[#07277F]">
                        {user.phone_number || "Phone not available"}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-slate-500">
                        {user.joined_at_human || ""}
                      </p>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>

          {pagination && pagination.last_page > 1 && (
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 pt-1">
              <button
                type="button"
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                disabled={pagination.current_page <= 1 || isFetching}
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-[#07277F] disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <p className="text-center text-xs font-bold text-slate-500">
                Page {pagination.current_page} of {pagination.last_page}
              </p>
              <button
                type="button"
                onClick={() =>
                  setPage((value) =>
                    Math.min(value + 1, pagination.last_page),
                  )
                }
                disabled={
                  pagination.current_page >= pagination.last_page || isFetching
                }
                className="grid h-11 w-11 place-items-center rounded-2xl border border-slate-200 bg-white text-[#07277F] disabled:opacity-40"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
