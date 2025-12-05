import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Check active session
    const checkUser = async () => {
      try {
        // First check for admin backdoor session
        const adminUser = localStorage.getItem('admin_user');
        const adminProfile = localStorage.getItem('admin_profile');
        
        if (adminUser && adminProfile) {
          console.log('✅ Admin backdoor session found');
          setUser(JSON.parse(adminUser));
          setProfile(JSON.parse(adminProfile));
          setLoading(false);
          return;
        }

        // Then check Supabase session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // 2. Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user ? 'User logged in' : 'No user');
      
      if (session?.user) {
        setUser(session.user);
        await fetchProfile(session.user.id);
        setLoading(false);
      } else {
        setUser(null);
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      console.log('Profile fetched:', data);
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error);
      // Fallback for new users
      const fallbackProfile = { id: userId, credits: 5, subscription_plan: 'free' };
      console.log('Using fallback profile:', fallbackProfile);
      setProfile(fallbackProfile); 
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      
      // Clear admin backdoor session
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_profile');
      
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      localStorage.removeItem('admin_user');
      localStorage.removeItem('admin_profile');
      setUser(null);
      setProfile(null);
      window.location.href = "/";
    }
  };

  const value = {
    user,
    profile,
    loading,
    isPro: profile?.subscription_plan === 'pro',
    credits: profile?.credits || 0,
    signOut,
    setUser,
    setProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
