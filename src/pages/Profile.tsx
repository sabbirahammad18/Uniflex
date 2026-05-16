import { Link } from "react-router";
import { useState } from "react";
import img from "../assets/images/download.jpg";
const Profile = () => {
  const [openType, setOpenType] = useState<string | null>(null);

  const toggleDropdown = (type: string) => {
    setOpenType(openType === type ? null : type);
  };

  const earningsData = [
    {
      key: "booking",
      title: "Booking Money",
      amount: "৳ 1,500.00",
      dot: "bg-green-500",
      customers: [
        {
          name: "Rahim Ahmed",
          date: "12 Oct 2023",
          id: "CUST-1001",
          amount: "৳ 500.00",
        },
        {
          name: "Karim Hasan",
          date: "14 Oct 2023",
          id: "CUST-1002",
          amount: "৳ 700.00",
        },
        {
          name: "Sumaiya Akter",
          date: "16 Oct 2023",
          id: "CUST-1003",
          amount: "৳ 300.00",
        },
      ],
    },
    {
      key: "down",
      title: "Down Payment",
      amount: "৳ 2,000.00",
      dot: "bg-[#07277f]",
      customers: [
        {
          name: "Nayeem Islam",
          date: "18 Oct 2023",
          id: "CUST-2001",
          amount: "৳ 1,200.00",
        },
        {
          name: "Sadia Khan",
          date: "20 Oct 2023",
          id: "CUST-2002",
          amount: "৳ 800.00",
        },
      ],
    },
    {
      key: "installment",
      title: "Installment",
      amount: "৳ 1,000.00",
      dot: "bg-slate-300",
      customers: [
        {
          name: "Fahim Chowdhury",
          date: "22 Oct 2023",
          id: "CUST-3001",
          amount: "৳ 400.00",
        },
        {
          name: "Jannat Mim",
          date: "25 Oct 2023",
          id: "CUST-3002",
          amount: "৳ 600.00",
        },
      ],
    },
  ];

  return (
    <div className="bg-white min-h-screen pb-24 font-sans text-slate-950">
      <main className="mx-auto w-full max-w-107.5 px-4 py-8 space-y-6">
        {/* Profile Section */}
        <section className="grid grid-cols-1 rounded-xl bg-white -mt-9 p-6">
          <div className="grid grid-cols-[96px_1fr] items-center gap-5">
            <div className="relative">
              <img
                alt="Agent Profile"
                className="w-21 h-21 rounded-full object-cover border-2 border-blue-900 mb-5 shadow-lg"
                src={img}
              />
            </div>

            <div>
              <h2 className="text-h2 leading-6 font-extrabold text-[#00176b] tracking-tight">
                Mr. Hasan Rohaman Sajjad
              </h2>

              <div className="mt-2 flex items-center gap-2">
                <span className="rounded-full bg-blue-50 border border-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                  Marketing Officer
                </span>

                <span className="text-sm text-slate-400">ID: MO0084</span>
              </div>
            </div>
          </div>
        </section>

        {/* Wallet */}
        <section className="rounded-xl bg-[#07277F] p-6 text-white shadow-lg -mt-10">
          <p className="text-sm text-blue-200 font-medium">Wallet Balance</p>

          <Link
            to="/payment"
            className="text-sm font-medium text-white/70  mt-1"
          >
            <h3 className="mt-1 text-[38px] leading-none font-extrabold tracking-tight text-[#9cb4ff]">
              ৳ 43,850.00
            </h3>
          </Link>

          <div className="mt-6 flex items-center gap-2 text-emerald-300">
            <span className="material-symbols-outlined text-[23px]">
              trending_up
            </span>

            <span className="text-sm font-bold">+12.5% this month</span>
          </div>
        </section>

        {/* Menu */}
        <section className="grid grid-cols-2 gap-4">
          <Link
            to="/customer"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-blue-600">
              <span className="material-symbols-outlined text-[23px]">
                history
              </span>
            </div>
            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Customer
              <br />
              History
            </span>
          </Link>

          <Link
            to="/employee"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center border border-blue-100 gap-3 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-100 grid place-items-center text-indigo-600">
              <span className="material-symbols-outlined text-[23px]">
                account_tree
              </span>
            </div>
            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Employee
              <br />
              Tree
            </span>
          </Link>

          {/* <Link
            to="/setting"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            {" "}
            <div className="w-10 h-10 rounded-lg bg-slate-100 grid place-items-center text-slate-600">
              <span className="material-symbols-outlined text-[23px]">
                settings
              </span>
            </div>
            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Settings
            </span>
          </Link> */}

          <Link
            to="../commission"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-blue-600">
              <span className="material-symbols-outlined text-[23px]">
                payments
              </span>
            </div>

            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Commission
            </span>
          </Link>

          <Link
            to="/achievement"
            className="rounded-xl bg-white p-4 min-h-18 grid grid-cols-[40px_1fr] items-center gap-3 border border-blue-100 active:scale-[0.98] transition"
          >
            <div className="w-10 h-10 rounded-lg bg-blue-100 grid place-items-center text-blue-600">
              <span className="material-symbols-outlined text-[23px]">
                workspace_Premium
              </span>
            </div>

            <span className="text-sm leading-4 font-medium text-[#00176b]">
              Achievement
            </span>
          </Link>
        </section>

        {/* Customer Card */}
        <aside className="grid grid-cols-1 gap-5">
          <section className="relative overflow-hidden rounded-3xl bg-[#07277f] p-6 text-white shadow-xl">
            <div className="absolute -right-12 -top-12 h-28 w-28 rounded-full bg-white/10" />

            <div className="mt-5 grid grid-cols-[56px_1fr] items-center gap-4">
              <div className="h-14 w-14 rounded-2xl">
                <img className="rounded-full" src={img} alt="" />
              </div>

              <div>
                <h3 className="text-xl font-extrabold leading-6">
                  Hasan Sajjad
                </h3>

                <p className="text-sm text-blue-200">Marketing Officer</p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                <span className="material-symbols-outlined text-blue-300">
                  apartment
                </span>

                <div>
                  <p className="text-[10px] uppercase font-extrabold text-blue-300">
                    Project Name
                  </p>

                  <p className="text-sm">Project Phoenix</p>
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] items-center gap-3">
                <span className="material-symbols-outlined text-blue-300">
                  badge
                </span>

                <div>
                  <p className="text-[10px] uppercase font-extrabold text-blue-300">
                    Reference
                  </p>

                  <p className="text-sm">Mr / MO0084</p>
                </div>
              </div>
            </div>

            <Link to="/profilecustomer">
              <button className="mt-6 h-12 w-full rounded-2xl bg-sky-300 text-sm font-extrabold text-[#00176b] shadow-lg">
                View Us
              </button>
            </Link>
          </section>

          {/* Earnings Breakdown */}
          <section className="rounded-3xl bg-white border border-blue-100 p-5 shadow-sm">
            <h3 className="text-xl font-extrabold text-[#00176b]">
              Earnings Breakdown
            </h3>

            <div className="mt-5 grid grid-cols-1 gap-4">
              {earningsData.map((item) => (
                <div
                  key={item.key}
                  className="rounded-2xl border border-blue-100 bg-white p-4 shadow-sm"
                >
                  <button
                    onClick={() => toggleDropdown(item.key)}
                    className="w-full grid grid-cols-[1fr_auto] items-center gap-3"
                  >
                    <div className="grid grid-cols-[auto_1fr] items-center gap-3 text-left">
                      <div className={`h-3 w-3 rounded-full ${item.dot}`} />

                      <div>
                        <p className="text-sm font-bold text-slate-700">
                          {item.title}
                        </p>

                        <p className="text-xs text-slate-400">
                          {item.customers.length} Customers
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-extrabold text-[#00176b]">
                        {item.amount}
                      </span>

                      <span className="material-symbols-outlined text-[22px] text-slate-400">
                        {openType === item.key ? "expand_less" : "expand_more"}
                      </span>
                    </div>
                  </button>

                  {openType === item.key && (
                    <div className="mt-4 grid grid-cols-1 gap-3">
                      {item.customers.map((customer) => (
                        <div
                          key={customer.id}
                          className="rounded-2xl bg-slate-50 border border-slate-100 p-4"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex flex-col mt-2">
                              <h4 className="text-sm font-extrabold text-[#00176b]">
                                {customer.name}
                              </h4>

                              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                                <span>ID: {customer.id}</span>
                              </div>
                            </div>
                            <div className="flex flex-col ">
                              <span className="rounded-xl bg-blue-100 w-25 px-3 py-1 text-sm font-extrabold text-[#00176b]">
                                {customer.amount}
                              </span>
                              <span className="text-label-md font-semibold ml-4 mt-2 opacity-60 ">
                                {customer.date}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="grid grid-cols-[1fr_auto] items-center border-t border-slate-100 pt-5">
                <span className="text-base font-extrabold text-[#00176b]">
                  Total Commission
                </span>

                <span className="text-base font-extrabold text-[#00176b]">
                  ৳ 4,500.00
                </span>
              </div>
            </div>
          </section>
        </aside>
      </main>
    </div>
  );
};

export default Profile;
