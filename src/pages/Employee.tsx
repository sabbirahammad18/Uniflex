import { useState } from "react";

type EmployeeNode = {
  name: string;
  role: string;
  color: string;
  image?: string;
  children?: EmployeeNode[];
};

function EmployeeTree() {
  const employees: EmployeeNode = {
    name: "Sabbir Ahmed",
    role: "CEO",
    color: "bg-blue-600",

    children: [
      {
        name: "Rakib Hasan",
        role: "Manager",
        color: "bg-purple-500",

        children: [
          {
            name: "Nusrat Jahan",
            role: "UI Designer",
            color: "bg-pink-500",
          },
          {
            name: "Tanvir Hossain",
            role: "Frontend Dev",
            color: "bg-cyan-500",
          },
        ],
      },

      {
        name: "Mim Akter",
        role: "HR Lead",
        color: "bg-orange-500",

        children: [
          {
            name: "Arif Rahman",
            role: "Recruiter",
            color: "bg-green-500",
          },
          {
            name: "Jannat Islam",
            role: "HR Assistant",
            color: "bg-red-500",
          },
        ],
      },

      {
        name: "Hasan Mahmud",
        role: "Backend Lead",
        color: "bg-indigo-500",

        children: [
          {
            name: "Fahim Khan",
            role: "Node.js Dev",
            color: "bg-teal-500",
          },
          {
            name: "Riya Akter",
            role: "API Engineer",
            color: "bg-yellow-500",
          },
        ],
      },

      {
        name: "Shila Roy",
        role: "Marketing Lead",
        color: "bg-rose-500",

        children: [
          {
            name: "Nayeem Islam",
            role: "SEO Expert",
            color: "bg-lime-500",
          },
          {
            name: "Tania Noor",
            role: "Content Writer",
            color: "bg-sky-500",
          },
        ],
      },
    ],
  };

  const EmployeeCard = ({ employee }: { employee: EmployeeNode }) => {
    const [open, setOpen] = useState(false);

    return (
      <div className="flex flex-col w-full">
        {/* Card */}
        <div
          onClick={() => setOpen(!open)}
          className="bg-white rounded-lg border border-blue-100  p-4 cursor-pointer active:scale-[0.98] transition"
        >
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className={`w-12 h-12 rounded-full ${employee.color} flex items-center justify-center text-white font-bold`}
              >
                {employee.name.charAt(0)}
              </div>

              {/* Info */}
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  {employee.name}
                </h2>

                <p className="text-xs text-gray-500 mt-1">{employee.role}</p>
              </div>
            </div>

            {/* Button */}
            {employee.children && (
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-700">
                {open ? "−" : "+"}
              </div>
            )}
          </div>
        </div>

        {/* Children */}
        {open && employee.children && (
          <div className="ml-6 mt-4 border-l-2 border-dashed border-gray-300 pl-4 space-y-4">
            {employee.children.map((item) => (
              <EmployeeCard key={item.role} employee={item} />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full min-h-screen flex justify-center py-5 px-2">
      {/* Mobile Container */}
      <div className="w-107 min-h-screen to-white rounded-xl shadow overflow-hidden">
        {/* Header */}
        <div className="bg-[#07277F] p-5 text-white sticky top-0 z-20">
          <h1 className="text-xl font-bold">Employee Tree</h1>

          <p className="text-xs opacity-80 mt-1">
            Click card to view sub employees
          </p>
        </div>

        {/* Tree */}
        <div className="p-4 space-y-4">
          <EmployeeCard employee={employees} />
        </div>
      </div>
    </div>
  );
}

export default EmployeeTree;
