import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, BarChart2, UserX, Settings, Search, RefreshCw, Home } from 'lucide-react';
import { getUsers, deleteUser, updateUser, getSignatures } from '../utils/storageUtils';

interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  organization?: string;
  role?: string;
  createdAt: string;
}

interface Analytics {
  totalUsers: number;
  totalDocuments: number;
  totalSignatures: number;
  activeUsers: number;
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [analytics, setAnalytics] = useState<Analytics>({
    totalUsers: 0,
    totalDocuments: 0,
    totalSignatures: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdminAuth = () => {
      const adminUser = localStorage.getItem('adminAuth');
      if (!adminUser) {
        navigate('/admin-login');
      }
    };

    checkAdminAuth();
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      // Fetch users and ensure it's an array
      const usersData = await getUsers() || [];
      setUsers(usersData);

      // Fetch signatures
      const signatures = await getSignatures() || [];
      
      // Calculate analytics
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      setAnalytics({
        totalUsers: usersData.length,
        totalDocuments: signatures.length,
        totalSignatures: signatures.length,
        activeUsers: usersData.filter(user => {
          const createdAt = new Date(user.createdAt);
          return createdAt > thirtyDaysAgo;
        }).length,
      });

      setLoading(false);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Failed to load dashboard data');
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await deleteUser(userId);
      setUsers(users.filter(user => user.id !== userId));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user');
    }
  };

  const handleUpdateUserRole = async (userId: string, newRole: string) => {
    try {
      await updateUser(userId, { role: newRole });
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
    } catch (err) {
      console.error('Error updating user role:', err);
      setError('Failed to update user role');
    }
  };

  const filteredUsers = users?.filter(user => {
    const searchString = searchTerm.toLowerCase();
    return (
      user.email.toLowerCase().includes(searchString) ||
      user.firstName?.toLowerCase().includes(searchString) ||
      user.lastName?.toLowerCase().includes(searchString) ||
      user.organization?.toLowerCase().includes(searchString)
    );
  }) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-2 text-gray-600">Manage users and monitor system analytics</p>
          </div>
          <Link
            to="/"
            className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition-colors duration-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <BarChart2 className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Users (30d)</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalDocuments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Settings className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Signatures</p>
                <p className="text-2xl font-semibold text-gray-900">{analytics.totalSignatures}</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
              <button
                onClick={() => fetchData()}
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>

            <div className="mt-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Organization
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{user.organization || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={user.role || 'user'}
                        onChange={(e) => handleUpdateUserRole(user.id, e.target.value)}
                        className="text-sm text-gray-900 border border-gray-300 rounded-md"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <UserX className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}