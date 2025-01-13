type Feedback = {
  id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

type PaginatedResponse = {
  data: {
    feedback: Feedback[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
};


export type UserEvent = {
  id: string;
  userId: string;
  name: string | null;
  email: string;
  eventId: string;
  eventName: string;
  eventDate: Date;
  registeredAt: Date;
};

export type UserEventsResponse = {
  data: UserEvent[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};