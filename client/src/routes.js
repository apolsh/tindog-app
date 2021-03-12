import React from "react";
import {Switch, Route, Redirect} from "react-router-dom";
import UserProfilePage from "./pages/UserProfilePage";
import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";


export const useRoutes = (isAuthenticated, onError) => {
    if(isAuthenticated){
        return (
            <Switch>
                <Route path="/profile" exact>
                    <UserProfilePage onError={onError} />
                </Route>
                <Route path="/main" exact>
                    <MainPage onError={onError} />
                </Route>
                <Redirect to="/main" onError={onError}/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <LoginPage onError={onError}/>
            </Route>
            <Route path="/register" exact>
                <RegisterPage onError={onError}/>
            </Route>
            <Redirect to="/"/>
        </Switch>
    )
}