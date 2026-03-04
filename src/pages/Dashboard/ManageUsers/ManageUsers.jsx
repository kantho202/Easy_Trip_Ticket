import { useState } from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { useQuery } from '@tanstack/react-query';
import { 
    FaUser, 
    FaUserShield, 
    FaUserTie, 
    FaUserSlash,
    FaEnvelope,
    FaSearch,
    FaFilter,
    FaCrown,
    FaStore,
    FaExclamationTriangle,
    FaUsers
} from 'react-icons/fa';
import Swal from 'sweetalert2';

const ManageUsers = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');

    const { refetch, data: manageUsers = [], isLoading } = useQuery({
        queryKey: ['manageUsers'],
        queryFn: async () => {
            const res = await axiosSecure.get('/users');
            return res.data;
        }
    });

    const getRoleInfo = (role) => {
        switch (role) {
            case 'admin':
                return { 
                    color: 'text-purple-600', 
                    bg: 'bg-purple-100', 
                    border: 'border-purple-300',
                    icon: FaUserShield, 
                    text: 'Admin',
                    badgeColor: 'bg-purple-500'
                };
            case 'vendor':
                return { 
                    color: 'text-blue-600', 
                    bg: 'bg-blue-100', 
                    border: 'border-blue-300',
                    icon: FaUserTie, 
                    text: 'Vendor',
                    badgeColor: 'bg-blue-500'
                };
            case 'fraud':
                return { 
                    color: 'text-red-600', 
                    bg: 'bg-red-100', 
                    border: 'border-red-300',
                    icon: FaUserSlash, 
                    text: 'Fraud',
                    badgeColor: 'bg-red-500'
                };
            default:
                return { 
                    color: 'text-green-600', 
                    bg: 'bg-green-100', 
                    border: 'border-green-300',
                    icon: FaUser, 
                    text: 'User',
                    badgeColor: 'bg-green-500'
                };
        }
    };

    const filteredUsers = manageUsers.filter(user => {
        const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const updateUserRole = (user, newRole, actionText) => {
        Swal.fire({
            title: `Make ${user.displayName} ${actionText}?`,
            text: "This will change the user's permissions",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: newRole === 'fraud' ? "#ef4444" : "#10b981",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, make ${actionText}!`,
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                const roleInfo = { role: newRole };
                const endpoint = newRole === 'fraud' ? `/users/mark-fraud/${user._id}` : `/users/${user._id}/role`;
                
                axiosSecure.patch(endpoint, roleInfo).then(res => {
                    const success = newRole === 'fraud' ? 
                        res.data.fraudUser?.modifiedCount > 0 : 
                        res.data.modifiedCount > 0;
                    
                    if (success) {
                        refetch();
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: `${user.displayName} is now ${actionText}`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });
    };

    const handleMakeAdmin = (user) => updateUserRole(user, 'admin', 'Admin');
    const handleMakeVendor = (user) => updateUserRole(user, 'vendor', 'Vendor');
    const handleMakeFraud = (user) => updateUserRole(user, 'fraud', 'Fraud');

    if (isLoading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <div className="text-xl font-semibold text-gray-600">Loading users...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  p-4 lg:p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600"></div>
             </div>

                <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className=" rounded-3xl shadow-xl p-8 mb-8 border border-gray-100" data-aos="fade-up">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg">
                                <FaUsers size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold  mb-2">
                                    Manage Users
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Manage user roles and permissions
                                </p>
                            </div>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="flex gap-4">
                            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200 text-center min-w-[80px]">
                                <div className="text-2xl font-bold text-purple-600">
                                    {manageUsers.filter(u => u.role === 'admin').length}
                                </div>
                                <div className="text-sm text-purple-600 font-medium">Admins</div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 text-center min-w-[80px]">
                                <div className="text-2xl font-bold text-blue-600">
                                    {manageUsers.filter(u => u.role === 'vendor').length}
                                </div>
                                <div className="text-sm text-blue-600 font-medium">Vendors</div>
                            </div>
                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 text-center min-w-[80px]">
                                <div className="text-2xl font-bold text-green-600">
                                    {manageUsers.filter(u => !u.role || u.role === 'user').length}
                                </div>
                                <div className="text-sm text-green-600 font-medium">Users</div>
                            </div>
                            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-2xl p-4 border border-red-200 text-center min-w-[80px]">
                                <div className="text-2xl font-bold text-red-600">
                                    {manageUsers.filter(u => u.role === 'fraud').length}
                                </div>
                                <div className="text-sm text-red-600 font-medium">Fraud</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className="rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by name or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
                            />
                        </div>
                        
                        {/* Role Filter */}
                        <div className="flex items-center gap-3">
                            <FaFilter className="text-gray-500" />
                            <select
                                value={roleFilter}
                                onChange={(e) => setRoleFilter(e.target.value)}
                                className="select select-bordered select-sm w-full max-w-xs"
                            >
                                <option value="all">All Roles</option>
                                <option value="user">Users</option>
                                <option value="vendor">Vendors</option>
                                <option value="admin">Admins</option>
                                <option value="fraud">Fraud</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredUsers.length === 0 ? (
                    <div className="rounded-3xl shadow-xl p-12 text-center border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <FaUsers className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold  mb-3">No Users Found</h3>
                        <p className="text-gray-600 text-lg">
                            {searchTerm || roleFilter !== 'all' ? 'Try adjusting your search criteria' : 'No users available'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block rounded-3xl shadow-xl overflow-hidden border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">#</th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaUser />
                                                    User
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope />
                                                    Email
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">Role</th>
                                            <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user, index) => {
                                            const roleInfo = getRoleInfo(user.role);
                                            return (
                                                <tr key={user._id} className="border-b border-gray-100 hover:bg-primary/40 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="relative">
                                                                <img
                                                                    src={user.photoURL}
                                                                    alt={user.displayName}
                                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                                />
                                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${roleInfo.badgeColor} rounded-full border-2 border-white flex items-center justify-center`}>
                                                                    <roleInfo.icon size={8} className="text-white" />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <div className="font-semibold ">{user.displayName}</div>
                                                                <div className="text-sm text-gray-500">{roleInfo.text}</div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="">{user.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border} border`}>
                                                            <roleInfo.icon size={12} />
                                                            {roleInfo.text}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center gap-2">
                                                            {user.role !== 'admin' && (
                                                                <button
                                                                    onClick={() => handleMakeAdmin(user)}
                                                                    className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 text-sm"
                                                                >
                                                                    <FaCrown size={12} />
                                                                    Admin
                                                                </button>
                                                            )}
                                                            {user.role === 'vendor' ? (
                                                                <button
                                                                    onClick={() => handleMakeFraud(user)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 text-sm"
                                                                >
                                                                    <FaExclamationTriangle size={12} />
                                                                    Fraud
                                                                </button>
                                                            ) : user.role !== 'vendor' && user.role !== 'fraud' && (
                                                                <button
                                                                    onClick={() => handleMakeVendor(user)}
                                                                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200 text-sm"
                                                                >
                                                                    <FaStore size={12} />
                                                                    Vendor
                                                                </button>
                                                            )}
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden space-y-4" data-aos="fade-up" data-aos-delay="200">
                            {filteredUsers.map((user, index) => {
                                const roleInfo = getRoleInfo(user.role);
                                return (
                                    <div key={user._id} className="rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                    #{index + 1}
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${roleInfo.bg} ${roleInfo.color} ${roleInfo.border} border`}>
                                                    <roleInfo.icon size={12} />
                                                    {roleInfo.text}
                                                </div>
                                            </div>
                                            <div className="relative">
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName}
                                                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                                                />
                                                <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${roleInfo.badgeColor} rounded-full border-2 border-white flex items-center justify-center`}>
                                                    <roleInfo.icon size={8} className="text-white" />
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Card Content */}
                                        <div className="space-y-3">
                                            <div className="flex items-start gap-3">
                                                <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                    <FaUser size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm text-gray-500 font-medium">Name</div>
                                                    <div className="font-semibold text-gray-800">{user.displayName}</div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-start gap-3">
                                                <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                                    <FaEnvelope size={16} />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-sm text-gray-500 font-medium">Email</div>
                                                    <div className="font-semibold text-gray-800">{user.email}</div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Card Actions */}
                                        <div className="flex gap-3 mt-6 pt-4 border-t border-gray-100">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleMakeAdmin(user)}
                                                    className="flex-1 bg-purple-500 hover:bg-purple-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                                                >
                                                    <FaCrown />
                                                    Admin
                                                </button>
                                            )}
                                            {user.role === 'vendor' ? (
                                                <button
                                                    onClick={() => handleMakeFraud(user)}
                                                    className="flex-1 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                                                >
                                                    <FaExclamationTriangle />
                                                    Fraud
                                                </button>
                                            ) : user.role !== 'vendor' && user.role !== 'fraud' && (
                                                <button
                                                    onClick={() => handleMakeVendor(user)}
                                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                                                >
                                                    <FaStore />
                                                    Vendor
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default ManageUsers;
