import "../../App.css";
import {MswContent} from "./MswContent";

export function MswOverviewPage(props) {
    function MswHeader() {
        return <>
            <header className="App-header">
                <div className="title">
                    <h1>MagicSwissWeed</h1>
                    <p>Current surfing conditions in Switzerland</p>
                </div>
            </header>
        </>;
    }

    function MswFooter() {
        return <>
            <footer>
                <div className="Footer">
                    <div className="Footer_item">
                        Source:{" "}
                        <a className="Link" href="https://www.hydrodaten.admin.ch">
                            BAFU
                        </a>
                    </div>
                    <div className="Footer_item wide">
                        © 2023 Academic Surf Club Switzerland
                    </div>
                    <div className="Footer_item">
                        <a
                            className="Link"
                            href="https://github.com/nkueng/MagicSwissWeed/issues"
                        >
                            Feedback
                        </a>
                    </div>
                </div>
            </footer>
        </>;
    }

// return HTML including state variables computed above for displaying
    return (
        <div className="App">
            <MswHeader/>
            <MswContent includeSecretSpots={props.includeSecretSpots}/>
            <MswFooter/>
        </div>
    );
}
