import React from 'react';
import { useSelector } from 'react-redux';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({children , ...rest}) => {

    const auth = useSelector(state => state.auth)

    return (
        <Route
            {...rest}
            render={() =>
                auth.token ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: "/login",
                            }}
                        />
                    )
            }
        />
    );
};

export default PrivateRoute;