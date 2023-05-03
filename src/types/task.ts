export interface ITask {
  id: string;
  type: string;
  text: string;
  answerCount: number;
  author: IAuthor;
  acceptedAnswer: IAcceptedAnswer[];
  suggestedAnswer: ISuggestedAnswer[];
  createdAt: string;
}

export interface IAcceptedAnswer {
  type: string;
  text: string;
  upvoteCount: number;
  author: IAuthor;
  createdAt: string;
}

export interface ISuggestedAnswer {
  type: string;
  text: string;
  upvoteCount: number;
  author: IAuthor;
  createdAt: string;
}

export interface IAuthor {
  type: string;
  name: string;
}
