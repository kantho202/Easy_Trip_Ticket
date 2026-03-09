import React, { useState } from 'react';
import { 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaClock,
    FaFacebook,
    FaTwitter,
    FaInstagram,
    FaLinkedin
} from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';
import Swal from 'sweetalert2';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Show success message
        Swal.fire({
            icon: 'success',
            title: 'Message Sent!',
            text: 'Thank you for contacting us. We will get back to you soon.',
            confirmButtonColor: '#ff8c42'
        });

        // Reset form
        setFormData({
            name: '',
            email: '',
            phone: '',
            subject: '',
            message: ''
        });
    };

    const contactInfo = [
        {
            icon: <FaPhone />,
            title: 'Phone',
            details: ['+880 1234-567890', '+880 9876-543210'],
            color: 'bg-green-100 text-green-500',
            hoverColor: 'hover:bg-green-500 hover:text-white'
        },
        {
            icon: <FaEnvelope />,
            title: 'Email',
            details: ['support@ticketbooking.com', 'info@ticketbooking.com'],
            color: 'bg-blue-100 text-blue-500',
            hoverColor: 'hover:bg-blue-500 hover:text-white'
        },
        {
            icon: <FaMapMarkerAlt />,
            title: 'Address',
            details: ['123 Main Street', 'Dhaka, Bangladesh'],
            color: 'bg-red-100 text-red-500',
            hoverColor: 'hover:bg-red-500 hover:text-white'
        },
        {
            icon: <FaClock />,
            title: 'Working Hours',
            details: ['Mon - Fri: 9:00 AM - 6:00 PM', 'Sat - Sun: 10:00 AM - 4:00 PM'],
            color: 'bg-yellow-100 text-yellow-600',
            hoverColor: 'hover:bg-yellow-500 hover:text-white'
        }
    ];

    const socialLinks = [
        { icon: <FaFacebook />, name: 'Facebook', url: '#', color: 'hover:bg-blue-600' },
        { icon: <FaXTwitter />, name: 'Twitter', url: '#', color: 'hover:bg-black' },
        { icon: <FaInstagram />, name: 'Instagram', url: '#', color: 'hover:bg-pink-600' },
        { icon: <FaLinkedin />, name: 'LinkedIn', url: '#', color: 'hover:bg-blue-700' }
    ];

    return (
        <div className="py-16 px-4 lg:px-4  min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Get In Touch
                    </h1>
                    <p className="text-lg  max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
                </div>

                {/* Contact Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {contactInfo.map((info, index) => (
                        <div 
                            key={index}
                            className=" p-6 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2 text-center"
                        >
                            <div className={`w-16 h-16 ${info.color} rounded-full flex items-center justify-center text-2xl mx-auto mb-4 transition-all duration-300 ${info.hoverColor}`}>
                                {info.icon}
                            </div>
                            <h3 className="text-lg font-semibold  mb-3">
                                {info.title}
                            </h3>
                            {info.details.map((detail, idx) => (
                                <p key={idx} className="text-sm text-gray-600 font-semibold mb-1">
                                    {detail}
                                </p>
                            ))}
                        </div>
                    ))}
                </div>

                {/* Contact Form and Map Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Contact Form */}
                    <div className="p-4 lg:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold  mb-6">
                            Send Us a Message
                        </h2>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold  mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold  mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="Enter your email"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold  mb-2">
                                        Phone Number
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        placeholder="Enter your phone"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold  mb-2">
                                        Subject *
                                    </label>
                                    <input
                                        type="text"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        placeholder="Enter subject"
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold  mb-2">
                                    Message *
                                </label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Write your message here..."
                                    rows="6"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold text-lg hover:from-orange-600 hover:to-orange-700 transform hover:-translate-y-1 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>

                    {/* Map Section */}
                    <div className="p-4 lg:p-8 rounded-2xl shadow-lg">
                        <h2 className="text-3xl font-bold  mb-6">
                            Find Us Here
                        </h2>
                        <div className="w-full h-80 rounded-xl overflow-hidden mb-6">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d233668.38703692693!2d90.25446309999999!3d23.780573!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b087026b81%3A0x8fa563bbdd5904c2!2sDhaka!5e0!3m2!1sen!2sbd!4v1234567890123!5m2!1sen!2sbd"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="Location Map"
                            />
                        </div>

                        {/* Social Links */}
                        <div className="text-center">
                            <h3 className="text-xl font-semibold  mb-4">
                                Follow Us
                            </h3>
                            <div className="flex justify-center gap-4">
                                {socialLinks.map((social, index) => (
                                    <a
                                        key={index}
                                        href={social.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={`w-12 h-12 bg-gray-100 text-gray-600 rounded-full flex items-center justify-center text-xl transition-all duration-300 hover:text-white transform hover:-translate-y-1 hover:shadow-lg ${social.color}`}
                                    >
                                        {social.icon}
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
