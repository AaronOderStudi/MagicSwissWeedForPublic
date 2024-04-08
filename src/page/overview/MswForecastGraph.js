import {
    LineChart,
    Line,
    CartesianGrid,
    XAxis,
    YAxis,
    ReferenceArea,
    ResponsiveContainer,
    Tooltip,
    Legend,
    ReferenceLine,
    Label
} from 'recharts';
import moment from "moment";
import PropTypes from "prop-types";
import {extractInterestingInformation} from "./MswSpotlist";

MswForecastGraph.propTypes = {
    location: PropTypes.any,
    flowAndTempData: PropTypes.any,
    isMini: PropTypes.bool,
    isMobile: PropTypes.bool
}

export function MswForecastGraph(props) {
    function normalizeData(forecastData) {
        let normalizedData = [];
        for(let curveIndex = 0; curveIndex < forecastData.data.length; curveIndex++) {
            let foreCastCurve = forecastData.data[curveIndex];
            for(let curveDatapointIndex = 0; curveDatapointIndex < foreCastCurve.x.length; curveDatapointIndex++) {
                let obj = {};
                obj["datetime"] = moment(foreCastCurve.x[curveDatapointIndex]).valueOf();
                obj["forecastFlow" + curveIndex] = foreCastCurve.y[curveDatapointIndex]
                normalizedData.push(obj);
            }
            if(props.flowAndTempData && curveIndex === 4) {
                let {flow, _, lastFlowMeasurementTimestamp} = extractInterestingInformation(props.flowAndTempData, props.location.id);
                let obj = {};
                obj["datetime"] = lastFlowMeasurementTimestamp*1000;
                obj["forecastFlow" + curveIndex] = flow
                normalizedData.push(obj);
            }
        }
        return normalizedData;
    }

    if(props.forecastData == null || props.location == null) {
        return <>
            <div>Detailed Forecast not possible at the moment...</div>
        </>
    }

    let normalizedGraphData = normalizeData(props.forecastData);

    const from = normalizedGraphData[0].datetime;
    const to = normalizedGraphData[normalizedGraphData.length-1].datetime;
    let firstDayMidnight = new Date(from).setHours(0, 0, 0, 1);
    let firstDayMidnightDate = new Date(firstDayMidnight);
    const ticks = [
        firstDayMidnight,
        firstDayMidnightDate.setHours(24, 0, 0, 0),
        firstDayMidnightDate.setHours(24, 0, 0, 0),
        firstDayMidnightDate.setHours(24, 0, 0, 0),
        firstDayMidnightDate.setHours(24, 0, 0, 0),
        firstDayMidnightDate.setHours(24, 0, 0, 0)
    ]

    let showXAxis = true;
    let showMinMaxReferenceLines = true;
    let showTooltip = true;
    let showYAxis = true;
    let showLegend = true;


    if(props.isMobile === true) {
        showYAxis = false;
        showLegend = false;
    } else if(props.isMini === true) {
        showXAxis = false;
        showMinMaxReferenceLines = false;
        showTooltip = false;
        showYAxis = false;
        showLegend = false;
    }

    function getMinMaxReferenceLines() {
        return <>
            <ReferenceLine y={props.location.min}>
                <Label value={props.location.min} position="insideRight"/>
            </ReferenceLine>
            <ReferenceLine y={props.location.max}>
                <Label value={props.location.max} position="insideRight"/>
            </ReferenceLine>
        </>;
    }

    function getTooltip() {
        return <Tooltip labelFormatter={v => moment(v).format("DD.MM. hh:00")}/>;
    }

    function getYAxis() {
        return <YAxis/>;
    }

    function getLegend() {
        return <Legend
            payload={[
                {type: "line", value: "Gemessen", color: "green"},
                {type: "line", value: "25.-75. Perzentil", color: "blue"},
                {type: "line", value: "Median", color: "orange"},
            ]}
        />;
    }

    return <>
        <ResponsiveContainer className="forecastGraph" width="100%" aspect={2}>
            <LineChart data={normalizedGraphData} ticks={1}>
                <ReferenceArea y1={props.location.min} y2={props.location.max} ifOverflow="extendDomain" fill="green"/>
                <ReferenceLine x={Date.now()} stroke="orange"/>
                <Line type="monotone"
                      dataKey="forecastFlow2"
                      stroke="blue"
                      dot={false}
                      name={props.forecastData.data[2].name}/>
                <Line type="monotone"
                      dataKey="forecastFlow3"
                      stroke="orange"
                      dot={false}
                      name={props.forecastData.data[3].name}/>
                <Line type="monotone"
                      dataKey="forecastFlow4"
                      stroke="green"
                      dot={false}
                      name={props.forecastData.data[4].name}/>
                <CartesianGrid/>
                <XAxis
                    type="number"
                    dataKey="datetime"
                    domain={[from, to]}
                    scale="time"
                    ticks={ticks}
                    tickFormatter={v => moment(v).format("DD") + "."}
                    minTickGap={1}
                    hide={!showXAxis}/>

                {showMinMaxReferenceLines && getMinMaxReferenceLines()}
                {showTooltip && getTooltip()}
                {showYAxis && getYAxis()}
                {/* payload is only necessary to get rid of unneccessary double legend entry because forecastFlow0 and forecastFlow1 are both named Min/Max */}
                {showLegend && getLegend()}
            </LineChart>
        </ResponsiveContainer>
    </>
}