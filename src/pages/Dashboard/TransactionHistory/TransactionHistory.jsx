import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import useAuth from '../../../hook/useAuth';
import Loader from '../../../components/Loading/Loading';
import { 
    FaReceipt, 
    FaCalendarAlt, 
    FaCreditCard, 
    FaTicketAlt,
    FaSearch,
    FaDownload,
    FaEye,
    FaCheckCircle,
    FaMoneyBillWave,
    FaUser,
    FaHashtag,
    FaFilter,
    FaFileExport
} from 'react-icons/fa';

const TransactionHistory = () => {
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const { data: payments = [], isLoading } = useQuery({
        queryKey: ['payments', user.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/payments?email=${user?.email}`);
            return res.data;
        }
    });

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

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-BD').format(amount);
    };

    const filteredPayments = payments.filter(payment => 
        payment.ticketName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.transactionId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalAmount = payments.reduce((sum, payment) => sum + (payment.amount || 0), 0);

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen p-4 lg:p-8">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="rounded-3xl shadow-xl p-8 mb-8 border border-gray-100" data-aos="fade-up">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg">
                                <FaReceipt size={32} />
                            </div>
                            <div>
                                <h1 className="text-3xl lg:text-4xl font-bold mb-2">
                                    Transaction History
                                </h1>
                                <p className="text-gray-600 text-lg">
                                    Track all your payment transactions and bookings
                                </p>
                            </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-3">
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl  font-medium  hover:border-orange-500 hover:text-orange-500 transition-all duration-300">
                                <FaFileExport />
                                Export
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl  font-medium  hover:border-orange-500 hover:text-orange-500 transition-all duration-300">
                                <FaFilter />
                                Filter
                            </button>
                        </div>
                    </div>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" data-aos="fade-up" data-aos-delay="100">
                    <div className="rounded-2xl shadow-lg p-6 border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            <FaReceipt />
                        </div>
                        <div>
                            <div className="text-3xl font-bold ">{payments.length}</div>
                            <div className="text-gray-600 font-medium">Total Transactions</div>
                        </div>
                    </div>
                    <div className="rounded-2xl shadow-lg p-6 border border-gray-100 flex items-center gap-4 hover:shadow-xl transition-shadow duration-300">
                        <div className="w-16 h-16 bg-green-100 text-green-500 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">
                            <FaMoneyBillWave />
                        </div>
                        <div>
                            <div className="text-3xl font-bold ">${formatAmount(totalAmount)}</div>
                            <div className="text-gray-600 font-medium">Total Spent</div>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="rounded-2xl shadow-lg p-6 mb-8 border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                    <div className="relative max-w-md">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by ticket name or transaction ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
                        />
                    </div>
                </div>

                {filteredPayments.length === 0 ? (
                    <div className="rounded-3xl shadow-xl p-12 text-center border border-gray-100" data-aos="fade-up" data-aos-delay="300">
                        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
                            <FaReceipt className="text-gray-400 text-3xl" />
                        </div>
                        <h3 className="text-2xl font-bold  mb-3">No Transactions Found</h3>
                        <p className="text-gray-600 text-lg">
                            {searchTerm 
                                ? 'Try adjusting your search criteria'
                                : 'You haven\'t made any transactions yet'
                            }
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block rounded-3xl shadow-xl overflow-hidden border border-gray-100" data-aos="fade-up" data-aos-delay="300">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                                        <tr>
                                            <th className="px-6 py-4 text-left font-semibold">#</th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaTicketAlt />
                                                    Ticket Name
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaUser />
                                                    Email
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaCreditCard />
                                                    Transaction ID
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaMoneyBillWave />
                                                    Amount
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">
                                                <div className="flex items-center gap-2">
                                                    <FaCalendarAlt />
                                                    Date & Time
                                                </div>
                                            </th>
                                            <th className="px-6 py-4 text-left font-semibold">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {filteredPayments.map((payment, index) => (
                                            <tr key={payment._id} className="hover:bg-primary/40 transition-colors duration-200">
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-orange-500">{index + 1}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-semibold  truncate max-w-xs">
                                                        {payment.ticketName}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className=" text-sm truncate max-w-xs">
                                                        {payment.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-mono text-sm  truncate max-w-xs">
                                                        {payment.transactionId}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="font-bold text-green-600">
                                                        ${formatAmount(payment.amount)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className=" text-sm whitespace-nowrap">
                                                        {formatDate(payment.paidAt)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                                                        <FaCheckCircle />
                                                        Completed
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Mobile Card View */}
                        <div className="lg:hidden grid gap-6" data-aos="fade-up" data-aos-delay="300">
                            {filteredPayments.map((payment, index) => (
                                <div key={payment._id} className="rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-base-100 to-gray-50">
                                    {/* Card Header with gradient background */}
                                    <div className="flex justify-between items-center mb-6 pb-4 border-b-2 border-gray-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-bold shadow-lg">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">Transaction</div>
                                                <div className="font-bold text-gray-800">#{payment.transactionId?.slice(-8)}</div>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg">
                                            <FaCheckCircle />
                                            Completed
                                        </span>
                                    </div>

                                    {/* Ticket Section with enhanced design */}
                                    <div className="mb-6 p-5 bg-gradient-to-r from-orange-50 to-orange-100 rounded-2xl border-2 border-orange-200 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 shadow-lg transform hover:scale-110 transition-transform duration-300">
                                                <FaTicketAlt />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-orange-600 uppercase tracking-wide font-bold mb-1">Ticket Name</div>
                                                <div className="font-bold text-gray-900 text-lg mb-2 leading-tight">
                                                    {payment.ticketName}
                                                </div>
                                                <div className="flex items-center gap-2 bg-base-200 px-3 py-2 rounded-lg shadow-sm">
                                                    <FaMoneyBillWave className="text-green-600" />
                                                    <span className="text-sm text-gray-600 font-medium">Total Amount:</span>
                                                    <span className="font-bold text-green-600 text-lg">৳{formatAmount(payment.amount)}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid with enhanced styling */}
                                    <div className="space-y-3">
                                        {/* Email */}
                                        <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors duration-300 shadow-sm">
                                            <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <FaUser size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Email Address</div>
                                                <div className="font-semibold  text-sm truncate">{payment.email}</div>
                                            </div>
                                        </div>

                                        {/* Transaction ID */}
                                        <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors duration-300 shadow-sm">
                                            <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-purple-200 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <FaCreditCard size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Transaction ID</div>
                                                <div className="font-mono text-xs text-gray-800 font-semibold truncate bg-gray-50 px-2 py-1 rounded">{payment.transactionId}</div>
                                            </div>
                                        </div>

                                        {/* Date & Time */}
                                        <div className="flex items-center gap-4 p-4 bg-base-200 rounded-xl border border-gray-200 hover:border-orange-300 transition-colors duration-300 shadow-sm">
                                            <div className="w-12 h-12 bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                                                <FaCalendarAlt size={18} />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-1">Payment Date</div>
                                                <div className="font-semibold  text-sm">{formatDate(payment.paidAt)}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer with receipt icon */}
                                    <div className="mt-6 pt-4 border-t-2 border-gray-100 flex items-center justify-center gap-2 ">
                                        <FaReceipt />
                                        <span className="text-xs font-medium">Digital Receipt</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TransactionHistory;
