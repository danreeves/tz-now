import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";
import { unique } from "../utils/unique";
import { Select } from "./select";
import { Timetable } from "./timetable";

const Page = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: center;
`;

const Body = styled.div`
  display: flex;
  flex-direction: column;
`;

export class App extends React.Component {
  constructor() {
    super();
    const now = DateTime.local();
    const timezones = [now.zoneName];
    this.state = { now, timezones, tzIds: [] };
  }

  componentDidMount() {
    // Set up internal clock
    this.interval = setInterval(() => {
      const now = DateTime.local();
      this.setState({ now });
    }, 1000);

    // Get timezone IANA IDs
    import("../data/tz-ids.json").then(tzIds =>
      this.setState({
        tzIds: tzIds
          .filter(id => !this.state.timezones.includes(id))
          .concat(["PST", "CST", "JST"])
      })
    );
  }

  componentWillUnmount() {
    // Kill the internal clock
    clearInterval(this.interval);
  }

  addTimezone = timezone => {
    this.setState(prevState => {
      const newTimezones = unique([...prevState.timezones, timezone]);
      return {
        tzIds: prevState.tzIds.filter(id => !newTimezones.includes(id)),
        timezones: newTimezones
      };
    });
  };

  render() {
    const { now, timezones, tzIds } = this.state;
    return (
      <Page>
        <Body>
          <div>
            <Select options={tzIds} onSelect={this.addTimezone} />
          </div>
          <Timetable now={now} timezones={timezones} />
        </Body>
      </Page>
    );
  }
}
