import moment from "moment/moment";
import {MswLoader} from "./MswLoader";

const measurementClass = "measurements";

export function LoadingMeasurements() {
    return <>
        <div className={measurementClass}>
            {MswLoader()}
        </div>
    </>;
}

export function Measurements(props) {
    let flow_color = flow2color(props.flow, props.location);
    return <>
        <div className={measurementClass}>
            {/* first row */}
            <div className="timestamp">
                {moment(props.lastFlowMeasurementTimestamp*1000).format("HH:mm")}
            </div>
            {/* second row */}
            <div className="flow meas">
                <div className={flow_color}>{props.flow}</div>
                <div className="unit">
                    m<sup>3</sup>/s
                </div>

                {/* add warning sign if flow reaches dangerous levels */}
                {flow_color === "flow_danger" && (
                    <div
                        className="danger"
                        title="Moderate flood danger, be careful!"
                    >
                        &ensp; ⚠️
                    </div>
                )}
            </div>
            {/* third row */}
            <div className={isNaN(props.temp)? "noDisplay" : "temp meas"}>
                <div className={temp2color(props.temp)}>{props.temp}</div>
                <div className="unit">°C</div>
            </div>
        </div>
    </>;
}

function flow2color(_flow, _location) {
    if (_flow < _location.min) {
        return "flow_bad";
    }
    if (_flow < _location.optimum) {
        return "flow_ok";
    }
    // check if it's a riversurf location
    if ("max" in _location) {
        if (_flow < _location.optimum_max) {
            return "flow_good";
        }
        if (_flow < _location.max) {
            return "flow_ok";
        }
        if (_flow < _location.danger) {
            return "flow_bad";
        }
    } else if (_flow < _location.danger) {
        return "flow_good";
    }
    return "flow_danger";
}

function temp2color(_temp) {
    if (_temp < 8) {
        return "temp_0";
    }
    if (_temp < 13) {
        return "temp_1";
    }
    if (_temp < 18) {
        return "temp_2";
    }
    if (_temp < 23) {
        return "temp_3";
    }
    return "temp_4";
}