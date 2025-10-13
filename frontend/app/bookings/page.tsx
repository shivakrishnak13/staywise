'use client';
import { useEffect, useState } from "react";
import { bookingsApi } from "@/app/lib/api";
import Image from "next/image";
import { Booking } from "../types/booking";

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelingId, setCancelingId] = useState<string | null>(null);

  const fetchBookings = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await bookingsApi.list();
      setBookings(Array.isArray(res.bookings) ? res.bookings : []);
    } catch (err) {
      setError((err as Error)?.message || 'Could not fetch bookings');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleCancel = async (id: string) => {
    setCancelingId(id);
    try {
      await bookingsApi.cancel(id);
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'canceled' } : b));
    } catch (err) {
      alert((err as Error)?.message || 'Failed to cancel booking');
    }
    setCancelingId(null);
  };

  const isFutureBooking = (startDate: string) => {
    return new Date(startDate) > new Date();
  };

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

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-background)] px-4 py-8 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-8"></div>
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-[var(--color-cardBg)] rounded-xl shadow-sm p-6 animate-pulse">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-64 h-48 bg-gray-200 rounded-lg"></div>
                  <div className="flex-1 space-y-4">
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-[var(--color-textPrimary)]">My Bookings</h1>
          <div className="text-sm text-[var(--color-textSecondary)]">
            {bookings.length} {bookings.length === 1 ? 'Booking' : 'Bookings'}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-[var(--color-error)] text-[var(--color-error)] px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {!loading && bookings.length === 0 ? (
          <div className="bg-[var(--color-cardBg)] rounded-xl shadow-sm p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-12 h-12 text-[var(--color-textSecondary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-textPrimary)] mb-2">No bookings yet</h3>
            <p className="text-[var(--color-textSecondary)]">Start exploring properties and make your first booking!</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map(booking => (
              <div
                key={booking._id}
                className="bg-[var(--color-cardBg)] rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-80 h-56 md:h-auto bg-gray-100">
                    <Image
                      src={booking.propertyDetails.images[0] || '/placeholder.jpg'}
                      alt={booking.propertyDetails.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-semibold text-[var(--color-textPrimary)] mb-2">
                          {booking.propertyDetails.title}
                        </h2>
                        <div className="flex items-center text-[var(--color-textSecondary)] text-sm mb-3">
                          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {booking.propertyDetails.location}
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize ${getStatusColor(booking.status)}`}>
                          {booking.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 rounded-lg">
                      <div>
                        <div className="text-xs text-[var(--color-textSecondary)] mb-1">Check-in</div>
                        <div className="text-sm font-medium text-[var(--color-textPrimary)]">
                          {formatDate(booking.startDate)}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[var(--color-textSecondary)] mb-1">Check-out</div>
                        <div className="text-sm font-medium text-[var(--color-textPrimary)]">
                          {formatDate(booking.endDate)}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="text-xs text-[var(--color-textSecondary)] mb-1">Total Amount</div>
                        <div className="text-2xl font-bold text-[var(--color-primary)]">
                          ₹{booking.totalPrice.toLocaleString('en-IN')}
                        </div>
                      </div>
                      
                      {isFutureBooking(booking.startDate) && booking.status !== 'canceled' && (
                        <button
                          onClick={() => handleCancel(booking._id)}
                          disabled={cancelingId === booking._id}
                          className="px-6 py-2.5 rounded-lg border-2 border-[var(--color-error)] text-[var(--color-error)] font-medium hover:bg-[var(--color-error)] hover:text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {cancelingId === booking._id ? 'Canceling...' : 'Cancel Booking'}
                        </button>
                      )}
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
