import React, { useState } from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loading/Loading';
import { 
    FaTicketAlt, 
    FaUser, 
    FaEnvelope, 
    FaCalendarAlt,
    FaSearch,
    FaFilter,
    FaBullhorn,
    FaEye,
    FaEyeSlash,
    FaStar,
    FaImage,
    FaClock,
    FaCheckCircle,
    FaTimesCircle
} from 'react-icons/fa';

const AdvertiseTickets = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    const { data: tickets = [], refetch, isLoading } = useQuery({
        queryKey: ['tickets'],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets?status=approved`);
            return res.data;
        }
    });

    const getAdvertiseStatus = (isAdvertised) => {
        if (isAdvertised === 'advertise') {
            return { 
                color: 'text-green-600', 
                bg: 'bg-green-100', 
                border: 'border-green-300',
                icon: FaCheckCircle, 
                text: 'Advertised' 
            };
        } else {
            return { 
                color: 'text-gray-600', 
                bg: 'bg-gray-100', 
                border: 'border-gray-300',
                icon: FaTimesCircle, 
                text: 'Not Advertised' 
            };
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = ticket.ticketTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            ticket.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || 
                            (statusFilter === 'advertised' && ticket.isAdvertised === 'advertise') ||
                            (statusFilter === 'unadvertised' && ticket.isAdvertised !== 'advertise');
        return matchesSearch && matchesStatus;
    });

    const handleToggleAdvertise = (ticket, isAdvertised) => {
        const actionText = isAdvertised === 'advertise' ? 'advertise' : 'remove from advertising';
        
        Swal.fire({
            title: `${actionText.charAt(0).toUpperCase() + actionText.slice(1)} this ticket?`,
            text: `This will ${actionText} "${ticket.ticketTitle}"`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: isAdvertised === 'advertise' ? "#10b981" : "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${actionText}!`,
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                const updateInfo = { isAdvertised };
                axiosSecure.patch(`/tickets/${ticket._id}`, updateInfo).then(res => {
                    if (res.data.modifiedCount) {
                        refetch();
                        Swal.fire({
                            position: "top-end",
                            icon: "success",
                            title: `Ticket ${actionText} successfully`,
                            showConfirmButton: false,
                            timer: 1500
                        });
                    }
                });
            }
        });
    };

    const handleAdvertise = (ticket) => {
        handleToggleAdvertise(ticket, 'advertise');
    };

    const handleUnAdvertise = (ticket) => {
        handleToggleAdvertise(ticket, 'unadvertised');
    };

    // if (isLoading) {
    //     return (
    //         <div className="min-h-screen  flex items-center justify-center">
    //             <div className="text-center">
    //                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
    //                 <div className="text-xl font-semibold text-gray-600">Loading tickets...</div>
    //             </div>
    //         </div>
    //     );
    // }

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
                                <FaBullhorn size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold  mb-2">
                                    Advertise Tickets
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Manage ticket advertising and promotions
                                </p>
                            </div>
                        </div>
                        
                        {/* Stats Cards */}
                        <div className="flex gap-4">
                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-2xl p-4 border border-green-200 text-center min-w-[100px]">
                                <div className="text-2xl font-bold text-green-600">
                                    {tickets.filter(t => t.isAdvertised === 'advertise').length}
                                </div>
                                <div className="text-sm text-green-600 font-medium">Advertised</div>
                            </div>
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200 text-center min-w-[100px]">
                                <div className="text-2xl font-bold text-gray-600">
                                    {tickets.filter(t => t.isAdvertised !== 'advertise').length}
                                </div>
                                <div className="text-sm text-gray-600 font-medium">Not Advertised</div>
                            </div>
                            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200 text-center min-w-[100px]">
                                <div className="text-2xl font-bold text-blue-600">
                                    {tickets.length}
                                </div>
                                <div className="text-sm text-blue-600 font-medium">Total</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Section */}
                <div className=" rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                    <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
                        {/* Search Bar */}
                        <div className="relative flex-1 max-w-md">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search by ticket title or email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300 "
                            />
                        </div>
                        
                        {/* Status Filter */}
                        <div className="flex items-center gap-3">
                            <FaFilter className="text-gray-500" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="select select-bordered select-sm w-full max-w-xs"
                            >
                                <option value="all">All Tickets</option>
                                <option value="advertised">Advertised</option>
                                <option value="unadvertised">Not Advertised</option>
                            </select>
                        </div>
                    </div>
                </div>

                {filteredTickets.length === 0 ? (
                    <div className=" rounded-3xl shadow-xl p-12 text-center border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                        <div className="bg-gray-200 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <FaTicketAlt className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold  mb-3">No Tickets Found</h3>
                        <p className="text-gray-600 text-lg">
                            {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search criteria' : 'No approved tickets available'}
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block  rounded-3xl shadow-xl overflow-hidden border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">#</th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaTicketAlt />
                                                    Ticket
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaEnvelope />
                                                    Email
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt />
                                                    Date
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                                            <th className="px-6 py-4 text-center font-semibold">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredTickets.map((ticket, index) => {
                                            const statusInfo = getAdvertiseStatus(ticket.isAdvertised);
                                            return (
                                                <tr key={ticket._id} className="border-b border-gray-100 hover:bg-primary/40 transition-colors duration-200">
                                                    <td className="px-6 py-4">
                                                        <div className="bg-orange-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                                                            {index + 1}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-4">
                                                            <img
                                                                src={ticket.image}
                                                                alt={ticket.ticketTitle}
                                                                className="w-16 h-16 rounded-xl object-cover border-2 border-gray-200"
                                                            />
                                                            <div>
                                                                <div className="font-semibold  max-w-xs truncate">
                                                                    {ticket.ticketTitle}
                                                                </div>
                                                                <div className="text-sm text-gray-500">
                                                                    {ticket.from} → {ticket.to}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="">{ticket.email}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="">{formatDate(ticket.departureDateTime)}</div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                                                            <statusInfo.icon size={12} />
                                                            {statusInfo.text}
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex justify-center">
                                                            {ticket.isAdvertised === 'unadvertised' || !ticket.isAdvertised ? (
                                                                <button
                                                                    onClick={() => handleAdvertise(ticket)}
                                                                    className="bg-green-500 hover:bg-green-600 text-white  px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
                                                                >
                                                                    <FaEye size={14} />
                                                                    Advertise
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    onClick={() => handleUnAdvertise(ticket)}
                                                                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors duration-200"
                                                                >
                                                                    <FaEyeSlash size={14} />
                                                                    Remove
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
                            {filteredTickets.map((ticket, index) => {
                                const statusInfo = getAdvertiseStatus(ticket.isAdvertised);
                                return (
                                    <div key={ticket._id} className="rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-shadow duration-300">
                                        {/* Card Header */}
                                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="bg-orange-500 text-white rounded-full w-10 h-10 flex items-center justify-center font-bold">
                                                    #{index + 1}
                                                </div>
                                                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold ${statusInfo.bg} ${statusInfo.color} ${statusInfo.border} border`}>
                                                    <statusInfo.icon size={12} />
                                                    {statusInfo.text}
                                                </div>
                                            </div>
                                            <img
                                                src={ticket.image}
                                                alt={ticket.ticketTitle}
                                                className="w-12 h-12 rounded-xl object-cover border-2 border-gray-200"
                                            />
                                        </div>
                                        
                                        {/* Card Content */}
                                        <div className="space-y-4">
                                            <div>
                                                <h3 className="text-xl font-bold  mb-2">
                                                    {ticket.ticketTitle}
                                                </h3>
                                                <p className="text-gray-500 text-sm">
                                                    {ticket.from} → {ticket.to}
                                                </p>
                                            </div>

                                            <div className="grid grid-cols-1 gap-3">
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
                                                        <FaEnvelope size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-500 font-medium">Email</div>
                                                        <div className="font-semibold ">{ticket.email}</div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-start gap-3">
                                                    <div className="bg-blue-100 text-blue-600 p-2 rounded-lg">
                                                        <FaCalendarAlt size={16} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm text-gray-500 font-medium">Departure Date</div>
                                                        <div className="font-semibold ">{formatDate(ticket.departureDateTime)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        
                                        {/* Card Actions */}
                                        <div className="mt-6 pt-4 border-t border-gray-100">
                                            {ticket.isAdvertised === 'unadvertised' || !ticket.isAdvertised ? (
                                                <button
                                                    onClick={() => handleAdvertise(ticket)}
                                                    className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                                                >
                                                    <FaEye />
                                                    Advertise This Ticket
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleUnAdvertise(ticket)}
                                                    className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors duration-200"
                                                >
                                                    <FaEyeSlash />
                                                    Remove from Advertising
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

export default AdvertiseTickets;
