import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";

const Table = styled.table`
  font-family: monospace;
  border: 1px solid darkgrey;
  margin-left: auto;
  margin-right: auto;
  user-select: none;
`;

const Row = styled.tr`
  &:hover {
    color: white;
    border-color: white;
  }
`;

const Cell = styled.td`
  border-top: 1px solid darkgrey;
  border-bottom: 1px solid darkgrey;
  padding: 0.5rem;
  text-align: center;
  ${({ now }) => now && "background: deeppink; color: black;"};
  ${({ eod }) =>
    eod &&
    "border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-right: 1px solid darkgrey;"}
  ${({ sod }) =>
    sod &&
    "border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-left: 1px solid darkgrey;"}
  ${({ box }) => box && "border: 1px solid darkgrey;"}
  ${({ cap }) => cap && `border-${cap}: 1px solid darkgrey;`}
  ${({ highlight }) => highlight && "color: white; border-color: white;"}
`;

const P = styled.p`
  margin: 0;
  margin-bottom: 0.25rem;
`;

export class Timetable extends React.Component {
  state = { highlighted: null };

  offsetBefore = 1;
  offsetAfter = 23;

  componentDidMount() {
    this.interval = setInterval(() => {
      const now = DateTime.local();
      this.setState({ now });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setHovered = time => {
    this.setState({ highlighted: time });
  };

  render() {
    const { now, timezones } = this.props;
    const { highlighted } = this.state;
    const hoursBefore = Array.from({ length: this.offsetBefore })
      .map((v, i) => i + 1)
      .reverse()
      .map(v => now.minus({ hours: v }));
    const hoursAfter = Array.from({ length: this.offsetAfter })
      .map((v, i) => i + 1)
      .map(v => now.plus({ hours: v }));
    const times = [...hoursBefore, now, ...hoursAfter];

    return (
      <Table
        onMouseLeave={() => {
          this.setHovered(null);
        }}
      >
        <tbody>
          {timezones.map(zoneName => {
            return (
              <Row key={zoneName}>
                <Cell box>
                  {zoneName === now.zoneName ? "⌂ " : ""}
                  {zoneName}
                </Cell>
                <Cell box>
                  <P>
                    {now
                      .setZone(zoneName)
                      .toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET)}
                  </P>
                  <P>
                    {now.setZone(zoneName).toLocaleString(DateTime.DATE_HUGE)}
                  </P>
                </Cell>
                {times.map((time, i) => {
                  const localTime = time.setZone(zoneName);
                  const isNow = time === now;
                  const isHighlighted =
                    highlighted && highlighted.hasSame(time, "hour");
                  const isEod = localTime.hour === 23;
                  const isSod = localTime.hour === 0;
                  const cellCap =
                    i === 0 ? "left" : i === times.length - 1 ? "right" : false;
                  const timeString = isSod
                    ? localTime.toFormat("EEE d")
                    : localTime.toFormat("ha");
                  return (
                    <Cell
                      key={`${time.weekday}-${time.hour}`}
                      now={isNow}
                      eod={isEod}
                      sod={isSod}
                      cap={cellCap}
                      highlight={isHighlighted}
                      onMouseEnter={() => {
                        this.setHovered(time);
                      }}
                    >
                      {timeString}
                    </Cell>
                  );
                })}
              </Row>
            );
          })}
        </tbody>
      </Table>
    );
  }
}
