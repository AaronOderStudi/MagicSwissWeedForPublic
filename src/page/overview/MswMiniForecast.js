import * as PropTypes from "prop-types";
import {MswForecastGraph} from "./MswForecastGraph";
import {MswCurrentDataVisualization} from "./MswCurrentDataVisualization";
import {MswLoader} from "./MswLoader";

MswMiniForecast.propTypes = {
  location: PropTypes.any,
  flowAndTempData: PropTypes.any,
  hasFetchedForecast: PropTypes.bool,
  forecastData: PropTypes.any,
  isMobile: PropTypes.bool
};

export function MswMiniForecast(props) {
  let content;
  if(props.hasFetchedForecast) {
    if(props.forecastData) {
      content = <MswForecastGraph location={props.location}
                                  forecastData={props.forecastData}
                                  flowAndTempData={props.flowAndTempData}
                                  isMini={true}
                                  isMobile={props.isMobile}/>;
    } else if(props.flowAndTempData){
      content = <MswCurrentDataVisualization location={props.location}
                                             flowAndTempData={props.flowAndTempData} />;
    }
  } else {
    content = MswLoader();
  }

  let className = "forecastContainer";
  if(props.isMobile) {
    className += " hiddenOnDesktop";
  } else {
    className += " hiddenOnMobile";
  }
  return <>
    <div className={className}>
      <div className="miniGraph">
        {content}
      </div>
    </div>
    </>;
}
