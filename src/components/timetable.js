import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";

const Table = styled.table`
  border: 1px solid darkgrey;
  user-select: none;
`;

const ActionBox = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  height: 100%;
  top: 0;
  left: -5rem;
  padding-right: 2rem;
  opacity: 0;
  &:hover {
    opacity: 1;
  }
`;

const Row = styled.tr`
  &:hover {
    color: white;
    border-color: white;
    & ${ActionBox} {
      opacity: 1;
    }
  }
`;

const Cell = styled.td`
  position: relative;
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

const Btn = styled.button`
  background: none;
  text-align: right;
  border: none;
  color: darkgrey;
  font-size: 1rem;
  line-height: 1rem;
  padding: 0.25rem;
`;

export class Timetable extends React.Component {
  state = { highlighted: null };

  offsetBefore = 1;
  offsetAfter = 23;

  setHovered = time => {
    this.setState({ highlighted: time });
  };

  render() {
    const { now, timezones, removeTimezone, moveUp, moveDown } = this.props;
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
                  <ActionBox>
                    <Btn onClick={() => moveUp(zoneName)}>Up</Btn>
                    <Btn onClick={() => moveDown(zoneName)}>Down</Btn>
                    <Btn onClick={() => removeTimezone(zoneName)}>Remove</Btn>
                  </ActionBox>
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
                  const cellTop = isSod
                    ? localTime.toFormat(`EEE`)
                    : localTime.toFormat(`h`);
                  const cellBottom = isSod
                    ? localTime.toFormat(`d`)
                    : localTime.toFormat(`a`);
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
                      <div>{cellTop}</div>
                      <div>{cellBottom}</div>
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
