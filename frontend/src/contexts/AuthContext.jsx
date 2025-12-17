import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../utils/supabase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Refs to prevent race conditions
  const isFetchingProfile = useRef(false);
  const lastFetchedUserId = useRef(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Check active session - only runs once on mount
    const checkUser = async () => {
      if (isInitialized.current) return;
      isInitialized.current = true;

      try {
        console.log('🔍 Checking for active session...');
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          console.log('✅ Session found:', session.user.email);
          setUser(session.user);
          await fetchProfile(session.user.id);
        } else {
          console.log('❌ No active session');
        }
      } catch (error) {
        console.error("Auth init error:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();

    // Listen for auth state changes - minimal handling
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('🔄 Auth event:', event);

      // Only handle explicit sign out
      if (event === 'SIGNED_OUT') {
        console.log('👋 User signed out - clearing state');
        setUser(null);
        setProfile(null);
        lastFetchedUserId.current = null;
        setLoading(false);
        return;
      }

      // Only handle fresh sign in
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('👤 User signed in:', session.user.email);
        setUser(session.user);
        // Only fetch if different user
        if (lastFetchedUserId.current !== session.user.id) {
          fetchProfile(session.user.id);
        }
        setLoading(false);
        return;
      }

      // For TOKEN_REFRESHED - just update user object, keep profile
      if (event === 'TOKEN_REFRESHED' && session?.user) {
        setUser(session.user);
        // Don't refetch profile - it's fine
        return;
      }

      // For all other events - do nothing to prevent flickering
      // The profile we have is fine, don't touch it
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId) => {
    // Prevent concurrent fetches
    if (isFetchingProfile.current) {
      console.log('⏳ Profile fetch already in progress, skipping');
      return;
    }

    // Skip if we already have this user's profile
    if (lastFetchedUserId.current === userId && profile) {
      console.log('📋 Profile already loaded for this user');
      return;
    }

    isFetchingProfile.current = true;

    // Only show loading on initial load
    if (!profile) {
      setProfileLoading(true);
    }

    try {
      console.log('📋 Fetching profile for:', userId);

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('❌ Profile fetch error:', error.message);
        // Keep existing profile if we have one
        if (!profile) {
          setProfile({ id: userId, credits: 2, subscription_plan: 'free' });
        }
      } else if (data) {
        console.log('✅ Profile loaded:', data.subscription_plan, 'credits:', data.credits);
        setProfile(data);
        lastFetchedUserId.current = userId;
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
      // Keep existing profile
    } finally {
      isFetchingProfile.current = false;
      setProfileLoading(false);
    }
  };

  // Manual refresh - for after purchases, etc.
  const refreshProfile = async () => {
    if (!user) return;

    console.log('🔄 Manual profile refresh requested');
    lastFetchedUserId.current = null; // Force refetch
    await fetchProfile(user.id);
  };

  const signOut = async () => {
    try {
      console.log('🔓 Signing out...');
      await supabase.auth.signOut();
      // State will be cleared by onAuthStateChange handler
    } catch (error) {
      console.error("Logout error:", error);
      // Force clear on error
      setUser(null);
      setProfile(null);
      lastFetchedUserId.current = null;
    }
    window.location.href = "/";
  };

  const value = {
    user,
    profile,
    loading,
    profileLoading,
    isPro: ['pro', 'pre', 'premium'].includes(profile?.subscription_plan),
    isPremium: ['pre', 'premium'].includes(profile?.subscription_plan),
    subscriptionPlan: profile?.subscription_plan || 'free',
    credits: profile?.credits || 0,
    signOut,
    setUser,
    setProfile,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
