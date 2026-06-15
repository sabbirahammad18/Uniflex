import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCheckPendingBookingPropertyMutation,
  useGetPendingBookingEditQuery,
  useUpdatePendingBookingMutation,
} from "@/queries/managementQuery";
import { getApiErrorMessage } from "@/utils/format";

type FormState = {
  customer_id: string;
  applicant_name_bengali: string;
  applicant_name_english: string;
  father_name_bengali: string;
  father_name_english: string;
  mother_name_bengali: string;
  mother_name_english: string;
  husband_wife_name_bengali: string;
  husband_wife_name_english: string;
  customer_email: string;
  current_address_bengali: string;
  current_address_english: string;
  permanent_address_Bengali: string;
  permanent_address_english: string;
  dob: string;
  customer_mobile: string;
  national_id_passport_no: string;
  emergency_mobile_no: string;
  nationality: string;
  religion: string;
  tin_no: string;
  profession: string;
  booking_type: string;
  mo_id: string;
  agm_id: string;
  gm_id: string;
  ed_id: string;
  first_nominee: string;
  first_nominee_relation: string;
  first_nominee_mobile: string;
  first_nominee_share: string;
  first_nominee_photo: string;
  second_nominee: string;
  second_nominee_relation: string;
  second_nominee_mobile: string;
  second_nominee_share: string;
  second_nominee_photo: string;
  file_id_no: string;
  sector_no: string;
  block_no: string;
  road_no: string;
  property_no: string;
  size_of_property_katha: string;
  size_of_property_land_percentage: string;
  property_price_digit: string;
  property_price_text: string;
  property_price_text_bangla: string;
  branch: string;
  bank: string;
  total_year: string;
  swift_code_routing_no: string;
  total_instalment: string;
  have_to_pay_amount: string;
  have_to_pay_amount_text: string;
  payment_gatway: string;
  office_only_money_receipt_no: string;
  r_u_a_loan_recipient: string;
  witness_name_1: string;
  witness_mobile_number_1: string;
  witness_address_1: string;
  witness_name_2: string;
  witness_mobile_number_2: string;
  witness_address_2: string;
  office_only_booking_others: string;
  office_only_booking_chart_making: string;
};

type FormKey = keyof FormState;
type FieldErrors = Partial<Record<FormKey | "avatar" | "payment_digit", string[]>>;
type PropertyState = {
  tone: "idle" | "checking" | "available" | "booked" | "invalid";
  message: string;
};

const initialState: FormState = {
  customer_id: "",
  applicant_name_bengali: "",
  applicant_name_english: "",
  father_name_bengali: "",
  father_name_english: "",
  mother_name_bengali: "",
  mother_name_english: "",
  husband_wife_name_bengali: "",
  husband_wife_name_english: "",
  customer_email: "",
  current_address_bengali: "",
  current_address_english: "",
  permanent_address_Bengali: "",
  permanent_address_english: "",
  dob: "",
  customer_mobile: "",
  national_id_passport_no: "",
  emergency_mobile_no: "",
  nationality: "",
  religion: "",
  tin_no: "",
  profession: "",
  booking_type: "",
  mo_id: "",
  agm_id: "",
  gm_id: "",
  ed_id: "",
  first_nominee: "",
  first_nominee_relation: "",
  first_nominee_mobile: "",
  first_nominee_share: "",
  first_nominee_photo: "",
  second_nominee: "",
  second_nominee_relation: "",
  second_nominee_mobile: "",
  second_nominee_share: "",
  second_nominee_photo: "",
  file_id_no: "",
  sector_no: "",
  block_no: "",
  road_no: "",
  property_no: "",
  size_of_property_katha: "",
  size_of_property_land_percentage: "",
  property_price_digit: "",
  property_price_text: "",
  property_price_text_bangla: "",
  branch: "",
  bank: "",
  total_year: "",
  swift_code_routing_no: "",
  total_instalment: "",
  have_to_pay_amount: "",
  have_to_pay_amount_text: "",
  payment_gatway: "",
  office_only_money_receipt_no: "",
  r_u_a_loan_recipient: "",
  witness_name_1: "",
  witness_mobile_number_1: "",
  witness_address_1: "",
  witness_name_2: "",
  witness_mobile_number_2: "",
  witness_address_2: "",
  office_only_booking_others: "",
  office_only_booking_chart_making: "",
};

