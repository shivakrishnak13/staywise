'use client';
import { useEffect, useState } from "react";
import { bookingsApi } from "@/app/lib/api";
import Image from "next/image";
import { AdminBooking } from "../types/booking";



export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingsApi.admin();
      setBookings(Array.isArray(res.bookings) ? res.bookings : []);
      setFilteredBookings(Array.isArray(res.bookings) ? res.bookings : []);
    } catch (err) {
      setError((err as Error)?.message || 'Could not fetch bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (statusFilter !== 'all') {
      filtered = filtered.filter(b => b.status === statusFilter);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(b => 
        b.propertyDetails?.title?.toLowerCase().includes(query) ||
        b.userDetails?.name?.toLowerCase().includes(query) ||
        b.userDetails?.email?.toLowerCase().includes(query) ||
        b.propertyDetails?.location?.toLowerCase().includes(query)
      );
    }

    setFilteredBookings(filtered);
  }, [statusFilter, searchQuery, bookings]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-700';
      case 'canceled':
        return 'bg-red-100 text-red-700';
      case 'completed':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  const getTotalRevenue = () => {
    return filteredBookings
      .filter(b => b.status === 'confirmed')
      .reduce((sum, b) => sum + b.totalPrice, 0);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-cardBg rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-32"></div>
              </div>
            ))}
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-cardBg rounded-xl shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-textPrimary">Admin Dashboard</h1>
            <p className="text-textSecondary mt-1">Manage all bookings</p>
          </div>
          <button
            onClick={fetchBookings}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Refresh
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-error text-error px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-cardBg rounded-xl shadow-sm p-6">
            <p className="text-textSecondary text-sm mb-2">Total Bookings</p>
            <p className="text-3xl font-bold text-textPrimary">{bookings.length}</p>
          </div>
          <div className="bg-cardBg rounded-xl shadow-sm p-6">
            <p className="text-textSecondary text-sm mb-2">Confirmed Bookings</p>
            <p className="text-3xl font-bold text-green-600">
              {bookings.filter(b => b.status === 'confirmed').length}
            </p>
          </div>
          <div className="bg-cardBg rounded-xl shadow-sm p-6">
            <p className="text-textSecondary text-sm mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">
              ₹{getTotalRevenue().toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        <div className="bg-cardBg rounded-xl shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by user, property, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'all' ? 'bg-primary text-white' : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setStatusFilter('confirmed')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'confirmed' ? 'bg-primary text-white' : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                }`}
              >
                Confirmed
              </button>
              <button
                onClick={() => setStatusFilter('canceled')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  statusFilter === 'canceled' ? 'bg-primary text-white' : 'bg-gray-100 text-textPrimary hover:bg-gray-200'
                }`}
              >
                Canceled
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-textSecondary">
              Showing {filteredBookings.length} of {bookings.length} bookings
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <div className="bg-cardBg rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-textSecondary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">No bookings found</h3>
            <p className="text-textSecondary">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map(booking => (
              <div
                key={booking._id}
                className="bg-cardBg rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="relative w-full lg:w-64 h-48 lg:h-auto bg-gray-100">
                    <Image
                      src={booking.propertyDetails?.images?.[0] || '/placeholder.jpg'}
                      alt={booking.propertyDetails?.title || 'Property'}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h2 className="text-xl font-semibold text-textPrimary">
                            {booking.propertyDetails?.title}
                          </h2>
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ml-2 ${getStatusColor(booking.status)}`}>
                            {booking.status}
                          </span>
                        </div>
                        
                        <div className="flex items-center text-textSecondary text-sm mb-3">
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.propertyDetails?.location}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 mb-3">
                          <p className="text-xs text-textSecondary mb-1">Guest</p>
                          <p className="text-sm font-medium text-textPrimary">
                            {booking.userDetails?.name || 'Unknown User'}
                          </p>
                          <p className="text-xs text-textSecondary">
                            {booking.userDetails?.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs text-textSecondary mb-1">Check-in</div>
                        <div className="text-sm font-medium text-textPrimary">
                          {formatDate(booking.startDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-textSecondary mb-1">Check-out</div>
                        <div className="text-sm font-medium text-textPrimary">
                          {formatDate(booking.endDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-textSecondary mb-1">Booked On</div>
                        <div className="text-sm font-medium text-textPrimary">
                          {formatDate(booking.createdAt)}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-xs text-textSecondary mb-1">Total Amount</div>
                        <div className="text-2xl font-bold text-primary">
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
