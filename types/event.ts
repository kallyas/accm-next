export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl?: string;
  registeredCount: number;
}

export interface EventInput {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  location: string;
  bannerUrl?: string;
}
