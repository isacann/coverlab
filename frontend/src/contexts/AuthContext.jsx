import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    // Check active session
    const checkUser = async () => {
      try {
        console.log('🔍 Checking for active session...');

        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('✅ Session found:', session.user.email, 'ID:', session.user.id);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('❌ No active session');
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

    // Listen for auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Auth state changed:', event, session?.user?.email || 'No user');

      if (session?.user) {
        setUser(session.user);
        // Force fresh profile fetch on sign in to ensure latest subscription data
        const forceRefresh = event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED';
        await fetchProfile(session.user.id, forceRefresh);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId, forceRefresh = false) => {
    setProfileLoading(true);
    try {
      console.log('📋 Fetching profile for user:', userId, forceRefresh ? '(forced refresh)' : '');

      // Add timeout to prevent hanging queries
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Query timeout after 10s')), 10000)
      );

      // Use AbortController to ensure fresh request (bypasses any potential caching)
      const abortController = new AbortController();

      const queryPromise = supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .abortSignal(abortController.signal)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.error('❌ Profile fetch error:', error.message, error.code, error);
        throw error;
      }

      if (!data) {
        console.error('❌ Profile fetch returned null data');
        throw new Error('No profile data returned');
      }

      console.log('✅ Profile fetched successfully:', {
        id: data.id,
        email: data.email,
        credits: data.credits,
        subscription_plan: data.subscription_plan
      });
      setProfile(data);
    } catch (error) {
      console.error("Profile fetch error:", error.message || error);
      // Fallback for new users
      const fallbackProfile = { id: userId, credits: 5, subscription_plan: 'free' };
      console.log('⚠️ Using fallback profile:', fallbackProfile);
      setProfile(fallbackProfile);
    } finally {
      setProfileLoading(false);
    }
  };

  // Force refresh profile data - useful after subscription changes
  const refreshProfile = async () => {
    if (user) {
      console.log('🔄 Manually refreshing profile...');
      await fetchProfile(user.id, true);
    }
  };

  const signOut = async () => {
    try {
      console.log('🔓 Signing out...');

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase signOut error:", error);
      }

      // Clear local state
      setUser(null);
      setProfile(null);

      console.log('✅ Sign out successful, redirecting...');
      // Force full page reload to clear all state
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      // Force logout even if API fails
      setUser(null);
      setProfile(null);
      window.location.href = "/";
    }
  };

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    isPro: ['pro', 'pre', 'premium'].includes(profile?.subscription_plan),
    isPremium: profile?.subscription_plan === 'premium',
    subscriptionPlan: profile?.subscription_plan || 'free',
    credits: profile?.credits || 0,
    signOut,
    setUser,
    setProfile,
    refreshProfile, // Expose refresh function for manual profile updates
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
