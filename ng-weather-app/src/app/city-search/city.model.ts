export type CityResponse = {
  name: string;
  local_names: [];
  state: string;
  country: string;
  lat: number;
  lon: number;
};

export type City = {
  id: string;
  name: string;
  state: string;
  country: string;
  lat: number;
  lon: number;
};
