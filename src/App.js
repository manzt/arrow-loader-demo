import React, { useState, useEffect } from "react";
import { Table } from "apache-arrow";
import Scatterplot from "./components/Scatterplot";

//
import { ArrowLoader, ArrowWorkerLoader } from "@loaders.gl/arrow";
import { load } from "@loaders.gl/core";

const ARROW_DATA_URL =
  "https://gist.githubusercontent.com/manzt/" +
  "ad8c2fe8063b03461b5480ba45f292d6/raw/" +
  "ef89111fe3c352913f277397150d6226e344b29d/" +
  "linnarsson.molecules.arrow";

const JSON_DATA_URL =
  "https://s3.amazonaws.com/vitessce-data/" +
  "0.0.18/reorganize_folders/" +
  "linnarsson/" +
  "linnarsson.molecules.json";

async function fetchArrow() {
  const buffer = await fetch(ARROW_DATA_URL).then(res => res.arrayBuffer());
  const data = await Table.from([new Uint8Array(buffer)]);
  return data;
}

async function fetchJson() {
  const data = await fetch(JSON_DATA_URL).then(res => res.json());
  return data;
}

// deck gl loader doesn't support latest arrow format
// https://github.com/uber-web/loaders.gl/issues/531
async function deckLoader() {
  const data = await load(ARROW_DATA_URL, ArrowLoader);
  // const data = await load(ARROW_DATA_URL, ArrowWorkerLoader);
  return data;
}

async function consoleTimer(label, asyncFn) {
  console.time(label);
  let data = await asyncFn();
  console.timeEnd(label);
  console.log(label, data);
  return data;
}

const App = () => {
  const [data, setData] = useState({});
  const [allLoaded, setAllLoaded] = useState(false);

  async function timeAndLoad() {
    const arrow = await consoleTimer("arrow", fetchArrow);
    const json = await consoleTimer("JSON", fetchJson);
    setData(arrow);
    setAllLoaded(true);
  }

  useEffect(() => {
    timeAndLoad();
  }, []);

  return (
    <div>
      {allLoaded ? (
        <>
          <p>Data fetched and parsed. Check console for details.</p>
          <Scatterplot data={data} />
        </>
      ) : (
        <p>Fetching Arrow and JSON...</p>
      )}
    </div>
  );
};

export default App;
