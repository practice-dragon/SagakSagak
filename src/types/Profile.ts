export type Profile = {
  id: string;
  username: string;
  joinedat?: string;
  character?: string;
  waketime?: string;
  bedtime?: string;
  [key: string]: any;
};
