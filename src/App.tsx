import "bootstrap/dist/css/bootstrap.min.css";
import "./components/Sidebar.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import Home from "./pages/Home";
import Sidebar from "./components/Sidebar";
import Vista2 from "./pages/Vista2";
import Vista1 from "./pages/Vista1";

function App() {
  const client = new ApolloClient({
    uri: "https://countries.trevorblades.com/",
    cache: new InMemoryCache(),
  });

  return (
    <>
      <ApolloProvider client={client}>
        <Router>
          <div className="contenedor">
            <Sidebar />

            <main>
              <Routes>
                <Route path="/home" element={<Home />}></Route>
                <Route path="/vista1" element={<Vista1 />}></Route>
                <Route path="/vista2" element={<Vista2 />}></Route>
              </Routes>
            </main>
          </div>
        </Router>
      </ApolloProvider>
    </>
  );
}

export default App;
