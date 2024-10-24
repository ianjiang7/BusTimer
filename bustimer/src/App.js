import './App.css';
import { useEffect, useState } from 'react';

function App() {
  // State variables
  const [inputTime, setInputTime] = useState("6:00");
  const [targetTime, setTargetTime] = useState("");
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      if (targetTime && !showAlert) {
        const currentTime = new Date();
        const targetDate = new Date(targetTime);

        if (currentTime >= targetDate) {
          alert("Time reached!");
          setShowAlert(true); // Set alert flag
        }
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [targetTime, showAlert]);

  // Function to fetch bus data and find the closest time
  const fetchData = async (givenTime) => {
    try {
      const response = await fetch(
        "https://bustime.mta.info/api/siri/stop-monitoring.json?key=d66294e3-5fe2-4bcb-91c8-a13515006ed5&OperatorRef=MTA&MonitoringRef=403913&LineRef=MTA+NYCT_M101"
       ,{mode:"no-cors"});
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const stopVisits = data.Siri.ServiceDelivery.StopMonitoringDelivery[0].MonitoredStopVisit;

      let timeList = [];
      for (const visit of stopVisits) {
        timeList.push(visit.MonitoredVehicleJourney.MonitoredCall.ExpectedArrivalTime);
      }
      console.log(timeList, givenTime);
      return getClosestTimeBefore(givenTime, timeList);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // ChatGPT function to find the closest time before the given time
  function getClosestTimeBefore(givenTime, timeList) {
    const givenDate = new Date(`1970-01-01T${givenTime}:00`);

    const validTimes = timeList
      .map(time => new Date(`1970-01-01T${time}:00`))
      .filter(time => time <= givenDate);

    if (validTimes.length === 0) {
      return null;
    }

    const closestTime = new Date(Math.max(...validTimes));

    const hours = closestTime.getHours().toString().padStart(2, '0');
    const minutes = closestTime.getMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
  }

  // Handle time input change
  const handleTimeChange = (event) => {
    setInputTime(event.target.value);
  };

  // Handle form submit and timer setting
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (inputTime) {
      const bustime = await fetchData(inputTime); // Await the result from fetchData
      if (bustime) {
        const now = new Date();
        const [hours, minutes] = bustime.split(":").map(Number);
        const target = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes - 5);

        if (new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes) < now) {
          setTargetTime(target);
          setShowAlert(false); // Reset alert flag
        } else {
          alert("The time must be in the future.");
        }
      } else {
        alert("No bus times found.");
      }
    }
  };
  /* ChatGPT generated*/
  return (
    <div style={{ padding: "20px" }}>
      <h2>Select a Time</h2>
      <form onSubmit={handleSubmit}>
        {/* Time input */}
        <input
          type="time"
          value={inputTime}
          onChange={handleTimeChange}
          style={{ fontSize: "16px", padding: "5px", marginRight: "10px" }}
        />
        <button type="submit" style={{ fontSize: "16px", padding: "5px" }}>
          Submit
        </button>
      </form>
      {/* Display the selected and target time */}
      <p>Selected Time: {inputTime}</p>
      <p>Next Bus to Catch: {targetTime && new Date(targetTime).toLocaleTimeString()}</p>
    </div>
  );
}

export default App;
