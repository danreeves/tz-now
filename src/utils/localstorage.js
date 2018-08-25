const LS_KEY = "tz-now";

function getState() {
  const data = window.localStorage.getItem(LS_KEY);
  const json = JSON.parse(data) || {};
  return json;
}

export function get(key) {
  const json = getState();
  return json[key];
}

export function set(key, value) {
  const json = getState();
  json[key] = value;
  window.localStorage.setItem(LS_KEY, JSON.stringify(json));
}
