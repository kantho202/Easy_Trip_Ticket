import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import { 
    FaCheck, 
    FaTimes, 
    FaUser, 
    FaEnvelope, 
    FaHashtag,
    FaDollarSign,
    FaSearch,
    FaDownload,
} from 'react-icons/fa';
import { 
    FiClock, 
    FiEye,
    FiCheckCircle,
    FiXCircle,
    FiRefreshCw
} from 'react-icons/fi';
import Swal from 'sweetalert2';
import Loader from '../../../components/Loading/Loading';
import { FaTicket } from 'react-icons/fa6';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const RequestedBooking = () => {
    const axiosSecure = useAxiosSecure();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isProcessing, setIsProcessing] = useState(null);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);

    const { data: bookings = [], isLoading, refetch,isFetching } = useQuery({
        queryKey: ['bookings'],
        queryFn: async () => {
            const res = await axiosSecure.get('/bookings');
            return res.data;
        }
    });

    if (isLoading) {
        return <Loader></Loader>;
    }

    // Filter bookings based on search and status
    const filteredBookings = bookings.filter(booking => {
        const matchesSearch = booking.ticket_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            booking.email.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
        
        return matchesSearch && matchesStatus;
    });

    const updateBookingStatus = async (id, status) => {
        const result = await Swal.fire({
            title: `${status === 'accepted' ? 'Accept' : 'Reject'} Booking Request?`,
            text: `Are you sure you want to ${status} this booking request?`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: status === 'accepted' ? "#10b981" : "#ef4444",
            cancelButtonColor: "#6b7280",
            confirmButtonText: `Yes, ${status === 'accepted' ? 'Accept' : 'Reject'}!`,
            cancelButtonText: "Cancel"
        });

        if (result.isConfirmed) {
            setIsProcessing(id);
            try {
                const updateInfo = { status };
                const res = await axiosSecure.patch(`/bookings/${id}`, updateInfo);
                
                if (res.data.modifiedCount) {
                    await Swal.fire({
                        position: "top-end",
                        icon: "success",
                        title: `Booking ${status === 'accepted' ? 'accepted' : 'rejected'} successfully!`,
                        showConfirmButton: false,
                        timer: 2000
                    });
                    refetch();
                }
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Something went wrong. Please try again.',
                });
            } finally {
                setIsProcessing(null);
            }
        }
    };

    const handleApproved = (id) => {
        updateBookingStatus(id, 'accepted');
    };

    const handleRejection = (id) => {
        updateBookingStatus(id, 'rejected');
    };

    const getStatusBadge = (status) => {
        const badges = {
            accepted: (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                    <FiCheckCircle /> Accepted
                </span>
            ),
            rejected: (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                    <FiXCircle /> Rejected
                </span>
            ),
            pending: (
                <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700">
                    <FiClock /> Pending
                </span>
            )
        };
        
        return badges[status] || badges.pending;
    };

    const handleRefresh = async () => {
        // await refetch(); // This will refetch the data
       window.location.reload();
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedBooking(null);
    };

    const handleOpenViewModal = (booking) => {
        setSelectedBooking(booking);
        setIsViewModalOpen(true);
    };

    const handleCloseViewModal = () => {
        setIsViewModalOpen(false);
        setSelectedBooking(null);
    };

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        
        const form = e.target;
        const updatedData = {
            name: form.name.value,
            email: form.email.value,
            ticket_title: form.ticket_title.value,
            bookingQuantity: parseInt(form.bookingQuantity.value),
            total_price: parseFloat(form.total_price.value),
            status: form.status.value
        };

        try {
            const res = await axiosSecure.patch(`/bookings/${selectedBooking._id}`, updatedData);
            
            if (res.data.modifiedCount > 0) {
                await Swal.fire({
                    icon: 'success',
                    title: 'Updated!',
                    text: 'Booking has been updated successfully.',
                    timer: 2000,
                    showConfirmButton: false
                });
                handleCloseModal();
                refetch();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update booking. Please try again.',
            });
        }
    };

    const handleExportPDF = () => {
        try {
            console.log('Starting PDF export...');
            console.log('Filtered bookings:', filteredBookings);
            
            const doc = new jsPDF();
            
            // Add title with background
            doc.setFillColor(255, 140, 66);
            doc.rect(0, 0, 210, 35, 'F');
            doc.setFontSize(24);
            doc.setTextColor(255, 255, 255);
            doc.text('Booking Requests Report', 105, 15, { align: 'center' });
            
            // Add date
            doc.setFontSize(11);
            const dateStr = new Date().toLocaleDateString('en-US', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
            doc.text(`Generated on: ${dateStr}`, 105, 25, { align: 'center' });
            
            // Add statistics section with boxes
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Summary Statistics', 14, 45);
            
            const stats = [
                { label: 'Total Requests', value: filteredBookings.length, color: [255, 140, 66] },
                { label: 'Accepted', value: filteredBookings.filter(b => b.status === 'accepted').length, color: [16, 185, 129] },
                { label: 'Rejected', value: filteredBookings.filter(b => b.status === 'rejected').length, color: [239, 68, 68] },
                { label: 'Pending', value: filteredBookings.filter(b => !b.status || b.status === 'pending').length, color: [245, 158, 11] }
            ];
            
            let xPos = 14;
            stats.forEach((stat, index) => {
                doc.setFillColor(stat.color[0], stat.color[1], stat.color[2]);
                doc.rect(xPos, 50, 45, 20, 'F');
                doc.setFontSize(18);
                doc.setTextColor(255, 255, 255);
                doc.text(stat.value.toString(), xPos + 22.5, 60, { align: 'center' });
                doc.setFontSize(9);
                doc.text(stat.label, xPos + 22.5, 67, { align: 'center' });
                xPos += 48;
            });
            
            // Add detailed bookings section
            doc.setFontSize(14);
            doc.setTextColor(0);
            doc.text('Detailed Booking Information', 14, 80);
            
            // Prepare comprehensive table data with all details
            const tableData = filteredBookings.map((booking, index) => {
                const bookingDate = booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A';
                return [
                    index + 1,
                    booking.name || 'N/A',
                    booking.email || 'N/A',
                    booking.ticket_title || 'N/A',
                    booking.bookingQuantity || 0,
                    `BDT ${booking.total_price?.toLocaleString() || '0'}`,
                    booking.status === 'accepted' ? 'Accepted' : 
                    booking.status === 'rejected' ? 'Rejected' : 'Pending',
                    bookingDate
                ];
            });
            
            console.log('Table data prepared:', tableData);
            
            // Add comprehensive table
            doc.autoTable({
                startY: 85,
                head: [['#', 'Customer', 'Email', 'Ticket', 'Qty', 'Amount', 'Status', 'Date']],
                body: tableData,
                theme: 'grid',
                headStyles: {
                    fillColor: [255, 140, 66],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    fontSize: 10,
                    halign: 'center'
                },
                styles: {
                    fontSize: 9,
                    cellPadding: 4,
                    lineColor: [200, 200, 200],
                    lineWidth: 0.1
                },
                columnStyles: {
                    0: { cellWidth: 10, halign: 'center' },
                    1: { cellWidth: 28 },
                    2: { cellWidth: 38 },
                    3: { cellWidth: 32 },
                    4: { cellWidth: 12, halign: 'center' },
                    5: { cellWidth: 25, halign: 'right' },
                    6: { cellWidth: 22, halign: 'center' },
                    7: { cellWidth: 23, halign: 'center' }
                },
                didParseCell: function(data) {
                    // Color code status column
                    if (data.column.index === 6 && data.section === 'body') {
                        const status = data.cell.raw;
                        if (status === 'Accepted') {
                            data.cell.styles.textColor = [22, 101, 52];
                            data.cell.styles.fillColor = [220, 252, 231];
                            data.cell.styles.fontStyle = 'bold';
                        } else if (status === 'Rejected') {
                            data.cell.styles.textColor = [220, 38, 38];
                            data.cell.styles.fillColor = [254, 242, 242];
                            data.cell.styles.fontStyle = 'bold';
                        } else {
                            data.cell.styles.textColor = [217, 119, 6];
                            data.cell.styles.fillColor = [254, 243, 199];
                            data.cell.styles.fontStyle = 'bold';
                        }
                    }
                },
                margin: { top: 85, left: 14, right: 14 }
            });
            
            console.log('Table added to PDF');
            
            // Calculate totals
            const totalAmount = filteredBookings.reduce((sum, b) => sum + (b.total_price || 0), 0);
            const totalQuantity = filteredBookings.reduce((sum, b) => sum + (b.bookingQuantity || 0), 0);
            
            // Add summary at the end
            const finalY = doc.lastAutoTable.finalY + 10;
            doc.setFillColor(248, 250, 252);
            doc.rect(14, finalY, 182, 25, 'F');
            
            doc.setFontSize(12);
            doc.setTextColor(0);
            doc.text('Total Summary:', 20, finalY + 8);
            doc.setFontSize(10);
            doc.text(`Total Bookings: ${filteredBookings.length}`, 20, finalY + 15);
            doc.text(`Total Quantity: ${totalQuantity}`, 20, finalY + 21);
            doc.text(`Total Amount: BDT ${totalAmount.toLocaleString()}`, 100, finalY + 15);
            doc.text(`Report Generated: ${dateStr}`, 100, finalY + 21);
            
            // Add footer with page numbers and branding
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                
                // Footer line
                doc.setDrawColor(255, 140, 66);
                doc.setLineWidth(0.5);
                doc.line(14, doc.internal.pageSize.getHeight() - 15, 196, doc.internal.pageSize.getHeight() - 15);
                
                // Page number
                doc.setFontSize(9);
                doc.setTextColor(100);
                doc.text(
                    `Page ${i} of ${pageCount}`,
                    105,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'center' }
                );
                
                // Branding
                doc.text(
                    'Online Ticket Booking System',
                    14,
                    doc.internal.pageSize.getHeight() - 10
                );
                
                doc.text(
                    `© ${new Date().getFullYear()}`,
                    196,
                    doc.internal.pageSize.getHeight() - 10,
                    { align: 'right' }
                );
            }
            
            console.log('Footer added');
            
            // Save the PDF
            const fileName = `booking-requests-${new Date().toISOString().split('T')[0]}.pdf`;
            console.log('Saving PDF as:', fileName);
            doc.save(fileName);
            
            console.log('PDF saved successfully');
            
            // Show success message
            Swal.fire({
                icon: 'success',
                title: 'PDF Downloaded!',
                text: `${filteredBookings.length} booking requests exported successfully.`,
                timer: 2500,
                showConfirmButton: false
            });
        } catch (error) {
            console.error('Error generating PDF:', error);
            Swal.fire({
                icon: 'error',
                title: 'Export Failed',
                text: `Error: ${error.message}. Please check the console for details.`,
                confirmButtonColor: '#ff8c42'
            });
        }
    };
    return (
        <div className='p-4 lg:p-8 min-h-screen'>
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8 flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Booking Requests
                    </h1>
                    <p className="text-gray-500 text-lg">Manage and review customer booking requests</p>
                </div>
                <div className="flex gap-4">
                    <button 
                        onClick={handleRefresh} 
                        disabled={isFetching}
                        className="flex items-center gap-2 px-6 py-3  border border-gray-200 rounded-xl  font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-orange-500 hover:text-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FiRefreshCw className={isFetching ? 'animate-spin' : ''} />
                        {isFetching ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button 
                        onClick={handleExportPDF}
                        className="flex items-center gap-2 px-6 py-3  border border-gray-200 rounded-xl  font-medium cursor-pointer transition-all hover:bg-gray-50 hover:border-orange-500 hover:text-orange-500"
                    >
                        <FaDownload />
                        Export
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className=" p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-500 text-xl flex-shrink-0">
                        <FaTicket />
                    </div>
                    <div>
                        <div className="text-3xl font-bold ">{bookings.length}</div>
                        <div className="text-gray-500 text-sm font-medium">Total Requests</div>
                    </div>
                </div>
                <div className=" p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-green-500 text-xl flex-shrink-0">
                        <FaCheck />
                    </div>
                    <div>
                        <div className="text-3xl font-bold ">{bookings.filter(b => b.status === 'accepted').length}</div>
                        <div className="text-gray-500 text-sm font-medium">Accepted</div>
                    </div>
                </div>
                <div className=" p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-500 text-xl flex-shrink-0">
                        <FaTimes />
                    </div>
                    <div>
                        <div className="text-3xl font-bold ">{bookings.filter(b => b.status === 'rejected').length}</div>
                        <div className="text-gray-500 text-sm font-medium">Rejected</div>
                    </div>
                </div>
                <div className=" p-6 rounded-2xl border border-gray-100 shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center text-amber-500 text-xl flex-shrink-0">
                        <FiClock />
                    </div>
                    <div>
                        <div className="text-3xl font-bold ">{bookings.filter(b => !b.status || b.status === 'pending').length}</div>
                        <div className="text-gray-500 text-sm font-medium">Pending</div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="flex items-center gap-4 mb-8 flex-col md:flex-row">
                <div className="relative flex-1 w-full">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email, or ticket title..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    />
                </div>
                
                {/* DaisyUI Status Filter Select */}
                <select 
                    className="select select-bordered focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all w-full md:w-auto md:max-w-xs"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                </select>
            </div>

            {/* Desktop Table View */}
            <div className=" rounded-2xl overflow-hidden shadow-sm border border-gray-100 mb-8 hidden lg:block">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse min-w-[800px]">
                        <thead className="bg-gradient-to-br from-orange-500 to-orange-600 ">
                            <tr>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">#</th>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">Customer</th>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">Ticket Details</th>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">Quantity</th>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">Amount</th>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">Status</th>
                                <th className="px-6 py-4 text-left font-semibold text-white  text-xs uppercase tracking-wider whitespace-nowrap">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredBookings.map((booking, i) => (
                                <tr key={booking._id} className="hover:bg-primary/40  transition-colors">
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        <span className="font-semibold text-white  bg-gradient-to-br from-orange-500 to-orange-600  px-2 py-1 rounded-md text-xs whitespace-nowrap">
                                            #{i + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        <div className="flex items-center gap-3 min-w-[180px]">
                                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full flex items-center justify-center font-semibold flex-shrink-0">
                                                {booking.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <div className="font-semibold  whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {booking.name}
                                                </div>
                                                <div className="text-xs  whitespace-nowrap overflow-hidden text-ellipsis">
                                                    {booking.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        <div className="min-w-[200px]">
                                            <div className="font-semibold  mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                                                {booking.ticket_title}
                                            </div>
                                            <div className="flex items-center gap-1 text-xs text-gray-500 whitespace-nowrap">
                                                <FaHashtag />
                                                ID: {booking._id.slice(-6)}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        <span className="bg-sky-100 text-sky-700 px-3 py-1 rounded-full font-semibold text-sm whitespace-nowrap">
                                            {booking.bookingQuantity}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        <span className="font-bold text-green-600 text-lg whitespace-nowrap">
                                            ${booking.total_price?.toLocaleString()}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        {getStatusBadge(booking.status)}
                                    </td>
                                    <td className="px-6 py-4 border-b border-gray-100">
                                        {(!booking.status || booking.status === 'pending') ? (
                                            <div className="flex gap-2 items-center min-w-[140px]">
                                                <button
                                                    onClick={() => handleApproved(booking._id)}
                                                    disabled={isProcessing === booking._id}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-green-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex-1"
                                                >
                                                    <FaCheck />
                                                    <span className="hidden sm:inline">{isProcessing === booking._id ? 'Processing...' : 'Accept'}</span>
                                                </button>
                                                <button
                                                    onClick={() => handleRejection(booking._id)}
                                                    disabled={isProcessing === booking._id}
                                                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg font-medium cursor-pointer transition-all hover:bg-red-600 hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed flex-1"
                                                >
                                                    <FaTimes />
                                                    <span className="hidden sm:inline">Reject</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleOpenViewModal(booking)}
                                                className="flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-600 rounded-lg cursor-pointer transition-all hover:bg-gray-200 hover:text-gray-800 flex-shrink-0"
                                            >
                                                <FiEye title='details' />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Mobile Card View */}
            <div className="lg:hidden space-y-4">
                {filteredBookings.map((booking, i) => (
                    <div key={booking._id} className=" rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        {/* Card Header */}
                        <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-orange-100 border-b border-orange-200">
                            <span className="font-bold text-orange-600 bg-white px-3 py-1 rounded-full text-sm">
                                #{i + 1}
                            </span>
                            {getStatusBadge(booking.status)}
                        </div>

                        {/* Card Content */}
                        <div className="p-4 space-y-4">
                            {/* Ticket Section */}
                            <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
                                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl flex items-center justify-center text-xl flex-shrink-0">
                                    <FaTicket />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h3 className="font-bold  text-lg mb-1 break-words">
                                        {booking.ticket_title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        Booking ID: {booking._id.slice(-6)}
                                    </p>
                                </div>
                            </div>

                            {/* Info Grid */}
                            <div className="grid grid-cols-1 gap-3">
                                {/* Customer */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 flex-shrink-0">
                                        <FaUser />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-0.5">Customer</p>
                                        <p className="font-semibold  truncate">{booking.name}</p>
                                    </div>
                                </div>

                                {/* Email */}
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 flex-shrink-0">
                                        <FaEnvelope />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs text-gray-500 mb-0.5">Email</p>
                                        <p className="font-semibold  truncate">{booking.email}</p>
                                    </div>
                                </div>

                                {/* Quantity and Amount */}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600 flex-shrink-0">
                                            <FaHashtag />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 mb-0.5">Quantity</p>
                                            <p className="font-semibold ">{booking.bookingQuantity}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-600 flex-shrink-0">
                                            <FaDollarSign />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-500 mb-0.5">Total Amount</p>
                                            <p className="font-bold text-green-600">৳{booking.total_price?.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Card Actions */}
                        {(!booking.status || booking.status === 'pending') && (
                            <div className="flex gap-3 p-4 bg-gray-50 border-t border-gray-100">
                                <button
                                    onClick={() => handleApproved(booking._id)}
                                    disabled={isProcessing === booking._id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-xl font-semibold cursor-pointer transition-all hover:bg-green-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <FaCheck />
                                    {isProcessing === booking._id ? 'Processing...' : 'Accept'}
                                </button>
                                <button
                                    onClick={() => handleRejection(booking._id)}
                                    disabled={isProcessing === booking._id}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-xl font-semibold cursor-pointer transition-all hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed"
                                >
                                    <FaTimes />
                                    Reject
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Empty State */}
            {filteredBookings.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16 px-4">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-4xl mb-6">
                        <FaTicket />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                        No booking requests found
                    </h3>
                    <p className="text-gray-500 text-center max-w-md">
                        {searchTerm || statusFilter !== 'all' 
                            ? 'Try adjusting your search or filter criteria'
                            : 'Booking requests will appear here when customers make reservations'
                        }
                    </p>
                </div>
            )}

            {/* DaisyUI Modal for View Details */}
            {isViewModalOpen && selectedBooking && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-3xl">
                        <button 
                            className="btn btn-sm btn-circle absolute right-2 top-2"
                            onClick={handleCloseViewModal}
                        >
                            ✕
                        </button>
                        
                        <h3 className="font-bold text-2xl mb-6 text-center" style={{color: '#ff8c42'}}>
                            Booking Details
                        </h3>
                        
                        <div className="space-y-4">
                            {/* Booking ID */}
                            <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                                    <FaHashtag className="text-orange-500 text-xl" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-500">Booking ID</p>
                                    <p className="font-semibold text-lg">{selectedBooking._id}</p>
                                </div>
                            </div>

                            {/* Customer Name */}
                            <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                                    <FaUser className="text-blue-500 text-xl" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-500">Customer Name</p>
                                    <p className="font-semibold text-lg">{selectedBooking.name}</p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                    <FaEnvelope className="text-green-500 text-xl" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-500">Email Address</p>
                                    <p className="font-semibold text-lg">{selectedBooking.email}</p>
                                </div>
                            </div>

                            {/* Ticket Title */}
                            <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                                    <FaTicket className="text-purple-500 text-xl" />
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-500">Ticket Title</p>
                                    <p className="font-semibold text-lg">{selectedBooking.ticket_title}</p>
                                </div>
                            </div>

                            {/* Quantity and Price */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                    <div className="flex-shrink-0 w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                                        <FaHashtag className="text-yellow-500 text-xl" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-500">Quantity</p>
                                        <p className="font-semibold text-lg">{selectedBooking.bookingQuantity}</p>
                                    </div>
                                </div>

                                <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                    <div className="flex-shrink-0 w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                                        <FaDollarSign className="text-green-500 text-xl" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-500">Total Price</p>
                                        <p className="font-semibold text-lg">৳{selectedBooking.total_price?.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status */}
                            <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                    {selectedBooking.status === 'accepted' ? (
                                        <FiCheckCircle className="text-green-500 text-xl" />
                                    ) : selectedBooking.status === 'rejected' ? (
                                        <FiXCircle className="text-red-500 text-xl" />
                                    ) : (
                                        <FiClock className="text-yellow-500 text-xl" />
                                    )}
                                </div>
                                <div className="ml-4 flex-1">
                                    <p className="text-sm text-gray-500">Status</p>
                                    <div className="mt-1">
                                        {getStatusBadge(selectedBooking.status)}
                                    </div>
                                </div>
                            </div>

                            {/* Booking Date */}
                            {selectedBooking.createdAt && (
                                <div className="flex items-center p-4 bg-base-200 rounded-lg">
                                    <div className="flex-shrink-0 w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center">
                                        <FiClock className="text-pink-500 text-xl" />
                                    </div>
                                    <div className="ml-4 flex-1">
                                        <p className="text-sm text-gray-500">Booking Date</p>
                                        <p className="font-semibold text-lg">
                                            {new Date(selectedBooking.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="modal-action">
                            <button
                                className="btn"
                                style={{backgroundColor: '#ff8c42', color: 'white', border: 'none'}}
                                onClick={handleCloseViewModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseViewModal}></div>
                </div>
            )}

            {/* DaisyUI Modal for Update */}
            {isModalOpen && selectedBooking && (
                <div className="modal modal-open">
                    <div className="modal-box max-w-2xl">
                        <h3 className="font-bold text-2xl mb-4 text-center" style={{color: '#ff8c42'}}>
                            Update Booking Details
                        </h3>
                        
                        <form onSubmit={handleUpdateBooking}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Customer Name */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Customer Name</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        defaultValue={selectedBooking.name}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Email</span>
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        defaultValue={selectedBooking.email}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Ticket Title */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Ticket Title</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="ticket_title"
                                        defaultValue={selectedBooking.ticket_title}
                                        className="input input-bordered w-full"
                                        required
                                    />
                                </div>

                                {/* Quantity */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Quantity</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="bookingQuantity"
                                        defaultValue={selectedBooking.bookingQuantity}
                                        className="input input-bordered w-full"
                                        min="1"
                                        required
                                    />
                                </div>

                                {/* Total Price */}
                                <div className="form-control">
                                    <label className="label">
                                        <span className="label-text font-semibold">Total Price (BDT)</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="total_price"
                                        defaultValue={selectedBooking.total_price}
                                        className="input input-bordered w-full"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>

                                {/* Status */}
                                <div className="form-control md:col-span-2">
                                    <label className="label">
                                        <span className="label-text font-semibold">Status</span>
                                    </label>
                                    <select
                                        name="status"
                                        defaultValue={selectedBooking.status || 'pending'}
                                        className="select select-bordered w-full"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="accepted">Accepted</option>
                                        <option value="rejected">Rejected</option>
                                    </select>
                                </div>
                            </div>

                            <div className="modal-action">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="btn"
                                    style={{backgroundColor: '#ff8c42', color: 'white', border: 'none'}}
                                >
                                    Update Booking
                                </button>
                            </div>
                        </form>
                    </div>
                    <div className="modal-backdrop" onClick={handleCloseModal}></div>
                </div>
            )}
        </div>
    );
};

export default RequestedBooking;
