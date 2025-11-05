import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  MoreVertical,
  User,
  Shield,
  ShieldCheck,
  Eye,
  UserX,
  UserCheck,
} from "lucide-react";
import {
  getAllUsers,
  toggleUserStatus,
  changeUserRole,
} from "../../api/user.api";
import { User as UserType } from "../../types/user.types";
import { useAuth } from "../../context/AuthContextProvider";
import toast from "react-hot-toast";

// User management interface for management dashboard
const ManagementUsers: React.FC = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch users with filters and pagination
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        pageSize,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter && { role: roleFilter }),
        ...(statusFilter && { isActive: statusFilter === "active" }),
      };

      const response = await getAllUsers(params);
      if (response.data) {
        setUsers(response.data.items || []);
        setTotalUsers(response.data.pagination?.total || 0);
        setTotalPages(response.data.pagination?.totalPages || 0);
      }
    } catch (error: any) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, searchTerm, roleFilter, statusFilter]);

  // Handle user status toggle
  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own status");
      return;
    }

    try {
      setActionLoading(userId);
      await toggleUserStatus(userId, !currentStatus);
      toast.success(
        `User ${!currentStatus ? "activated" : "deactivated"} successfully`
      );
      fetchUsers();
    } catch (error: any) {
      console.error("Error toggling user status:", error);
      toast.error("Failed to update user status");
    } finally {
      setActionLoading(null);
    }
  };

  // Handle role change
  const handleRoleChange = async (
    userId: string,
    newRole: "USER" | "ADMIN" | "MODERATOR"
  ) => {
    if (userId === currentUser?.id) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      setActionLoading(userId);
      await changeUserRole(userId, newRole);
      toast.success("User role updated successfully");
      fetchUsers();
    } catch (error: any) {
      console.error("Error changing user role:", error);
      toast.error("Failed to update user role");
    } finally {
      setActionLoading(null);
    }
  };

  // Get role badge styling
  const getRoleBadge = (role: string) => {
    const styles = {
      ADMIN: "bg-red-100 text-red-800 border-red-200",
      MODERATOR: "bg-blue-100 text-blue-800 border-blue-200",
      USER: "bg-gray-100 text-gray-800 border-gray-200",
    };
    return styles[role as keyof typeof styles] || styles.USER;
  };

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case "ADMIN":
        return <ShieldCheck size={14} />;
      case "MODERATOR":
        return <Shield size={14} />;
      default:
        return <User size={14} />;
    }
  };

  // Format role text for display
  const formatRoleText = (role: string) => {
    const roleMap: { [key: string]: string } = {
      ADMIN: "Admin",
      MODERATOR: "Moderator",
      USER: "User",
    };
    return roleMap[role] || role;
  };

  // Use totalPages from backend response instead of calculating

  // Safe date formatter for Joined column
  const formatDate = (value: string | Date | null | undefined) => {
    if (!value) return '—';
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-accent font-semibold text-gray-900">User Management</h1>
          <p className="text-gray-600">Manage users, roles, and permissions</p>
        </div>
        <div className="text-sm text-gray-500">Total Users: {totalUsers}</div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Roles</option>
              <option value="USER">User</option>
              <option value="MODERATOR">Moderator</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="p-8 text-center">
            <User className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No users found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Try adjusting your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          {user.profilePicture ? (
                            <img
                              className="h-10 w-10 rounded-full object-cover"
                              src={user.profilePicture}
                              alt={`${user.firstName} ${user.lastName}`}
                            />
                          ) : (
                            <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                              <User className="h-5 w-5 text-indigo-600" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.firstName} {user.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        {getRoleIcon(user.role)}
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadge(
                            user.role
                          )}`}
                        >
                          {formatRoleText(user.role)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.isActive
                            ? "bg-green-100 text-green-800 border-green-200"
                            : "bg-red-100 text-red-800 border-red-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.createdAt as any)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        {/* Role Change Dropdown */}
                        <select
                          value={user.role}
                          onChange={(e) =>
                            handleRoleChange(
                              user.id,
                              e.target.value as "USER" | "ADMIN" | "MODERATOR"
                            )
                          }
                          disabled={
                            actionLoading === user.id ||
                            user.id === currentUser?.id
                          }
                          className="text-xs border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                        >
                          <option value="USER">User</option>
                          <option value="MODERATOR">Moderator</option>
                          <option value="ADMIN">Admin</option>
                        </select>

                        {/* Status Toggle Button */}
                        <button
                          onClick={() =>
                            handleToggleStatus(user.id, user.isActive)
                          }
                          disabled={
                            actionLoading === user.id ||
                            user.id === currentUser?.id
                          }
                          className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium transition-colors disabled:opacity-50 ${
                            user.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-green-100 text-green-700 hover:bg-green-200"
                          }`}
                        >
                          {actionLoading === user.id ? (
                            <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                          ) : user.isActive ? (
                            <>
                              <UserX size={12} className="mr-1" />
                              Deactivate
                            </>
                          ) : (
                            <>
                              <UserCheck size={12} className="mr-1" />
                              Activate
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {(currentPage - 1) * pageSize + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(currentPage * pageSize, totalUsers)}
                </span>{" "}
                of <span className="font-medium">{totalUsers}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        currentPage === page
                          ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                          : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  );
                })}
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementUsers;