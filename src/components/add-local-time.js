import React from "react";

export function AddLocalTime({ now, timezones, addTimezone }) {
  if (timezones.includes(now.zoneName)) {
    return null;
  }
  return (
    <button onClick={() => addTimezone(now.zoneName)}>
      Add local time ({now.zoneName})
    </button>
  );
}
