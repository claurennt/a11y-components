export type ResponseData = {
  error: boolean;
  message: string;
  data: {
    city: string;
    country: string;
    populationCount: { [key: string]: string };
  }[];
};
