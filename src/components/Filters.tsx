import React from "react";
import {
  Grid,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
} from "@material-ui/core";
import { IFilter } from "../interfaces";

interface Props {
  isLoading: boolean;
  locations: string[];
  levels: string[];
  filter: IFilter;
  onChangeFilter: (key: string, value: string | boolean) => void;
  onRefresh: () => void;
}

function Filters({
  isLoading,
  locations,
  levels,
  filter,
  onChangeFilter,
  onRefresh,
}: Props) {
  return (
    <Grid container direction="row" spacing={2}>
      <Grid item>
        <InputLabel>Locations</InputLabel>
        <Select
          value={filter.location}
          onChange={(event) =>
            onChangeFilter("location", String(event.target.value))
          }
          disabled={isLoading}
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
          onChange={(event) =>
            onChangeFilter("level", String(event.target.value))
          }
          disabled={isLoading}
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
              disabled={isLoading}
            />
          }
          label="Only with free places"
        />
      </Grid>
      <Grid item>
        <Button
          variant="contained"
          disabled={isLoading}
          onClick={() => onRefresh()}
        >
          Refresh
        </Button>
      </Grid>
    </Grid>
  );
}

export default Filters;