const inputClass =
  "mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-800 outline-none transition focus:border-[#07277F]";
const readOnlyInputClass =
  "mt-1 h-10 w-full rounded-xl border border-slate-200 bg-slate-100 px-3 text-xs font-semibold text-slate-500 outline-none";
const labelClass = "text-[11px] font-bold text-slate-400";

const personalFields: Array<{ name: FormKey; label: string; type?: string; span?: string }> = [
  { name: "customer_id", label: "Customer ID", span: "sm:col-span-2" },
  { name: "applicant_name_bengali", label: "Applicant Name Bengali" },
  { name: "applicant_name_english", label: "Applicant Name" },
  { name: "father_name_bengali", label: "Father Name Bengali" },
  { name: "father_name_english", label: "Father Name English" },
  { name: "mother_name_bengali", label: "Mother Name Bengali" },
  { name: "mother_name_english", label: "Mother Name English" },
  { name: "husband_wife_name_bengali", label: "Husband/Wife Bengali" },
  { name: "husband_wife_name_english", label: "Husband/Wife English" },
  { name: "customer_email", label: "Email", type: "email" },
  { name: "customer_mobile", label: "Mobile" },
  { name: "dob", label: "DOB", type: "date" },
  { name: "national_id_passport_no", label: "National ID / Passport" },
  { name: "emergency_mobile_no", label: "Emergency Mobile" },
  { name: "nationality", label: "Nationality" },
  { name: "religion", label: "Religion" },
  { name: "tin_no", label: "TIN" },
  { name: "profession", label: "Profession" },
  { name: "current_address_bengali", label: "Current Address Bengali", span: "sm:col-span-2" },
  { name: "current_address_english", label: "Current Address English", span: "sm:col-span-2" },
  { name: "permanent_address_Bengali", label: "Permanent Address Bengali", span: "sm:col-span-2" },
  { name: "permanent_address_english", label: "Permanent Address English", span: "sm:col-span-2" },
];

const nomineeOneFields: Array<{ name: FormKey; label: string; span?: string }> = [
  { name: "first_nominee", label: "Name" },
  { name: "first_nominee_relation", label: "Relation" },
  { name: "first_nominee_mobile", label: "Mobile" },
  { name: "first_nominee_share", label: "Share" },
  { name: "first_nominee_photo", label: "Photo", span: "sm:col-span-2" },
];

const nomineeTwoFields: Array<{ name: FormKey; label: string; span?: string }> = [
  { name: "second_nominee", label: "Name" },
  { name: "second_nominee_relation", label: "Relation" },
  { name: "second_nominee_mobile", label: "Mobile" },
  { name: "second_nominee_share", label: "Share" },
  { name: "second_nominee_photo", label: "Photo", span: "sm:col-span-2" },
];

const propertyFields: Array<{ name: FormKey; label: string; placeholder?: string; span?: string }> = [
  { name: "file_id_no", label: "File / ID No.", span: "sm:col-span-2" },
  { name: "sector_no", label: "Sector" },
  { name: "block_no", label: "Block" },
  { name: "road_no", label: "Road", placeholder: "04 or AV/80" },
  { name: "property_no", label: "Plot / Share", placeholder: "44 or 44/01" },
  { name: "size_of_property_katha", label: "Size of Property (Katha)" },
  { name: "size_of_property_land_percentage", label: "Size of Property Land (%)" },
  { name: "property_price_digit", label: "Property Price (Digit)" },
  { name: "property_price_text", label: "Property Price (Text)" },
  { name: "property_price_text_bangla", label: "Property Price (Bangla Text)" },
  { name: "branch", label: "Branch" },
  { name: "bank", label: "Bank" },
  { name: "total_year", label: "Total Year" },
  { name: "swift_code_routing_no", label: "Swift Code / Routing No." },
  { name: "total_instalment", label: "Total Instalment" },
];

