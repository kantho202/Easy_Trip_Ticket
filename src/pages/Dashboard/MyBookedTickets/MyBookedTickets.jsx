import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { Link } from 'react-router';
import useAuth from '../../../hook/useAuth';
import Countdown from 'react-countdown';
import Loader from '../../../components/Loading/Loading';
import {
    FaMapMarkerAlt,
    FaUsers,
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaArrowRight,
    FaCalendarAlt,
    FaClock,
    FaStar,
    FaWifi,
    FaCoffee,
    FaParking,
    FaTv,
    FaSnowflake,
    FaCheckCircle,
    FaTimesCircle,
    FaHourglassHalf,
    FaCreditCard,
    FaRoute
} from 'react-icons/fa';
import { LuCalendar, LuClock, LuMapPin, LuUsers } from 'react-icons/lu';

const MyBookedTickets = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();

    const { data: bookings = [], isLoading } = useQuery({
        queryKey: ['bookings', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/bookings?email=${user?.email}`);
            return res.data;
        }
    });

    const transportIcons = {
        Bus: FaBus,
        Train: FaTrain,
        Plane: FaPlane,
        Launch: FaShip,
        Flight: FaPlane,
        Boat: FaShip
    };

    const perkIcons = {
        AC: FaSnowflake,
        Breakfast: FaCoffee,
        WiFi: FaWifi,
        TV: FaTv,
        Parking: FaParking,
        'Air Conditioning': FaSnowflake,
        'Free WiFi': FaWifi
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    };

    const getStatusInfo = (status, paymentStatus) => {
        if (paymentStatus === 'paid') {
            return {
                color: 'text-green-600',
                bg: 'bg-green-100',
                border: 'border-green-300',
                icon: FaCheckCircle,
                text: 'Paid'
            };
        }
        switch (status) {
            case 'accepted':
                return {
                    color: 'text-green-600',
                    bg: 'bg-green-100',
                    border: 'border-green-300',
                    icon: FaCheckCircle,
                    text: 'Accepted'
                };
            case 'rejected':
                return {
                    color: 'text-red-600',
                    bg: 'bg-red-100',
                    border: 'border-red-300',
                    icon: FaTimesCircle,
                    text: 'Rejected'
                };
            default:
                return {
                    color: 'text-yellow-600',
                    bg: 'bg-yellow-100',
                    border: 'border-yellow-300',
                    icon: FaHourglassHalf,
                    text: 'Pending'
                };
        }
    };

    const handlePayment = async (book) => {
        const paymentInfo = {
            total_price: book.total_price,
            ticketId: book.ticketId,
            bookingId: book._id,
            email: book.email,
            ticket_title: book.ticket_title,
            bookingQuantity: book.bookingQuantity,
            ticketQuantity: book.ticketQuantity,
        };
        const res = await axiosSecure.post('/create-checkout-session', paymentInfo);
        window.location.assign(res.data.url);
    };

    const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <div className="bg-red-100 border-2 border-red-300 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-lg">
                        <FaClock />
                        Booking Expired
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border-2 border-orange-200 rounded-xl p-4">
                <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-orange-800">Payment Due In:</h3>
                </div>
                <div className="flex justify-center gap-2">
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-2 py-1 font-bold text-lg min-w-[35px]">
                            {days}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Days</div>
                    </div>
                    <div className="text-orange-500 font-bold text-lg">:</div>
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-2 py-1 font-bold text-lg min-w-[35px]">
                            {hours}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Hours</div>
                    </div>
                    <div className="text-orange-500 font-bold text-lg">:</div>
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-2 py-1 font-bold text-lg min-w-[35px]">
                            {minutes}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Min</div>
                    </div>
                    <div className="text-orange-500 font-bold text-lg">:</div>
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-2 py-1 font-bold text-lg min-w-[35px]">
                            {seconds}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Sec</div>
                    </div>
                </div>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="min-h-screen  flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <div className="text-xl font-semibold text-gray-600">Loading your bookings...</div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-8 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Header Section */}
                <div className="text-center mb-12" data-aos="fade-up">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-3 rounded-full font-semibold mb-6 shadow-lg">
                        <FaStar className="text-yellow-300" />
                        My Bookings
                    </div>
                    <h1 className="text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                        My Booked Tickets
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Manage your travel bookings and track payment status
                    </p>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6 items-stretch">
                    {bookings.map((book, index) => {
                        const isExpired = new Date(book.departureDateTime) < new Date();
                        const isReject = book.status === "rejected";
                        const statusInfo = getStatusInfo(book.status, book.paymentStatus);
                        const TransportIcon = transportIcons[book.transport] || FaBus;

                        return (
                            <div
                                key={book._id}
                                data-aos="fade-up"
                                data-aos-duration="800"
                                data-aos-delay={index * 100}
                                className="h-full flex flex-col"
                            >
                                <div className="rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:scale-100 hover:shadow-3xl border border-white/20 flex flex-col h-full group">
                                    {/* Image Container */}
                                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                                        <img
                                            src={book.image}
                                            alt={book.ticket_title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60"></div>

                                        {/* Price Tag */}
                                        <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 text-orange-500 rounded-full font-bold text-lg backdrop-blur-md">
                                            ${book.total_price}
                                        </div>
                                        {/* <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 text-orange-500 rounded-full font-bold text-lg backdrop-blur-md">
                                            ৳{book.total_price}
                                        </div> */}

                                        {/* Status Badge */}
                                        <div className={`absolute top-4 left-4 ${statusInfo.bg} ${statusInfo.color} px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-2`}>
                                            <statusInfo.icon size={12} />
                                            {statusInfo.text}
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 lg:p-8">
                                        <h3 className="text-2xl font-bold mb-4">{book.ticket_title}</h3>

                                        <div className="flex items-center gap-4 mb-6 px-4 py-4  rounded-xl">
                                            <div className="flex items-center gap-2 font-semibold ">
                                                <LuMapPin className="text-orange-500" />
                                                <span>{book.from}</span>
                                            </div>
                                            <div className="text-orange-500 font-bold text-xl">→ </div>
                                            <div className="flex items-center gap-2 font-semibold ">
                                                <LuMapPin className="text-orange-500" />
                                                <span>{book.to}</span>
                                            </div>
                                        </div>
                                        {/* <div className="flex items-center gap-4 mb-6 px-4 py-4 rounded-xl">
                                            <div className="flex items-center gap-2 font-semibold">
                                                <FaMapMarkerAlt className="text-orange-500" />
                                                <span>{book.from}</span>
                                            </div>
                                            <div className="text-orange-500 font-bold text-xl">→</div>
                                            <div className="flex items-center gap-2 font-semibold">
                                                <FaMapMarkerAlt className="text-orange-500" />
                                                <span>{book.to}</span>
                                            </div>
                                        </div> */}

                                        <div className="grid grid-cols-2 gap-4 mb-6">

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <TransportIcon />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold  uppercase  mb-1">Transport</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">{book.transport}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <LuUsers />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold  uppercase  mb-1">Quantity</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">{book.bookingQuantity}</div>
                                                </div>
                                            </div>


                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <LuCalendar />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold uppercase mb-1">Departure</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">
                                                        {new Date(book.departureDateTime).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <LuClock />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold uppercase  mb-1">Time</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">
                                                        {new Date(book.departureDateTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 px-4 py-4 rounded-xl min-h-[70px]">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                                {user?.displayName?.charAt(0)?.toUpperCase() || 'U'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-semibold uppercase tracking-wide mb-1">Booked by</div>
                                                <div className="text-sm text-gray-500 font-semibold truncate">
                                                    {user?.displayName?.length > 15 ?
                                                        user.displayName.slice(0, 15) + '...' :
                                                        user?.displayName || 'User'
                                                    }
                                                </div>
                                            </div>
                                        </div>

                                        {book.perks && book.perks.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold mb-3">Included Perks</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {book.perks.map((perk, index) => {
                                                        const PerkIcon = perkIcons[perk] || FaWifi;
                                                        return (
                                                            <div key={index} className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl text-xs font-semibold">
                                                                <PerkIcon className="text-sm" />
                                                                {perk}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

                                        {/* Countdown Section */}
                                        {book?.departureDateTime && !isReject && book.paymentStatus !== "paid" && (
                                            <div className="mb-4">
                                                <Countdown
                                                    date={book.departureDateTime}
                                                    renderer={countdownRenderer}
                                                />
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        <div className="mt-auto pt-4">
                                            {book.paymentStatus === 'paid' ? (
                                                <button className="relative w-full bg-gradient-to-r from-green-500 to-green-600 text-white border-none px-6 py-3 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-500 overflow-hidden shadow-xl hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 group">
                                                    <div className="flex items-center justify-center gap-4 relative z-10">
                                                        <FaCheckCircle />
                                                        <span className="text-lg">Paid</span>
                                                    </div>
                                                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-full"></div>
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handlePayment(book)}
                                                    disabled={book.status !== "accepted" || isExpired}
                                                    className={`relative w-full border-none px-6 py-3 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-500 overflow-hidden shadow-xl ${book.status !== "accepted" || isExpired
                                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                                        : "bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 group"
                                                        }`}
                                                >
                                                    <div className="flex items-center justify-center gap-4 relative z-10">
                                                        <span className="text-lg">
                                                            {book.status !== 'accepted' ? 'Waiting Approval' :
                                                                isExpired ? 'Expired' : 'Pay Now'}
                                                        </span>
                                                        <FaCreditCard className="text-xl transition-transform duration-300 group-hover:translate-x-1" />
                                                    </div>
                                                    {book.status === "accepted" && !isExpired && (
                                                        <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-full"></div>
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {bookings.length === 0 && (
                    <div className="text-center py-16" data-aos="fade-up">
                        <div className="rounded-3xl shadow-xl p-12 max-w-md mx-auto border border-gray-100">
                            <div className="text-6xl mb-6">🎫</div>
                            <h3 className="text-2xl font-bold text-gray-800 mb-3">No Bookings Found</h3>
                            <p className="text-gray-600 text-lg">You haven't booked any tickets yet</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyBookedTickets;
