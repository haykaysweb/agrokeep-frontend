// storage details map types or interface
export interface NearestMarket {
  name: string;
  distance: string;
  duration: string;
}

export interface StorageFacility {
  id: string;
  name: string;
  locationName: string;
  lat: number;
  lng: number;
  drivingDirections: string;
  nearestMarkets: NearestMarket[];
}