const witnessFields: Array<{ name: FormKey; label: string }> = [
  { name: "witness_name_1", label: "Witness Name (1st)" },
  { name: "witness_mobile_number_1", label: "Witness Mobile (1st)" },
  { name: "witness_address_1", label: "Witness Address (1st)" },
  { name: "witness_name_2", label: "Witness Name (2nd)" },
  { name: "witness_mobile_number_2", label: "Witness Mobile (2nd)" },
  { name: "witness_address_2", label: "Witness Address (2nd)" },
  { name: "office_only_booking_others", label: "Others" },
  { name: "office_only_booking_chart_making", label: "Booking Chart Making" },
];

const isValidationErrorResponse = (
  error: unknown,
): error is { data?: { errors?: Record<string, string[]> } } =>
  typeof error === "object" && error !== null && "data" in error;

const BookingEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const bookingId = Number(id);
  const [form, setForm] = useState<FormState>(initialState);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [propertyState, setPropertyState] = useState<PropertyState>({
    tone: "idle",
    message: "",
  });

  const { data, isLoading, isError, isFetching } = useGetPendingBookingEditQuery(
    bookingId,
    { skip: !Number.isFinite(bookingId) || bookingId <= 0 },
  );
  const [checkProperty, { isLoading: isCheckingProperty }] =
    useCheckPendingBookingPropertyMutation();
  const [updatePendingBooking, { isLoading: isSaving }] =
    useUpdatePendingBookingMutation();

  const payload = data?.data;

  useEffect(() => {
    if (!payload) {
      return;
    }

    const booking = payload.booking;
    const info = payload.info || {};

    setForm({
      customer_id: booking.user?.uid || "",
      applicant_name_bengali: String(info.applicant_name_bengali ?? ""),
      applicant_name_english:
        String(info.applicant_name_english ?? booking.user?.name ?? ""),
      father_name_bengali: String(info.father_name_bengali ?? ""),
      father_name_english: String(info.father_name_english ?? ""),
      mother_name_bengali: String(info.mother_name_bengali ?? ""),
      mother_name_english: String(info.mother_name_english ?? ""),
      husband_wife_name_bengali: String(info.husband_wife_name_bengali ?? ""),
      husband_wife_name_english: String(info.husband_wife_name_english ?? ""),
      customer_email: String(info.customer_email ?? booking.user?.email ?? ""),
      current_address_bengali: String(info.current_address_bengali ?? ""),
      current_address_english: String(info.current_address_english ?? ""),
      permanent_address_Bengali: String(info.permanent_address_Bengali ?? ""),
      permanent_address_english: String(info.permanent_address_english ?? ""),
      dob: String(info.dob ?? ""),
      customer_mobile: String(
        info.customer_mobile ?? booking.user?.phone_number ?? booking.user?.phone ?? "",
      ),
      national_id_passport_no: String(info.national_id_passport_no ?? ""),
      emergency_mobile_no: String(info.emergency_mobile_no ?? ""),
      nationality: String(info.nationality ?? ""),
      religion: String(info.religion ?? ""),
      tin_no: String(info.tin_no ?? ""),
      profession: String(info.profession ?? ""),
      booking_type: String(booking.booking_type ?? ""),
      mo_id: booking.mo_id ? String(booking.mo_id) : "",
      agm_id: booking.agm_id ? String(booking.agm_id) : "",
      gm_id: booking.gm_id ? String(booking.gm_id) : "",
      ed_id: booking.ed_id ? String(booking.ed_id) : "",
      first_nominee: String(info["1st_nominee"] ?? ""),
      first_nominee_relation: String(info["1st_nominee_relation"] ?? ""),
      first_nominee_mobile: String(info["1st_nominee_mobile"] ?? ""),
      first_nominee_share: String(info["1st_nominee_share"] ?? ""),
      first_nominee_photo: String(info["1st_nominee_photo"] ?? ""),
      second_nominee: String(info["2nd_nominee"] ?? ""),
      second_nominee_relation: String(info["2nd_nominee_relation"] ?? ""),
      second_nominee_mobile: String(info["2nd_nominee_mobile"] ?? ""),
      second_nominee_share: String(info["2nd_nominee_share"] ?? ""),
      second_nominee_photo: String(info["2nd_nominee_photo"] ?? ""),
      file_id_no: String(info.file_id_no ?? ""),
      sector_no: String(info.sector_no ?? ""),
      block_no: String(info.block_no ?? ""),
      road_no: String(info.road_no ?? ""),
      property_no: String(info.property_no ?? ""),
      size_of_property_katha: String(info.size_of_property_katha ?? ""),
      size_of_property_land_percentage: String(
        info.size_of_property_land_percentage ?? "",
      ),
      property_price_digit: String(info.property_price_digit ?? ""),
      property_price_text: String(info.property_price_text ?? ""),
      property_price_text_bangla: String(info.property_price_text_bangla ?? ""),
      branch: String(info.branch ?? ""),
      bank: String(info.bank ?? ""),
      total_year: String(info.total_year ?? ""),
      swift_code_routing_no: String(info.swift_code_routing_no ?? ""),
      total_instalment: String(info.total_instalment ?? ""),
      have_to_pay_amount: String(booking.have_to_pay_amount ?? ""),
      have_to_pay_amount_text: String(info.have_to_pay_amount_text ?? ""),
      payment_gatway: String(info.payment_gatway ?? ""),
      office_only_money_receipt_no: String(payload.first_payment?.receipt_no ?? ""),
      r_u_a_loan_recipient: String(info.r_u_a_loan_recipient ?? ""),
      witness_name_1: String(info.witness_name_1 ?? ""),
      witness_mobile_number_1: String(info.witness_mobile_number_1 ?? ""),
      witness_address_1: String(info.witness_address_1 ?? ""),
      witness_name_2: String(info.witness_name_2 ?? ""),
      witness_mobile_number_2: String(info.witness_mobile_number_2 ?? ""),
      witness_address_2: String(info.witness_address_2 ?? ""),
      office_only_booking_others: String(info.office_only_booking_others ?? ""),
      office_only_booking_chart_making: String(info.office_only_booking_chart_making ?? ""),
    });
    setAvatarFile(null);
    setFieldErrors({});
    setPropertyState({ tone: "idle", message: "" });
  }, [payload]);

  useEffect(() => {
    if (!payload) {
      return;
    }

    const sector = form.sector_no.trim();
    const block = form.block_no.trim();
    const road = form.road_no.trim();
    const property = form.property_no.trim();

    if (!sector || !block || !road || !property) {
      setPropertyState({ tone: "idle", message: "" });
      return;
    }

    setPropertyState((current) =>
      current.tone === "checking"
        ? current
        : { tone: "checking", message: "Checking property availability..." },
    );

    let active = true;
    const timer = window.setTimeout(async () => {
      try {
        const response = await checkProperty({
          booking_id: bookingId,
          sector_no: sector,
          block_no: block,
          road_no: road,
          property_no: property,
        }).unwrap();

        if (!active) {
          return;
        }

        if (response.booked) {
          setPropertyState({
            tone: "booked",
            message: response.customer_name
              ? `Already booked by ${response.customer_name}.`
              : "This property is already booked.",
          });
          return;
        }

        setPropertyState({
          tone: "available",
          message: "Property is available.",
        });
      } catch (error) {
        if (!active) {
          return;
        }

        const validationErrors =
          isValidationErrorResponse(error) && error.data?.errors
            ? error.data.errors
            : undefined;

        if (validationErrors) {
          setPropertyState({
            tone: "invalid",
            message:
              validationErrors.property_no?.[0] ||
              validationErrors.road_no?.[0] ||
              validationErrors.block_no?.[0] ||
              validationErrors.sector_no?.[0] ||
              "Property details are invalid.",
          });
          return;
        }

        setPropertyState({
          tone: "invalid",
          message: "Could not verify property right now.",
        });
      }
    }, 400);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [
    bookingId,
    checkProperty,
    form.block_no,
    form.property_no,
    form.road_no,
    form.sector_no,
    payload,
  ]);

  const users = payload?.options.users || [];
  const accounts = payload?.options.accounts || [];

  const errorList = useMemo(
    () => Object.values(fieldErrors).flat(),
    [fieldErrors],
  );

  const setField = (field: FormKey, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
    setErrorMessage("");
    setSuccessMessage("");
    setFieldErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  const getFieldError = (field: FormKey | "avatar" | "payment_digit") =>
    fieldErrors[field]?.[0] ?? "";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!Number.isFinite(bookingId) || bookingId <= 0) {
      setErrorMessage("Invalid booking id.");
      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setFieldErrors({});

    try {
      await updatePendingBooking({
        id: bookingId,
        customer_id: form.customer_id,
        applicant_name_bengali: form.applicant_name_bengali,
        applicant_name_english: form.applicant_name_english,
        father_name_bengali: form.father_name_bengali,
        father_name_english: form.father_name_english,
        mother_name_bengali: form.mother_name_bengali,
        mother_name_english: form.mother_name_english,
        husband_wife_name_bengali: form.husband_wife_name_bengali,
        husband_wife_name_english: form.husband_wife_name_english,
        customer_email: form.customer_email,
        current_address_bengali: form.current_address_bengali,
        current_address_english: form.current_address_english,
        permanent_address_Bengali: form.permanent_address_Bengali,
        permanent_address_english: form.permanent_address_english,
        dob: form.dob,
        customer_mobile: form.customer_mobile,
        national_id_passport_no: form.national_id_passport_no,
        emergency_mobile_no: form.emergency_mobile_no,
        nationality: form.nationality,
        religion: form.religion,
        tin_no: form.tin_no,
        profession: form.profession,
        booking_type: form.booking_type,
        mo_id: Number(form.mo_id || 0),
        agm_id: Number(form.agm_id || 0),
        gm_id: Number(form.gm_id || 0),
        ed_id: Number(form.ed_id || 0),
        "1st_nominee": form.first_nominee,
        "1st_nominee_relation": form.first_nominee_relation,
        "1st_nominee_mobile": form.first_nominee_mobile,
        "1st_nominee_share": form.first_nominee_share,
        "1st_nominee_photo": form.first_nominee_photo,
        "2nd_nominee": form.second_nominee,
        "2nd_nominee_relation": form.second_nominee_relation,
        "2nd_nominee_mobile": form.second_nominee_mobile,
        "2nd_nominee_share": form.second_nominee_share,
        "2nd_nominee_photo": form.second_nominee_photo,
        file_id_no: form.file_id_no,
        sector_no: form.sector_no,
        block_no: form.block_no,
        road_no: form.road_no,
        property_no: form.property_no,
        size_of_property_katha: form.size_of_property_katha,
        size_of_property_land_percentage: form.size_of_property_land_percentage,
        property_price_digit: form.property_price_digit,
        property_price_text: form.property_price_text,
        property_price_text_bangla: form.property_price_text_bangla,
        branch: form.branch,
        bank: form.bank,
        total_year: form.total_year,
        swift_code_routing_no: form.swift_code_routing_no,
        total_instalment: form.total_instalment,
        have_to_pay_amount: form.have_to_pay_amount,
        have_to_pay_amount_text: form.have_to_pay_amount_text,
        payment_gatway: Number(form.payment_gatway || 0),
        office_only_money_receipt_no: form.office_only_money_receipt_no,
        r_u_a_loan_recipient: form.r_u_a_loan_recipient,
        witness_name_1: form.witness_name_1,
        witness_mobile_number_1: form.witness_mobile_number_1,
        witness_address_1: form.witness_address_1,
        witness_name_2: form.witness_name_2,
        witness_mobile_number_2: form.witness_mobile_number_2,
        witness_address_2: form.witness_address_2,
        office_only_booking_others: form.office_only_booking_others,
        office_only_booking_chart_making: form.office_only_booking_chart_making,
        avatar: avatarFile,
      }).unwrap();

      setSuccessMessage("Pending booking updated successfully.");
      window.setTimeout(() => navigate("/bookings"), 700);
    } catch (error) {
      if (isValidationErrorResponse(error) && error.data?.errors) {
        setFieldErrors(error.data.errors as FieldErrors);
      }

      setErrorMessage(getApiErrorMessage(error, "Booking update failed."));
    }
  };

  const renderTextField = (
    field: { name: FormKey; label: string; type?: string; placeholder?: string; span?: string },
    options?: { readOnly?: boolean; helper?: string },
  ) => {
    const error = getFieldError(field.name);
    const className = options?.readOnly ? readOnlyInputClass : inputClass;

    return (
      <label key={field.name} className={field.span}>
        <span className={labelClass}>{field.label}</span>
        <input
          type={field.type ?? "text"}
          className={`${className}${error ? " border-red-400" : ""}`}
          value={form[field.name]}
          placeholder={field.placeholder}
          readOnly={options?.readOnly}
          onChange={(event) => setField(field.name, event.target.value)}
        />
        {options?.helper && !error && (
          <p className="mt-1 text-[11px] text-slate-400">{options.helper}</p>
        )}
        {error && <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
      </label>
    );
  };

  const renderSelectField = (
    field: { name: FormKey; label: string; options: Array<{ value: string; label: string }>; span?: string },
  ) => {
    const error = getFieldError(field.name);

    return (
      <label key={field.name} className={field.span}>
        <span className={labelClass}>{field.label}</span>
        <select
          className={`${inputClass}${error ? " border-red-400" : ""}`}
          value={form[field.name]}
          onChange={(event) => setField(field.name, event.target.value)}
        >
          <option value="">Select</option>
          {field.options.map((option) => (
            <option key={`${field.name}-${option.value}`} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-[11px] font-semibold text-red-600">{error}</p>}
      </label>
    );
  };

  if (!Number.isFinite(bookingId) || bookingId <= 0) {
    return <div className="p-5 text-sm font-bold text-red-700">Invalid booking id.</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="mx-auto w-full max-w-107.5 bg-white">
        <div className="bg-[#07277F] px-4 py-4 text-white">
          <Link to="/bookings" className="text-xs font-bold uppercase tracking-[0.2em] text-blue-200">
            Back to bookings
          </Link>
          <h1 className="mt-1.5 text-lg font-black">Edit Pending Booking</h1>
          <p className="mt-1 text-[11px] text-blue-100">
            Update the pending booking before approval
          </p>
        </div>

        {(isLoading || isFetching) && (
          <div className="p-4">
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-bold text-[#07277F]">
              Loading booking details...
            </div>
          </div>
        )}

        {isError && (
          <div className="p-4">
            <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">
              Could not load pending booking details.
            </div>
          </div>
        )}

        {!isLoading && !isError && payload && (
          <form onSubmit={handleSubmit} className="space-y-3.5 p-4">
            {errorMessage && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm font-bold text-red-700">
                {errorMessage}
              </div>
            )}

            {errorList.length > 0 && (
              <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-700">
                <p className="font-bold">Please fix the highlighted fields.</p>
                <ul className="mt-1 list-disc pl-4">
                  {errorList.map((message, index) => (
                    <li key={`${message}-${index}`}>{message}</li>
                  ))}
                </ul>
              </div>
            )}

            {successMessage && (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-3 text-sm font-bold text-emerald-700">
                {successMessage}
              </div>
            )}

            {isSaving && (
              <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-sm font-bold text-[#07277F]">
                Saving changes...
              </div>
            )}

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Customer</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {personalFields.map((field) =>
                  renderTextField(field, {
                    readOnly: field.name === "customer_id",
                    helper:
                      field.name === "customer_id" ? "Customer ID cannot be changed." : undefined,
                  }),
                )}

                <label className="sm:col-span-2">
                  <span className={labelClass}>Customer Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    className={`${inputClass}${getFieldError("avatar") ? " border-red-400" : ""}`}
                    onChange={(event) => {
                      setAvatarFile(event.target.files?.[0] ?? null);
                      setFieldErrors((current) => {
                        if (!current.avatar) {
                          return current;
                        }

                        const next = { ...current };
                        delete next.avatar;
                        return next;
                      });
                    }}
                  />
                  {getFieldError("avatar") && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                      {getFieldError("avatar")}
                    </p>
                  )}
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Hierarchy</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  { name: "mo_id" as FormKey, label: "MO" },
                  { name: "agm_id" as FormKey, label: "AGM" },
                  { name: "gm_id" as FormKey, label: "GM" },
                  { name: "ed_id" as FormKey, label: "ED" },
                ].map((field) =>
                  renderSelectField({
                    ...field,
                    options: users.map((user) => ({
                      value: String(user.id),
                      label: `${user.name || "Unnamed"}${user.uid ? ` (${user.uid})` : ""}`,
                    })),
                  }),
                )}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Nominee 1</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {nomineeOneFields.map((field) => renderTextField(field))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Nominee 2</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {nomineeTwoFields.map((field) => renderTextField(field))}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Property</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {propertyFields.map((field) =>
                  renderTextField(field, {
                    helper:
                      field.name === "property_no"
                        ? "Use separate sector, block, road, and plot/share fields."
                        : undefined,
                  }),
                )}
              </div>

              {(propertyState.message || isCheckingProperty) && (
                <div
                  className={`mt-3 rounded-xl border p-3 text-xs font-bold ${
                    propertyState.tone === "booked" || propertyState.tone === "invalid"
                      ? "border-red-100 bg-red-50 text-red-700"
                      : propertyState.tone === "available"
                        ? "border-emerald-100 bg-emerald-50 text-emerald-700"
                        : "border-blue-100 bg-blue-50 text-[#07277F]"
                  }`}
                >
                  {propertyState.message}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Payment</h2>
              <div className="mt-3 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs font-bold text-amber-700">
                Customer ID and paid amount are locked on update.
              </div>

              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {renderSelectField({
                  name: "payment_gatway",
                  label: "Payment Method",
                  options: accounts.map((account) => ({
                    value: String(account.id),
                    label: account.title,
                  })),
                })}

                {renderTextField({ name: "have_to_pay_amount", label: "Total Property Price" })}
                {renderTextField({
                  name: "have_to_pay_amount_text",
                  label: "Total Property Price (Text)",
                })}

                <label>
                  <span className={labelClass}>Booking Amount Paid</span>
                  <input
                    className={readOnlyInputClass}
                    readOnly
                    value={String(payload.booking.paid ?? "")}
                  />
                  {getFieldError("payment_digit") && (
                    <p className="mt-1 text-[11px] font-semibold text-red-600">
                      {getFieldError("payment_digit")}
                    </p>
                  )}
                </label>

                {renderTextField({
                  name: "office_only_money_receipt_no",
                  label: "Money Receipt No.",
                })}

                {renderSelectField({
                  name: "r_u_a_loan_recipient",
                  label: "Are you a loan recipient?",
                  options: [
                    { value: "yes", label: "Yes" },
                    { value: "no", label: "No" },
                  ],
                })}
              </div>
            </section>

            <section className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
              <h2 className="text-sm font-black text-slate-900">Witness & Office Info</h2>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {witnessFields.map((field) => renderTextField(field))}
              </div>
            </section>

            <div className="flex items-center justify-end gap-3">
              <Link
                to="/bookings"
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-xl bg-[#07277F] px-4 py-2 text-xs font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingEdit;
