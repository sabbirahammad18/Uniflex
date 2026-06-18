export type ApiUser = {
  id: number;
  uid: string | null;
  name: string | null;
  email: string | null;
  phone_number?: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  wallet_balance?: number | string | null;
  role_id?: number | string | null;
  designation?: string | null;
  role?: string | null;
};

export type ApiMessageResponse = {
  message?: string;
};

export type AuthResponse = {
  message?: string;
  user: ApiUser;
};

export type LoginCredentials = {
  login: string;
  password: string;
};

export type ForgotPasswordPayload = {
  login: string;
};

export type VerifyOtpPayload = {
  otp: string;
};

export type ResetPasswordPayload = {
  password: string;
  password_confirmation: string;
};

export type UserProfile = {
  id: number;
  uid: string | null;
  name: string | null;
  email: string | null;
  phone_number: string | null;
  avatar?: string | null;
  avatar_url?: string | null;
  wallet_balance?: number | string | null;
};

export type ProfileResponse = {
  message?: string;
  data: UserProfile;
};

export type UpdateProfilePayload = {
  name?: string;
  phone_number?: string;
  avatar?: File | null;
};

export type ChangePasswordPayload = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

export type ProjectSummary = {
  imageUrl: string | undefined;
  id: number;
  title: string;
  location: string;
  status: boolean;
  image: string | null;
};

export type ProjectDetails = {
  id: number;
  project_id: string;
  project_name: string;
  location: string;
  avenue: string;
  road: string;
  plot: string;
  video: string;
  per_share_plot_cost: string | number;
  per_share_plot_cost_in_text: string;
  per_share_flat_cost: string | number;
  per_share_flat_cost_in_text: string;
  description: string;
  image: string | null;
};

export type Booking = {
  project_id: number;
  booking_id: number;
  is_approved:number;
  user_id: number | null;
  customer_uid: string | null;
  user_name: string | null;
  project_name: string | null;
  plot_price: number;
  project_status:string;
  booking_money: number;
  down_payment: number;
  installment_amount: number;
  total_paid_amount: number;
  remaining_amount: number;
  plot_size_khata: string | number | null;
  last_entry_date: string | null;
};

export interface BookingListResponse {
  current_page: number;
  per_page: number;
  total: number;
  last_page: number;
  data: Booking[];
}

export type CustomerBooking = {
  booking_id: number;
  project_id: number | null;
  project_name: string | null;
  project_status: string | number | boolean | null;
  booking_type: string | number | null;
  booking_date: string | null;
  plot_price: number;
  booking_money: number;
  down_payment: number;
  installment_amount: number;
  total_paid_amount: number;
  remaining_amount: number;
  plot_size_katha: string | number | null;
  property_no: string | null;
  last_entry_date: string | null;
  status: number;
  status_label: string;
};

export type Customer = {
  user_id: number;
  customer_uid: string | null;
  name: string | null;
  phone_number: string | null;
  status: number;
  status_label: string;
  bookings: CustomerBooking[];
};

export type CustomerListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export type CustomerListResponse = {
  data: Customer[];
  pagination: Pagination;
};

export type EarningCustomer = {
  customer_id: number | null;
  customer_uid: string | null;
  customer_name: string | null;
  amount: number;
  date: string | null;
  road_no: string;
  block_no: string;
  sector_no: string;
  property_no: string;
  withdraw: number;
  total_amount: number;
  pending_withdraw_amount: number;
};

export type EarningCategory = {
  category_name: string;
  total_amount: number;
  total_customers: number;
  customers: EarningCustomer[];
  category_id:number;
};

export type EarningBreakdownResponse = {
  earnings_breakdown: EarningCategory[];
  total_commission: number;
  total_income?: number;
  total_expense?: number;
};

export type PaymentSummary = {
  user_id: string;
  user_name: string;
  plot_price: number;
  booking_money: number;
  down_payment: number;
  installment_amount: number;
  total_paid_amount: number;
  remaining_amount: number;
  plot_size_khata: number;
};

export type PayoutBalance = {
  total_balance: number;
  approved_amount: number;
  pending_amount: number;
  remaining_balance: number;
};

export type PayoutBalanceResponse = {
  data: PayoutBalance;
};

export type PayoutRequestPayload = {
  amount: number;
  payment_method: "Cash" | "Bank" | "Gateway";
};

export type PayoutRequest = {
  request_id: number;
  user_id?: string;
  user_name?: string;
  amount: number;
  payment_method?: string;
  status: string;
  total_balance?: number;
  pending_amount?: number;
  remaining_balance?: number;
  receipt_url?: string;
  date?: string;
};

export type PayoutRequestResponse = {
  data: PayoutRequest;
};

