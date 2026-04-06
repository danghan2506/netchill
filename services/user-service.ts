import { User } from '@supabase/supabase-js';
import { supabase } from '@/utils/supabase';
import { UserInfo } from '@/types/user-type';
import { decode } from 'base64-arraybuffer';
export const userService = {
  async upsertUserProfile(authUser: User): Promise<UserInfo> {
    const userInfo: UserInfo = {
      id: authUser.id,
      email: authUser.email ?? '',
      user_name:
        authUser.user_metadata?.full_name ??
        authUser.user_metadata?.name ??
        authUser.email?.split('@')[0] ??
        'Người dùng',
      avatar_url:
        authUser.user_metadata?.avatar_url ??
        authUser.user_metadata?.picture ??
        '',
    };

    const { error } = await supabase.from('users').upsert(
      {
        id: userInfo.id,
        email: userInfo.email,
        user_name: userInfo.user_name,
        avatar_url: userInfo.avatar_url,
        created_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );

    if (error) {
      console.error('Error upserting user profile:', error);
      throw error;
    }

    return userInfo;
  },

  /**
   * Lấy thông tin user từ bảng public.users.
   */
  async getUserProfile(userId: string): Promise<UserInfo | null> {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    return data as UserInfo;
  },

  /**
   * Cập nhật username trong bảng users.
   */
  async updateUsername(userId: string, username: string): Promise<void> {
    const { error } = await supabase
      .from('users')
      .update({ user_name: username })
      .eq('id', userId);

    if (error) {
      console.error('Error updating username:', error);
      throw error;
    }
  },

  /**
   * Upload avatar lên Supabase Storage bucket 'avatars'.
   * Trả về public URL của ảnh đã upload.
   */
  async uploadAvatar(
    userId: string,
    base64: string,
    mimeType: string
  ): Promise<string> {
    const extension = mimeType.includes('png') ? 'png' : 'jpg';
    const filePath = `${userId}/avatar.${extension}`;

    // Decode base64 → ArrayBuffer
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const fileData = decode(base64Data);

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, fileData, {
        contentType: mimeType,
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading avatar:', uploadError);
      throw uploadError;
    }

    const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
    const publicUrl = `${data.publicUrl}?t=${Date.now()}`; // cache bust

    // Lưu URL vào bảng users
    const { error: updateError } = await supabase
      .from('users')
      .update({ avatar_url: publicUrl })
      .eq('id', userId);

    if (updateError) {
      console.error('Error saving avatar URL:', updateError);
      throw updateError;
    }

    return publicUrl;
  },
};
