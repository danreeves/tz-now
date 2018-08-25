import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";
import memoize from "memoize-one";
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

const Header = styled.header`
  position: relative;
`;

const Input = styled.input`
  border: 1px solid lightgrey;
  background: transparent;
  padding: 0.5rem;
  margin: 0.25rem;
  margin-left: 0;
  color: lightgrey;
`;

const tzIdFilter = memoize((timezones, localZone) => {
  return id => {
    return !timezones.includes(id) && id !== localZone;
  };
});

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
        tzIds
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

  addTimezone = timezone => {
    this.setState(prevState => {
      const newTimezones = unique([...prevState.timezones, timezone]);

      // Persist to ls
      set("timezones", newTimezones);

      // Update component state
      return {
        timezones: newTimezones
      };
    });
  };

  removeTimezone = timezone => {
    this.setState(prevState => {
      const newTimezones = prevState.timezones.filter(id => id !== timezone);

      // Persist to ls
      set("timezones", newTimezones);

      // Update component state
      return { timezones: newTimezones };
    });
  };

  render() {
    const { now, timezones, tzIds } = this.state;
    const activeTimezones = unique([now.zoneName, ...timezones]);
    const activeTzIds = tzIds.filter(tzIdFilter(activeTimezones, now.zoneName));
    return (
      <Page>
        <Body>
          <Header>
            <Select options={activeTzIds} onSelect={this.addTimezone} />
          </Header>

          <Timetable
            now={now}
            timezones={activeTimezones}
            removeTimezone={this.removeTimezone}
          />
        </Body>
      </Page>
    );
  }
}
