import React from "react";
import { Grid, Button } from "@material-ui/core";
import { ICourse } from "../interfaces";

interface Props {
  course: ICourse;
}

function Course({ course }: Props) {
  return (
    <Grid item>
      <Grid item>
        <b>{course["language course level"]}</b> {course.Address}
      </Grid>
      <Grid item>
        {course["course start"]} - {course["course end"]}
      </Grid>
      <Grid item>{course["Additional info"]}</Grid>
      <Grid item>{course["course description"]}</Grid>
      <Grid item>
        No of form Submissions: {course["No of form Submissions"]}
      </Grid>
      <Grid item>
        Reserve group no of places: {course["Reserve group no of places"]}
      </Grid>
      <Grid item>
        Main group no of places: {course["Main group no of places"]}
      </Grid>
      <Grid item>
        {Number(course["Main group no of places"]) +
          Number(course["Reserve group no of places"]) >
        Number(course["No of form Submissions"]) ? (
          <Button
            variant="contained"
            href={`https://integratsioon.ee${course["Button link"]}`}
          >
            Registration
          </Button>
        ) : (
          <b>No free places</b>
        )}
      </Grid>
    </Grid>
  );
}

export default Course;
