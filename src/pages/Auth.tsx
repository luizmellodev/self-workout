
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import AuthCard from '@/components/auth/AuthCard';

const Auth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  return (
    <Layout>
      <div className="flex min-h-screen items-center justify-center py-12 px-4">
        <AuthCard />
      </div>
    </Layout>
  );
};

export default Auth;
