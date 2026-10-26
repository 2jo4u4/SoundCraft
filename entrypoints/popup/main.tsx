import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { Store } from "../../utils";

const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  Store.getAll().then(storeData => {
    root.render(
      <React.StrictMode>
        <App storeData={storeData} />
      </React.StrictMode>
    );
  });
}
