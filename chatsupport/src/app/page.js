'use client';

import { usePathname } from 'next/navigation';
import SignIn from './signin/page'; // Adjust based on your file structure
import SignUp from './signup/page'; // Adjust based on your file structure

const Page = () => {
  const pathname = usePathname();

  switch (pathname) {
    case '/signin':
      return <SignIn />;
    case '/signup':
      return <SignUp />;
    default:
      return <SignUp />; // Render Sign Up page by default
  }
};

export default Page;
