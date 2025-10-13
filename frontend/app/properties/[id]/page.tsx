'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { propertiesApi, bookingsApi } from '@/app/lib/api';
import { TOKEN_KEY, ROUTES } from '@/app/lib/constants';
import { Property } from '@/app/types/property';


export default function PropertyDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPropertyDetails();
    }
  }, [id]);

  const fetchPropertyDetails = async () => {
    try {
      setLoading(true);
      const data = await propertiesApi.getById(id);
      setProperty(data.property || data);
    } catch (err) {
      setError((err as Error).message || 'Failed to load property details');
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }
    setShowDatePicker(true);
    setBookingError('');
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!startDate || !endDate) {
      setBookingError('Please select both check-in and check-out dates');
      return;
    }

    if (new Date(startDate) >= new Date(endDate)) {
      setBookingError('Check-out date must be after check-in date');
      return;
    }

    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      router.push(ROUTES.LOGIN);
      return;
    }

    try {
      setBooking(true);
      setBookingError('');
      
      await bookingsApi.create({
        propertyId: id,
        startDate,
        endDate
      });

      alert('Booking successful! Redirecting to your bookings...');
      router.push(ROUTES.BOOKINGS);
    } catch (err) {
      setBookingError((err as Error).message || 'Failed to create booking. Please try again.');
    } finally {
      setBooking(false);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const calculateNights = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getPropertyTypeIcon = (type: string) => {
    switch (type) {
      case 'villa':
        return '🏡';
      case 'resort':
        return '🏖️';
      case 'hotel':
        return '🏨';
      default:
        return '🏠';
    }
  };

  const nights = calculateNights();
  const totalPrice = property ? nights * property.price : 0;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary]">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-error font-semibold mb-2">Property Not Found</p>
          <p className="text-textSecondary mb-4">{error || 'The property you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push(ROUTES.PROPERTIES)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Back to Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push(ROUTES.PROPERTIES)}
          className="flex items-center text-primary mb-6 hover:underline font-medium"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Properties
        </button>

        <div className="bg-cardBg] rounded-lg shadow-lg overflow-hidden">
          <div className="relative">
            <div className="w-full h-[400px] bg-gray-200">
              <img
                src={property.images[selectedImageIndex]}
                alt={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            {property.images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-black/50 px-3 py-2 rounded-full">
                {property.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      index === selectedImageIndex ? 'bg-white w-6' : 'bg-white/60'
                    }`}
                    aria-label={`View image ${index + 1}`}
                  />
                ))}
              </div>
            )}

            <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full font-semibold text-textPrimary flex items-center gap-2 shadow-lg">
              <span className="text-xl">{getPropertyTypeIcon(property.propertyType)}</span>
              <span className="capitalize">{property.propertyType}</span>
            </div>
          </div>

          {property.images.length > 1 && (
            <div className="flex gap-2 p-4 overflow-x-auto bg-gray-50">
              {property.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border-2 transition-all ${
                    index === selectedImageIndex
                      ? 'border-primary shadow-md'
                      : 'border-gray-300 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${property.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="p-8">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-textPrimary mb-4">
                {property.title}
              </h1>
              
              <div className="flex items-center text-textSecondary mb-6">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="text-lg">{property.location}</span>
              </div>

              <div className="flex items-baseline mb-6">
                <span className="text-5xl font-bold text-primary">
                  ₹{property.price.toLocaleString('en-IN')}
                </span>
                <span className="text-xl text-textSecondary ml-2">/night</span>
              </div>
            </div>

            <div className="mb-8 pb-8 border-b border-gray-200">
              <h2 className="text-2xl font-semibold text-textPrimary mb-4">
                About This Property
              </h2>
              <p className="text-textSecondary text-lg leading-relaxed">
                {property.description}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-textPrimary mb-6">
                Reserve Your Stay
              </h2>

              {!showDatePicker ? (
                <button
                  onClick={handleBookNow}
                  className="w-full sm:w-auto px-10 py-4 bg-primary text-white text-lg font-semibold rounded-lg hover:opacity-90 transition-opacity shadow-lg"
                >
                  Book Now
                </button>
              ) : (
                <form onSubmit={handleBookingSubmit} className="max-w-2xl">
                  <div className="grid sm:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-textPrimary mb-2">
                        Check-in Date
                      </label>
                      <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        min={getTodayDate()}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary]"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-textPrimary mb-2">
                        Check-out Date
                      </label>
                      <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        min={startDate || getTodayDate()}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  {nights > 0 && (
                    <div className="bg-white p-5 rounded-lg mb-6 border border-gray-200">
                      <h3 className="font-semibold text-textPrimary mb-3">Price Breakdown</h3>
                      <div className="space-y-2 mb-3">
                        <div className="flex justify-between text-textSecondary]">
                          <span>₹{property.price.toLocaleString('en-IN')} × {nights} {nights === 1 ? 'night' : 'nights'}</span>
                          <span>₹{totalPrice.toLocaleString('en-IN')}</span>
                        </div>
                      </div>
                      <div className="border-t pt-3 flex justify-between items-center">
                        <span className="font-semibold text-textPrimary text-lg">Total Amount</span>
                        <span className="text-primary text-2xl font-bold">₹{totalPrice.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  )}

                  {bookingError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                      <div className="flex items-start">
                        <svg className="w-5 h-5 text-error mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                        <p className="text-error] text-sm font-medium">{bookingError}</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      disabled={booking || nights === 0}
                      className="flex-1 sm:flex-none px-8 py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                    >
                      {booking ? 'Processing...' : 'Confirm Booking'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowDatePicker(false);
                        setStartDate('');
                        setEndDate('');
                        setBookingError('');
                      }}
                      disabled={booking}
                      className="px-8 py-3 border-2 border-gray-300 text-textPrimary font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
