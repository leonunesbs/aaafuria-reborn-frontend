export type IIssueType = {
  id: string;
  title: string;
  description: string;
  author: {
    apelido: string;
    matricula: string;
  };
  status: string;
  getStatusDisplay: string;
  priority: string;
  getPriorityDisplay: string;
  category: string;
  getCategoryDisplay: string;
  createdAt: string;
  updatedAt: string;
  comments: {
    edges: {
      node: ICommentType;
    }[];
  };
};

export type ICommentType = {
  id: string;
  author: {
    apelido: string;
  };
  description: string;
  createdAt: string;
};
