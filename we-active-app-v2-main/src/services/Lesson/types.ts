import {Place} from '../Place/Place';

export type AvailablePlaces = {
  available: Place[];
  locked: Place[];
  visible: Place[];
};

export type AvailablePlacesResponse = {
  status: number;
  message: string;
  data: AvailablePlaces;
};
