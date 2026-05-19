import { supabase } from './supabaseClient';

export interface UserLink {
  id?: string;
  user_id: string;
  title: string;
  url: string;
  type: 'movie' | 'sound' | 'article' | 'other';
  created_at?: string;
}

export const linkService = {
  async saveLink(link: Omit<UserLink, 'id' | 'created_at' | 'user_id'>) {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('用户未登录');

    const { data, error } = await supabase
      .from('user_links')
      .insert([
        {
          ...link,
          user_id: user.id,
        },
      ])
      .select();

    if (error) throw error;
    return data[0];
  },

  async getUserLinks() {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) throw new Error('用户未登录');

    const { data, error } = await supabase
      .from('user_links')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as UserLink[];
  },

  async deleteLink(id: string) {
    const { error } = await supabase
      .from('user_links')
      .delete()
      .match({ id });

    if (error) throw error;
  }
};
