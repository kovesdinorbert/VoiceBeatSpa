import React from 'react'; 
import { Route, Redirect, RouteProps } from 'react-router-dom'

export interface ICustomRouteProps extends RouteProps {
    isAuthenticated: boolean;
    redirectPath: string;
}
 
export class AuthRoute extends Route<ICustomRouteProps> {
    render () {
      return (
        this.props.isAuthenticated
        ? <Route {...this.props}/>
        // : <></>
        : <Redirect to={{pathname:this.props.redirectPath, state:{from: this.props.location}}} ></Redirect>
      );
    }
  }

  export default AuthRoute