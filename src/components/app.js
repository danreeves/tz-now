import React from "react";
import { DateTime } from "luxon";
import { Timetable } from "./timetable";

const now = DateTime.local();
const timezones = [
  now.zoneName,
  "America/New_York",
  "America/Chicago",
  "America/Los_Angeles",
  "Asia/Tokyo"
];

export function App() {
  return (
    <div style={{ marginTop: "1rem" }}>
      <Timetable now={now} timezones={timezones} />
    </div>
  );
}
