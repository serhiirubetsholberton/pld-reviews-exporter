enum IEventStatus {
  PENDING = 'Pending'
}

interface IBatch {
  id: number;
  full_name: string;
  name: string;
  number: any;
  school_location: {
    id: number;
    name: string;
  }
}

interface IUser {
  batch: IBatch,
  full_name: string;
  id: number;
  picture_url: string;
  uri: string;
}

export interface IEvent {
  id: number;
  score: number;
  status: IEventStatus;
  uri: string;
  user: IUser
}

export interface IExcelData {
  'Email Address': string;
  "Total Sprint Review Score\n(formula)": string;
}

export type IMapStudentIdToScore = Record<string, number>
export type IMapStudentIdToEvent = Record<string, IEvent>