import { useState } from "react";
import { useGetMyTreeQuery } from "@/queries/userTreeQuery";
import type { UserTreeNode } from "@/queries/types";

const colorByDesignation = (designation: string | null | undefined) => {
  const value = (designation || "").toLowerCase();
  if (value === "ed") return "bg-indigo-600";
  if (value === "gm") return "bg-purple-600";
  if (value === "agm") return "bg-cyan-600";
  if (value === "mo") return "bg-green-600";
  if (value === "agency") return "bg-orange-600";
  return "bg-blue-600";
};

const EmployeeCard = ({ node }: { node: UserTreeNode }) => {
  const [open, setOpen] = useState(true);
  const employee = node.user;
  const children = node.children || [];
  const hasChildren = children.length > 0;

  return (
    <div className="flex flex-col w-full">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white rounded-lg border border-blue-100 p-4 text-left active:scale-[0.98] transition"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${colorByDesignation(
                employee.designation,
              )} flex items-center justify-center text-white font-bold`}
            >
              {(employee.name || employee.uid || "U").charAt(0)}
            </div>

            <div>
              <h2 className="text-sm font-semibold text-gray-800">
                {employee.name || "User"}
              </h2>

              <p className="text-xs text-gray-500 mt-1 capitalize">
                {employee.designation || "Member"}{" "}
                {employee.uid ? `(${employee.uid})` : ""}
              </p>
              {hasChildren && (
                <p className="mt-1 text-[11px] font-bold text-slate-400">
                  {children.length} member{children.length === 1 ? "" : "s"}
                </p>
              )}
            </div>
          </div>

          {hasChildren && (
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
              {open ? "-" : "+"}
            </div>
          )}
        </div>
      </button>

      {open && hasChildren && (
        <div className="ml-6 mt-4 border-l-2 border-dashed border-gray-300 pl-4 space-y-4">
          {children.map((child) => (
            <EmployeeCard key={child.user.id} node={child} />
          ))}
        </div>
      )}
    </div>
  );
};

function EmployeeTree() {
  const { data, isLoading, isError } = useGetMyTreeQuery();

  return (
    <div className="w-full min-h-screen flex justify-center py-5 px-2">
      <div className="w-full max-w-107.5 min-h-screen bg-white rounded-xl shadow overflow-hidden">
        <div className="bg-[#07277F] p-5 text-white sticky top-0 z-20">
          <h1 className="text-xl font-bold">Employee Tree</h1>
          <p className="text-xs opacity-80 mt-1">Your backend hierarchy</p>
        </div>

        <div className="p-4 space-y-4">
          {isLoading && (
            <p className="rounded-xl bg-blue-50 p-4 text-sm font-bold text-[#07277F]">
              Loading tree...
            </p>
          )}

          {isError && (
            <p className="rounded-xl bg-red-50 p-4 text-sm font-bold text-red-700">
              Could not load employee tree.
            </p>
          )}

          {data?.data && <EmployeeCard node={data.data} />}

          {!isLoading && !isError && !data?.data && (
            <p className="rounded-xl bg-slate-50 p-4 text-sm font-bold text-slate-600">
              No employee tree found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmployeeTree;
