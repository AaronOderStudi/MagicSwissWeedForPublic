import {MswMiniForecast} from "./MswMiniForecast";
import {MswForecastGraph} from "./MswForecastGraph";
import {useEffect, useState} from "react";
import arrow_down from "./assets/arrow_down.png";
import {LoadingMeasurements, Measurements} from "./MswMeasurements";

let forecastDataMap = new Map();

function spotContainer(name, summaryContent, collapsibleContent) {
  return <>
    <details key={name} className="spot">
      <summary className="spotname">
        {summaryContent}
      </summary>
      {collapsibleContent}
    </details>
  </>;
}

export function getCollapsibleIcon(isHidden) {
  let className = "collapsibleIcon hiddenOnMobile";
  if(isHidden === true) {
    className += " hide";
  }
  return <>
        <span className={className}>
          <img alt="extend forecast" src={arrow_down}/>
        </span>
  </>;
}

function getSpotSummaryContent(location, flowAndTempData, hasFetchedForecast, forecastData) {
  let link = "https://www.hydrodaten.admin.ch/de/seen-und-fluesse/stationen-und-daten/" + location.id;

  let measurement = <LoadingMeasurements />
  if(flowAndTempData) {
    let {flow, temp, lastFlowMeasurementTimestamp} = extractInterestingInformation(flowAndTempData, location.id);
    measurement = <Measurements location={location}
                  lastFlowMeasurementTimestamp={lastFlowMeasurementTimestamp}
                  flow={flow}
                  temp={temp}/>
  }

  let forecast = getForecastsWith2ClassesSwitchableByScreenSize()

  return <>
    <div className="spotContainer">
      <a href={link} target="_blank" rel="noreferrer">
        {location.name}
      </a>
      {measurement}
      {forecast}
    </div>
    {getCollapsibleIcon(!forecastData)}
  </>

  function getForecastsWith2ClassesSwitchableByScreenSize() {
    return <>
      {getForecast(true)}
      {getForecast(false)}
    </>;

    function getForecast(isMobile) {
      return <MswMiniForecast
          location={location}
          flowAndTempData={flowAndTempData}
          hasFetchedForecast={hasFetchedForecast}
          forecastData={forecastData}
          isMobile={isMobile}/>;
    }
  }
}

function Spot(location, flowAndTempData) {
  const [forecastData, setForecastData] = useState(forecastDataMap.get(location.id));
  const [hasFetchedForecast, setHasFetchedForecast] = useState(forecastDataMap.get(location.id) !== undefined);

  const fetchForecastData = async(locationId) => {
    if(!forecastDataMap.get(locationId)) {
      let fetch_url = `https://europe-west6-windy-anchor-328011.cloudfunctions.net/msw_forecast?locationId=${locationId}`;
      try {
        const response = await fetch(fetch_url);
        let responseData = await response.json();
        if (!responseData.plot) {
          throw new Error(
              `This is an HTTP error: The status is ${response.status}`
          );
        }
        setForecastData(responseData.plot);
        forecastDataMap.set(locationId, responseData.plot);
      } catch (err) {
        setForecastData(null);
      }
      setHasFetchedForecast(true);
    } else {
      setForecastData(forecastDataMap.get(locationId));
      setHasFetchedForecast(true);
    }
  };

  // empty deps array is here to make sure useEffect is only called once. Maybe there's a better way to do this
  useEffect(() => {
    fetchForecastData(location.id).then(() => console.log("forecast data fetched for " + location.name));
  }, []);

  let collapsibleContent = <></>
  if(forecastData && location) {
    collapsibleContent = <>
      <div className="collapsibleContent hiddenOnMobile">
        <h2>Forecast</h2>
        <MswForecastGraph location={location} forecastData={forecastData} flowAndTempData={flowAndTempData} />
      </div>
    </>;
  }

  let summaryContent = getSpotSummaryContent(location, flowAndTempData, hasFetchedForecast, forecastData);

  return spotContainer(location.name, summaryContent, collapsibleContent);
}

export function extractInterestingInformation(flowAndTempData, id) {
  let flow = null;
  let temp = null;
  let lastFlowMeasurementTimestamp = null;

  if(flowAndTempData) {
    flow = flowAndTempData.payload.find(
        ({loc, par}) => loc === id && par === "flow"
    );
    temp = flowAndTempData.payload.find(
        ({loc, par}) => loc === id && par === "temperature"
    );

    if (flow !== undefined) {
      lastFlowMeasurementTimestamp = flow.timestamp;
      flow = flow.val;
    }
    if (temp !== undefined) {
      temp = temp.val;
    }
  }
  flow = Math.round(flow);
  temp = Math.round(temp);
  return {flow, temp, lastFlowMeasurementTimestamp};
}

export function SpotList(props) {
  return (
    <div className="spotlist">
      {props.locations.map((location) => Spot(location, props.flowAndTempData))}
    </div>
  );
}
