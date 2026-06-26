export type Role = 'RIDER' | 'COMMUTER' | 'ADMIN';
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'EXPIRED';
export type RideStatus = 'ACTIVE' | 'CANCELLED' | 'COMPLETED';
export type RecurrenceType = 'NONE' | 'DAILY' | 'WEEKLY';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
  name: string;
}

export interface User {
  id: number;
  email: string;
  phone: string;
  role: Role;
  name: string;
  photoUrl?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  licenseNumber?: string;
  vehicleNumber?: string;
  verificationStatus: VerificationStatus;
  emailVerified: boolean;
  phoneVerified: boolean;
  avgRating: number;
  karmaPoints: number;
  createdAt: string;
}

export interface RegisterRequest {
  email: string;
  phone: string;
  password: string;
  name: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface ProfileUpdateRequest {
  name?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  licenseNumber?: string;
  vehicleNumber?: string;
}

export interface Ride {
  id: number;
  riderId: number;
  riderName: string;
  riderRating: number;
  sourceName: string;
  sourceLat: number;
  sourceLng: number;
  destName: string;
  destLat: number;
  destLng: number;
  routePolyline?: string;
  distanceKm: number;
  tollAmount: number;
  departureTime: string;
  totalSeats: number;
  availableSeats: number;
  womenOnly: boolean;
  recurrence: RecurrenceType;
  status: RideStatus;
}

export interface RideRequest {
  sourceName: string;
  sourceLat: number;
  sourceLng: number;
  destName: string;
  destLat: number;
  destLng: number;
  departureTime: string;
  totalSeats: number;
  tollAmount: number;
  womenOnly: boolean;
  recurrence: RecurrenceType;
}

export interface RideMatch {
  rideId: number;
  riderName: string;
  riderRating: number;
  sourceName: string;
  destName: string;
  departureTime: string;
  availableSeats: number;
  womenOnly: boolean;
  distanceKm: number;
  suggestedPickupLat: number;
  suggestedPickupLng: number;
  suggestedPickupName: string;
  detourKm: number;
  matchScore: number;
  farePerSeat: number;
}

export interface Booking {
  id: number;
  rideId: number;
  commuterId: number;
  commuterName: string;
  pickupName: string;
  pickupLat: number;
  pickupLng: number;
  status: BookingStatus;
  fareAmount: number;
  matchScore: number;
  detourKm: number;
  expiresAt: string;
  confirmedAt?: string;
  completedAt?: string;
  createdAt: string;
  ride?: Ride;
}

export interface BookingRequest {
  rideId: number;
  pickupName: string;
  pickupLat: number;
  pickupLng: number;
  matchScore?: number;
  detourKm?: number;
}

export interface FarePreviewRequest {
  distanceKm: number;
  toll: number;
  seats: number;
}

export interface FarePreviewResponse {
  distanceKm: number;
  fuelRate: number;
  toll: number;
  seats: number;
  farePerSeat: number;
  totalFare: number;
}

export interface Receipt {
  bookingId: number;
  source: string;
  destination: string;
  distanceKm: number;
  farePaid: number;
  riderName: string;
  commuterName: string;
  completedAt: string;
}

export interface ChatMessage {
  id: number;
  bookingId: number;
  senderId: number;
  senderName: string;
  senderEmail: string;
  content: string;
  sentAt: string;
}

export interface TrackingUpdate {
  bookingId: number;
  lat: number;
  lng: number;
  type: 'START' | 'LIVE' | 'END';
}

export interface EcoTracker {
  id: number;
  co2SavedKg: number;
  tripsShared: number;
}

export interface Report {
  id: number;
  reason: string;
  description: string;
  resolved: boolean;
  createdAt: string;
}

export interface ReviewRequest {
  bookingId: number;
  rating: number;
  comment?: string;
}

export interface ReportRequest {
  reportedUserId: number;
  reason: string;
  description?: string;
}

export interface SosRequest {
  bookingId?: number;
  lat?: number;
  lng?: number;
}

export interface LocationPoint {
  name: string;
  lat: number;
  lng: number;
}

export interface DashboardData {
  bookings: Booking[];
  totalTrips: number;
}

export interface Analytics {
  users: number;
  rides: number;
  bookings: number;
  activeRides: number;
}
