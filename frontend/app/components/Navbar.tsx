'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ROUTES } from '@/app/lib/constants';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: ROUTES.HOME, label: 'Home' },
    { href: ROUTES.PROPERTIES, label: 'Properties' },
    { href: ROUTES.BOOKINGS, label: 'My Bookings' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">StayWise</span>
          </div>

          <div className="hidden md:flex space-x-8">
            <a href="#" className="text-sm font-medium text-blue-600">Home</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">Properties</a>
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">My Bookings</a>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#" className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors">
              Login
            </a>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}