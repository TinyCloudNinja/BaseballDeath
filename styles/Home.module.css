// File: pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [medianAge, setMedianAge] = useState(35);
  const [attendance, setAttendance] = useState(30000);
  const [gameLength, setGameLength] = useState(3); // in hours
  const [probability, setProbability] = useState(0);
  const [fillPercentage, setFillPercentage] = useState(0);
  
  // Function to generate stadium seats based on attendance
  const getStadiumSeats = (row, attendance) => {
    // Max capacity is 100,000
    // Different rows have different capacities
    const maxCapacity = 100000;
    const rowWidths = [25, 27, 29, 31, 33, 33, 33, 33, 33];
    const totalSpaces = rowWidths.reduce((a, b) => a + b, 0);
    
    // Calculate fill percentage based on attendance
    const percentFull = Math.min(attendance / maxCapacity, 1);
    
    // Calculate how many positions should be filled in this row
    const spacesToFill = Math.floor(rowWidths[row] * percentFull);
    
    // Create the seat string with filled and empty seats
    let seatString = '';
    for (let i = 0; i < rowWidths[row]; i++) {
      // Alternate characters for visual variety
      if (i < spacesToFill) {
        seatString += i % 4 === 0 ? '@' : i % 3 === 0 ? '#' : i % 2 === 0 ? 'o' : '*';
      } else {
        seatString += ' ';
      }
    }
    
    return seatString;
  };

  // Calculate probability of at least one death
  useEffect(() => {
    // Base rate: 8.3 deaths per 1,000 people per year
    // Convert to hourly rate
    const hourlyRatePer1000 = 8.3 / 8760;
    
    // Adjust for age (simplified model)
    let ageMultiplier = 1;
    if (medianAge < 18) ageMultiplier = 0.2;
    else if (medianAge < 30) ageMultiplier = 0.3;
    else if (medianAge < 45) ageMultiplier = 0.5;
    else if (medianAge < 60) ageMultiplier = 1.2;
    else if (medianAge < 75) ageMultiplier = 3;
    else ageMultiplier = 8;
    
    // Calculate probability for total attendance over game length
    const individualRiskFor10Hours = hourlyRatePer1000 * gameLength * ageMultiplier / 1000;
    const probOfNoDeath = Math.pow(1 - individualRiskFor10Hours, attendance);
    const probOfAtLeastOneDeath = 1 - probOfNoDeath;
    
    setProbability(probOfAtLeastOneDeath);
    setFillPercentage(Math.min(probOfAtLeastOneDeath * 100, 100));
  }, [medianAge, attendance, gameLength]);

  return (
    <div className={styles.container}>
      <Head>
        <title>Baseball Stadium Mortality Calculator</title>
        <meta name="description" content="Calculate the probability of mortality in a baseball stadium" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Baseball Stadium Mortality Calculator
        </h1>
        
        <div className={styles.stadiumContainer}>
          <div className={styles.probabilityCircle} style={{ 
            background: `conic-gradient(#00ff00 0% ${fillPercentage}%, transparent ${fillPercentage}% 100%)` 
          }}>
            <div className={styles.probabilityText}>
              {(probability * 100).toFixed(2)}%
            </div>
          </div>
          
          <div className={styles.stadium}>
            <pre>
{`
        .-""""-.
       / _    _ \\
      |  o    o  |
      |    vv    |
      |  \\____/  |
   ___|          |___
  /                   \\
 /                     \\
/                       \\
|    ${getStadiumSeats(0, attendance)}   |
|   ${getStadiumSeats(1, attendance)}  |
|  ${getStadiumSeats(2, attendance)} |
| ${getStadiumSeats(3, attendance)} |
|${getStadiumSeats(4, attendance)}|
|${getStadiumSeats(5, attendance)}|
|${getStadiumSeats(6, attendance)}|
|${getStadiumSeats(7, attendance)}|
|${getStadiumSeats(8, attendance)}|
 \\    ---HOME PLATE---    /
  \\___________________/
`}
            </pre>
          </div>
        </div>
        
        <div className={styles.controls}>
          <div className={styles.control}>
            <label htmlFor="medianAge">Median Age: {medianAge}</label>
            <input 
              type="range" 
              id="medianAge" 
              min="5" 
              max="85" 
              value={medianAge} 
              onChange={(e) => setMedianAge(Number(e.target.value))} 
            />
          </div>
          
          <div className={styles.control}>
            <label htmlFor="attendance">Attendance: {attendance.toLocaleString()} / 100,000</label>
            <input 
              type="range" 
              id="attendance" 
              min="1000" 
              max="100000" 
              step="1000"
              value={attendance} 
              onChange={(e) => setAttendance(Number(e.target.value))} 
            />
          </div>
          
          <div className={styles.control}>
            <label htmlFor="gameLength">Game Length: {gameLength} hours</label>
            <input 
              type="range" 
              id="gameLength" 
              min="1" 
              max="10" 
              value={gameLength} 
              onChange={(e) => setGameLength(Number(e.target.value))} 
            />
          </div>
        </div>
        
        <div className={styles.explanation}>
          <p>
            This calculator shows the probability of at least one death occurring during a baseball game based on:
          </p>
          <ul>
            <li>Median age of attendees (affects mortality rate)</li>
            <li>Number of people attending the game</li>
            <li>Length of the game in hours</li>
          </ul>
          <p>
            The calculation uses the U.S. mortality rate of 8.3 deaths per 1,000 people per year, 
            adjusted for time and age demographics.
          </p>
        </div>
      </main>
    </div>
  );
}