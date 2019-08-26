export interface Room {
  id: string;
  name: string;
  public: boolean;

  state: string;
  currentKeyword: string;
  players: { [key: string]: Player };
}

export interface Answer {
  phrase: string;
  score: number;
  history: number[];
}

export interface Player {
  name: string;
  online: boolean;
  ready: boolean;
  answers: { [key: string]: Answer };
  // socket: websocket
}
