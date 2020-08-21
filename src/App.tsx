import React, { useEffect, useState } from "react";
import { Grid, LinearProgress } from "@material-ui/core";
import map from "lodash/map";
import uniq from "lodash/uniq";
import { useLocation, withRouter } from "react-router-dom";
import { History } from "history";
import { ICourse, IResponseCourses, IFilter } from "./interfaces";
import Course from "./components/Course";
import Filters from "./components/Filters";

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

interface Props {
  history: History;
}

function App(props: Props) {
  const query = new URLSearchParams(useLocation().search);
  const [filter, setFilter] = useState<IFilter>({
    location: query.get("location") || "Tallinn",
    level: query.get("level") || "A1",
    onlyWithFreePlaces: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [levels, setLevels] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<ICourse[]>([]);

  useEffect(() => {
    if (courses.length === 0) {
      getCourses();
    }
  }, [courses.length]);

  useEffect(() => {
    if (
      query.get("location") !== filter.location ||
      query.get("level") !== filter.level
    ) {
      props.history?.push(`?location=${filter.location}&level=${filter.level}`);
    }
  }, [filter.level, filter.location, props.history, query]);

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
  }, [courses, filter.level, filter.location, filter.onlyWithFreePlaces]);

  async function getCourses() {
    setIsLoading(true);
    const responseCourses = await getData<IResponseCourses>(
      "https://api.allorigins.win/raw?url=https://integratsioon.ee/language-courses.json"
    );
    const courses = responseCourses.nodes.map((course) => course.node);
    setLocations(uniq(map(courses, "City/County")));
    setLevels(uniq(map(courses, "language course level")));
    setCourses(courses);
    setIsLoading(false);
  }

  function onChangeFilter(key: string, value: unknown) {
    setFilter({
      ...filter,
      [key]: value,
    });
  }

  return (
    <div className="App">
      <Filters
        isLoading={isLoading}
        locations={locations}
        levels={levels}
        filter={filter}
        onChangeFilter={onChangeFilter}
        onRefresh={() => getCourses()}
      />
      {isLoading && <LinearProgress />}
      <Grid container direction="column" spacing={2}>
        {filteredCourses?.map((course) => (
          <Course key={course.Nid} course={course} />
        ))}
      </Grid>
    </div>
  );
}

export default withRouter(App);
