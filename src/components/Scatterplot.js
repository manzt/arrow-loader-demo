import React, { useState } from "react";
import {
  DeckGL,
  ScatterplotLayer,
  OrthographicView,
  COORDINATE_SYSTEM
} from "deck.gl";

const INITIAL_VIEW_STATE = { target: [15916.5, 25880, 0], zoom: -5 };

const Scatterplot = ({ data }) => {
  return (
    <DeckGL
      controller={true}
      initialViewState={INITIAL_VIEW_STATE}
      views={new OrthographicView({ controller: true })}
    >
      <ScatterplotLayer
        id={`scatterplot-${Date.now()}`}
        data={data}
        coordinateSystem={COORDINATE_SYSTEM.IDENTITY}
        getPosition={d => [d.x, d.y]}
        getRadius={10}
      />
    </DeckGL>
  );
};

export default Scatterplot;
