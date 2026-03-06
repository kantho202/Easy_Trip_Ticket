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
                                <div key={payment._id} className="rounded-2xl shadow-lg p-4 lg:p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
                                    {/* Card Header */}
                                    <div className="flex justify-between items-center mb-6">
                                        <span className="font-bold text-orange-500 text-lg">#{index + 1}</span>
                                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-600">
                                            <FaCheckCircle />
                                            Completed
                                        </span>
                                    </div>

                                    {/* Ticket Section */}
                                    <div className="flex items-center gap-4 mb-6 p-4 bg-gray-50 rounded-xl">
                                        <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                            <FaTicketAlt />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-gray-800 mb-1">
                                                {payment.ticketName}
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                Amount: ${formatAmount(payment.amount)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaUser />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</div>
                                                <div className="font-semibold  text-sm truncate">{payment.email}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaCreditCard />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Transaction</div>
                                                <div className="font-mono text-xs  truncate">{payment.transactionId}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaCalendarAlt />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date & Time</div>
                                                <div className="font-semibold  text-sm">{formatDate(payment.paidAt)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-100 text-gray-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <FaMoneyBillWave />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs text-gray-500 uppercase tracking-wide mb-1">Amount</div>
                                                <div className="font-bold text-green-600 text-sm">৳{formatAmount(payment.amount)}</div>
                                            </div>
                                        </div>
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
