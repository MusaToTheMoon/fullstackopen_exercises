import { useState } from 'react';

const Button = ({ handleClick, text }) => {
  return <button onClick={handleClick}>{text}</button>;
};

const Statistics = ({ good, neutral, bad }) => {
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tr>
          <td>good</td>
          <td>{good}</td>
        </tr>
        <tr>
          <td>neutral</td>
          <td>{neutral}</td>
        </tr>
        <tr>
          <td>bad</td>
          <td>{bad}</td>
        </tr>
        <tr>
          <td>all</td>
          <td>{good + bad + neutral}</td>
        </tr>
        <tr>
          <td>average</td>
          <td>{(good * 1 + bad * -1) / (good + bad + neutral)}</td>
        </tr>
        <tr>
          <td>positive</td>
          <td>{(good / (good + bad + neutral)) * 100} %</td>
        </tr>
      </table>
    </>
  );
};

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  return (
    <div>
      <h1>give feedback</h1>
      <Button handleClick={() => setGood(good + 1)} text="good" />
      <Button handleClick={() => setNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      {good + neutral + bad > 0 ? (
        <Statistics good={good} bad={bad} neutral={neutral} />
      ) : <p>No feedback given</p>}
    </div>
  );
};

export default App;
