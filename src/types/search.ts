export interface ISearch {
  totalAnswers: number;
  tasks: ITask;
}

export interface ITask {
  id: string;
  authorId: string;
  text: string;
  answers: IAnswer[];
}

export interface IAnswer {
  totalRates: number;
  totalThanks: number;
  rating: number;
  verified: boolean;
}
