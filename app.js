class TimersDashboard extends React.Component {
  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          Timers
        </div>
      </div>
    )
  }
}

ReactDOM.render(<TimersDashboard />, document.getElementById('content'))