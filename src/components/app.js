import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";
import { get, set } from "../utils/localstorage";
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

const Input = styled.input`
  border: 1px solid lightgrey;
  background: transparent;
  padding: 0.5rem;
  margin: 0.25rem;
  margin-left: 0;
  color: lightgrey;
`;

export class App extends React.Component {
  constructor() {
    super();
    const now = DateTime.local();
    this.state = { now, timezones: [], tzIds: [] };
  }

  componentDidMount() {
    // Set up internal clock
    this.interval = setInterval(() => {
      const now = DateTime.local();
      this.setState({ now });
    }, 1000);

    // Get timezone IANA IDs
    import("../data/tz-ids.json").then(tzIds =>
      this.setState(prevState => ({
        tzIds: tzIds.filter(this.tzIdFilter(prevState.timezones, prevState.now))
      }))
    );

    // Get persisted data from localStorage
    const persistedTimezones = get("timezones");
    if (persistedTimezones) {
      this.setState({ timezones: persistedTimezones });
    }
  }

  componentWillUnmount() {
    // Kill the internal clock
    clearInterval(this.interval);
  }

  tzIdFilter(timezones, now) {
    return id => {
      return !timezones.includes(id) && id !== now.zoneName;
    };
  }

  addTimezone = timezone => {
    this.setState(prevState => {
      const newTimezones = unique([...prevState.timezones, timezone]);
      const newTzIds = prevState.tzIds.filter(
        this.tzIdFilter(newTimezones, prevState.now)
      );

      // Persist to ls
      set("timezones", newTimezones);

      // Update component state
      return {
        tzIds: newTzIds,
        timezones: newTimezones
      };
    });
  };

  render() {
    const { now, timezones, tzIds } = this.state;
    const activeTimezones = unique([now.zoneName, ...timezones]);
    return (
      <Page>
        <Body>
          <div>
            <Select options={tzIds} onSelect={this.addTimezone} />
          </div>
          <Timetable now={now} timezones={activeTimezones} />
        </Body>
      </Page>
    );
  }
}
