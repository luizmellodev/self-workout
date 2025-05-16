
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  created_at: string | null;
  updated_at: string | null;
}

// Get user profile
export const fetchProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data as Profile;
};

// Update user profile
export const updateProfile = async (
  userId: string,
  updates: {
    username?: string;
    avatar_url?: string;
  }
): Promise<boolean> => {
  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return false;
  }

  return true;
};

// Upload avatar
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<{ path: string | null; error: any }> => {
  const fileExt = file.name.split('.').pop();
  const filePath = `${userId}/avatar.${fileExt}`;

  const { error } = await supabase.storage
    .from('avatars')
    .upload(filePath, file, { upsert: true });

  if (error) {
    return { path: null, error };
  }

  // Get public URL
  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(filePath);

  // Update profile with avatar URL
  await updateProfile(userId, {
    avatar_url: data.publicUrl,
  });

  return { path: data.publicUrl, error: null };
};
