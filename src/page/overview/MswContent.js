import {useState} from "react";
import {getCollapsibleIcon, SpotList} from "./MswSpotlist";
import {bungee_locations, river_locations} from "../../locations";

export function MswContent(props) {
    const parameters = ["flow", "temperature"];

    const [flowAndTempData, setFlowAndTempFlowAndTempData] = useState(null);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        let fetch_url = constructFetchUrlForFlowAndTemp();
        try {
            const response = await fetch(fetch_url);
            setFlowAndTempFlowAndTempData(await response.json());
            setError(null);
        } catch (err) {
            setError(err.message);
            setFlowAndTempFlowAndTempData(null);
        }
    };

    if(!flowAndTempData) {
        fetchData().then(() => console.log("Refreshed measurements!"));
    }

    return <>
        {error? <MswFetchContentError/> : <MswContentData includeSecretSpots={props.includeSecretSpots} />}
    </>;

    function constructFetchUrlForFlowAndTemp() {
        // var fetch_url =
        // "https://api.existenz.ch/apiv1/hydro/latest?locations=2018&parameters=flow%2C%20temperature&app=MagicSwissWeed&version=0.1.0";
        let fetch_url = "https://api.existenz.ch/apiv1/hydro/latest?";

        // add variables to fetch_url
        fetch_url +=
            "locations=" +
            river_locations
                .concat(bungee_locations)
                .map(({id}) => id)
                .join("%2C");
        fetch_url += "&parameters=" + parameters.join("%2C");
        const appVersion = require("../../../package.json").version;
        fetch_url += "&app=MagicSwissWeed&version=" + appVersion;
        return fetch_url;
    }

    function MswContentData(props) {
        return <div className="surfspots">
            <div className="riversurf">
                {getSpotListIncludingTitle("Riversurf", river_locations, props.includeSecretSpots)}
            </div>
            <div className="bungeesurf">
                {getSpotListIncludingTitle("Bungeesurf", bungee_locations, props.includeSecretSpots)}
            </div>
        </div>;

        function getSpotListIncludingTitle(title, locations, includeSecretSpots) {
            let filteredLocations = locations
                .filter((location) => includeSecretSpots || !location.isSecret)

            let tableHeader = <div className="tableHeaderContainer hiddenOnMobile">
                <div className="tableHeader hiddenOnMobile">
                    <div className="tableHeaderCol">Name</div>
                    <div className="tableHeaderCol">Flow/Temp</div>
                    <div className="tableHeaderCol doubleCol">Forecast</div>
                </div>
                {/* only to have the same columns as in the spots */}
                {getCollapsibleIcon(true)}
            </div>;

            return <div className="spotsContainer">
                <h2>{title}</h2>
                {tableHeader}
                <SpotList flowAndTempData={flowAndTempData}
                          locations={filteredLocations}/>
            </div>;
        }
    }

    function MswFetchContentError() {
        return <div>
            {`There is a problem fetching the latest measurements - ${error} `}
            <p>
                Try again later or report the problem via the feedback form linked
                below.
            </p>
        </div>;
    }
}