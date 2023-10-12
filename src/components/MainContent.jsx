import React from "react";
import Grid from "@mui/material/Unstable_Grid2";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Prayer from "./Prayer";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import axios from "axios";
import { wait } from "@testing-library/user-event/dist/utils";
import { useState, useEffect } from "react";
import { useForkRef } from "@mui/material";

export default function MainContent() {
  //States
  const [timings, setTimings] = useState({
    Fajr: "06:28",
    Dhuhr: "13:09",
    Asr: "16:25",
    Maghrib: "18:53",
    Isha: "19:48",
  });

  const [selectedCity, setSelectedCity] = useState({
    displayName: "Tanger",
    apiName: "MA-01",
  });

  const avilableCities = [
    {
      displayName: "Tanger",
      apiName: "MA-01",
    },
    {
      displayName: "Casablanca",
      apiName: "MA-CAS*",
    },
    {
      displayName: "Laâyoune",
      apiName: "MA-11",
    },
  ];

  const getTimings = async () => {
    const response = await axios.get(
      "https://api.aladhan.com/v1/timingsByCity?country=MAR&city=Tetouan"
    );

    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, []);

  //  const data = wait axios.get("https://api.aladhan.com/v1/timingsByCity?country=MAR&city=Tetouan");

  const handleCityChange = (event) => {
    const cityObject = avilableCities.find((city) => {
      return city.apiName == event.target.value;
    });
    console.log("the new value is", event.target.value);
    setSelectedCity(cityObject);
  };
  return (
    <>
      {/* top row */}
      <Grid container>
        <Grid xs={6}>
          <div>
            <h2>Lorem, ipsum dolor.</h2>
            <h1>{selectedCity.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2>Lorem, ipsum dolor.</h2>
            <h1>Lorem, ipsum.</h1>
          </div>
        </Grid>
      </Grid>
      {/* **** top row **** */}

      <Divider />

      {/* PRAYERS CARDS */}
      <Stack direction={"row"} justifyContent={"space-around"}>
        <Prayer name="Al fajr" time={timings.Fajr} imagePrayer="" />
        <Prayer name="Al duhr" time={timings.Dhuhr} imagePrayer="" />
        <Prayer name="Al Asr" time={timings.Asr} imagePrayer="" />
        <Prayer name="Al marghib" time={timings.Maghrib} imagePrayer="" />
        <Prayer name="Al achae" time={timings.Isha} imagePrayer="" />
      </Stack>
      {/* PRAYERS CARDS */}

      {/* select city */}

      <Stack
        direction="row"
        justifyContent={"center"}
        style={{ marginTop: "40px" }}
      >
        <FormControl style={{ width: "20%" }}>
          <InputLabel id="demo-simple-select-label">City</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            // value={age}
            label="Age"
            onChange={handleCityChange}
          >
            {avilableCities.map((city) => {
              return (
                <MenuItem value={city.apiName}>{city.displayName}</MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
