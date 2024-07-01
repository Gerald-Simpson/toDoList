export type listTitles = {
  id: string;
  cookieId: string;
  createdAt: Date;
  title: string;
};

export type listItems = {
  id: string;
  titleId: number;
  cookieId: string;
  createdAt: Date;
  message: string;
  complete: boolean;
};

export type tokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};
