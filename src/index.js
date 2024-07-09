import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  RouterProvider,
} from "react-router-dom";
import "./index.css";
import router from "./AppRouter";

import { PackageProvider } from './context/PackageContext';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
        <PackageProvider>
    <RouterProvider router={router} />
    </PackageProvider>
  </React.StrictMode>
);