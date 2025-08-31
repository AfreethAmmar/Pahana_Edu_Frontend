import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { getInitials } from '../../utils/helpers';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = async () => {
    setShowLogoutModal(false);
    await logout();
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <button
              type="button"
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={onMenuClick}
            >
              <span className="sr-only">Open sidebar</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="ml-3 text-2xl font-bold text-gray-900 lg:ml-0">
              Pahana Bookshop
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <span>Welcome back,</span>
              <span className="font-medium text-gray-900">
                {user?.firstName || user?.username}
              </span>
            </div>

            <div className="relative">
              <button
                type="button"
                className="flex items-center space-x-2 p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                onClick={() => setShowProfileMenu(!showProfileMenu)}
              >
                <div className="h-8 w-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                  {getInitials(user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.username || 'User')}
                </div>
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                  <div className="px-4 py-2 border-b border-gray-200">
                    <p className="text-sm font-medium text-gray-900">
                      {user?.firstName && user?.lastName 
                        ? `${user.firstName} ${user.lastName}` 
                        : user?.username}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                    <p className="text-xs text-blue-600 font-medium mt-1">
                      {user?.role}
                    </p>
                  </div>
                  
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to profile page
                    }}
                  >
                    View Profile
                  </button>
                  
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => {
                      setShowProfileMenu(false);
                      // Navigate to settings page
                    }}
                  >
                    Settings
                  </button>
                  
                  <hr className="my-1" />
                  
                  <button
                    className="block w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50"
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoutModal(true);
                    }}
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Confirm Logout"
      >
        <div className="space-y-4">
          <p className="text-gray-600">
            Are you sure you want to log out? You will need to sign in again to access your account.
          </p>
          
          <div className="flex justify-end space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowLogoutModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleLogout}
            >
              Log Out
            </Button>
          </div>
        </div>
      </Modal>

      {showProfileMenu && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => setShowProfileMenu(false)}
        />
      )}
    </>
  );
};

export default Header;