import { supabase } from '@/utils/supabase';
export const authService = {
  async signUp(email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: undefined,
      },
    });
    return { data, error };
  },
  async verifyOtp(email: string, token: string) {
    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    return { data, error };
  },
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  /**
   * Lấy session hiện tại.
   */
  async getCurrentSession() {
    const { data, error } = await supabase.auth.getSession();
    return { session: data.session, error };
  },
};
