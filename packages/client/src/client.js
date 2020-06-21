export const getTimers = (callback) =>
  fetch('http://localhost:3000/api/timers')
    .then((response) => response.json())
    .then(callback);
