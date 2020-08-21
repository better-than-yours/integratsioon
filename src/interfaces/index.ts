export interface IResponseCourses {
  nodes: {
    node: ICourse;
  }[];
}

export interface ICourse {
  "City/County": string;
  Address: string;
  "City/County ID": string;
  "Additional info": string;
  "course start": string;
  "course end": string;
  "course description": string;
  "Button link": string;
  "language course level": string;
  "No of form Submissions": string;
  "Main group no of places": string;
  "Reserve group no of places": string;
  "description for tooltip": string;
  "Language level ID": string;
  Nid: string;
}

export interface IFilter {
  onlyWithFreePlaces: boolean;
  level: string;
  location: string;
}
