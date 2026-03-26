import { isClerkAPIResponseError } from '@clerk/expo';

type AuthErrorMapping = {
  [key: string]: string;
};

// Map common Clerk error codes to user-friendly Vietnamese messages.
// Note: Clerk error codes can vary by configuration; this covers typical cases.
const clerkErrorMessages: AuthErrorMapping = {
  // Sign in
  form_password_incorrect: 'Mật khẩu không chính xác.',
  form_identifier_not_found: 'Không tìm thấy tài khoản với email này.',
  form_identifier_invalid: 'Địa chỉ email không hợp lệ.',

  // Sign up
  form_identifier_exists: 'Email này đã được sử dụng bởi một tài khoản khác.',
  form_password_pwned: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.',
  form_password_length_too_short: 'Mật khẩu phải có ít nhất 6 ký tự.',
  form_password_not_strong_enough: 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.',

  // Email verification
  form_code_incorrect: 'Mã xác thực không hợp lệ.',
  form_code_expired: 'Mã xác thực đã hết hạn. Vui lòng yêu cầu mã mới.',
};

export const getFirebaseErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;

  if (isClerkAPIResponseError(error)) {
    const first = error.errors?.[0];
    const code = first?.code;
    if (code && clerkErrorMessages[code]) return clerkErrorMessages[code];
    return first?.longMessage || first?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
  }

  const errorCode = error?.code;
  if (errorCode && clerkErrorMessages[errorCode]) return clerkErrorMessages[errorCode];

  return error?.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
};
  
  // Create a formatted error object
  export const createAuthError = (error: any): { code: string; message: string } => {
    return {
      code: error?.code || 'auth/unknown-error',
      message: getFirebaseErrorMessage(error)
    };
  };
  
  // Helper function to handle auth errors in one line
  export const handleAuthError = (error: any): { code: string; message: string } => {
    console.error('Auth error:', error);
    return createAuthError(error);
  };