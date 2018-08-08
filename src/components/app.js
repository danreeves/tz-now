import React from "react";
import styled from "react-emotion";
import { DateTime } from "luxon";

const Body = styled.table`
  font-family: monospace;
  border: 1px solid black;
  margin-left: auto;
  margin-right: auto;
`;

const Row = styled.tr``;

const Col = styled.td`
  border-top: 1px solid black;
  border-bottom: 1px solid black;
  padding: 0.5rem;
  ${({ now }) => now && "background: yellow;"};
  ${({ eod }) =>
    eod &&
    "border-top-right-radius: 5px; border-bottom-right-radius: 5px; border-right: 1px solid black;"}
  ${({ sod }) =>
    sod &&
    "border-top-left-radius: 5px; border-bottom-left-radius: 5px; border-left: 1px solid black;"}
  ${({ box }) => box && "border: 1px solid black;"}
  ${({ cap }) => cap && `border-${cap}: 1px solid black;`}
`;

const P = styled.p`
  margin: 0;
  margin-bottom: 0.25rem;
`;

function Padded({ children }) {
  return children.length < 4 ? (
    <React.Fragment>
      &nbsp;
      {children}
    </React.Fragment>
  ) : (
    children
  );
}

export default class App extends React.Component {
  constructor(props) {
    super(props);

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

  offsetBefore = 5;
  offsetAfter = 10;

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
    const { timezones, now } = this.state;
    const hoursBefore = Array.from({ length: this.offsetBefore })
      .map((v, i) => i + 1)
      .reverse()
      .map(v => now.minus({ hours: v }));
    const hoursAfter = Array.from({ length: this.offsetAfter })
      .map((v, i) => i + 1)
      .map(v => now.plus({ hours: v }));
    const times = [...hoursBefore, now, ...hoursAfter];

    return (
      <div>
        <h1>Hello, planet!</h1>
        <P>WIP</P>
        <hr />
        <Body>
          <tbody>
            {timezones.map(zoneName => {
              return (
                <Row key={zoneName}>
                  <Col box>
                    {zoneName === now.zoneName ? "⌂ " : ""}
                    {zoneName}
                  </Col>
                  <Col box>
                    <P>
                      {now
                        .setZone(zoneName)
                        .toLocaleString(DateTime.TIME_24_WITH_SHORT_OFFSET)}
                    </P>
                    <P>
                      {now.setZone(zoneName).toLocaleString(DateTime.DATE_HUGE)}
                    </P>
                  </Col>
                  {times.map((time, i) => {
                    const localTime = time.setZone(zoneName);
                    const timeString = localTime.toFormat("ha");
                    if (zoneName !== "America/New_York")
                      console.log({ localTime });
                    return (
                      <Col
                        key={time.hour}
                        now={time === now}
                        eod={localTime.hour === 0}
                        sod={localTime.hour === 1}
                        cap={
                          i === 0
                            ? "left"
                            : i === times.length - 1
                              ? "right"
                              : false
                        }
                      >
                        <Padded>{timeString}</Padded>
                      </Col>
                    );
                  })}
                </Row>
              );
            })}
          </tbody>
        </Body>
      </div>
    );
  }
}
