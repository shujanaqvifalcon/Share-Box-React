import Header from "./Components/Header";
import { ToastContainer, Flip } from "react-toastify";
import { StoreProvider } from "./StoreContext";
import { BrowserRouter } from "react-router-dom";
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
