'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { propertiesApi } from '@/app/lib/api';
import { ROUTES } from '@/app/lib/constants';
import { Property } from '../types/property';

export default function PropertiesPage() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProperties();
  }, []);

  useEffect(() => {
    filterProperties();
  }, [searchQuery, selectedType, properties]);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const data = await propertiesApi.list();
      setProperties(data.properties || []);
      setFilteredProperties(data.properties || []);
    } catch (err) {
      setError((err as Error).message || 'Failed to load properties');
    } finally {
      setLoading(false);
    }
  };

  const filterProperties = () => {
    let filtered = properties;

    if (selectedType !== 'all') {
      filtered = filtered.filter(property => property.propertyType === selectedType);
    }

    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        property =>
          property.title.toLowerCase().includes(query) ||
          property.location.toLowerCase().includes(query) ||
          property.description.toLowerCase().includes(query)
      );
    }

    setFilteredProperties(filtered);
  };

  const handleViewDetails = (id: string) => {
    router.push(ROUTES.PROPERTY_DETAILS(id));
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-textSecondary">Loading properties...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <p className="text-error font-semibold mb-2">Error Loading Properties</p>
          <p className="text-textSecondary">{error}</p>
          <button
            onClick={fetchProperties}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-textPrimary mb-2">
            Discover Your Perfect Stay
          </h1>
          <p className="text-textSecondary">
            Choose from our collection of {properties.length} premium properties across India
          </p>
        </div>

        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by title, location, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <svg
              className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-textSecondary"
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

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedType('all')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedType === 'all'
                  ? 'bg-primary text-white'
                  : 'bg-white text-textPrimary border border-gray-300 hover:border-primary'
              }`}
            >
              All Properties
            </button>
            <button
              onClick={() => setSelectedType('villa')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedType === 'villa'
                  ? 'bg-primary text-white'
                  : 'bg-white text-textPrimary border border-gray-300 hover:border-primary'
              }`}
            >
              🏡 Villas
            </button>
            <button
              onClick={() => setSelectedType('resort')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedType === 'resort'
                  ? 'bg-primary text-white'
                  : 'bg-white text-textPrimary border border-gray-300 hover:border-primary'
              }`}
            >
              🏖️ Resorts
            </button>
            <button
              onClick={() => setSelectedType('hotel')}
              className={`px-4 py-2 rounded-full font-medium transition-colors ${
                selectedType === 'hotel'
                  ? 'bg-primary text-white'
                  : 'bg-white text-textPrimary border border-gray-300 hover:border-primary'
              }`}
            >
              🏨 Hotels
            </button>
          </div>

          <div className="flex items-center justify-between">
            <p className="text-sm text-textSecondary">
              {filteredProperties.length} {filteredProperties.length === 1 ? 'property' : 'properties'} found
            </p>
            {(searchQuery || selectedType !== 'all') && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                }}
                className="text-sm text-primary hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {filteredProperties.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-gray-300 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
            <h3 className="text-lg font-semibold text-textPrimary mb-2">
              No Properties Found
            </h3>
            <p className="text-textSecondary mb-4">
              Try adjusting your search or filter criteria
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedType('all');
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg hover:opacity-90"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <div
                key={property._id}
                className="bg-cardBg rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                onClick={() => handleViewDetails(property._id)}
              >
                <div className="relative h-52 bg-gray-200 overflow-hidden group">
                  <img
                    src={property.images[0]}
                    alt={property.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-textPrimary flex items-center gap-1">
                    <span>{getPropertyTypeIcon(property.propertyType)}</span>
                    <span className="capitalize">{property.propertyType}</span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-xl font-semibold text-textPrimary mb-2 truncate">
                    {property.title}
                  </h3>

                  <div className="flex items-center text-textSecondary mb-3">
                    <svg
                      className="w-4 h-4 mr-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span className="text-sm truncate">{property.location}</span>
                  </div>

                  <p className="text-textSecondary text-sm mb-4 line-clamp-2">
                    {property.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-primary">
                        ₹{property.price.toLocaleString('en-IN')}
                      </span>
                      <span className="text-textSecondary ml-1 text-sm">/night</span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewDetails(property._id);
                      }}
                      className="px-4 py-2 bg-primary text-white text-sm rounded-lg font-medium hover:opacity-90 transition-opacity"
                    >
                      View Details
                    </button>
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
