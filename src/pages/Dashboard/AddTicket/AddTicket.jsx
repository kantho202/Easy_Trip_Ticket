import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoaderData, useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import useAuth from '../../../hook/useAuth';
import axios from 'axios';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { toast } from 'react-toastify';
import Loader from '../../../components/Loading/Loading';
import { 
    IoTicket, 
    IoCloudUpload, 
    IoCalendar, 
    IoLocation, 
    IoPricetag,
    IoCheckmarkCircle,
    IoInformationCircle
} from 'react-icons/io5';
import { 
    FaUser, 
    FaEnvelope, 
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

const AddTicket = () => {
    const serviceCenter = useLoaderData();
    const regionsDuplicate = serviceCenter.map(c => c.region);
    const regions = [...new Set(regionsDuplicate)];
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const { user, loading } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const perks = [
        { name: "AC", icon: FaSnowflake, label: "Air Conditioning" },
        { name: "Breakfast", icon: FaCoffee, label: "Complimentary Breakfast" },
        { name: "WiFi", icon: FaWifi, label: "Free WiFi" },
        { name: "TV", icon: FaTv, label: "Entertainment System" },
        { name: "Parking", icon: FaParking, label: "Free Parking" }
    ];

    const transportTypes = [
        { value: "Bus", icon: FaBus, label: "Bus" },
        { value: "Train", icon: FaTrain, label: "Train" },
        { value: "Plane", icon: FaPlane, label: "Flight" },
        { value: "Launch", icon: FaShip, label: "Launch/Ferry" }
    ];

    const { register, handleSubmit, formState: { errors }, clearErrors } = useForm();

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!validTypes.includes(file.type)) {
                toast.error('Please select a valid image file (JPG, PNG, GIF, WebP)');
                return;
            }

            const maxSize = 10 * 1024 * 1024;
            if (file.size > maxSize) {
                toast.error('Image size should be less than 10MB');
                return;
            }

            setSelectedImage(file);
            clearErrors('image');

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddTicket = async (data) => {
        if (!selectedImage) {
            toast.error('Please select an image');
            return;
        }

        const result = await Swal.fire({
            title: "Add New Ticket?",
            text: 'Are you sure you want to add this ticket?',
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#ff8c42",
            cancelButtonColor: "#6b7280",
            confirmButtonText: "Yes, Add Ticket!",
            cancelButtonText: "Cancel"
        });

        if (!result.isConfirmed) return;

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('image', selectedImage);

            const imageAPI_URL = `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_image_host_key}`;
            
            const imageResponse = await axios.post(imageAPI_URL, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (imageResponse.data && imageResponse.data.data && imageResponse.data.data.url) {
                const imageUrl = imageResponse.data.data.url;
                
                const ticketData = {
                    ...data,
                    image: imageUrl,
                    createAt: new Date(),
                    status: 'pending'
                };

                delete ticketData.imageFile;

                const saveResponse = await axiosSecure.post('/tickets', ticketData);
                
                if (saveResponse.data) {
                    toast.success('Ticket added successfully!');
                    navigate('/dashboard/myAddedTickets');
                } else {
                    throw new Error('Failed to save ticket data');
                }
            } else {
                throw new Error('Image upload failed - no URL returned');
            }

        } catch (error) {
            console.error('Error adding ticket:', error);
            
            if (error.response) {
                const errorMessage = error.response.data?.message || 'Server error occurred';
                toast.error(`Error: ${errorMessage}`);
            } else if (error.request) {
                toast.error('Network error. Please check your connection.');
            } else {
                toast.error(error.message || 'An unexpected error occurred');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <div className="min-h-screen  p-8 md:p-4 font-sans">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-12 p-8 rounded-3xl shadow-md border border-gray-100">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-xl flex-shrink-0">
                    <IoTicket />
                </div>
                <div className="flex-1">
                    <h1 className="text-5xl md:text-3xl font-bold text-gray-800 mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Add New Ticket
                    </h1>
                    <p className="text-xl md:text-base text-gray-600 m-0">
                        Create a new travel ticket for your customers
                    </p>
                </div>
            </div>

            {/* Form Container */}
            <div className=" rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
                <form onSubmit={handleSubmit(handleAddTicket)} className="p-12 md:p-6">
                    {/* Personal Information Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                <FaUser />
                            </div>
                            <h2 className="text-2xl font-semibold  m-0">Personal Information</h2>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <FaUser className="text-orange-500 text-base" />
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={user?.displayName}
                                    readOnly
                                    {...register('name', { required: 'Name is required' })}
                                    placeholder="Enter your full name"
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange read-only:bg-gray-50 read-only:text-gray-600 read-only:cursor-not-allowed placeholder:text-gray-400"
                                />
                                {errors.name && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.name.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <FaEnvelope className="text-orange-500 text-base" />
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    defaultValue={user?.email}
                                    readOnly
                                    {...register('email', { required: 'Email is required' })}
                                    placeholder="Enter your email"
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange read-only:bg-gray-50 read-only:text-gray-600 read-only:cursor-not-allowed placeholder:text-gray-400"
                                />
                                {errors.email && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.email.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Ticket Details Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                <IoTicket />
                            </div>
                            <h2 className="text-2xl font-semibold  m-0">Ticket Details</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <IoTicket className="text-orange-500 text-base" />
                                    Ticket Title
                                </label>
                                <input
                                    type="text"
                                    {...register('ticketTitle', { required: 'Ticket title is required' })}
                                    placeholder="Enter descriptive ticket title"
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange placeholder:text-gray-400"
                                />
                                {errors.ticketTitle && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.ticketTitle.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <IoPricetag className="text-orange-500 text-base" />
                                    Price (৳)
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    {...register('price', { 
                                        required: 'Price is required',
                                        min: { value: 1, message: 'Price must be greater than 0' }
                                    })}
                                    placeholder="Enter ticket price"
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange placeholder:text-gray-400"
                                />
                                {errors.price && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.price.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <IoTicket className="text-orange-500 text-base" />
                                    Ticket Quantity
                                </label>
                                <input
                                    type="number"
                                    min="1"
                                    {...register('ticketQuantity', { 
                                        required: 'Ticket quantity is required',
                                        min: { value: 1, message: 'Quantity must be at least 1' }
                                    })}
                                    placeholder="Available tickets"
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange placeholder:text-gray-400"
                                />
                                {errors.ticketQuantity && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.ticketQuantity.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Travel Information Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                <IoLocation />
                            </div>
                            <h2 className="text-2xl font-semibold  m-0">Travel Information</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <IoLocation className="text-orange-500 text-base" />
                                    From
                                </label>
                                <input
                                    {...register('from', { required: 'Departure location is required' })}
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all cursor-pointer focus:outline-none focus:border-orange-500 focus:shadow-orange"
                               />
                                    
                                
                                {errors.from && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.from.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <IoLocation className="text-orange-500 text-base" />
                                    To
                                </label>
                                <input
                                    {...register('to', { required: 'Destination is required' })}
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all cursor-pointer focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                />
                                   
                                
                                {errors.to && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.to.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="flex items-center gap-2 font-semibold  text-sm mb-2">
                                    <IoCalendar className="text-orange-500 text-base" />
                                    Departure Date & Time
                                </label>
                                <input
                                    type="datetime-local"
                                    {...register('departureDateTime', { required: 'Departure date and time is required' })}
                                    className="px-5 py-4 border-2 border-gray-200 rounded-xl text-base transition-all focus:outline-none focus:border-orange-500 focus:shadow-orange"
                                />
                                {errors.departureDateTime && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.departureDateTime.message}</span>}
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-semibold  text-sm mb-2">Transport Type</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-2">
                                    {transportTypes.map((transport) => (
                                        <div key={transport.value} className="relative">
                                            <input
                                                type="radio"
                                                value={transport.value}
                                                {...register('transport', { required: 'Transport type is required' })}
                                                id={transport.value}
                                                className="absolute opacity-0 cursor-pointer peer"
                                            />
                                            <label 
                                                htmlFor={transport.value}
                                                className="flex flex-col items-center gap-2 px-4 py-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all text-sm font-medium hover:border-orange-500  peer-checked:bg-gradient-to-br peer-checked:from-orange-500 peer-checked:to-orange-600 peer-checked:text-white peer-checked:border-orange-500 peer-checked:-translate-y-1 peer-checked:shadow-xl"
                                            >
                                                <transport.icon className="text-2xl" />
                                                {transport.label}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                {errors.transport && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.transport.message}</span>}
                            </div>
                        </div>
                    </div>

                    {/* Image Upload Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                <IoCloudUpload />
                            </div>
                            <h2 className="text-2xl font-semibold  m-0">Ticket Image</h2>
                        </div>

                        <div className="mt-4">
                            <div className="relative">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    id="image-upload"
                                    className="hidden"
                                />
                                
                                <label htmlFor="image-upload" className="block cursor-pointer">
                                    {imagePreview ? (
                                        <div className="relative w-full h-52 rounded-xl overflow-hidden border-2 border-dashed border-gray-200 group">
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center gap-2 text-white opacity-0 transition-opacity group-hover:opacity-100">
                                                <IoCloudUpload className="text-3xl" />
                                                <span>Click to change image</span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-4 px-8 py-12 border-2 border-dashed border-gray-300 rounded-xl hover:text-black transition-all hover:border-orange-500 hover:bg-orange-50">
                                            <IoCloudUpload className="text-5xl text-gray-400" />
                                            <div className="text-lg  text-center">
                                                <strong className="text-orange-500">Click to upload</strong> or drag and drop
                                            </div>
                                            <div className="text-sm text-gray-600">PNG, JPG, GIF up to 10MB</div>
                                        </div>
                                    )}
                                </label>
                            </div>
                            {!selectedImage && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">Ticket image is required</span>}
                        </div>
                    </div>

                    {/* Perks Section */}
                    <div className="mb-12">
                        <div className="flex items-center gap-4 mb-8 pb-4 border-b-2 border-gray-100">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl text-white shadow-lg">
                                <IoCheckmarkCircle />
                            </div>
                            <h2 className="text-2xl font-semibold  m-0">Available Perks</h2>
                            <p className="text-sm text-gray-600 m-0 ml-auto">Select the amenities included with this ticket</p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                            {perks.map((perk) => (
                                <div key={perk.name} className="relative">
                                    <input
                                        type="checkbox"
                                        value={perk.name}
                                        {...register("perks", { required: 'Please select at least one perk' })}
                                        id={perk.name}
                                        className="absolute opacity-0 cursor-pointer peer"
                                    />
                                    <label 
                                        htmlFor={perk.name}
                                        className="flex items-center gap-4 px-4 py-4 border-2 border-gray-200 rounded-xl cursor-pointer transition-all  hover:border-orange-500  peer-checked:bg-gradient-to-br peer-checked:from-orange-500 peer-checked:to-orange-600 peer-checked:text-white peer-checked:border-orange-500 peer-checked:-translate-y-1 peer-checked:shadow-xl"
                                    >
                                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center text-xl text-gray-600 transition-all peer-checked:text-white peer-checked:bg-white/20">
                                            <perk.icon />
                                        </div>
                                        <div className="flex-1">
                                            <div className="font-semibold  mb-1 peer-checked:text-white">{perk.name}</div>
                                            <div className="text-xs  peer-checked:text-white/90">{perk.label}</div>
                                        </div>
                                    </label>
                                </div>
                            ))}
                        </div>
                        {errors.perks && <span className="text-red-500 text-xs mt-1 flex items-center gap-1 before:content-['⚠']">{errors.perks.message}</span>}
                    </div>

                    {/* Submit Button */}
                    <div className="flex flex-col items-center gap-4 mt-12 pt-8 border-t-2 border-gray-100">
                        <button 
                            type="submit" 
                            disabled={isSubmitting || !selectedImage}
                            className="flex items-center gap-3 px-12 py-5 bg-gradient-to-br from-orange-500 to-orange-600 text-white border-none rounded-full text-lg font-semibold cursor-pointer transition-all shadow-xl hover:not(:disabled):-translate-y-1 hover:not(:disabled):shadow-2xl disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none md:w-full md:justify-center"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Adding Ticket...
                                </>
                            ) : (
                                <>
                                    <IoTicket className="text-xl" />
                                    Add Ticket
                                </>
                            )}
                        </button>
                        <div className="flex items-center gap-2 text-sm text-gray-600 text-center">
                            <IoInformationCircle className="text-orange-500 text-base" />
                            Your ticket will be reviewed before being published
                        </div>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .focus\\:shadow-orange:focus {
                    box-shadow: 0 0 0 3px rgba(255, 140, 66, 0.1);
                }
            `}</style>
        </div>
    );
};

export default AddTicket;
