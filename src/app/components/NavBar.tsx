'use client';

import { Button } from 'antd';
import { LogoutOutlined, LoginOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

const NavBar = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    
    getUser();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleLogin = () => {
    router.push('/login');
  };

  return (
    <header 
      className="flex justify-between items-center px-6 py-4 shadow-lg"
      style={{ backgroundColor: '#A9BD93' }} 
    >
      <h1 className="text-2xl font-bold text-white m-0">
        <Link 
          href="/" 
          className=" hover:text-white no-underline"
          style={{ color: '#FFFDF6'}} 
        >
          Cliento
        </Link>
      </h1>
      
      {!loading && (
        <>
          {user ? (
            <Button 
              type="text" 
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              className="text-white border-none hover:opacity-80 transition-all duration-200"
              style={{ 
                backgroundColor: '#A9BD93', 
                color: '#FFFDF6',
                borderRadius: '8px',
                padding: '8px 16px',
                height: 'auto',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Logout
            </Button>
          ) : (
            <Button 
              type="text" 
              icon={<LoginOutlined />}
              onClick={handleLogin}
              className="text-white border-none hover:opacity-80 transition-all duration-200"
              style={{ 
                backgroundColor: '#A9BD93', 
                color: '#FFFDF6',
                borderRadius: '8px',
                padding: '8px 16px',
                height: 'auto',
                fontWeight: 'bold',
                fontSize: '16px'
              }}
            >
              Login
            </Button>
          )}
        </>
      )}
    </header>
  );
};

export default NavBar;