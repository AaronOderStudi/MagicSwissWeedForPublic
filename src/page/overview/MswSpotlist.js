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
      // explanation:
      // - This fetch-url is used to fetch the forecast data.
      // - unfortunately we can't fetch the forecast data directly from "https://www.hydrodaten.admin.ch/plots/q_forecast/" + locationId + "_q_forecast_de.json", because they protected their API using CORS
      // - But a backend (or a cloud function can fetch the data from there)
      // - therefore we call a cloud function that fetches and returns the data for us.
      // let fetch_url = `https://europe-west6-windy-anchor-328011.cloudfunctions.net/msw_forecast?locationId=${locationId}`;
      // TODO: use different fetch_url with your own backend.
      //  You can use this one for some local testing, but please don't use it productively and make one on your own,
      //  as it's now running in a cloud function on GCP which costs me per use...
      //  My Cloud-Function looks like this:
            // package gcfv2;
            //
            // import com.google.cloud.functions.HttpFunction;
            // import com.google.cloud.functions.HttpRequest;
            // import com.google.cloud.functions.HttpResponse;
            // import java.io.BufferedReader;
            // import java.io.InputStreamReader;
            // import java.net.HttpURLConnection;
            // import java.net.URL;
            // import java.util.logging.Logger;
            //
            // public class HelloHttpFunction implements HttpFunction {
            //   private static final Logger logger = Logger.getLogger(HelloHttpFunction.class.getName());
            //
            //   @Override
            //   public void service(final HttpRequest request, final HttpResponse response) throws Exception {
            //      String locationId = request.getFirstQueryParameter("locationId").orElse("");
            //         logger.info(locationId);
            //         String urlStr = "https://www.hydrodaten.admin.ch/plots/q_forecast/" + locationId + "_q_forecast_de.json";
            //
            //         URL url = new URL(urlStr);
            //         HttpURLConnection con = (HttpURLConnection) url.openConnection();
            //         con.setRequestMethod("GET");
            // 				con.setRequestProperty("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0");
            //
            //
            //         int responseCode = con.getResponseCode();
            //         logger.info("GET Response Code :: " + responseCode);
            //
            // 				response.appendHeader("Access-Control-Allow-Origin", "*");
            //         if (responseCode == HttpURLConnection.HTTP_OK) { // success
            //             BufferedReader in = new BufferedReader(new InputStreamReader(con.getInputStream()));
            //             String inputLine;
            //             StringBuffer data = new StringBuffer();
            //
            //             while ((inputLine = in.readLine()) != null) {
            //                 data.append(inputLine);
            //             }
            //             in.close();
            //
            //             logger.info("inside end");
            //             response.getWriter().write(data.toString());
            //         } else {
            //             logger.info("GET request didn't work");
            //             response.setStatusCode(HttpURLConnection.HTTP_INTERNAL_ERROR);
            //             response.getWriter().write("Error: GET request didn't work");
            //         }
            //   }
            // }

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
