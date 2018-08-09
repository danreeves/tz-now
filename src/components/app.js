import React from "react";
import { DateTime } from "luxon";
import { Timetable } from "./timetable";

export class App extends React.Component {
  constructor() {
    super();
    const now = DateTime.local();
    const timezones = [
      now.zoneName,
      "America/New_York",
      "America/Chicago",
      "America/Los_Angeles",
      "Asia/Tokyo"
    ];
    this.state = { now, timezones };
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      const now = DateTime.local();
      this.setState({ now });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    const { now, timezones } = this.state;
    return (
      <div style={{ marginTop: "1rem" }}>
        <Timetable now={now} timezones={timezones} />
      </div>
    );
  }
}
