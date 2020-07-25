import React from "react";
import styled from "@emotion/styled";

const Button = styled.button`
  background: black;
  border: 2px double lightgrey;
  width: 250px;
  height: 38px;
  color: lightgrey;
  float: right;
`;

export function AddLocalTime({ now, timezones, addTimezone }) {
  if (timezones.includes(now.zoneName)) {
    return null;
  }
  return (
    <Button onClick={() => addTimezone({ value: now.zoneName })}>
      Add local time ({now.zoneName})
    </Button>
  );
}
