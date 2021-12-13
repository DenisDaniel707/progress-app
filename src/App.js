import { useState, useEffect } from 'react';
import './App.css';
import moment from 'moment'

// const goal = 365 //days
const starting_date = "2021-12-6 18:57:00"
let ms_percentage, seconds, minutes, hours, days, months, years, start, wanted_duration, end, calculated_ms

document.title = "Progress App"
document.body.style.background = "#888"


const App = () => {

  const [goal, setGoal] = useState(localStorage.getItem('goal') ?? 90)
  const [current_time, setCurrent_time] = useState()
  const [seconds, setSeconds] = useState()
  const [minutes, setMinutes] = useState()
  const [hours, setHours] = useState()
  const [days, setDays] = useState()
  const [months, setMonths] = useState()
  const [years, setYears] = useState()

  const calcTime = () => {
    start = moment(starting_date)
    
    wanted_duration = goal * 86400000

    end = moment(moment().format("YYYY-MM-DD HH:mm:ss"))
    
    ms_percentage = ((end - start) / 1000) / wanted_duration * 1000
    
    calculated_ms = moment.duration(end.diff(start))['_milliseconds']

    let s = Math.floor(calculated_ms / 1000) % 60
    setSeconds(s)
    let m = Math.floor(calculated_ms / 1000 / 60) % 60
    setMinutes(m)
    let h = Math.floor(calculated_ms / 1000 / 60 / 60) % 24
    setHours(h)
    let d = Math.floor(calculated_ms / 1000 / 60 / 60 / 24) % 30
    setDays(d)
    let M = Math.floor(calculated_ms / 1000 / 60 / 60 / 24 / 30) % 12
    setMonths(M)
    let y = Math.floor(calculated_ms / 1000 / 60 / 60 / 24 / 30 / 12)
    setYears(y)

    setCurrent_time(Math.floor(Math.abs(moment.duration(start.diff(end)).asDays())) - 1)
  }

  useEffect(() => {
    window.setInterval(() => {
      calcTime()
      document.documentElement.style.setProperty('--progress-percentage', ms_percentage * 100 + '%');
      if(ms_percentage * 100 >= 100) {
        document.documentElement.style.setProperty('--progress-color', 'green');
      }
      // console.log('tick')
    }, 1000)
  }, [])

  // useEffect(() => {
  //   window.location.reload(false)
  // }, [])

  return (
    <div className="App">
      {current_time >= 0 ?
        <div className="canvas">
          <div className="time-div">
            <div className="time">{days + ' Days'}</div>
            <div className="time">{hours + ' Hours'}</div>
            <div className="time">{minutes + ' Minutes'}</div>
            <div className="time">{seconds + ' Seconds'}</div>
          </div>
          <div className="loading-bar-box">
            <div className="loading-bar">
              <div className="text">{(ms_percentage * 100).toFixed(2) + '%'}</div>
              <div className="progress"></div>
            </div>
            <div className="goal">{'Goal: ' + goal + ' Days'}</div>
            <input className="goal-setter" placeholder="Set new goal" onKeyPress={e => {
              if(e.key === 'Enter' && !isNaN(e.target.value)) {
                localStorage.setItem('goal', e.target.value);
                window.location.reload(false)
              }
            }} />
          </div>
          {ms_percentage * 100 >= 100 ? 
            <div className="celebration">🎉</div>
            : 
            null}
        </div>
      : 
        null}
    </div>
  );
}

export default App;