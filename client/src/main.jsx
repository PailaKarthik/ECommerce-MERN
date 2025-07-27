import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import { Provider } from "react-redux";
import { Toaster } from "./components/ui/sonner";
import store from "./store/store";
import Maintenance from "./Maintanance";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
      {/* <Maintenance /> */}
      <Toaster/>
    </Provider>
  </BrowserRouter>
);