export type PayoutHistoryResponse = {
  data: PayoutRequest[];
};

export type RecentTransaction = {
  id: number;
  title: string;
  amount: number;
  transaction_id: string | null;
  status: string;
  date: string | null;
  created_at: string | null;
};

export type Pagination = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export type RecentTransactionsResponse = {
  data: RecentTransaction[];
  pagination: Pagination;
};

export type ManagementFilterOption = {
  value: string | number;
  label: string;
};

export type ManagementRoleOption = {
  id: number;
  name: string;
};

export type ManagementUser = {
  id: number;
  name: string | null;
  uid: string | null;
  email: string | null;
  phone_number: string | null;
  avatar: string | null;
  avatar_url: string | null;
  role_id: number | null;
  role_name: string | null;
  designation: string | null;
  status: number;
  status_label: string;
  joined_at: string | null;
  joined_at_human: string | null;
};

export type ManagementUsersResponse = {
  data: ManagementUser[];
  pagination: Pagination;
  filters: {
    roles: ManagementRoleOption[];
    statuses: ManagementFilterOption[];
  };
};

export type ManagementUsersParams = {
  page?: number;
  per_page?: number;
  search?: string;
  role_id?: number | "";
  status?: number | "";
};

export type ManagementUserDetail = {
  father_name: string | null;
  mother_name: string | null;
  husband_spouse: string | null;
  nid: string | null;
  dob: string | null;
  education: string | null;
  permanent_address: string | null;
  present_address: string | null;
  bank_name: string | null;
  branch_name: string | null;
  bank_account_no: string | null;
  bank_routing_no: string | null;
  mobile_banking_portal: string | null;
  mobile_banking_ac_no: string | null;
};

export type ManagementUserNominee = {
  id: number;
  name: string | null;
  relation: string | null;
  age: number | null;
  mobile_number: string | null;
  percentage: number | null;
};

export type ManagementUserRole = {
  id: number;
  name: string;
};

export type ManagementUserProfile = {
  id: number;
  uid: string | null;
  name: string | null;
  email: string | null;
  phone: string | null;
  phone_number: string | null;
  avatar: string | null;
  avatar_url: string | null;
  role_id: number | null;
  role: ManagementUserRole | null;
  designation: string | null;
  reference: number | null;
  mo: number | null;
  agm: number | null;
  gm: number | null;
  ed: number | null;
  status: number | boolean | null;
  details: ManagementUserDetail | null;
  nominees: ManagementUserNominee[];
};

export type ManagementUserProfileResponse = {
  success?: boolean;
  data: ManagementUserProfile;
};

export type UpdateManagementUserPayload = {
  id?: number;
  name?: string;
  email?: string;
  role_id?: number | "";
  designation?: string;
  phone_number?: string;
  password?: string;
  avatar?: File | null;
  uid?: string;
  reference?: number | "";
  mo?: number | "";
  agm?: number | "";
  gm?: number | "";
  ed?: number | "";
  status?: number | boolean;
  father_name?: string;
  mother_name?: string;
  husband_spouse?: string;
  nid?: string;
  dob?: string;
  education?: string;
  permanent_address?: string;
  present_address?: string;
  bank_name?: string;
  branch_name?: string;
  bank_account_no?: string;
  bank_routing_no?: string;
  mobile_banking_portal?: string;
  mobile_banking_ac_no?: string;
  nominee_name1?: string;
  nominee_relation1?: string;
  nominee_age1?: number | "";
  nominee_mobile1?: string;
  nominee_percentage1?: number | "";
  nominee_name2?: string;
  nominee_relation2?: string;
  nominee_age2?: number | "";
  nominee_mobile2?: string;
  nominee_percentage2?: number | "";
};

export type ManagementBooking = {
  booking_id: number;
  is_approved: number;
  customer_uid: string | null;
  customer_name: string | null;
  phone_number: string | null;
  project_name: string | null;
  payable_amount: number;
  paid_amount: number;
  due_amount: number;
  payment_status: "due" | "paid";
  created_at: string | null;
  money_receipt_url: string | null;
};

export type ManagementBookingsResponse = {
  data: ManagementBooking[];
  pagination: Pagination;
  filters: {
    statuses: ManagementFilterOption[];
    payment_statuses: ManagementFilterOption[];
  };
};

export type ManagementBookingsParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: number | "";
  payment_status?: "due" | "paid" | "";
};

