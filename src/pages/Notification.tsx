import { Link } from "react-router-dom";
import { useState } from "react";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsAsReadMutation,
  useMarkNotificationAsReadMutation,
} from "@/queries/notificationQuery";
import { getApiUrl } from "@/utils/apiUrl";

const receiptUrl = (path: string) => {
  const normalizedPath = path.replace(/^\/?api\//, "");
  return getApiUrl(normalizedPath);
};

const NotificationPage = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading, isFetching, isError } = useGetNotificationsQuery({
    page,
    per_page: 20,
  });
  const [markAsRead, { isLoading: markingOne }] =
    useMarkNotificationAsReadMutation();
  const [markAllAsRead, { isLoading: markingAll }] =
    useMarkAllNotificationsAsReadMutation();

  const notifications = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="bg-white mx-auto w-full max-w-107.5 pb-24 font-sans text-slate-950">
      <main className="mx-auto grid w-full max-w-107.5 grid-cols-1 gap-5 px-4 py-6">
        <section className="grid grid-cols-[1fr_auto] items-center gap-3">
          <div>
            <h1 className="text-2xl font-extrabold text-[#00176b]">
              Notifications
            </h1>
            <p className="mt-1 text-sm font-semibold text-slate-500">
              {data?.unread_count || 0} unread
            </p>
          </div>

          <button
            type="button"
            onClick={() => markAllAsRead()}
            disabled={!data?.unread_count || markingAll}
            className="h-10 rounded-xl bg-[#07277F] px-4 text-xs font-extrabold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Mark all
          </button>
        </section>

        {isLoading && (
          <p className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm font-bold text-[#00176b]">
            Loading notifications...
          </p>
        )}

        {isError && (
          <p className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
            Could not load notifications.
          </p>
        )}

        {!isLoading && !isError && notifications.length === 0 && (
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-6 text-center">
            <span className="material-symbols-outlined text-4xl text-slate-300">
              notifications
            </span>
            <p className="mt-2 text-sm font-bold text-slate-600">
              No notifications found.
            </p>
          </div>
        )}

        <section className="grid grid-cols-1 gap-3">
          {notifications.map((notification) => {
            const unread = !notification.read_at;
            const actionPath = notification.action_url || null;
            const canLinkInApp = actionPath?.startsWith("/");
            const receiptPath = notification.meta?.receipt_url;

            return (
              <article
                key={notification.id}
                className={`rounded-2xl border p-4 ${
                  unread
                    ? "border-blue-100 bg-blue-50"
                    : "border-slate-100 bg-white"
                }`}
              >
                <div className="grid grid-cols-[40px_1fr] gap-3">
                  <div
                    className={`h-10 w-10 rounded-xl grid place-items-center ${
                      unread
                        ? "bg-[#07277F] text-white"
                        : "bg-slate-100 text-[#07277F]"
                    }`}
                  >
                    <span className="material-symbols-outlined text-[22px]">
                      {notification.type === "payment_created"
                        ? "payments"
                        : "event_available"}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <div className="grid grid-cols-[1fr_auto] items-start gap-2">
                      <h2 className="text-sm font-extrabold leading-5 text-[#00176b]">
                        {notification.title}
                      </h2>
                      {unread && (
                        <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
                          New
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-5 text-slate-600">
                      {notification.message}
                    </p>

                    <p className="mt-2 text-xs font-semibold text-slate-400">
                      {notification.created_at_human ||
                        notification.created_at ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  {canLinkInApp ? (
                    <Link
                      to={actionPath ?? "/notifications"}
                      className="grid h-10 place-items-center rounded-xl border border-blue-200 bg-white text-xs font-extrabold text-[#07277F]"
                    >
                      View
                    </Link>
                  ) : (
                    <span />
                  )}

                  {receiptPath ? (
                    <a
                      href={receiptUrl(String(receiptPath))}
                      target="_blank"
                      rel="noreferrer"
                      className="grid h-10 place-items-center rounded-xl border border-blue-200 bg-white text-xs font-extrabold text-[#07277F]"
                    >
                      Receipt
                    </a>
                  ) : (
                    <span />
                  )}
                </div>

                {unread && (
                  <button
                    type="button"
                    onClick={() => markAsRead(notification.id)}
                    disabled={markingOne}
                    className="mt-2 h-10 w-full rounded-xl bg-[#07277F] text-xs font-extrabold text-white disabled:opacity-60"
                  >
                    Mark as read
                  </button>
                )}
              </article>
            );
          })}
        </section>

        {pagination && pagination.last_page > 1 && (
          <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(value - 1, 1))}
              disabled={page <= 1 || isFetching}
              className="h-10 w-10 rounded-full border border-slate-200 text-[#07277F] disabled:opacity-40"
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <p className="text-center text-xs font-bold text-slate-500">
              Page {pagination.current_page} of {pagination.last_page}
            </p>
            <button
              type="button"
              onClick={() =>
                setPage((value) => Math.min(value + 1, pagination.last_page))
              }
              disabled={page >= pagination.last_page || isFetching}
              className="h-10 w-10 rounded-full border border-slate-200 text-[#07277F] disabled:opacity-40"
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default NotificationPage;
