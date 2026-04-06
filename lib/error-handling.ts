import { AuthError } from '@supabase/supabase-js';

type AuthErrorMapping = {
  [key: string]: string;
};

// Map Supabase AuthError codes/messages → Vietnamese user-friendly messages
const supabaseErrorMessages: AuthErrorMapping = {
  // Sign in
  invalid_credentials: 'Email hoặc mật khẩu không đúng.',
  user_not_found: 'Không tìm thấy tài khoản với email này.',

  // Email verification
  email_not_confirmed: 'Email chưa được xác thực. Vui lòng kiểm tra hộp thư.',
  otp_expired: 'Mã OTP đã hết hạn. Vui lòng đăng ký lại.',
  token_expired: 'Mã OTP đã hết hạn. Vui lòng thử lại.',
  otp_disabled: 'Xác thực OTP không được bật.',

  // Sign up
  user_already_exists: 'Email này đã được đăng ký.',
  email_exists: 'Email này đã được sử dụng bởi một tài khoản khác.',
  weak_password: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.',

  // Rate limiting
  over_request_rate_limit: 'Quá nhiều yêu cầu. Vui lòng thử lại sau vài phút.',
  over_email_send_rate_limit: 'Đã gửi quá nhiều email. Vui lòng chờ trước khi thử lại.',

  // Network / general
  network_failure: 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.',
};

export const getSupabaseErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  if (error instanceof AuthError) {
    const code = error.code;
    if (code && supabaseErrorMessages[code]) return supabaseErrorMessages[code];

    // Fallback: match on message content
    const msg = error.message?.toLowerCase() ?? '';
    if (msg.includes('invalid login credentials')) return supabaseErrorMessages['invalid_credentials'];
    if (msg.includes('email not confirmed')) return supabaseErrorMessages['email_not_confirmed'];
    if (msg.includes('user already registered')) return supabaseErrorMessages['user_already_exists'];
    if (msg.includes('weak password')) return supabaseErrorMessages['weak_password'];

    return error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  const code = error?.code;
  if (code && supabaseErrorMessages[code]) return supabaseErrorMessages[code];

  return error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
};

export const createAuthError = (error: any): { code: string; message: string } => {
  return {
    code: error?.code || 'auth/unknown-error',
    message: getSupabaseErrorMessage(error),
  };
};

export const handleAuthError = (error: any): { code: string; message: string } => {
  console.error('Auth error:', error);
  return createAuthError(error);
};