export type PendingBookingEditResponse = {
  data: {
    booking: {
      id: number;
      project_id: number | null;
      user_id: number | null;
      reference_user_id: number | null;
      mo_id: number | null;
      agm_id: number | null;
      gm_id: number | null;
      ed_id: number | null;
      have_to_pay_amount: number | string | null;
      paid: number | string | null;
      booking_type: string | null;
      is_approved: number;
      project: {
        id: number | null;
        title: string | null;
      } | null;
      user: {
        id: number | null;
        uid: string | null;
        name: string | null;
        email: string | null;
        phone: string | null;
        phone_number: string | null;
      } | null;
    };
    info: Record<string, string | number | null>;
    first_payment: {
      id: number;
      receipt_no: string | null;
      amount: number | string | null;
      date: string | null;
    } | null;
    options: {
      projects: { id: number; title: string }[];
      users: { id: number; uid: string | null; name: string | null }[];
      accounts: { id: number; title: string }[];
    };
  };
};

export type PendingBookingPropertyCheckPayload = {
  booking_id?: number;
  sector_no: string;
  block_no: string;
  road_no: string;
  property_no: string;
};

export type PendingBookingPropertyCheckResponse = {
  status: number;
  booked: boolean;
  available: boolean;
  message?: string;
  customer_name?: string | null;
  errors?: Record<string, string[]>;
};

export type PendingBookingUpdatePayload = {
  id: number;
  applicant_name_english: string;
  customer_mobile: string;
  customer_email?: string;
  customer_id?: string;
  applicant_name_bengali?: string;
  father_name_bengali?: string;
  father_name_english?: string;
  mother_name_bengali?: string;
  mother_name_english?: string;
  husband_wife_name_bengali?: string;
  husband_wife_name_english?: string;
  current_address_bengali?: string;
  current_address_english?: string;
  permanent_address_Bengali?: string;
  permanent_address_english?: string;
  dob?: string;
  national_id_passport_no?: string;
  emergency_mobile_no?: string;
  nationality?: string;
  religion?: string;
  tin_no?: string;
  profession?: string;
  mo_id: number;
  agm_id: number;
  gm_id: number;
  ed_id: number;
  "1st_nominee"?: string;
  "1st_nominee_relation"?: string;
  "1st_nominee_mobile"?: string;
  "1st_nominee_share"?: string;
  "1st_nominee_photo"?: string;
  "2nd_nominee"?: string;
  "2nd_nominee_relation"?: string;
  "2nd_nominee_mobile"?: string;
  "2nd_nominee_share"?: string;
  "2nd_nominee_photo"?: string;
  property_no: string;
  road_no: string;
  block_no: string;
  sector_no: string;
  file_id_no?: string;
  size_of_property_katha: string;
  size_of_property_land_percentage?: string;
  property_price_digit: number | string;
  property_price_text: string;
  property_price_text_bangla?: string;
  branch?: string;
  bank?: string;
  total_year?: string;
  swift_code_routing_no?: string;
  total_instalment?: string;
  have_to_pay_amount: number | string;
  have_to_pay_amount_text?: string;
  payment_gatway: number;
  office_only_money_receipt_no: string;
  r_u_a_loan_recipient?: string;
  witness_name_1?: string;
  witness_mobile_number_1?: string;
  witness_address_1?: string;
  witness_name_2?: string;
  witness_mobile_number_2?: string;
  witness_address_2?: string;
  office_only_booking_others?: string;
  office_only_booking_chart_making?: string;
  avatar?: File | null;
  booking_type?: string;
  [key: string]: string | number | File | null | undefined;
};

export type AppNotification = {
  id: string;
  title: string;
  message: string;
  type: string;
  action_url: string | null;
  meta: {
    booking_id?: number;
    payment_id?: number;
    receipt_url?: string;
    [key: string]: unknown;
  };
  read_at: string | null;
  created_at: string | null;
  created_at_human: string | null;
};

export type NotificationListParams = {
  page?: number;
  per_page?: number;
};

export type NotificationListResponse = {
  data: AppNotification[];
  unread_count: number;
  pagination: Pagination;
};

export type NotificationMutationResponse = {
  message?: string;
  data?: AppNotification;
  unread_count: number;
};

export type PromotionStatus = {
  current_position: string;
  next_position?: string | null;
  target_katha: number;
  achieved_katha: number;
  remaining_katha: number;
  target_down_payment?: number;
  achieved_down_payment?: number;
  remaining_down_payment?: number;
  progress_percent: number;
};

export type PlotSearch = {
  sector_no: string;
  block: string;
  road_no: string;
  plot: string;
};

export type UserTreeNode = {
  user: ApiUser & {
    reference?: number | null;
    ed?: number | null;
    gm?: number | null;
    agm?: number | null;
    mo?: number | null;
  };
  children: UserTreeNode[];
};

export type UserTreeResponse = {
  message?: string;
  data: UserTreeNode;
};
