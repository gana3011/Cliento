'use client';

import { Button } from 'antd';
import { LogoutOutlined } from '@ant-design/icons';
import { supabase } from '../lib/supabase/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NavBar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
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
          fontWeight: 'bold'
        }}
      >
        Logout
      </Button>
    </header>
  );
};

export default NavBar;