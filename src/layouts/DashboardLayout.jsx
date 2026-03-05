import React from 'react';
import { Link, NavLink, Outlet } from 'react-router';
import Logo from '../components/Logo/Logo';
import { FaHistory, FaTicketAlt, FaUsersCog, FaUserTie } from 'react-icons/fa';
import { IoMegaphone, IoTicket } from 'react-icons/io5';
import { LuTicketsPlane } from 'react-icons/lu';
import { HiOutlineDocumentSearch, HiTicket } from 'react-icons/hi';
import { RiLineChartLine } from 'react-icons/ri';
import { BsTicketPerforated } from 'react-icons/bs';
import useRole from '../hook/useRole';
import Navbar from '../pages/Shares/Navbar';
import { VscThreeBars } from "react-icons/vsc";
import DashboardNavbar from '../pages/Dashboard/DashboardNavbar/DashboardNavbar';
import useAuth from '../hook/useAuth';

const DashboardLayout = () => {
    const { role } = useRole()
    const { user } = useAuth()

    return (
        <div>
            {/* Fixed Navbar with proper z-index */}
            <div className='flex items-center bg-primary sticky h-16 top-0 z-[100]'>
                <label htmlFor="my-drawer-4" aria-label="open sidebar" className="p-5 lg:p-6 cursor-pointer">
                    <VscThreeBars className='text-white' />
                </label>
                <DashboardNavbar></DashboardNavbar>
            </div>

            {/* Main content with top margin to account for fixed navbar */}
            <div className="drawer drawer-mobile lg:drawer-open min-h-screen pt-16 lg:pt-20">
                <input id="my-drawer-4" type="checkbox" className="drawer-toggle peer" />

                <div className="drawer-content bg-base-100
  transition-all
  duration-300
  lg:ml-16
  lg:peer-checked:ml-64">
                    <div className="lg:is-drawer-close:pr-20">
                        <Outlet></Outlet>
                    </div>
                </div>

                {/* Drawer side with higher z-index */}
                <div className="drawer-side z-50  ">
                    <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>

                    <div className="
                    fixed
    top-16 lg:top-
    left-0
    h-[calc(100vh-4rem)]
    flex
    shadow
    flex-col
    bg-base-200
    is-drawer-close:w-14
    lg:is-drawer-close:w-16
    is-drawer-open:w-64
    overflow-visible
      ">
                        {/* Dashboard Title */}
                        <div className='flex flex-wrap min h-screen'>
                            <div className="p-4 is-drawer-close:tooltip is-drawer-close:tooltip-right w-full" data-tip="">
                                <span className="is-drawer-close:hidden text-2xl font-bold block w-full text-center border-primary border-2 p-2 
                                bg-primary/80 rounded-xl">Dashboard</span>
                                {/* <div className='border-primary border '></div> */}
                            </div>

                            {/* Menu Items */}

                            <ul className="menu w-full grow drop-shadow-sm space-y-2">
                                {/* User Menu */}

                                {role === 'user' && (
                                    <>
                                        <li>
                                            <NavLink
                                                to="/dashboard/userProfile"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center 
                                                 py-1.5 cursor-pointer" data-tip="User Profile">
                                                    <FaUserTie />
                                                    <span className="is-drawer-close:hidden pl-2">User Profile</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/myBookedTickets"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5 cursor-pointer" data-tip="My Booked Tickets">
                                                    <BsTicketPerforated />
                                                    <span className="is-drawer-close:hidden pl-2">My Booked Tickets</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/transactionHistory"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5 cursor-pointer" data-tip="Transaction History">
                                                    <FaHistory />
                                                    <span className="is-drawer-close:hidden pl-2">Transaction History</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {/* Vendor Menu */}
                                {role === 'vendor' && (
                                    <>
                                        <li>
                                            <NavLink
                                                to="/dashboard/vendorProfile"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Vendor Profile">
                                                    <FaUserTie />
                                                    <span className="is-drawer-close:hidden pl-2">Vendor Profile</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/addTicket"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Add Ticket">
                                                    <IoTicket />
                                                    <span className="is-drawer-close:hidden pl-2">Add Ticket</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/myAddedTickets"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="My Added Ticket">
                                                    <LuTicketsPlane />
                                                    <span className="is-drawer-close:hidden pl-2">My Added Tickets</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/requestedBooking"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Requested Booking">
                                                    <HiOutlineDocumentSearch />
                                                    <span className="is-drawer-close:hidden pl-2">Requested Booking</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/revenueOverview"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Revenue Overview">
                                                    <RiLineChartLine />
                                                    <span className="is-drawer-close:hidden pl-2">Revenue Overview</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                    </>
                                )}

                                {/* Admin Menu */}
                                {role === 'admin' && (
                                    <>
                                        <li>
                                            <NavLink
                                                to="/dashboard/adminProfile"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Admin Profile">
                                                    <FaUserTie />
                                                    <span className="is-drawer-close:hidden pl-2">Admin Profile</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/manageTickets"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Manage Tickets">
                                                    <FaTicketAlt />
                                                    <span className="is-drawer-close:hidden pl-2">Manage Tickets</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/mangeUsers"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Manage Users">
                                                    <FaUsersCog />
                                                    <span className="is-drawer-close:hidden pl-2">Manage Users</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink
                                                to="/dashboard/advertiseTickets"
                                                className={({ isActive }) =>
                                                    `flex items-center justify-center w-full p-2 rounded-xl ${isActive ? 'bg-primary text-white' : 'hover:bg-orange-200'
                                                    }`
                                                }
                                            >
                                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right flex items-center justify-center py-1.5" data-tip="Advertise Tickets">
                                                    <IoMegaphone />
                                                    <span className="is-drawer-close:hidden pl-2">Advertise Tickets</span>
                                                </button>
                                            </NavLink>
                                        </li>
                                    </>
                                )}
                            </ul>

                            {/* Dashboard Footer */}
                            <div className="w-full p-4 rounded-xl lg:mb- ">

                                <button className="is-drawer-close:tooltip is-drawer-close:tooltip-right is-drawer-close:hidden w-full p-4  
                            bg-primary/50 px- flex items-center justify-center py-5 rounded-xl border-2 border-primary" data-tip="">
                                    <div className="is-drawer-close:hidden font-bold  flex  items-center gap-3">
                                        <div role="button" className="btn  object-cover ring-1 border-0  hover:ring-orange-400 flex justify-end
                                   transition-all duration-300 btn-circle avatar">
                                            <div className="w-30 rounded-full    items-end">
                                                <img
                                                    alt=""
                                                    src={user?.photoURL} />
                                            </div>

                                        </div>
                                        <div className='text-xs'>
                                            <h1>Welcome Back</h1>
                                            <span className='text-primary'>{role}</span>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardLayout;
