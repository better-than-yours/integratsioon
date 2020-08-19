export interface ResponseCourses {
  nodes: {
    node: Course;
  }[];
}

export interface Course {
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
