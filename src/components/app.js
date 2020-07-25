import React from "react";
import styled from "@emotion/styled";
import { DateTime } from "luxon";
import memoize from "memoize-one";
import Select from "react-select";
import { get, set } from "../utils/localstorage";
import { unique } from "../utils/unique";
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
  return (id) => {
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
    import("../data/tz-ids.js").then((module) =>
      this.setState((prevState) => ({
        tzIds: module.list,
      }))
    );

    // Get persisted data from localStorage
    const persistedTimezones = get("timezones");
    if (persistedTimezones) {
      this.setState({ timezones: persistedTimezones });
    }
  }

  componentDidUnmount() {
    // Kill the internal clock
    clearInterval(this.interval);
  }

  render() {
    const addTimezone = ({ value: timezone } = {}) => {
      this.setState((prevState) => {
        const newTimezones = unique([...prevState.timezones, timezone]);

        // Persist to ls
        set("timezones", newTimezones);

        // Update component state
        return {
          timezones: newTimezones,
        };
      });
    };

    const removeTimezone = (timezone) => {
      this.setState((prevState) => {
        const newTimezones = prevState.timezones.filter(
          (id) => id !== timezone
        );

        // Persist to ls
        set("timezones", newTimezones);

        // Update component state
        return { timezones: newTimezones };
      });
    };

    const moveTimezone = (timezone, direction) => {
      const index = this.state.timezones.indexOf(timezone);
      const before = this.state.timezones.slice(0, index);
      const after = this.state.timezones.slice(
        index + 1,
        this.state.timezones.length
      );

      if (direction === "up") {
        const displaced = before.pop();
        this.setState({
          timezones: [...before, timezone, displaced, ...after],
        });
      }
      if (direction === "down") {
        const displaced = after.shift();
        this.setState({
          timezones: [...before, displaced, timezone, ...after],
        });
      }
    };

    const moveTimezoneUp = (timezone) => {
      moveTimezone(timezone, "up");
    };

    const moveTimezoneDown = (timezone) => {
      moveTimezone(timezone, "down");
    };
    const { now, timezones, tzIds } = this.state;
    const activeTzIds = tzIds
      .filter((id) => !timezones.includes(id) && now.zoneName !== id)
      .map((id) => ({
        value: id,
        label: id,
      }));
    return (
      <Page>
        <Body>
          <Header>
            <Select
              placeholder="Select a timezone..."
              options={activeTzIds}
              onChange={addTimezone}
              value={null}
              styles={{
                valueContainer: (p) => {
                  return {
                    ...p,
                    color: "white",
                    background: "black",
                  };
                },
                control: (p) => {
                  return {
                    ...p,
                    float: "left",
                    marginBottom: 2,
                    width: 250,
                    color: "white",
                    background: "black",
                    borderRadius: 0,
                  };
                },
                menu: (p) => {
                  return {
                    ...p,
                    width: 250,
                    color: "white",
                    background: "black",
                    borderRadius: 0,
                  };
                },
                option: (p, state) => {
                  return {
                    ...p,
                    width: 250,
                    color: state.isFocused ? "black" : "white",
                    background: state.isFocused ? "deeppink" : "black",
                    borderRadius: 0,
                  };
                },
                container: (p) => {
                  return {
                    ...p,
                    color: "white",
                    background: "black",
                  };
                },
                input: (p) => {
                  return {
                    ...p,
                    color: "white",
                    background: "black",
                  };
                },
              }}
            />
            <AddLocalTime
              now={now}
              timezones={timezones}
              addTimezone={addTimezone}
            />
          </Header>

          <Timetable
            now={now}
            timezones={timezones}
            removeTimezone={removeTimezone}
            moveUp={moveTimezoneUp}
            moveDown={moveTimezoneDown}
          />
        </Body>
      </Page>
    );
  }
}
