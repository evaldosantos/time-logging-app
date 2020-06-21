function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  } else {
    const error = new Error(`HTTP Error ${response.statusText}`);
    error.status = response.statusText;
    error.response = response;
    console.log(error);
    throw error;
  }
}

function parseJSON(response) {
  return response.json();
}

export const getTimers = (success) =>
  fetch('http://localhost:3000/api/timers').then(checkStatus).then(parseJSON).then(success);

export const startTimer = (data, success) =>
  fetch('http://localhost:3000/api/timers/start', {
    method: 'post',
    body: JSON.stringify(data),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  })
    .then(checkStatus)
    .then(parseJSON)
    .then(success);
