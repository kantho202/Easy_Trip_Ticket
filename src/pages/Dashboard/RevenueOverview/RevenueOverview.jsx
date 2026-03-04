import { useQuery } from '@tanstack/react-query';
import React from 'react';
import useAxiosSecure from '../../../hook/useAxiosecure';
import Loader from '../../../components/Loading/Loading';
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import {
    FiDollarSign,
    FiShoppingCart,
    FiPlus,
    FiTrendingUp,
    FiTrendingDown,
    FiCalendar,
    FiDownload,
    FiRefreshCw
} from 'react-icons/fi';

const RevenueOverview = () => {
    const axiosSecure = useAxiosSecure()
    const { data: revenue = {}, isLoading, refetch, isFetching } = useQuery({
        queryKey: ['bookings-star'],
        queryFn: async () => {
            const res = await axiosSecure.get('/dashboard/summary')
            return res.data;
        }
    })

    if (isLoading) {
        return <Loader></Loader>
    }

    const statsData = [
        {
            title: 'Total Revenue',
            value: `$${revenue.totalRevenue?.toLocaleString() || 0}`,
            change: '+20%',
            trend: 'up',
            icon: FiDollarSign,
            color: '#ff8c42',
            bgColor: {
                light: '#fff5f0',
                dark: '#3b2a20'
            }
        },
        {
            title: 'Tickets Sold',
            value: revenue.totalTicketSold?.toLocaleString() || 0,
            change: '+15%',
            trend: 'up',
            icon: FiShoppingCart,
            color: '#10b981',
            bgColor: {
                light: '#f0fdf4',
                dark: '#06281a'
            }
        },
        {
            title: 'Tickets Added',
            value: revenue.totalTicketAdded?.toLocaleString() || 0,
            change: '+8%',
            trend: 'up',
            icon: FiPlus,
            color: '#3b82f6',
            bgColor: {
                light: '#eff6ff',
                dark: '#0b1e3a'
            }
        }
    ];

    const chartData = [
        { name: 'Revenue', amount: revenue.totalRevenue || 0, color: '#ff8c42' },
        { name: 'Sold', amount: revenue.totalTicketSold || 0, color: '#10b981' },
        { name: 'Added', amount: revenue.totalTicketAdded || 0, color: '#3b82f6' }
    ];

    const pieData = [
        { name: 'Revenue', value: revenue.totalRevenue || 0, color: '#ff8c42' },
        { name: 'Tickets Sold', value: revenue.totalTicketSold || 0, color: '#10b981' },
        { name: 'Tickets Added', value: revenue.totalTicketAdded || 0, color: '#3b82f6' }
    ];

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-200">
                    <div className="font-semibold text-gray-700 mb-1">{label}</div>
                    <div className="text-xl font-bold text-orange-500">
                        {typeof payload[0].value === 'number' && payload[0].dataKey === 'amount' && label === 'Revenue'
                            ? `৳${payload[0].value.toLocaleString()}`
                            : payload[0].value.toLocaleString()
                        }
                    </div>
                </div>
            );
        }
        return null;
    };

    const handleRefresh = async () => {
        window.location.reload();
    };

    return (
        <div className="p-8  min-h-screen font-sans">
            {/* Header Section */}
            <div className="flex justify-between items-start mb-8 flex-col md:flex-row gap-4">
                <div>
                    <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                        Revenue Overview
                    </h1>
                    <p className="text-gray-600 text-lg">Track your business performance and growth</p>
                </div>
                <div className="flex gap-4 flex-wrap">
                    <button
                        onClick={handleRefresh}
                        disabled={isFetching}
                        className="flex items-center gap-2 px-6 py-3  border border-gray-200 rounded-xl  font-medium cursor-pointer transition-all  hover:border-orange-500 hover:text-orange-500"
                    >
                        <FiRefreshCw className={isFetching ? 'animate-spin' : ''} />
                        {isFetching ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3  border border-gray-200 rounded-xl  font-medium cursor-pointer transition-all  hover:border-orange-500 hover:text-orange-500">
                        <FiDownload />
                        Export
                    </button>
                    <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl font-medium cursor-pointer transition-all hover:from-orange-600 hover:to-orange-700 border-0">
                        <FiCalendar />
                        Last 30 days
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {statsData.map((stat, index) => (
                    <div
                        key={index}
                        className=" p-8 rounded-2xl border border-gray-100 transition-all hover:-translate-y-2 hover:shadow-2xl"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <div
                                className="w-15 h-15 rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg"
                                style={{ backgroundColor: stat.color, boxShadow: `0 8px 25px ${stat.color}40` }}
                            >
                                <stat.icon />
                            </div>
                            <div className={`flex items-center gap-1 text-sm font-semibold ${stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.trend === 'up' ? <FiTrendingUp /> : <FiTrendingDown />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-4xl font-bold mb-2">{stat.value}</div>
                        <div className="text-gray-500 font-medium mb-4">{stat.title}</div>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div
                                className="h-full rounded-full transition-all duration-1000"
                                style={{ width: '75%', backgroundColor: stat.color }}
                            ></div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Area Chart */}
                <div className=" rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold  mb-2">Revenue Trend</h3>
                        <p className="text-gray-500 text-sm">Monthly performance overview</p>
                    </div>
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <AreaChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <defs>
                                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#ff8c42" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="#ff8c42" stopOpacity={0.1} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#ff8c42"
                                    strokeWidth={3}
                                    fill="url(#colorGradient)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className=" rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold  mb-2">Performance Metrics</h3>
                        <p className="text-gray-500 text-sm">Comparative analysis</p>
                    </div>
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#6b7280', fontSize: 12 }}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar
                                    dataKey="amount"
                                    fill="#ff8c42"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Bottom Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Pie Chart */}
                <div className="rounded-2xl p-8 shadow-sm border border-gray-100">
                    <div className="mb-8">
                        <h3 className="text-2xl font-semibold  mb-2">Distribution</h3>
                        <p className="text-gray-500 text-sm">Revenue breakdown</p>
                    </div>
                    <div className="w-full">
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="flex justify-center gap-8 mt-4 flex-wrap">
                        {pieData.map((item, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: item.color }}
                                ></div>
                                <span className="text-sm text-gray-500 font-medium">{item.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Summary Card */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-2xl font-semibold">Quick Summary</h3>
                        <div className="text-2xl opacity-80">
                            <FiTrendingUp />
                        </div>
                    </div>
                    <div className="flex flex-col gap-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/20">
                            <span className="opacity-90 font-medium">Average Revenue</span>
                            <span className="font-bold text-lg">${Math.round((revenue.totalRevenue || 0) / 30).toLocaleString()}/day</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/20">
                            <span className="opacity-90 font-medium">Conversion Rate</span>
                            <span className="font-bold text-lg">
                                {revenue.totalTicketSold && revenue.totalTicketAdded
                                    ? Math.round((revenue.totalTicketSold / revenue.totalTicketAdded) * 100)
                                    : 0
                                }%
                            </span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/20">
                            <span className="opacity-90 font-medium">Growth Rate</span>
                            <span className="font-bold text-lg text-green-300">+15.3%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="opacity-90 font-medium">Total Transactions</span>
                            <span className="font-bold text-lg">{(revenue.totalTicketSold || 0).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RevenueOverview;
