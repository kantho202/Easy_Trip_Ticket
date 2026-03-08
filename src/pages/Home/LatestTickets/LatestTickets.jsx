import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { Link } from 'react-router';
import { useState, useEffect } from 'react';
import {
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaArrowRight,
    FaWifi,
    FaCoffee,
    FaParking,
    FaTv,
    FaSnowflake
} from 'react-icons/fa';
import { LuCalendar, LuClock, LuMapPin, LuUsers } from 'react-icons/lu';

const LatestTickets = () => {
    const axiosSecure = useAxiosSecure();

    // State for managing current image index for each ticket
    const [currentImageIndices, setCurrentImageIndices] = useState({});

    const { data: homeTicket = [] } = useQuery({
        queryKey: ['homeTicket'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets?status=approved&limit=6');
            return res.data;
        }
    });

    // Initialize image indices when tickets are loaded
    useEffect(() => {
        if (homeTicket.length > 0) {
            const initialIndices = {};
            homeTicket.forEach(ticket => {
                initialIndices[ticket._id] = 0;
            });
            setCurrentImageIndices(initialIndices);
        }
    }, [homeTicket]);

    // Auto-slide functionality for each ticket
    useEffect(() => {
        const intervals = {};

        homeTicket.forEach(ticket => {
            const images = ticket.images || [ticket.image];
            if (images.length > 1) {
                intervals[ticket._id] = setInterval(() => {
                    setCurrentImageIndices(prev => ({
                        ...prev,
                        [ticket._id]: (prev[ticket._id] + 1) % images.length
                    }));
                }, 5000); // Change image every 5 seconds
            }
        });

        // Cleanup intervals on unmount
        return () => {
            Object.values(intervals).forEach(interval => clearInterval(interval));
        };
    }, [homeTicket]);

    const transportIcons = {
        Bus: FaBus,
        Train: FaTrain,
        Plane: FaPlane,
        Launch: FaShip
    };

    const perks = [
        { name: "AC", icon: FaSnowflake },
        { name: "Breakfast", icon: FaCoffee },
        { name: "WiFi", icon: FaWifi },
        { name: "TV", icon: FaTv },
        { name: "Parking", icon: FaParking }
    ];

    return (
        <div className="min-h-screen  py-24 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-white/10 via-transparent to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px-8 md:px-4 relative z-10" data-aos="fade-up" data-aos-easing="linear" data-aos-duration="800">
                {/* Header Section */}
                <div className="text-center mb-20 md:mb-12">

                    <h1 className="text-6xl md:text-4xl text-xl font-extrabold  mb-6 tracking-tight leading-tight">
                        Latest Travel Tickets
                    </h1>
                    <p className="text-xl md:text-lg  max-w-3xl mx-auto leading-relaxed font-light">
                        Discover amazing travel experiences and book your next adventure with exclusive deals
                    </p>
                </div>

                {/* Tickets Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-6 items-stretch">
                    {homeTicket.map((ticket, index) => {
                        const TransportIcon = transportIcons[ticket.transport] || FaBus;
                        const images = ticket.images || [ticket.image];
                        const currentImageIndex = currentImageIndices[ticket._id] || 0;
                        const currentImage = images[currentImageIndex] || ticket.image;

                        return (
                            <div key={ticket._id} data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100} className="h-full flex flex-col">
                                <div className=" rounded-[10px] overflow-hidden shadow-2xl transition-all duration-500 hover:-translate-y-4 hover:scale-100 hover:shadow-3xl border border-white/20 flex flex-col h-full group">
                                    {/* Image Container */}
                                    <div className="relative h-64 overflow-hidden flex-shrink-0">
                                        <img
                                            src={currentImage}
                                            alt={ticket.ticketTitle}
                                            className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/60"></div>

                                        {/* Price Tag */}
                                         <div className="absolute top-4 right-4 px-4 py-2 bg-white/95 text-orange-500 rounded-full font-bold text-lg backdrop-blur-md">
                                            ${ticket.price}
                                        </div>

                                        {/* Image Indicators */}
                                        {images.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                                                {images.map((_, imgIndex) => (
                                                    <div
                                                        key={imgIndex}
                                                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                                            imgIndex === currentImageIndex
                                                                ? 'bg-white scale-125'
                                                                : 'bg-white/50'
                                                        }`}
                                                    />
                                                ))}
                                            </div>
                                        )}

                                        {/* Status Badge */}
                                        {/* <div className="absolute top-6 left-6 bg-green-500/90 text-white px-3 py-2 rounded-2xl text-xs font-semibold backdrop-blur-md border border-white/20">
                                            Available
                                        </div> */}
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 lg:p-8">
                                        <h3 className="text-2xl font-bold  mb-4">{ticket.ticketTitle}</h3>

                                        <div className="flex items-center gap-4 mb-6 px-4 py-4  rounded-xl">
                                            <div className="flex items-center gap-2 font-semibold ">
                                                <LuMapPin className="text-orange-500" />
                                                <span>{ticket.from}</span>
                                            </div>
                                            <div className="text-orange-500 font-bold text-xl">→ </div>
                                            <div className="flex items-center gap-2 font-semibold ">
                                                <LuMapPin className="text-orange-500" />
                                                <span>{ticket.to}</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <TransportIcon />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold  uppercase  mb-1">Transport</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">{ticket.transport}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <LuUsers />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold  uppercase  mb-1">Quantity</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">{ticket.ticketQuantity}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-orange-50 border-2 border-orange-200 rounded-lg flex items-center justify-center text-orange-500 text-lg">
                                                    <LuCalendar />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="text-xs font-semibold uppercase mb-1">Departure</div>
                                                    <div className="tracking-wide text-gray-700 text-sm">
                                                        {new Date(ticket.departureDateTime).toLocaleDateString()}
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
                                                        {new Date(ticket.departureDateTime).toLocaleTimeString([], {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="flex items-center gap-4 px-4 py-4  rounded-xl  min-h-[70px]">
                                            <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-base flex-shrink-0">
                                                {ticket.name?.charAt(0)?.toUpperCase() || 'T'}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs  font-semibold uppercase tracking-wide mb-1">Organized by</div>
                                                <div className="text-sm text-gray-500 font-semibold truncate">
                                                    {ticket.name?.length > 15
                                                        ? ticket.name.slice(0, 15) + '...'
                                                        : ticket.name || 'Travel Agent'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {ticket.perks && ticket.perks.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold  mb-3">Included Perks</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {ticket.perks.map((perk, index) => {
                                                        const PerkIcon = perks.find(p => p.name === perk)?.icon || FaWifi;
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

                                        {/* Action Button */}
                                        <div className="mt-auto pt-4">
                                            <Link to={`/seeDetails/${ticket._id}`} className="block w-full">
                                                <button className="relative w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none px-6 py-3 rounded-2xl font-bold text-lg cursor-pointer transition-all duration-500 overflow-hidden shadow-xl hover:-translate-y-1 hover:shadow-2xl active:translate-y-0 group">
                                                    <div className="flex items-center justify-center gap-4 relative z-10">
                                                        <span className="text-lg">Book Now</span>
                                                        <div className="text-xl transition-transform duration-300 group-hover:translate-x-1">
                                                            <FaArrowRight />
                                                        </div>
                                                    </div>
                                                    <div className="absolute top-0 -left-full w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-all duration-700 group-hover:left-full"></div>
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Empty State */}
                {homeTicket.length === 0 && (
                    <div className="text-center p-16 md:p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 mt-8">
                        <div className="text-6xl mb-6">🎫</div>
                        <h3 className="text-2xl font-semibold text-white mb-2">No Tickets Available</h3>
                        <p className="text-white/80 text-base">Check back later for new travel opportunities</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LatestTickets;
