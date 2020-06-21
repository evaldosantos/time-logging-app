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

function xFetch(endpoint, config = {}) {
  return (data, success) => {
    if (data && config.method !== 'get') {
      config = { ...config, body: JSON.stringify(data) };
    }

    return fetch(endpoint, {
      method: 'get',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      ...config,
    })
      .then(checkStatus)
      .then(parseJSON)
      .then(success);
  };
}

export const getTimers = xFetch('http://localhost:3000/api/timers');

export const startTimer = xFetch('http://localhost:3000/api/timers/start', { method: 'post' });
export const stopTimer = xFetch('http://localhost:3000/api/timers/stop', { method: 'post' });

export const createTimer = xFetch('http://localhost:3000/api/timers', { method: 'post' });
export const updateTimer = xFetch('http://localhost:3000/api/timers', { method: 'put' });
export const deleteTimer = xFetch('http://localhost:3000/api/timers', { method: 'delete' });
