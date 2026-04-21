// types/schedule.ts
export type Group = {
  id: number;
  name: string;
  color: string;
  venueId: number;
};

export type Venue = {
  id: number;
  name: string;
};

export type Lesson = {
  id: number;
  startTime: string;
  endTime: string;
  group: { id: number; name: string };
  venue: { id: number; name: string };
  color: string;
};

export type LessonsMap = Record<string, Lesson[]>;

export type ApiResponse = {
  lessons: LessonsMap;
  groups: Group[];
  venues: Venue[];
};