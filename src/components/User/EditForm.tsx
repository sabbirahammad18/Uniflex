import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetManagementUserQuery,
  useGetManagementUsersQuery,
  useUpdateManagementUserMutation,
} from "@/queries/managementQuery";
import { getApiErrorMessage } from "@/utils/format";

type FormState = {
  uid: string;
  name: string;
  email: string;
  phone_number: string;
  role_id: string;
  designation: string;
  status: string;
  password: string;
  reference: string;
  mo: string;
  agm: string;
  gm: string;
  ed: string;
  father_name: string;
  mother_name: string;
  husband_spouse: string;
  nid: string;
  dob: string;
  education: string;
  permanent_address: string;
  present_address: string;
  bank_name: string;
  branch_name: string;
  bank_account_no: string;
  bank_routing_no: string;
  mobile_banking_portal: string;
  mobile_banking_ac_no: string;
  nominee_name1: string;
  nominee_relation1: string;
  nominee_age1: string;
  nominee_mobile1: string;
  nominee_percentage1: string;
  nominee_name2: string;
  nominee_relation2: string;
  nominee_age2: string;
  nominee_mobile2: string;
  nominee_percentage2: string;
};

const initialState: FormState = {
  uid: "",
  name: "",
  email: "",
  phone_number: "",
  role_id: "",
  designation: "",
  status: "1",
  password: "",
  reference: "",
  mo: "",
  agm: "",
  gm: "",
  ed: "",
  father_name: "",
  mother_name: "",
  husband_spouse: "",
  nid: "",
  dob: "",
  education: "",
  permanent_address: "",
  present_address: "",
  bank_name: "",
  branch_name: "",
  bank_account_no: "",
  bank_routing_no: "",
  mobile_banking_portal: "",
  mobile_banking_ac_no: "",
  nominee_name1: "",
  nominee_relation1: "",
  nominee_age1: "",
  nominee_mobile1: "",
  nominee_percentage1: "",
  nominee_name2: "",
  nominee_relation2: "",
  nominee_age2: "",
  nominee_mobile2: "",
  nominee_percentage2: "",
};

const designationOptions = [
  { value: "", label: "Select designation" },
  { value: "mo", label: "Marketing Officer" },
  { value: "agm", label: "Assistant General Manager" },
  { value: "gm", label: "General Manager" },
  { value: "ed", label: "Executive Director" },
];

const inputClass =
  "mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#07277F]";
const textareaClass =
  "mt-1 min-h-20 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-800 outline-none focus:border-[#07277F]";
const labelClass =
  "text-[11px] font-bold uppercase tracking-[0.18em] text-slate-400";

const EditForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = Number(id);
  const [form, setForm] = useState<FormState>(initialState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const {
    data: detailResponse,
    isLoading,
    isFetching,
    isError,
  } = useGetManagementUserQuery(userId, { skip: !Number.isFinite(userId) || userId <= 0 });

  const { data: usersResponse } = useGetManagementUsersQuery({
    page: 1,
    per_page: 100,
  });

  const [updateManagementUser, { isLoading: isSaving }] =
    useUpdateManagementUserMutation();

  const detail = detailResponse?.data;
  const roleOptions = usersResponse?.filters.roles || [];
  const teamOptions = usersResponse?.data || [];

  useEffect(() => {
    if (!detail) {
      return;
    }

    const nominee1 = detail.nominees?.[0];
    const nominee2 = detail.nominees?.[1];

    setForm({
      uid: detail.uid || "",
      name: detail.name || "",
      email: detail.email || "",
      phone_number: detail.phone_number || detail.phone || "",
      role_id: detail.role?.id ? String(detail.role.id) : detail.role_id ? String(detail.role_id) : "",
      designation: detail.designation || "",
      status: String(Number(detail.status ?? 1)),
      password: "",
      reference: detail.reference ? String(detail.reference) : "",
      mo: detail.mo ? String(detail.mo) : "",
      agm: detail.agm ? String(detail.agm) : "",
      gm: detail.gm ? String(detail.gm) : "",
      ed: detail.ed ? String(detail.ed) : "",
      father_name: detail.details?.father_name || "",
      mother_name: detail.details?.mother_name || "",
      husband_spouse: detail.details?.husband_spouse || "",
      nid: detail.details?.nid || "",
      dob: detail.details?.dob || "",
      education: detail.details?.education || "",
      permanent_address: detail.details?.permanent_address || "",
      present_address: detail.details?.present_address || "",
      bank_name: detail.details?.bank_name || "",
      branch_name: detail.details?.branch_name || "",
      bank_account_no: detail.details?.bank_account_no || "",
      bank_routing_no: detail.details?.bank_routing_no || "",
      mobile_banking_portal: detail.details?.mobile_banking_portal || "",
      mobile_banking_ac_no: detail.details?.mobile_banking_ac_no || "",
      nominee_name1: nominee1?.name || "",
      nominee_relation1: nominee1?.relation || "",
      nominee_age1: nominee1?.age !== null && nominee1?.age !== undefined ? String(nominee1.age) : "",
      nominee_mobile1: nominee1?.mobile_number || "",
      nominee_percentage1:
        nominee1?.percentage !== null && nominee1?.percentage !== undefined
          ? String(nominee1.percentage)
          : "",
      nominee_name2: nominee2?.name || "",
      nominee_relation2: nominee2?.relation || "",
      nominee_age2: nominee2?.age !== null && nominee2?.age !== undefined ? String(nominee2.age) : "",
      nominee_mobile2: nominee2?.mobile_number || "",
      nominee_percentage2:
        nominee2?.percentage !== null && nominee2?.percentage !== undefined
          ? String(nominee2.percentage)
          : "",
    });
  }, [detail]);

  const avatarPreview = useMemo(() => {
    if (avatarFile) {
      return URL.createObjectURL(avatarFile);
    }

    return detail?.avatar_url || "";
  }, [avatarFile, detail?.avatar_url]);

  useEffect(() => {
    return () => {
      if (avatarPreview && avatarFile) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarFile, avatarPreview]);

  const setField = (field: keyof FormState, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!Number.isFinite(userId) || userId <= 0) {
      setErrorMessage("Invalid user id.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");

    try {
      await updateManagementUser({
        id: userId,
        uid: form.uid.trim(),
        name: form.name.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        role_id: form.role_id ? Number(form.role_id) : "",
        designation: form.designation || undefined,
        status: Number(form.status),
        password: form.password.trim() || undefined,
        reference: form.reference ? Number(form.reference) : "",
        mo: form.mo ? Number(form.mo) : "",
        agm: form.agm ? Number(form.agm) : "",
        gm: form.gm ? Number(form.gm) : "",
        ed: form.ed ? Number(form.ed) : "",
        father_name: form.father_name.trim(),
        mother_name: form.mother_name.trim(),
        husband_spouse: form.husband_spouse.trim(),
        nid: form.nid.trim(),
        dob: form.dob || undefined,
        education: form.education.trim(),
        permanent_address: form.permanent_address.trim(),
        present_address: form.present_address.trim(),
        bank_name: form.bank_name.trim(),
        branch_name: form.branch_name.trim(),
        bank_account_no: form.bank_account_no.trim(),
        bank_routing_no: form.bank_routing_no.trim(),
        mobile_banking_portal: form.mobile_banking_portal.trim(),
        mobile_banking_ac_no: form.mobile_banking_ac_no.trim(),
        nominee_name1: form.nominee_name1.trim(),
        nominee_relation1: form.nominee_relation1.trim(),
        nominee_age1: form.nominee_age1 ? Number(form.nominee_age1) : "",
        nominee_mobile1: form.nominee_mobile1.trim(),
        nominee_percentage1: form.nominee_percentage1 ? Number(form.nominee_percentage1) : "",
        nominee_name2: form.nominee_name2.trim(),
        nominee_relation2: form.nominee_relation2.trim(),
        nominee_age2: form.nominee_age2 ? Number(form.nominee_age2) : "",
        nominee_mobile2: form.nominee_mobile2.trim(),
        nominee_percentage2: form.nominee_percentage2 ? Number(form.nominee_percentage2) : "",
        avatar: avatarFile,
      }).unwrap();

      setSuccessMessage("User updated successfully.");
      setForm((current) => ({ ...current, password: "" }));
      setTimeout(() => navigate("/users"), 600);
    } catch (error) {
      setErrorMessage(getApiErrorMessage(error, "User update failed."));
    }
  };

  if (!Number.isFinite(userId) || userId <= 0) {
    return (
      <div className="min-h-screen bg-slate-50 p-5 text-sm font-bold text-red-700">
        Invalid user id.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto w-full max-w-107.5 bg-white">
        <div className="bg-[#07277F] px-4 py-4 text-white">
          <Link to="/users" className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
            Back to users
          </Link>
          <h1 className="mt-1.5 text-lg font-black">Edit User</h1>
          <p className="mt-1 text-[11px] text-blue-100">
            Update profile, reporting line, banking, and nominee details
          </p>
        </div>

        {isLoading || isFetching ? (
          <div className="p-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-bold text-[#07277F]">
              Loading user details...
            </div>
          </div>
        ) : null}

        {isError ? (
          <div className="p-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">
              Could not load user details.
            </div>
          </div>
        ) : null}

        {!isLoading && !isError && detail ? (
          <form onSubmit={handleSubmit} className="space-y-3.5 p-4">
            {errorMessage ? (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">
                {errorMessage}
              </div>
            ) : null}

            {successMessage ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                {successMessage}
              </div>
            ) : null}

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <div className="flex items-center gap-3">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt={form.name || "User"}
                    className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
                  />
                ) : (
                  <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#07277F] text-xl font-black text-white">
                    {(form.name || "U").slice(0, 1).toUpperCase()}
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-black text-slate-900">
                    {form.name || "Unnamed user"}
                  </p>
                  <p className="mt-0.5 text-[11px] font-semibold text-slate-500">
                    {form.uid || "No UID"} {form.email ? `· ${form.email}` : ""}
                  </p>
                  <label className="mt-2 inline-flex cursor-pointer items-center rounded-xl bg-slate-100 px-3 py-1.5 text-[11px] font-black text-[#07277F]">
                    Upload avatar
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) =>
                        setAvatarFile(event.target.files?.[0] ?? null)
                      }
                    />
                  </label>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Basic Information</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">

                <label className="sm:col-span-2">
                  <span className={labelClass}>Name</span>
                  <input className={inputClass} value={form.name} onChange={(e) => setField("name", e.target.value)} />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Email</span>
                  <input className={inputClass} type="email" value={form.email} onChange={(e) => setField("email", e.target.value)} />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Phone</span>
                  <input className={inputClass} value={form.phone_number} onChange={(e) => setField("phone_number", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Designation</span>
                  <select className={inputClass} value={form.designation} onChange={(e) => setField("designation", e.target.value)}>
                    {designationOptions.map((option) => (
                      <option key={option.value || "empty"} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Role</span>
                  <select className={inputClass} value={form.role_id} onChange={(e) => setField("role_id", e.target.value)}>
                    <option value="">Select role</option>
                    {roleOptions.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  <span className={labelClass}>Status</span>
                  <select className={inputClass} value={form.status} onChange={(e) => setField("status", e.target.value)}>
                    <option value="1">Active</option>
                    <option value="0">Inactive</option>
                  </select>
                </label>
                <label>
                  <span className={labelClass}>New Password</span>
                  <input
                    className={inputClass}
                    type="password"
                    value={form.password}
                    onChange={(e) => setField("password", e.target.value)}
                    placeholder="Leave blank to keep current password"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Reporting Line</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  ["reference", "Reference"],
                  ["mo", "Marketing Officer"],
                  ["agm", "Assistant General Manager"],
                  ["gm", "General Manager"],
                  ["ed", "Executive Director"],
                ].map(([field, label]) => (
                  <label key={field}>
                    <span className={labelClass}>{label}</span>
                    <select
                      className={inputClass}
                      value={form[field as keyof FormState]}
                      onChange={(e) => setField(field as keyof FormState, e.target.value)}
                    >
                      <option value="">None</option>
                      {teamOptions.map((user) => (
                        <option key={user.id} value={user.id}>
                          {user.name || "Unnamed"} {user.uid ? `(${user.uid})` : ""}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Personal Details</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Father Name</span>
                  <input className={inputClass} value={form.father_name} onChange={(e) => setField("father_name", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Mother Name</span>
                  <input className={inputClass} value={form.mother_name} onChange={(e) => setField("mother_name", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Spouse</span>
                  <input className={inputClass} value={form.husband_spouse} onChange={(e) => setField("husband_spouse", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Education</span>
                  <input className={inputClass} value={form.education} onChange={(e) => setField("education", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>NID</span>
                  <input className={inputClass} value={form.nid} onChange={(e) => setField("nid", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Date Of Birth</span>
                  <input className={inputClass} type="date" value={form.dob} onChange={(e) => setField("dob", e.target.value)} />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Permanent Address</span>
                  <textarea className={textareaClass} value={form.permanent_address} onChange={(e) => setField("permanent_address", e.target.value)} />
                </label>
                <label className="sm:col-span-2">
                  <span className={labelClass}>Present Address</span>
                  <textarea className={textareaClass} value={form.present_address} onChange={(e) => setField("present_address", e.target.value)} />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Banking</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label>
                  <span className={labelClass}>Bank Name</span>
                  <input className={inputClass} value={form.bank_name} onChange={(e) => setField("bank_name", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Branch Name</span>
                  <input className={inputClass} value={form.branch_name} onChange={(e) => setField("branch_name", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Account Number</span>
                  <input className={inputClass} value={form.bank_account_no} onChange={(e) => setField("bank_account_no", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Routing Number</span>
                  <input className={inputClass} value={form.bank_routing_no} onChange={(e) => setField("bank_routing_no", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Mobile Banking Portal</span>
                  <input className={inputClass} value={form.mobile_banking_portal} onChange={(e) => setField("mobile_banking_portal", e.target.value)} />
                </label>
                <label>
                  <span className={labelClass}>Mobile Banking Account</span>
                  <input className={inputClass} value={form.mobile_banking_ac_no} onChange={(e) => setField("mobile_banking_ac_no", e.target.value)} />
                </label>
              </div>
            </section>

            {[1, 2].map((index) => (
              <section key={index} className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
                <h2 className="text-sm font-black text-slate-900">Nominee {index}</h2>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="sm:col-span-2">
                    <span className={labelClass}>Name</span>
                    <input className={inputClass} value={form[`nominee_name${index}` as keyof FormState]} onChange={(e) => setField(`nominee_name${index}` as keyof FormState, e.target.value)} />
                  </label>
                  <label>
                    <span className={labelClass}>Relation</span>
                    <input className={inputClass} value={form[`nominee_relation${index}` as keyof FormState]} onChange={(e) => setField(`nominee_relation${index}` as keyof FormState, e.target.value)} />
                  </label>
                  <label>
                    <span className={labelClass}>Age</span>
                    <input className={inputClass} inputMode="numeric" type={"number"} value={form[`nominee_age${index}` as keyof FormState]} onChange={(e) => setField(`nominee_age${index}` as keyof FormState, e.target.value)} />
                  </label>
                  <label>
                    <span className={labelClass}>Mobile</span>
                    <input className={inputClass} value={form[`nominee_mobile${index}` as keyof FormState]} onChange={(e) => setField(`nominee_mobile${index}` as keyof FormState, e.target.value)} />
                  </label>
                  <label>
                    <span className={labelClass}>Percentage</span>
                    <input className={inputClass} inputMode="numeric" type={"number"} value={form[`nominee_percentage${index}` as keyof FormState]} onChange={(e) => setField(`nominee_percentage${index}` as keyof FormState, e.target.value)} />
                  </label>
                </div>
              </section>
            ))}

            <div className="grid grid-cols-2 gap-2 pt-1">
              <Link
                to="/users"
                className="grid h-10 place-items-center rounded-xl border border-slate-200 bg-white text-sm font-black text-slate-700"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="grid h-10 place-items-center rounded-xl bg-[#07277F] text-sm font-black text-white disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        ) : null}
      </div>
    </div>
  );
};

export default EditForm;
