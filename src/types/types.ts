import type {Dispatch, SetStateAction} from "react";

export type HeaderProps = {
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};

export type SidebarProps = {
    sidebarOpen: boolean;
    setSidebarOpen: Dispatch<SetStateAction<boolean>>;
};
