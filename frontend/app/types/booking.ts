export type Booking = {
  _id: string;
  userId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  propertyDetails: {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    propertyType: string;
  };
};

export type AdminBooking = {
  _id: string;
  userId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  status: string;
  totalPrice: number;
  createdAt: string;
  updatedAt: string;
  userDetails?: {
    _id: string;
    name: string;
    email: string;
  };
  propertyDetails: {
    _id: string;
    title: string;
    description: string;
    location: string;
    price: number;
    images: string[];
    propertyType: string;
  };
};