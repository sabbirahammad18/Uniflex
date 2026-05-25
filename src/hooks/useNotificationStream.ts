import { useEffect } from "react";
import { baseApi } from "@/queries/baseApi";
import { getApiUrl } from "@/utils/apiUrl";
import { useAppDispatch } from "@/app/hooks";

export const useNotificationStream = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof EventSource === "undefined") return;

    const source = new EventSource(getApiUrl("notifications/stream"), {
      withCredentials: true,
    });

    source.addEventListener("notifications", () => {
      dispatch(baseApi.util.invalidateTags(["Notifications"]));
    });

    source.onerror = () => {
      dispatch(baseApi.util.invalidateTags(["Notifications"]));
    };

    return () => {
      source.close();
    };
  }, [dispatch]);
};
