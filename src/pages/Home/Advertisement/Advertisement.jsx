import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { Link } from 'react-router';
import {
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaArrowRight,
    FaStar,
    FaWifi,
    FaCoffee,
    FaParking,
    FaTv,
    FaSnowflake
} from 'react-icons/fa';
import { LuCalendar, LuClock, LuMapPin, LuUsers } from 'react-icons/lu';

const Advertisement = () => {
    const axiosSecure = useAxiosSecure();
    const [imageIndices, setImageIndices] = useState({});

    const { data: advertise = [], isLoading } = useQuery({
        queryKey: ['advertise'],
        queryFn: async () => {
            const res = await axiosSecure.get('/tickets?isAdvertised=advertise');
            console.log(res);
            return res.data;
        }
    });

    // Initialize image indices for all tickets
    useEffect(() => {
        if (advertise.length > 0) {
            const initialIndices = {};
            advertise.forEach(ticket => {
                initialIndices[ticket._id] = 0;
            });
            setImageIndices(initialIndices);
        }
    }, [advertise]);

    // Auto-slide effect for each ticket
    useEffect(() => {
        const intervals = advertise.map(ticket => {
            const images = ticket.images || [ticket.image];
            if (images.length > 1) {
                return setInterval(() => {
                    setImageIndices(prev => ({
                        ...prev,
                        [ticket._id]: ((prev[ticket._id] || 0) + 1) % images.length
                    }));
                }, 5000);
            }
            return null;
        }).filter(Boolean);

        return () => intervals.forEach(interval => clearInterval(interval));
    }, [advertise]);

    const handlePrevImage = (e, ticketId, images) => {
        e.preventDefault();
        setImageIndices(prev => ({
            ...prev,
            [ticketId]: prev[ticketId] === 0 ? images.length - 1 : prev[ticketId] - 1
        }));
    };

    const handleNextImage = (e, ticketId, images) => {
        e.preventDefault();
        setImageIndices(prev => ({
            ...prev,
            [ticketId]: (prev[ticketId] + 1) % images.length
        }));
    };

    const transportIcons = {
        Bus: FaBus,
        Train: FaTrain,
        Plane: FaPlane,
        Launch: FaShip,
        Flight: FaPlane,
        Boat: FaShip
    };

    const perks = [
        { name: "AC", icon: FaSnowflake },
        { name: "Breakfast", icon: FaCoffee },
        { name: "WiFi", icon: FaWifi },
        { name: "TV", icon: FaTv },
        { name: "Parking", icon: FaParking },
        { name: "Air Conditioning", icon: FaSnowflake },
        { name: "Free WiFi", icon: FaWifi }
    ];

    if (isLoading) {
        return (
            <div className="py-20 px-4 lg:px-14 md:py-12">
                <div className="max-w-7xl mx-auto">
                    {/* Header skeleton */}
                    <div className="text-center mb-16 md:mb-12">
                        <div className="h-8 bg-gray-200 rounded-full animate-pulse w-48 mx-auto mb-6"></div>
                        <div className="h-10 bg-gray-200 rounded-lg animate-pulse w-96 mx-auto mb-4"></div>
                        <div className="h-5 bg-gray-200 rounded animate-pulse w-2/3 mx-auto"></div>
                    </div>
                    {/* Cards skeleton */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-xl overflow-hidden shadow-md border-3 border-gray-100 flex flex-col">
                                {/* Image skeleton */}
                                <div className="h-52 bg-gray-200 animate-pulse"></div>
                                {/* Content skeleton */}
                                <div className="p-6 flex flex-col gap-4">
                                    {/* Title */}
                                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                                    {/* Route */}
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                    </div>
                                    {/* Grid info */}
                                    <div className="grid grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, j) => (
                                            <div key={j} className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {/* Organizer */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                        </div>
                                    </div>
                                    {/* Button */}
                                    <div className="h-12 bg-gray-200 rounded-2xl animate-pulse mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="py-20 px-4 lg:px-14 md:py-12 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-radial from-white/10 via-transparent to-transparent"></div>
            </div>

            <div className="max-w-7xl mx-auto relative z-10" data-aos="fade-up" data-aos-easing="linear" data-aos-duration="800">
                {/* Header Section */}
                <div className="text-center mb-16 md:mb-12">
                    <div className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-md rounded-full text-sm font-semibold mb-6 border border-orange-200 bg-orange-50 text-orange-600">
                        <FaStar className="text-yellow-500" />
                        Featured Destinations
                    </div>
                    <h1 className="text-4xl nunito-sans   md:text-3xl font-bold mb-4 tracking-tight leading-tight">
                        Premium Travel Experiences
                    </h1>
                    <p className="text-lg text-gray-600 max-w-3xl inter mx-auto leading-relaxed">
                        Discover handpicked destinations and exclusive travel deals curated just for you
                    </p>
                </div>

                {/* Cards Skeleton */}
                {isLoading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(3)].map((_, i) => (
                            <div key={i} className="rounded-xl overflow-hidden shadow-md border-3 border-gray-100 flex flex-col">
                                <div className="h-52 bg-gray-200 animate-pulse"></div>
                                <div className="p-6 flex flex-col gap-4">
                                    <div className="h-6 bg-gray-200 rounded-lg animate-pulse w-3/4"></div>
                                    <div className="flex items-center gap-3">
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-4"></div>
                                        <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {[...Array(4)].map((_, j) => (
                                            <div key={j} className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"></div>
                                                <div className="flex-1 flex flex-col gap-1">
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                                    <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse flex-shrink-0"></div>
                                        <div className="flex-1 flex flex-col gap-1">
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                            <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
                                        </div>
                                    </div>
                                    <div className="h-12 bg-gray-200 rounded-2xl animate-pulse mt-2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Tickets Grid */}
                {!isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {advertise.map((ticket, index) => {
                        const TransportIcon = transportIcons[ticket.transport] || FaBus;
                        const images = ticket.images || [ticket.image];
                        const currentImageIndex = imageIndices[ticket._id] || 0;
                        const currentImage = images[currentImageIndex] || ticket.image;

                        return (
                            <div key={ticket._id} data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100}>
                                <div className=" rounded-xl overflow-hidden shadow-md border-3 hover:border-primary hover:border-3 border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full group">
                                    {/* Image Container */}
                                    <div className="relative h-52 overflow-hidden">
                                        {/* All images stacked — CSS fade transition */}
                                        {images.map((img, imgIndex) => (
                                            <img
                                                key={imgIndex}
                                                src={img}
                                                alt={ticket.ticketTitle}
                                                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                                                    imgIndex === currentImageIndex ? 'opacity-100' : 'opacity-0'
                                                }`}
                                            />
                                        ))}
                                        <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 z-10"></div>

                                        {/* Price Tag */}
                                        <div className="absolute top-4 right-4 z-20 px-4 py-2 bg-white/95 text-orange-500 rounded-full font-bold text-lg backdrop-blur-md">
                                            ${ticket.price}
                                        </div>

                                        {/* Image Indicators */}
                                        {images.length > 1 && (
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
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
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-4 lg:p-8">
                                        <h3 className="text-2xl font-bold nunito-sans   mb-4">{ticket.ticketTitle}</h3>

                                        <div className="flex items-center gap-4 mb-6 px-4 py-4  rounded-xl">
                                            <div className="flex items-center inter gap-2 font-semibold ">
                                                <LuMapPin className="text-orange-500" />
                                                <span>{ticket.from}</span>
                                            </div>
                                            <div className="text-orange-500 font-bold text-xl">→ </div>
                                            <div className="flex inter items-center gap-2 font-semibold ">
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
                                                <div className="text-xs  font-semibold uppercase tracking-wide inter mb-1">Organized by</div>
                                                <div className="text-sm text-gray-500 font-semibold inter truncate">
                                                    {ticket.name?.length > 15
                                                        ? ticket.name.slice(0, 15) + '...'
                                                        : ticket.name || 'Travel Agent'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                        {ticket.perks && ticket.perks.length > 0 && (
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold inter  mb-3">Included Perks</h4>
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
                )}

                {/* Empty State */}
                {!isLoading && advertise.length === 0 && (
                    <div className="text-center p-16 md:p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 mt-8">
                        <div className="text-6xl mb-6">🎫</div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">No Featured Tickets Available</h3>
                        <p className="text-gray-600 text-base">Check back later for exclusive travel deals</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Advertisement;
