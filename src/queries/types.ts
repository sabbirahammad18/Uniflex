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
};

export type EarningCategory = {
  category_name: string;
  total_amount: number;
  total_customers: number;
  customers: EarningCustomer[];
};

export type EarningBreakdownResponse = {
  earnings_breakdown: EarningCategory[];
  total_commission: number;
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
