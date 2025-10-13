export interface Property {
  _id: string;
  title: string;
  description: string;
  location: string;
  price: number;
  images: string[];
  propertyType: 'villa' | 'resort' | 'hotel';
}