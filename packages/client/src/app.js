import './style.css';
import './helpers';
import * as client from './client';

class TimersDashboard extends React.Component {
  state = {
    timers: [],
  };

  componentDidMount() {
    this.loadTimersFromServer();
    setInterval(this.loadTimersFromServer, 5000);
  }

  loadTimersFromServer = () => {
    client.getTimers(null, (serverTimes) => {
      this.setState({
        timers: serverTimes,
      });
    });
  };

  handleCreateFormSubmit = (timer) => {
    this.createTimer(timer);
  };

  handleEditFormSubmit = (attrs) => {
    this.updateTimer(attrs);
  };

  handleTrashClick = (timerId) => {
    this.deleteTimer(timerId);
  };

  handleStartClick = (timerId) => {
    this.startTimer(timerId);
  };

  handleStopClick = (timerId) => {
    this.stopTimer(timerId);
  };

  createTimer = (timer) => {
    const t = helpers.newTimer(timer);

    client.createTimer(t);

    this.setState({
      timers: this.state.timers.concat(t),
    });
  };

  updateTimer = (attrs) => {
    const { timers } = this.state;

    const nextTimers = timers.map((timer) => (timer.id !== attrs.id ? timer : { ...timer, ...attrs }));

    client.updateTimer(attrs);

    this.setState({
      timers: nextTimers,
    });
  };

  deleteTimer = (timerId) => {
    const { timers } = this.state;
    const nextTimers = timers.filter((timer) => timer.id !== timerId);

    client.deleteTimer({ id: timerId });

    this.setState({
      timers: nextTimers,
    });
  };

  startTimer = (timerId) => {
    const now = Date.now();
    const { timers } = this.state;

    const nextTimers = timers.map((timer) => (timer.id !== timerId ? timer : { ...timer, runningSince: now }));

    client.startTimer({ id: timerId, start: now });

    this.setState({
      timers: nextTimers,
    });
  };

  stopTimer = (timerId) => {
    const now = Date.now();
    const { timers } = this.state;

    const nextTimers = timers.map((timer) =>
      timer.id !== timerId
        ? timer
        : {
            ...timer,
            runningSince: null,
            elapsed: timer.elapsed + (now - timer.runningSince),
          }
    );

    client.stopTimer({ id: timerId, stop: now });

    this.setState({
      timers: nextTimers,
    });
  };

  render() {
    const { timers } = this.state;

    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
          <ToggleableTimerForm onFormSubmit={this.handleCreateFormSubmit} />
        </div>
      </div>
    );
  }
}

class EditableTimerList extends React.Component {
  render() {
    const { timers, onFormSubmit, onTrashClick, onStartClick, onStopClick } = this.props;
    return (
      <div id="timers">
        {timers.map((timer) => (
          <EditableTimer
            key={timer.id}
            id={timer.id}
            title={timer.title}
            project={timer.project}
            elapsed={timer.elapsed}
            runningSince={timer.runningSince}
            onFormSubmit={onFormSubmit}
            onTrashClick={onTrashClick}
            onStartClick={onStartClick}
            onStopClick={onStopClick}
          />
        ))}
      </div>
    );
  }
}

class EditableTimer extends React.Component {
  state = {
    editFormOpen: false,
  };

  handleEditClick = () => {
    this.openForm();
  };

  handleFormClose = () => {
    this.closeForm();
  };

  handleSubmit = (timer) => {
    const { onFormSubmit } = this.props;
    onFormSubmit(timer);
    this.closeForm();
  };

  handleTrashClick = () => {
    const { id, onTrashClick } = this.props;
    onTrashClick(id);
  };

  closeForm = () => {
    this.setState({ editFormOpen: false });
  };

  openForm = () => {
    this.setState({ editFormOpen: true });
  };

