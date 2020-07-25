import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";
import memoize from "memoize-one";
import { get, set } from "../utils/localstorage";
import { unique } from "../utils/unique";
import { Select } from "./select";
import { Timetable } from "./timetable";
import { AddLocalTime } from "./add-local-time";

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

  moveTimezone = (timezone, direction) => {
	const index = this.state.timezones.indexOf(timezone)
	const before = this.state.timezones.slice(0, index)
	const after = this.state.timezones.slice(index + 1, this.state.timezones.length)

	if (direction === "up") {
	  const displaced = before.pop()
	  this.setState({
		timezones: [...before, timezone, displaced, ...after]
	  })
	}
	if (directions === "down") {
	  const displaced = after.shift()
	  this.setState({
		timezones: [...before, displaced, timezone, ...after]
	  })
	}
  };

  moveTimezoneUp = (timezone) => {
	this.moveTimezone(timezone, "up")
  }

  moveTimezoneDown = (timezone) => {
	this.moveTimezone(timezone, "down")
  }

  render() {
    const { now, timezones, tzIds } = this.state;
    const activeTzIds = tzIds.filter(tzIdFilter(timezones, now.zoneName));
    return (
      <Page>
        <Body>
          <Header>
            <Select options={activeTzIds} onSelect={this.addTimezone} />
            <AddLocalTime
              now={now}
              timezones={timezones}
              addTimezone={this.addTimezone}
            />
          </Header>

          <Timetable
            now={now}
            timezones={timezones}
            removeTimezone={this.removeTimezone}
            moveUp={this.moveTimezoneUp}
            moveDown={this.moveTimezoneDown}
          />
        </Body>
      </Page>
    );
  }
}
