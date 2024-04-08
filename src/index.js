import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {MswOverviewPage} from "./page/overview/MswOverviewPage";
import {Secret} from "./page/secret/Secret";

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<MswOverviewPage />} />
                <Route path="/secret/spots/gahtdinuetaa" element={<Secret />} />
            </Routes>
        </BrowserRouter>
    );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
