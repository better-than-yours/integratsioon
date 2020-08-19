import React, { useEffect, useState } from "react";
import { Course, ResponseCourses } from "./interfaces";
import {
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { map, uniq } from "lodash";
import { useParams, withRouter } from "react-router-dom";
import { History } from "history";

async function getData<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
}

interface Filter {
  onlyWithFreePlaces: boolean;
  level: string;
  location: string;
}

interface Props {
  history: History;
}

function App(props: Props) {
  let { location, level } = useParams();
  const [filter, setFilter] = useState<Filter>({
    location: location || "Tallinn",
    level: level || "A1",
    onlyWithFreePlaces: true,
  });
  const [levels, setLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (courses.length === 0) {
      getCourses();
    }
  }, [courses.length]);

  useEffect(() => {
    setFilteredCourses(
      courses.filter((course) => {
        let found = true;
        if (found && filter.location) {
          found = course["City/County"] === filter.location;
        }
        if (found && filter.level) {
          found = course["language course level"] === filter.level;
        }
        if (found && filter.onlyWithFreePlaces) {
          found =
            Number(course["Main group no of places"]) +
              Number(course["Reserve group no of places"]) >
            Number(course["No of form Submissions"]);
        }
        return found;
      })
    );
    if (location !== filter.location || level !== filter.level) {
      props.history?.push(`/${filter.location}/${filter.level}`);
    }
  }, [
    courses,
    filter.level,
    filter.location,
    filter.onlyWithFreePlaces,
    level,
    location,
    props.history,
  ]);

  async function getCourses() {
    const responseCourses = await getData<ResponseCourses>(
      "https://integratsioon.ee/language-courses.json"
    );
    const courses = responseCourses.nodes.map((course) => course.node);
    setLocations(uniq(map(courses, "City/County")));
    setLevels(uniq(map(courses, "language course level")));
    setCourses(courses);
  }

  function onChangeFilter(key: string, value: unknown) {
    setFilter({
      ...filter,
      [key]: value,
    });
  }

  return (
    <div className="App">
      <Grid container direction="row" spacing={2}>
        <Grid item>
          <InputLabel>Locations</InputLabel>
          <Select
            value={filter.location}
            onChange={(event) => onChangeFilter("location", event.target.value)}
            disabled={locations?.length === 0}
          >
            {locations?.map((location) => (
              <MenuItem key={`location-${location}`} value={location}>
                {location}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <InputLabel>Levels</InputLabel>
          <Select
            value={filter.level}
            onChange={(event) => onChangeFilter("level", event.target.value)}
            disabled={levels?.length === 0}
          >
            {levels?.map((level) => (
              <MenuItem key={`level-${level}`} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </Grid>
        <Grid item>
          <FormControlLabel
            control={
              <Checkbox
                checked={filter.onlyWithFreePlaces}
                onChange={(event) =>
                  onChangeFilter("onlyWithFreePlaces", event.target.checked)
                }
              />
            }
            label="Only with free places"
          />
        </Grid>
      </Grid>

      <Grid container direction="column" spacing={2}>
        {filteredCourses?.map((course) => (
          <Grid item key={course.Nid}>
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
        ))}
      </Grid>
    </div>
  );
}

export default withRouter(App);