  render() {
    const { editFormOpen } = this.state;
    const { id, title, project, elapsed, runningSince, onStartClick, onStopClick } = this.props;

    if (editFormOpen) {
      return (
        <TimerForm
          id={id}
          title={title}
          project={project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Timer
          id={id}
          title={title}
          project={project}
          elapsed={elapsed}
          runningSince={runningSince}
          onEditClick={this.handleEditClick}
          onTrashClick={this.handleTrashClick}
          onStartClick={onStartClick}
          onStopClick={onStopClick}
        />
      );
    }
  }
}

class TimerForm extends React.Component {
  state = {
    title: this.props.title || '',
    project: this.props.project || '',
  };

  handleTitleChange = (e) => {
    this.setState({
      title: e.target.value,
    });
  };

  handleProjectChange = (e) => {
    this.setState({
      project: e.target.value,
    });
  };

  handleSubmit = (e) => {
    const { id, onFormSubmit } = this.props;
    const { title, project } = this.state;

    onFormSubmit({
      id,
      title,
      project,
    });
  };

  onFormClose = (e) => {
    const { onFormClose } = this.props;
    onFormClose();
  };

  render() {
    const { id } = this.props;
    const { title, project } = this.state;

    const submitText = id ? 'Update' : 'Create';

    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input type="text" name="title" value={title} onChange={this.handleTitleChange} />
            </div>
            <div className="field">
              <label>Project</label>
              <input type="text" name="project" value={project} onChange={this.handleProjectChange} />
            </div>
            <div className="ui two bottom attached buttons">
              <button className="ui basic blue button" onClick={this.handleSubmit}>
                {submitText}
              </button>
              <button className="ui basic red button" onClick={this.onFormClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

class ToggleableTimerForm extends React.Component {
  state = {
    isOpen: false,
  };

  handleFormOpen = () => {
    this.setState({ isOpen: true });
  };

  handleFormClose = () => {
    this.setState({ isOpen: false });
  };

  handleFormSubmit = (data) => {
    const { onFormSubmit } = this.props;
    this.setState({ isOpen: false });
    onFormSubmit(data);
    console.log(data);
  };

  render() {
    const { isOpen } = this.state;

    if (isOpen) {
      return <TimerForm onFormSubmit={this.handleFormSubmit} onFormClose={this.handleFormClose} />;
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <button onClick={this.handleFormOpen} className="ui basic button icon">
            <i className="plus icon" />
          </button>
        </div>
      );
    }
  }
}

class Timer extends React.Component {
  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleStartClick = () => {
    const { id, onStartClick } = this.props;
    onStartClick(id);
  };

  handleStopClick = () => {
    const { id, onStopClick } = this.props;
    onStopClick(id);
  };

  render() {
    const { runningSince, elapsed, title, project, onEditClick, onTrashClick } = this.props;

    const elapsedString = helpers.renderElapsedString(elapsed, runningSince);

    return (
      <div className="ui centered card">
        <div className="content">
          <div className="header">{title}</div>
          <div className="meta">{project}</div>
          <div className="center aligned description">
            <h2>{elapsedString}</h2>
          </div>
          <div className="extra content">
            <span className="right floated edit icon" onClick={onEditClick}>
              <i className="edit icon" />
            </span>
            <span className="right floated trash icon" onClick={onTrashClick}>
              <i className="trash icon" />
            </span>
          </div>
        </div>
        <TimerActionButton
          timerIsRunning={!!runningSince}
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
        />
      </div>
    );
  }
}

class TimerActionButton extends React.Component {
  render() {
    const { timerIsRunning, onStopClick } = this.props;

    if (timerIsRunning) {
      return (
        <div className="ui bottom attached red basic button" onClick={onStopClick}>
          Stop
        </div>
      );
    } else {
      return (
        <div className="ui bottom attached green basic button" onClick={this.props.onStartClick}>
          Start
        </div>
      );
    }
  }
}
ReactDOM.render(<TimersDashboard />, document.getElementById('content'));
