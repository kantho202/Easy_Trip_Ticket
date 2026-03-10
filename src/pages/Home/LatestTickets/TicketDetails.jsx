import useAxiosSecure from "../../../hook/useAxiosecure";
import { Link, useNavigate, useParams } from "react-router";
import { useQuery } from "@tanstack/react-query";
import { 
    FaArrowLeft, 
    FaBus, 
    FaCalendar, 
    FaMap, 
    FaMapMarkerAlt, 
    FaUser, 
    FaClock, 
    FaTicketAlt, 
    FaStar, 
    FaCheckCircle, 
    FaRoute,
    FaTrain,
    FaPlane,
    FaShip,
    FaWifi,
    FaCoffee,
    FaSnowflake,
    FaChevronLeft,
    FaChevronRight
} from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import Countdown from "react-countdown";
import useAuth from "../../../hook/useAuth";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const TicketDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const ticketModalRef = useRef(null);
    const { register, handleSubmit, formState: { errors } } = useForm();
    const navigate = useNavigate();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullImage, setShowFullImage] = useState(false);

    const { data: ticket = [], isLoading } = useQuery({
        queryKey: ["ticketDetails", id],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets/${id}`);
            return res.data;
        },
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
        WiFi: FaWifi,
        'Free WiFi': FaWifi,
        AC: FaSnowflake,
        'Air Conditioning': FaSnowflake,
        Breakfast: FaCoffee,
        Coffee: FaCoffee
    };

    const formatDateTime = (dateTimeString) => {
        if (!dateTimeString) return { date: 'Available', time: 'Flexible' };
        const dateTime = new Date(dateTimeString);
        const date = dateTime.toLocaleDateString('en-US', { 
            weekday: 'long',
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
        const time = dateTime.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        return { date, time };
    };

    const handleModalRef = () => {
        ticketModalRef.current.showModal();
    };

    const handleTicketSubmit = (data) => {
        const bookingInfo = {
            ticketId: ticket._id,
            name: user.displayName,
            ticket_title: ticket.ticketTitle,
            image: ticket.image,
            bookingQuantity: Number(data.bookingQuantity),
            ticketQuantity: Number(ticket.ticketQuantity),
            total_price: ticket.price * Number(data.bookingQuantity),
            from: ticket.from,
            to: ticket.to,
            departureDateTime: ticket.departureDateTime,
        };

        axiosSecure.post('/bookings', bookingInfo)
            .then(res => {
                ticketModalRef.current.close();
                navigate('/dashboard/myBookedTickets');
                console.log(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const isSoldOut = ticket.ticketQuantity === 0;
    const isExpired = new Date(ticket.departureDateTime) < new Date();
    const targetDateTime = ticket.departureDateTime;

    // Get all images (support both old single image and new multiple images)
    const ticketImages = ticket.images && ticket.images.length > 0 
        ? ticket.images 
        : [ticket.image];

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % ticketImages.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev - 1 + ticketImages.length) % ticketImages.length);
    };

    // Auto-slide functionality
    useEffect(() => {
        if (ticketImages.length <= 1) return; // Don't auto-slide if only one image

        const interval = setInterval(() => {
            nextImage();
        }, 5000); // Change image every 5 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, [ticketImages.length]); // Re-run if number of images changes

    const countdownRenderer = ({ days, hours, minutes, seconds, completed }) => {
        if (completed) {
            return (
                <div className="bg-red-100 border border-red-300 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-red-600 font-bold text-lg">
                        <FaClock />
                        Booking Expired
                    </div>
                </div>
            );
        }
        return (
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-6">
                <div className="text-center mb-3">
                    <h3 className="text-lg font-semibold text-orange-800">Booking Closes In:</h3>
                </div>
                <div className="flex justify-center gap-4">
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 font-bold text-xl min-w-[50px]">
                            {days}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Days</div>
                    </div>
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 font-bold text-xl min-w-[50px]">
                            {hours}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Hours</div>
                    </div>
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 font-bold text-xl min-w-[50px]">
                            {minutes}
                        </div>
                        <div className="text-xs text-orange-600 mt-1 font-medium">Min</div>
                    </div>
                    <div className="text-center">
                        <div className="bg-orange-500 text-white rounded-lg px-3 py-2 font-bold text-xl min-w-[50px]">
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
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-orange-500 mx-auto mb-4"></div>
                    <div className="text-xl font-semibold text-gray-600">Loading ticket details...</div>
                </div>
            </div>
        );
    }

    const { date, time } = formatDateTime(ticket.departureDateTime);
    const TransportIcon = transportIcons[ticket.transport] || FaBus;

    return (
        <div className="min-h-screen py-8 px-4">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-orange-600"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10">
                {/* Back Button */}
                <div className="mb-8" data-aos="fade-down">
                    <Link to="/">
                        <button className="group bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-orange-400 rounded-2xl px-6 py-3 flex items-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                            <div className="bg-gradient-to-r from-orange-500 to-orange-600 group-hover:from-orange-600 group-hover:to-orange-700 text-white rounded-xl p-2 transition-all duration-300">
                                <FaArrowLeft size={16} />
                            </div>
                            <span className="font-semibold text-gray-700 group-hover:text-orange-600 transition-colors duration-300">
                                Back to Tickets
                            </span>
                        </button>
                    </Link>
                </div>

                {/* Main Ticket Card */}
                <div className=" rounded-3xl shadow-2xl overflow-hidden border border-gray-100" data-aos="fade-up" data-aos-delay="200">
                        {/* Image Gallery Card */}
                        <div className=" rounded-3xl shadow-2xl overflow-hidden border border-gray-100" data-aos="fade-up">
                            {/* Hero Image Section with Gallery */}
                            <div className="relative h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden group">
                        <img
                            src={ticketImages[currentImageIndex]}
                            alt={`${ticket.ticketTitle} - Image ${currentImageIndex + 1}`}
                            className="w-full h-full object-cover transition-transform duration-700 cursor-pointer hover:scale-105"
                            onClick={() => setShowFullImage(true)}
                        />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                                
                                {/* Image Navigation - Only show if multiple images */}
                                {ticketImages.length > 1 && (
                                    <>
                                        <button
                                            onClick={prevImage}
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                        >
                                            <FaChevronLeft size={20} />
                                        </button>
                                        <button
                                            onClick={nextImage}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
                                        >
                                            <FaChevronRight size={20} />
                                        </button>

                                        {/* Image Counter */}
                                        <div className="absolute bottom-6 right-6 bg-black/70 backdrop-blur-sm text-white px-4 py-2 rounded-full text-sm font-semibold">
                                            {currentImageIndex + 1} / {ticketImages.length}
                                        </div>

                                        {/* Dot Navigation */}
                                        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                            {ticketImages.map((_, index) => (
                                                <button
                                                    key={index}
                                                    onClick={() => setCurrentImageIndex(index)}
                                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                        index === currentImageIndex 
                                                            ? 'bg-white w-8' 
                                                            : 'bg-white/50 hover:bg-white/75'
                                                    }`}
                                                />
                                            ))}
                                        </div>
                                    </>
                                )}
                                
                                {/* Badges Overlay */}
                                <div className="absolute top-6 left-6 flex flex-col gap-3">
                                    <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg backdrop-blur-sm">
                                        <TransportIcon size={16} />
                                        {ticket.transport}
                                    </div>
                                    <div className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-semibold shadow-lg backdrop-blur-sm">
                                        <FaCheckCircle size={14} />
                                        Available
                                    </div>
                                </div>

                                {/* Title Overlay */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 to-transparent">
                                    <h1 className="text-3xl lg:text-4xl font-bold text-white mb-3 drop-shadow-lg">
                                        {ticket.ticketTitle}
                                    </h1>
                                    <div className="flex items-center gap-4 text-white/90">
                                        <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                                            <FaStar className="text-yellow-400" />
                                            <span className="font-semibold">4.8</span>
                                        </div>
                                        <div className="w-1 h-1 bg-white/50 rounded-full"></div>
                                        <div className="flex items-center gap-2">
                                            <FaUser size={14} />
                                            <span className="font-medium">{ticket.name}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                    {/* Thumbnail Gallery - Below main image */}
                    {ticketImages.length > 1 && (
                        <div className="px-6 py-4  border-b border-gray-200">
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-orange-500 scrollbar-track-gray-200">
                                {ticketImages.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setCurrentImageIndex(index)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                                            index === currentImageIndex 
                                                ? 'border-orange-500 scale-105 shadow-lg' 
                                                : 'border-gray-300 hover:border-orange-300 opacity-70 hover:opacity-100'
                                        }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`Thumbnail ${index + 1}`}
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                        </div>

                        {/* Route Card */}
                        <div className=" rounded-3xl shadow-xl p-8 border border-gray-100" data-aos="fade-up" data-aos-delay="100">
                            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-white">
                                    <FaRoute />
                                </div>
                                Journey Route
                            </h3>
                            <div className=" rounded-2xl p-6 border-2 border-orange-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-2xl p-4 shadow-lg">
                                            <FaMap size={24} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-orange-600 font-semibold uppercase tracking-wide">From</div>
                                        <div className="text-lg font-bold ">{ticket.from}</div>
                                    </div>
                                </div>
                                
                                <div className="flex-1 flex justify-center">
                                    <div className="bg-orange-300 h-1 w-20 rounded-full relative">
                                        <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-orange-500 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <div className="bg-orange-500 text-white rounded-full p-3">
                                        <FaMapMarkerAlt size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm text-orange-600 font-medium">To</div>
                                        <div className="text-lg font-bold ">{ticket.to}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Grid */}
                        <div className="grid md:grid-cols-2 my-5 lg:grid-cols-4 gap-6">
                            <div className=" rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-colors duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-blue-500 text-white rounded-lg p-2">
                                        <FaUser size={16} />
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Organizer</div>
                                </div>
                                <div className="font-semibold ">{ticket.name}</div>
                            </div>

                            <div className=" rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-colors duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-green-500 text-white rounded-lg p-2">
                                        <FaTicketAlt size={16} />
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Available</div>
                                </div>
                                <div className="font-semibold ">{ticket.ticketQuantity} seats</div>
                            </div>

                            <div className=" rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-colors duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-purple-500 text-white rounded-lg p-2">
                                        <FaCalendar size={16} />
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Date</div>
                                </div>
                                <div className="font-semibold  text-sm">{date}</div>
                            </div>

                            <div className=" rounded-xl p-4 border border-gray-200 hover:border-orange-300 transition-colors duration-300">
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="bg-red-500 text-white rounded-lg p-2">
                                        <FaClock size={16} />
                                    </div>
                                    <div className="text-sm text-gray-600 font-medium">Time</div>
                                </div>
                                <div className="font-semibold ">{time}</div>
                            </div>
                        </div>

                        {/* Perks Section */}
                        {ticket.perks?.length > 0 && (
                            <div className="bg-green-50 rounded-2xl my-5 p-6 border border-green-200">
                                <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
                                    <FaCheckCircle />
                                    Included Amenities
                                </h3>
                                <div className="flex flex-wrap gap-3">
                                    {ticket.perks.map((perk, i) => {
                                        const PerkIcon = perkIcons[perk] || FaCheckCircle;
                                        return (
                                            <div key={i} className="bg-green-500 text-white px-4 py-2 rounded-full flex items-center gap-2 font-medium">
                                                <PerkIcon size={14} />
                                                {perk}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Countdown Section */}
                        {targetDateTime && (
                            <div>
                                <Countdown
                                    date={targetDateTime}
                                    renderer={countdownRenderer}
                                />
                            </div>
                        )}

                        {/* Booking Button */}
                        <div className="pt-4">
                            <button
                                disabled={isExpired || isSoldOut}
                                onClick={handleModalRef}
                                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all duration-300 ${
                                    isExpired || isSoldOut
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                }`}
                            >
                                {isExpired ? 'Booking Expired' : 
                                 isSoldOut ? 'Sold Out' : 
                                 'Book This Ticket'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Enhanced Booking Modal */}
                <dialog ref={ticketModalRef} className="modal modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-md bg-white rounded-3xl border-0 shadow-2xl">
                        <div className="text-center mb-6">
                            <div className="bg-orange-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                <FaTicketAlt className="text-orange-500 text-2xl" />
                            </div>
                            <h3 className="font-bold text-2xl text-gray-800 mb-2">Complete Your Booking</h3>
                            <p className="text-gray-600">Select the number of tickets you want to book</p>
                        </div>

                        <form onSubmit={handleSubmit(handleTicketSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Number of Tickets
                                </label>
                                <input
                                    type="number"
                                    {...register('bookingQuantity', {
                                        required: 'Please enter booking quantity',
                                        min: {
                                            value: 1,
                                            message: "Minimum quantity is 1"
                                        },
                                        max: {
                                            value: ticket.ticketQuantity,
                                            message: "Booking quantity can't exceed available tickets"
                                        }
                                    })}
                                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:outline-none transition-colors duration-300"
                                    placeholder="Enter quantity"
                                />
                                {errors.bookingQuantity && (
                                    <p className="text-red-500 text-sm mt-2 font-medium">
                                        {errors.bookingQuantity.message}
                                    </p>
                                )}
                            </div>

                            {/* Booking Summary */}
                            <div className=" rounded-xl p-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Price per ticket:</span>
                                    <span className="font-semibold">৳{ticket.price}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Available tickets:</span>
                                    <span className="font-semibold">{ticket.ticketQuantity}</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="flex-1 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                                >
                                    Confirm Booking
                                </button>
                                <button
                                    type="button"
                                    onClick={() => ticketModalRef.current.close()}
                                    className="px-6 py-3 border-2 border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl font-semibold transition-colors duration-300"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                    <form method="dialog" className="modal-backdrop">
                        <button>close</button>
                    </form>
                </dialog>

                {/* Full Image Modal */}
                {showFullImage && (
                    <div 
                        className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
                        onClick={() => setShowFullImage(false)}
                    >
                        <button
                            onClick={() => setShowFullImage(false)}
                            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition-all duration-300 backdrop-blur-sm z-10"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>

                        {/* Navigation Buttons */}
                        {ticketImages.length > 1 && (
                            <>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        prevImage();
                                    }}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm z-10"
                                >
                                    <FaChevronLeft size={24} />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        nextImage();
                                    }}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-4 transition-all duration-300 backdrop-blur-sm z-10"
                                >
                                    <FaChevronRight size={24} />
                                </button>
                            </>
                        )}

                        {/* Image Counter */}
                        {ticketImages.length > 1 && (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm">
                                {currentImageIndex + 1} / {ticketImages.length}
                            </div>
                        )}

                        {/* Full Image */}
                        <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
                            <img
                                src={ticketImages[currentImageIndex]}
                                alt={`${ticket.ticketTitle} - Full view`}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>

                        {/* Image Info */}
                        <div className="absolute bottom-8 right-8 bg-black/50 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
                            <p className="text-sm font-medium">Click anywhere to close</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TicketDetails;
