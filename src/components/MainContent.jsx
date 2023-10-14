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
import moment from "moment/moment";

export default function MainContent() {
  const [remainingTime, setRemainigTime] = useState("");

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

  const [today, setToday] = useState("");

  //for time
  // const [timer, setTimer] = useState(10);

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

  //for timing
  const [nextPrayerIndex, setNextPrayerIndex] = useState(0);
  const prayersArray = [
    { key: "Fajr", displayName: "al fajr" },
    { key: "Dhuhr", displayName: "Dhuhr" },
    { key: "Asr", displayName: "Asr" },
    { key: "Maghrib", displayName: "Maghrib" },
    { key: "Isha", displayName: "Isha" },
  ];

  const getTimings = async () => {
    const response = await axios.get(
      `https://api.aladhan.com/v1/timingsByCity?country=MAR&city=${selectedCity.apiName}`
    );

    setTimings(response.data.data.timings);
  };
  useEffect(() => {
    getTimings();
  }, [selectedCity]);

  useEffect(() => {
    let interval = setInterval(() => {
      console.log("calling timer");

      setupCountdownTimer();
    }, 1000);

    const t = moment();
    setToday(t.format("MMMM Do YYYY | h:mm"));
    return () => {
      clearInterval(interval);
    };
  }, [timings]);

  const setupCountdownTimer = () => {
    const momentNow = moment();

    let prayerIndex = 2;
    if (
      momentNow.isAfter(moment(timings["Fajr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Dhuhr"], "hh:mm"))
    ) {
      prayerIndex = 1;
    } else if (
      momentNow.isAfter(moment(timings["Dhuhr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Asr"], "hh:mm"))
    ) {
      prayerIndex = 2;
    } else if (
      momentNow.isAfter(moment(timings["Asr"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Maghrib"], "hh:mm"))
    ) {
      prayerIndex = 3;
    } else if (
      momentNow.isAfter(moment(timings["Maghrib"], "hh:mm")) &&
      momentNow.isBefore(moment(timings["Isha"], "hh:mm"))
    ) {
      prayerIndex = 4;
    } else {
      prayerIndex = 0;
    }

    //7adedna sala li maja
    setNextPrayerIndex(prayerIndex);

    const nextPrayerObject = prayersArray[prayerIndex];
    const nextPrayerTime = timings[nextPrayerObject.key];
    const nextPrayerTimeMoment = moment(nextPrayerTime, "hh:mm");

    let remainingTime = moment(nextPrayerTime, "hh:mm").diff(momentNow);

    if (remainingTime < 0) {
      const midnightDiff = moment("23:59:59", "hh:mm:ss").diff(momentNow);

      const fajrToMidnightDiff = nextPrayerTimeMoment.diff(
        moment("00:00:00", "hh:mm:ss")
      );
      const totalDiffernce = midnightDiff + fajrToMidnightDiff;
      remainingTime = totalDiffernce;
    }

    console.log(remainingTime);

    const durationRemainingTime = moment.duration(remainingTime);
    setRemainigTime(
      `${durationRemainingTime.seconds()}:
      ${durationRemainingTime.minutes()}:
    ${durationRemainingTime.hours()}`
    );
    console.log(
      "duration ",
      durationRemainingTime.hours(),
      durationRemainingTime.minutes(),
      durationRemainingTime.seconds()
    );

    console.log(momentNow.isBefore(moment(timings["Fajr"], "hh:mm")));

    const Isha = timings["Isha"];
    const IshaMoment = moment(Isha, "hh:mm");
    console.log(momentNow.isAfter(IshaMoment));
  };
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
            <h2>{today}</h2>
            <h1>{selectedCity.displayName}</h1>
          </div>
        </Grid>
        <Grid xs={6}>
          <div>
            <h2>
              Next prayer for Salat {prayersArray[nextPrayerIndex].displayName}
            </h2>
            <h1>{remainingTime}</h1>
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
                <MenuItem value={city.apiName} key={city.apiName}>
                  {city.displayName}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>
      </Stack>
    </>
  );
}
