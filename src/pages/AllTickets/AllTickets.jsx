import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import useAxiosSecure from '../../hook/useAxiosecure';
import { Link } from 'react-router';
import { LuSearch } from "react-icons/lu";
import Loader from '../../components/Loading/Loading';
import useRole from '../../hook/useRole';
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

const AllTickets = () => {
    const axiosSecure = useAxiosSecure();
    const [searchText, setSearchText] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [transportType, setTransportType] = useState("");
    const [sort, setSort] = useState('price');
    const [order, setOrder] = useState("asc");
    const [imageIndices, setImageIndices] = useState({});
    const itemsPerPage = 6;
    const skip = (currentPage - 1) * itemsPerPage;

    const { data: tickets = [], isLoading } = useQuery({
        queryKey: ['tickets', searchText, transportType, currentPage, order, sort],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets/sort?status=approved&searchText=${searchText}&transport=${transportType}&limit=${itemsPerPage}&skip=${skip}&sort=${sort}&order=${order}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    // Initialize image indices for all tickets
    useEffect(() => {
        if (tickets.length > 0) {
            const initialIndices = {};
            tickets.forEach(ticket => {
                initialIndices[ticket._id] = 0;
            });
            setImageIndices(initialIndices);
        }
    }, [tickets]);

    // Auto-slide effect for each ticket
    useEffect(() => {
        const intervals = tickets.map(ticket => {
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
    }, [tickets]);

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
        Launch: FaShip
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

    const handleSelect = (e) => {
        const sortText = e.target.value;
        setSort(sortText.split("-")[0]);
        setOrder(sortText.split("-")[1]);
    };

    const { role } = useRole();

    if (role === 'fraud') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 to-purple-800">
                <div className="text-center p-12 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 max-w-lg">
                    <h2 className="text-3xl font-bold text-red-500 mb-4">Access Restricted 🚫</h2>
                    <p className="text-white text-lg leading-relaxed">Your account is marked as fraud. You are not allowed to view tickets.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen  py-16 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 "></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 lg:px- md:px-4 relative z-10" data-aos="fade-up" data-aos-easing="linear" data-aos-duration="1000">
                {/* Header Section */}
                <div className="text-center mb-12">
                    <h1 className="text-3xl lg:text-4xl md:text-4xl font-extrabold  mb-4 tracking-tight leading-tight">
                        All Available Tickets
                    </h1>
                    <p className="text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
                        Discover and book your perfect travel experience
                    </p>
                </div>

                {/* Filter Section */}
                <div className=" rounded-2xl shadow-lg border border-gray-100 mb-12 overflow-hidden">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* Search Input */}
                        <div className="lg:col-span-6 border-b lg:border-b-0 lg:border-r border-gray-100">
                            <div className="relative h-full">
                                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400">
                                    <LuSearch className="text-xl" />
                                </div>
                                <input
                                    type="search"
                                    placeholder="Search destinations, cities, or ticket names..."
                                    className="w-full h-full pl-16 pr-6 py-6 text-base text-gray-700 placeholder:text-gray-400 focus:outline-none bg-transparent"
                                    onChange={(e) => {
                                        setSearchText(e.target.value);
                                        setCurrentPage(1);
                                    }}
                                />
                            </div>
                        </div>

                        {/* Transport Type Select */}
                        <div className="lg:col-span-3 border-b lg:border-b-0 lg:border-r border-gray-100">
                            <select
                                value={transportType}
                                onChange={(e) => {
                                    setTransportType(e.target.value);
                                    setCurrentPage(1);
                                }}
                                className="w-full h-full px-6 py-6 text-base text-gray-700 font-medium focus:outline-none bg-transparent cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1.5rem_center] bg-no-repeat"
                            >
                                <option value="">All Transport</option>
                                <option value="Bus">Bus</option>
                                <option value="Train">Train</option>
                                <option value="Plane">Plane</option>
                                <option value="Launch">Launch</option>
                            </select>
                        </div>

                        {/* Sort Select */}
                        <div className="lg:col-span-3">
                            <select
                                defaultValue="price-asc"
                                onChange={handleSelect}
                                className="w-full h-full px-6 py-6 text-base text-gray-700 font-medium focus:outline-none bg-transparent cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 24 24%27 fill=%27none%27 stroke=%27currentColor%27 stroke-width=%272%27 stroke-linecap=%27round%27 stroke-linejoin=%27round%27%3e%3cpolyline points=%276 9 12 15 18 9%27%3e%3c/polyline%3e%3c/svg%3e')] bg-[length:1.25rem] bg-[right_1.5rem_center] bg-no-repeat"
                            >
                                <option disabled value="">Sort by Price</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Active Filters */}
                    {(searchText || transportType) && (
                        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="text-sm font-medium text-gray-500">Active:</span>
                                {searchText && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                                        <span className="text-gray-500">Search:</span>
                                        <span className="text-orange-600">{searchText}</span>
                                        <button
                                            onClick={() => {
                                                setSearchText('');
                                                setCurrentPage(1);
                                            }}
                                            className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                {transportType && (
                                    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700">
                                        <span className="text-gray-500">Transport:</span>
                                        <span className="text-orange-600">{transportType}</span>
                                        <button
                                            onClick={() => {
                                                setTransportType('');
                                                setCurrentPage(1);
                                            }}
                                            className="ml-1 text-gray-400 hover:text-gray-600 transition-colors"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                )}
                                <button
                                    onClick={() => {
                                        setSearchText('');
                                        setTransportType('');
                                        setCurrentPage(1);
                                    }}
                                    className="ml-auto text-sm font-medium text-orange-600 hover:text-orange-700 transition-colors"
                                >
                                    Clear All
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {isLoading ? (
                    <div className="text-center py-16">
                        <Loader />
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center p-16 md:p-8 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20">
                        <div className="text-6xl mb-6">🎫</div>
                        <h3 className="text-2xl font-semibold text-white mb-2">No Tickets Found</h3>
                        <p className="text-white/80 text-base">Try adjusting your search criteria or filters</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tickets.map((ticket, index) => {
                            const TransportIcon = transportIcons[ticket.transport] || FaBus;
                            const images = ticket.images || [ticket.image];
                            const currentImageIndex = imageIndices[ticket._id] || 0;
                            const currentImage = images[currentImageIndex] || ticket.image;
                            
                            return (
                                <div key={ticket._id} data-aos="fade-up" data-aos-duration="800" data-aos-delay={index * 100}>
                                    <div className=" rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col h-full group">
                                        {/* Image Container */}
                                        <div className="relative h-52 overflow-hidden">
                                            <img
                                                src={currentImage}
                                                alt={ticket.ticketTitle}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30"></div>

                                            {/* Navigation Arrows - Only show if multiple images */}
                                            {images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={(e) => handlePrevImage(e, ticket._id, images)}
                                                        className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all z-10 text-lg font-bold"
                                                    >
                                                        ‹
                                                    </button>
                                                    <button
                                                        onClick={(e) => handleNextImage(e, ticket._id, images)}
                                                        className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 text-white rounded-full flex items-center justify-center transition-all z-10 text-lg font-bold"
                                                    >
                                                        ›
                                                    </button>
                                                </>
                                            )}

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
                )}

                {tickets.length > 0 && (
                    <div className="flex justify-center items-center gap-6 mt-12">
                        <button
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => prev - 1)}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600  border-none rounded-xl font-semibold cursor-pointer transition-all shadow-lg hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            Previous
                        </button>
                        <span className="px-6 py-4 bg-white/20  rounded-xl font-semibold backdrop-blur-md border border-white/30">
                            Page {currentPage}
                        </span>
                        <button
                            disabled={tickets.length < itemsPerPage}
                            onClick={() => setCurrentPage(prev => prev + 1)}
                            className="px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all shadow-lg hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
                .focus-within\\:shadow-orange:focus-within {
                    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
                }
            `}</style>
        </div>
    );
};

export default AllTickets;
