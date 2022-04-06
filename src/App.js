import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Files from "./Pages/Files";
import Ibox from "./Pages/Ibox";
import Header from "./Components/Header";
import { ToastContainer, Flip } from "react-toastify";
import { StoreProvider } from "./StoreContext";
import { BrowserRouter, Navigate } from "react-router-dom";
import Routing from "./Routes/routes";
function App() {
  return (
    <StoreProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={true}
        transition={Flip}
      />
      <BrowserRouter>
        <Header />
        <Routing />
      </BrowserRouter>
    </StoreProvider>
  );
}

export default App;
