import React from "react";
import { DndProvider } from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";
import Header from "./components/Header";
import Homepage from "./pages/Homepage";


const App = () => {
    return (
        <DndProvider backend={HTML5Backend}>
            <Header />
            <Homepage />
        </DndProvider>
    );
};

export default App;