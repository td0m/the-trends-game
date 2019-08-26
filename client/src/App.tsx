import React from "react";
import { Switch, BrowserRouter, Route } from "react-router-dom";

import RoomPage from "./pages/RoomPage";
import RoomsPage from "pages/RoomsPage";

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/sign-in" exact component={RoomsPage} />
        <Route path="/rooms" exact component={RoomsPage} />
        <Route path="/rooms/:roomId" exact component={RoomPage} />
      </Switch>
    </BrowserRouter>
  );
};

export default App;
