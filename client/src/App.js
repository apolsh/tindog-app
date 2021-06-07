import React, {useState} from "react";
import {useRoutes} from "./routes";
import {BrowserRouter as Router} from "react-router-dom";
import ErrorDialog from "./dialogs/ErrorDialog";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/AuthContext";
import Loader from "./components/Loader";

function App() {

  const [errorIsOpen, setErrorIsOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const {token, userId, login, logout, ready} = useAuth();
  const isAuthenticated = !!token;

  const onError = (message) => {
      setErrorIsOpen(true);
      setErrorMessage(message || "Неизвестная ошибка")
    };

  const onErrorClose = () => {
      setErrorIsOpen(false);
  }

    const routes = useRoutes(isAuthenticated , onError);
    //const routes = useRoutes(true , onError);

    if(!ready){
        return <Loader/>
    }

  return (
      <AuthContext.Provider value={{
          login, logout, userId, token,isAuthenticated
      }}>
          <ErrorDialog isOpen={errorIsOpen} message={errorMessage} onClose={onErrorClose}/>
          <Router>
              <div>
                  {routes}
              </div>
          </Router>
      </AuthContext.Provider>
  );
}

export default App;
