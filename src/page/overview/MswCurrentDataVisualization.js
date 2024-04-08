import * as PropTypes from "prop-types";
import {extractInterestingInformation} from "./MswSpotlist";

export function MswCurrentDataVisualization(props) {
    let {flow} = extractInterestingInformation(props.flowAndTempData, props.location.id);

    let backgroundColor = (flow > props.location.min && flow < props.location.max) ? 'green' : 'red';
    return <>
        <div style={{width: '80%', margin: 'auto', fontWeight: 'normal', color: 'gray'}}>
            {/* min and max labels */}
            <div style={{display: 'flex', height: '25px'}}>
                <div style={{flex: props.location.min}}></div>
                <p>{props.location.min}</p>
                <div style={{flex: (props.location.max-props.location.min)/2}}></div>
                <p>-</p>
                <div style={{flex: (props.location.max-props.location.min)/2}}></div>
                <p>{props.location.max}</p>
                <div style={{flex: props.location.min}}></div>
            </div>

            {/* reference bar where it's good and where it's bad */}
            <div style={{display: 'flex', height: '5px', opacity: '.3'}}>
                <div style={{background: 'red', flex: props.location.min, borderBottomLeftRadius: '3px', borderTopLeftRadius: '3px'}}></div>
                <div style={{background: 'green', flex: props.location.max-props.location.min}}></div>
                <div style={{background: 'red', flex: props.location.min, borderBottomRightRadius: '3px', borderTopRightRadius: '3px'}}></div>
            </div>

            {/* current flow bar */}
            <div style={{display: 'flex', height: '5px'}}>
                <div style={{background: backgroundColor, flex: flow, borderRadius: '3px'}}></div>
                <div style={{flex: (props.location.min + props.location.max)-flow}}></div>
            </div>

            {/* current flow label */}
            <div style={{display: 'flex', height: '25px'}}>
                <div style={{flex: flow, borderRadius: '3px'}}></div>
                <p>{flow}</p>
                <div style={{flex: (props.location.min + props.location.max)-flow}}></div>
            </div>
        </div>
    </>;
}

MswCurrentDataVisualization.propTypes = {
    currentFlow: PropTypes.any,
    location: PropTypes.any
};