// Reset to national average when no stadium is selected
const resetToNational = () => {
    setSelectedStadium(null);
    setSelectedState('United States');
  };
// File: pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';
import { stateDeathRates, nationalAverageDeathRate } from '../data/stateDeathRates';
import { mlbStadiums } from '../data/mlbStadiums';
import { usaAsciiMap } from '../data/usaAsciiMap';

export default function Home() {
  const [medianAge, setMedianAge] = useState(35);
  const [attendance, setAttendance] = useState(30000);
  const [gameLength, setGameLength] = useState(3); // in hours
  const [selectedState, setSelectedState] = useState('United States');
  const [selectedStadium, setSelectedStadium] = useState(null);
  const [probability, setProbability] = useState(0);
  const [fillPercentage, setFillPercentage] = useState(0);
  
  // Handle stadium selection
  const handleStadiumClick = (stadium) => {
    setSelectedStadium(stadium);
    setSelectedState(stadium.state);
  };
  
  // Create the stadium markers with dot selector
  const renderStadiumMarkers = () => {
    return mlbStadiums.map(stadium => {
      const [x, y] = stadium.coords;
      const isSelected = selectedStadium && selectedStadium.id === stadium.id;
      
      return (
        <span 
          key={stadium.id}
          className={`${styles.stadiumMarker} ${isSelected ? styles.selectedMarker : ''}`}
          style={{ 
            left: `${x}%`, 
            top: `${y}%` 
          }}
          onClick={() => handleStadiumClick(stadium)}
          title={`${stadium.name} - ${stadium.team}`}
        >
          •
        </span>
      );
    });
  };

  // Calculate probability of at least one death
  useEffect(() => {
    // Get the appropriate death rate based on selected state or national average
    let baseRatePer100k = nationalAverageDeathRate; // Default to national average
    
    if (selectedState !== 'United States' && stateDeathRates[selectedState]) {
      baseRatePer100k = stateDeathRates[selectedState];
    }
    
    // Convert from per 100,000 to per 1,000
    const baseRatePer1000 = baseRatePer100k / 100;
    
    // Convert to hourly rate
    const hourlyRatePer1000 = baseRatePer1000 / 8760;
    
    // Adjust for age (simplified model)
    let ageMultiplier = 1;
    if (medianAge < 18) ageMultiplier = 0.2;
    else if (medianAge < 30) ageMultiplier = 0.3;
    else if (medianAge < 45) ageMultiplier = 0.5;
    else if (medianAge < 60) ageMultiplier = 1.2;
    else if (medianAge < 75) ageMultiplier = 3;
    else ageMultiplier = 8;
    
    // Calculate probability for total attendance over game length
    const individualRiskForGameLength = hourlyRatePer1000 * gameLength * ageMultiplier / 1000;
    const probOfNoDeath = Math.pow(1 - individualRiskForGameLength, attendance);
    const probOfAtLeastOneDeath = 1 - probOfNoDeath;
    
    setProbability(probOfAtLeastOneDeath);
    setFillPercentage(Math.min(probOfAtLeastOneDeath * 100, 100));
  }, [medianAge, attendance, gameLength, selectedState]);

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
          
          <div className={styles.stadiumInfo}>
            {selectedStadium ? (
              <div>
                <h3>{selectedStadium.name}</h3>
                <p>{selectedStadium.team} - {selectedStadium.state}</p>
                <button 
                  className={styles.resetButton}
                  onClick={resetToNational}
                >
                  Reset to National Average
                </button>
              </div>
            ) : (
              <p>Select a stadium on the map to calculate location-specific mortality rates</p>
            )}
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
            <li>State-specific mortality rates (varies significantly by location)</li>
          </ul>
          <p>
            The calculation uses state-specific mortality data from CDC (2023), with rates ranging from 
            approximately 600 deaths per 100,000 in Hawaii to over 1,000 per 100,000 in states like 
            Mississippi and West Virginia.
          </p>
          <p>
            Current selected location: <strong>{selectedStadium ? 
              `${selectedStadium.name} (${selectedStadium.state})` : 
              'National Average'}</strong>
          </p>
          <p>
            Mortality rate: <strong>{selectedState === 'United States' ? 
              nationalAverageDeathRate : stateDeathRates[selectedState]} deaths per 100,000 population</strong>
          </p>
        </div>
      </main>
    </div>
  );
}