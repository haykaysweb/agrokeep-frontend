import type { StorageFacility } from "../types/facility";

export interface MyBookingHub {
  _id?: string;
  name?: string;
  address?: string;
  images?: string[];
  isVerified?: boolean;
  operatingHours?: string;
  rating?: number;
  reviewCount?: number;
  proximityText?: string;
  slug?: string;
  state?: string;
  lga?: string;
  storageType?: string;
}

export interface MyBooking {
  _id: string;
  bookingId: string;

  hub: MyBookingHub;

  cropType: string;
  quantity: number;
  unitType: string;

  dropOffDate: string;
  pickUpDate: string;
  durationInDays: number;

  bookingStatus: string;
  paymentStatus: string;

  createdAt: string;
  updatedAt?: string;

  fullName?: string;
  phoneNumber?: string;
  email?: string;

  dailyPricePerUnit?: number;

  storageFee?: number;
  serviceFee?: number;
  totalAmount?: number;
  depositAmount?: number;
  balanceAmount?: number;
}

export interface BookingMetrics {
  upcoming: number;
  active: number;
  completed: number;
}

export interface BookingPagination {
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  total: number;
  totalPages: number;
}

export interface MyBookingsData {
  bookings: MyBooking[];
  metrics: BookingMetrics;
  pagination: BookingPagination;
}

export interface MyBookingsResponse {
  success: boolean;
  message: string;
  data: MyBookingsData;
}

export const MOCK_FACILITIES: StorageFacility[] = [
  {
    id: "hub-001",
    name: "AgroKeep Challenge Hub",
    locationName: "Ibadan, Oyo State",
    lat: 7.3512,
    lng: 3.8643,
    drivingDirections: "Off Old Oyo Rd, 2.4 km from Challenge interchange",
    nearestMarkets: [
      { name: "Challenge Central", distance: "6.2 km", duration: "12 mins" },
      { name: "Dugbe Market", distance: "8 km", duration: "15 mins" },
    ],
  },
  {
    id: "hub-002",
    name: "AgroKeep Akure Central Hub",
    locationName: "Akure, Ondo State",
    lat: 7.2571,
    lng: 5.2058,
    drivingDirections: "Along Oyemekun Road, opposite First Bank Plaza",
    nearestMarkets: [
      { name: "Oja Oba Market", distance: "3.5 km", duration: "8 mins" },
      { name: "Isikan Market", distance: "5.1 km", duration: "10 mins" },
    ],
  },
  {
    id: "hub-003",
    name: "AgroKeep Ilorin Storage Hub",
    locationName: "Ilorin, Kwara State",
    lat: 8.4799,
    lng: 4.5418,
    drivingDirections: "Plot 14 Asa Dam Road, near Industrial Layout",
    nearestMarkets: [
      { name: "Obo Road Market", distance: "4.0 km", duration: "9 mins" },
      { name: "Ganmo Market", distance: "7.2 km", duration: "14 mins" },
    ],
  },
];
