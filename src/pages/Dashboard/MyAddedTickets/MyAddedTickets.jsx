import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import useAuth from '../../../hook/useAuth';
import useAxiosSecure from '../../../hook/useAxiosecure';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loading/Loading';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import axios from 'axios';
import {
    LuTicketsPlane,
    LuTrash2,
    LuCalendar,
    LuMapPin,
    LuUsers,
    LuClock,
    LuImage,
    LuX,
    LuCheck
} from 'react-icons/lu';
import {
    FaBus,
    FaTrain,
    FaPlane,
    FaShip,
    FaWifi,
    FaCoffee,
    FaParking,
    FaTv,
    FaSnowflake
} from 'react-icons/fa';

const MyAddedTickets = () => {
    const { user } = useAuth();
    const axiosSecure = useAxiosSecure();
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageIndices, setImageIndices] = useState({});

    const { data: tickets = [], refetch, isLoading } = useQuery({
        queryKey: ['tickets', user?.email],
        queryFn: async () => {
            const res = await axiosSecure.get(`/tickets?email=${user?.email}`);
            return res.data;
        }
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

    const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm();

    const perks = [
        { name: "AC", icon: FaSnowflake, label: "Air Conditioning" },
        { name: "Breakfast", icon: FaCoffee, label: "Complimentary Breakfast" },
        { name: "WiFi", icon: FaWifi, label: "Free WiFi" },
        { name: "TV", icon: FaTv, label: "Entertainment System" },
        { name: "Parking", icon: FaParking, label: "Free Parking" }
    ];

    const transportIcons = {
        Bus: FaBus,
        Train: FaTrain,
        Plane: FaPlane,
        Launch: FaShip
    };

    const handleTicketShowModal = (ticket) => {
        setSelectedTicket(ticket);
        // Set all images or fallback to single image
        const allImages = ticket.images || [ticket.image];
        setImagePreview(allImages);

        setValue('name', ticket.name);
        setValue('ticketTitle', ticket.ticketTitle);
        setValue('departureDateTime', ticket.departureDateTime);
        setValue('price', ticket.price);
        setValue('email', ticket.email);
        setValue('transport', ticket.transport);
        setValue('ticketQuantity', ticket.ticketQuantity);
        setValue('from', ticket.from);
        setValue('to', ticket.to);

        if (ticket.perks) {
            setValue('perks', ticket.perks);
        }

        // Open DaisyUI modal
        document.getElementById('update_ticket_modal').showModal();
    };

    const closeModal = () => {
        document.getElementById('update_ticket_modal').close();
        setSelectedTicket(null);
        setImagePreview(null);
        reset();
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Keep it as a single image for the new upload preview
                setImagePreview([reader.result]);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTicketUpdate = async (data) => {
        setIsUpdating(true);

        try {
            let imageUrl = selectedTicket.image;

            if (data.image && data.image.length > 0) {
                const formData = new FormData();
                formData.append('image', data.image[0]);

                const imgRes = await axios.post(
                    `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`,
                    formData
                );
                imageUrl = imgRes.data.data.url;
            }

            const updatedTicket = {
                ...data,
                image: imageUrl,
                perks: data.perks || [],
            };

            const res = await axiosSecure.patch(`/tickets/${selectedTicket._id}`, updatedTicket);

            if (res.data.modifiedCount > 0) {
                toast.success('Ticket updated successfully!');
                refetch();
                closeModal();
            } else {
                toast.info('No changes were made.');
            }
        } catch (err) {
            console.error(err);
            toast.error('Update failed!');
        } finally {
            setIsUpdating(false);
        }
    };

    const handleTicketRemove = (id) => {
        Swal.fire({
            title: "Delete Ticket?",
            text: "You won't be able to revert this action!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                axiosSecure.delete(`/tickets/${id}`)
                    .then(res => {
                        if (res.data.deletedCount) {
                            refetch();
                            Swal.fire({
                                title: "Deleted!",
                                text: "Your ticket has been deleted.",
                                icon: "success"
                            });
                        }
                    });
            }
        });
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved': return 'bg-green-500';
            case 'rejected': return 'bg-red-500';
            default: return 'bg-yellow-500';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved': return <LuCheck />;
            case 'rejected': return <LuX />;
            default: return <LuClock />;
        }
    };

    if (isLoading) {
        return <Loader />;
    }

    return (
        <div className="p-4 lg:p-8 md:p-4 min-h-screen font-sans">
            {/* Modern Header Section */}
            <div className="mb-8">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 p-6 lg:p-8 rounded-2xl shadow-lg border border-gray-100/50 backdrop-blur-sm">
                    {/* Left Section - Icon & Title */}
                    <div className="flex items-center gap-4 w-full lg:w-auto">
                        <div className="w-16 h-16 lg:w-20 lg:h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl lg:text-4xl text-white shadow-xl flex-shrink-0 transform transition-transform hover:scale-105">
                            <LuTicketsPlane />
                        </div>
                        <div className="flex-1">
                            <h1 className="text-2xl lg:text-4xl font-bold mb-1 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                                My Added Tickets
                            </h1>
                            <p className="text-sm lg:text-base text-gray-600">
                                Manage and track your ticket listings
                            </p>
                        </div>
                    </div>

                    {/* Right Section - Stats Card */}
                    <div className="w-full lg:w-auto">
                        <div className="flex items-center justify-between lg:justify-center gap-4 p-4 lg:p-6 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl lg:rounded-2xl text-white shadow-lg min-w-full lg:min-w-[140px]">
                            <div className="flex items-center gap-3 lg:flex-col lg:gap-1 lg:text-center">
                                <div className="text-3xl lg:text-4xl font-bold">{tickets.length}</div>
                                <div className="text-sm lg:text-base opacity-90 font-medium">Total Tickets</div>
                            </div>
                            <div className="lg:hidden">
                                <LuTicketsPlane className="text-3xl opacity-50" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {tickets.length === 0 ? (
                <div className="text-center p-16 md:p-8  rounded-3xl shadow-md">
                    <div className="w-25 h-25 bg-gray-100 rounded-full flex items-center justify-center text-5xl text-gray-400 mx-auto mb-8">
                        <LuTicketsPlane />
                    </div>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">No Tickets Added Yet</h2>
                    <p className="text-gray-600 text-base">Start by adding your first ticket to get bookings</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 md:grid-cols-2">
                    {tickets.map(ticket => {
                        const TransportIcon = transportIcons[ticket.transport] || FaBus;
                        const images = ticket.images || [ticket.image];
                        const currentImageIndex = imageIndices[ticket._id] || 0;
                        const currentImage = images[currentImageIndex] || ticket.image;

                        return (
                            <div key={ticket._id} className=" rounded-xl overflow-hidden shadow-md border border-gray-100 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
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

                                    <div className={`absolute top-4 left-4 flex items-center gap-2 px-4 py-2 ${getStatusColor(ticket.status)} text-white rounded-full text-xs font-semibold capitalize backdrop-blur-md`}>
                                        {getStatusIcon(ticket.status)}
                                        {ticket.status || 'pending'}
                                    </div>
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

                                    <div className="flex gap-4">
                                        <button
                                            disabled={ticket.status === 'rejected'}
                                            onClick={() => handleTicketShowModal(ticket)}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none rounded-xl font-semibold cursor-pointer transition-all hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            Update
                                        </button>
                                        <button
                                            disabled={ticket.status === 'rejected'}
                                            onClick={() => handleTicketRemove(ticket._id)}
                                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-500 border-2 border-red-500 rounded-xl font-semibold cursor-pointer transition-all hover:not(:disabled):bg-red-500 hover:not(:disabled):text-white hover:not(:disabled):-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                                        >
                                            <LuTrash2 />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}


            {/* Update Ticket Modal - Always rendered */}
            <dialog id="update_ticket_modal" className="modal">
                <div className="modal-box max-w-5xl p-0 rounded-3xl">
                    <div className="flex items-center justify-between px-8 py-6 bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                        <h2 className="text-2xl font-bold m-0">Update Ticket</h2>
                        <button
                            type="button"
                            onClick={closeModal}
                            className="bg-white/20 border-none text-white w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all hover:bg-white/30"
                        >
                            <LuX />
                        </button>
                    </div>

                    {selectedTicket && (
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            <form onSubmit={handleSubmit(handleTicketUpdate)} className="flex flex-col gap-8">
                                <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-semibold text-gray-700 text-sm">Ticket Title</label>
                                            <input
                                                type="text"
                                                {...register('ticketTitle', { required: 'Title is required' })}
                                                placeholder="Enter ticket title"
                                                className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                            />
                                            {errors.ticketTitle && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.ticketTitle.message}</span>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="font-semibold text-gray-700 text-sm">From</label>
                                                <input
                                                    type="text"
                                                    {...register('from', { required: 'From location is required' })}
                                                    placeholder="Departure location"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                                />
                                                {errors.from && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.from.message}</span>}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="font-semibold text-gray-700 text-sm">To</label>
                                                <input
                                                    type="text"
                                                    {...register('to', { required: 'Destination is required' })}
                                                    placeholder="Destination"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                                />
                                                {errors.to && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.to.message}</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="font-semibold text-gray-700 text-sm">Transport Type</label>
                                            <select
                                                {...register('transport', { required: 'Transport type is required' })}
                                                className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm bg-white cursor-pointer transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                            >
                                                <option value="">Select Transport</option>
                                                <option value="Bus">Bus</option>
                                                <option value="Train">Train</option>
                                                <option value="Plane">Plane</option>
                                                <option value="Launch">Launch</option>
                                            </select>
                                            {errors.transport && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.transport.message}</span>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="flex flex-col gap-2">
                                                <label className="font-semibold text-gray-700 text-sm">Price (৳)</label>
                                                <input
                                                    type="number"
                                                    {...register('price', { required: 'Price is required' })}
                                                    placeholder="Ticket price"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                                />
                                                {errors.price && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.price.message}</span>}
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                <label className="font-semibold text-gray-700 text-sm">Quantity</label>
                                                <input
                                                    type="number"
                                                    {...register('ticketQuantity', { required: 'Quantity is required' })}
                                                    placeholder="Available tickets"
                                                    className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                                />
                                                {errors.ticketQuantity && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.ticketQuantity.message}</span>}
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="font-semibold text-gray-700 text-sm">Departure Date & Time</label>
                                            <input
                                                type="datetime-local"
                                                {...register('departureDateTime', { required: 'Date and time is required' })}
                                                className="px-4 py-3 border-2 border-gray-200 rounded-lg text-sm transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                            />
                                            {errors.departureDateTime && <span className="text-red-500 text-xs flex items-center gap-1 before:content-['⚠']">{errors.departureDateTime.message}</span>}
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="font-semibold text-gray-700 text-sm">Current Images</label>
                                            {imagePreview && Array.isArray(imagePreview) && imagePreview.length > 0 && (
                                                <div className="grid grid-cols-2 gap-3 mb-4">
                                                    {imagePreview.map((img, index) => (
                                                        <div key={index} className="relative w-full h-32 rounded-lg overflow-hidden border-2 border-gray-200">
                                                            <img src={img} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                                                            <div className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded-full font-semibold">
                                                                {index + 1}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="font-semibold text-gray-700 text-sm">Update Image</label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    {...register('image')}
                                                    onChange={handleImageChange}
                                                    className="hidden"
                                                    id="update-image"
                                                />
                                                <label htmlFor="update-image" className="block cursor-pointer">
                                                    <div className="flex flex-col items-center justify-center gap-2 px-8 py-6 border-2 border-dashed border-gray-300 rounded-lg bg-gray-50 text-gray-600 transition-all hover:border-orange-500 hover:bg-white">
                                                        <LuImage className="text-2xl" />
                                                        <span className="text-sm">Click to upload new image</span>
                                                        <span className="text-xs text-gray-500">This will replace the first image</span>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="flex flex-col gap-2">
                                            <label className="font-semibold text-gray-700 text-sm">Available Perks</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                {perks.map((perk) => (
                                                    <div key={perk.name} className="relative">
                                                        <input
                                                            type="checkbox"
                                                            value={perk.name}
                                                            {...register("perks")}
                                                            id={`update-${perk.name}`}
                                                            className="absolute opacity-0 cursor-pointer peer"
                                                        />
                                                        <label
                                                            htmlFor={`update-${perk.name}`}
                                                            className="flex items-center gap-2 px-3 py-2 border-2 border-gray-200 rounded-lg cursor-pointer transition-all text-xs font-medium hover:border-orange-500 hover:bg-orange-50 peer-checked:bg-gradient-to-r peer-checked:from-orange-500 peer-checked:to-orange-600 peer-checked:text-white peer-checked:border-orange-500"
                                                        >
                                                            <perk.icon />
                                                            {perk.name}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4 justify-end">
                                    <button
                                        type="button"
                                        onClick={closeModal}
                                        className="px-6 py-3 bg-gray-100 text-gray-600 border-none rounded-lg font-semibold cursor-pointer transition-all hover:bg-gray-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isUpdating}
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white border-none rounded-lg font-semibold cursor-pointer transition-all hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isUpdating ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                Updating...
                                            </>
                                        ) : (
                                            <>
                                                <LuCheck />
                                                Update Ticket
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button onClick={closeModal}>close</button>
                </form>
            </dialog>

            <style jsx>{`
                .focus\\:shadow-orange:focus {
                    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
                }
            `}</style>
        </div>
    );
};

export default MyAddedTickets;
