
export enum BallType {
  NORMAL = 'NORMAL',
  WIDE = 'WIDE',
  NO_BALL = 'NO_BALL'
}

export interface BallRecord {
  id: string;
  runs: number;
  type: BallType;
  isWicket: boolean;
  timestamp: number;
}

export interface InningsState {
  history: BallRecord[];
}
