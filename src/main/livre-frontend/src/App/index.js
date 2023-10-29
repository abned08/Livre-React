import React, {Suspense, useEffect} from 'react';
import {Switch, Route} from 'react-router-dom';
import Loadable from 'react-loadable';
import Loader from './layout/Loader'
import Aux from "../hoc/_Aux";
import ScrollToTop from './layout/ScrollToTop';
import routes from "../route";
import {ThemeProvider} from "@material-ui/styles";
import {createTheme} from "@material-ui/core";
import themes from "devextreme/ui/themes";
import {useSelector} from "react-redux";
import pink from "@material-ui/core/colors/pink";

const AdminLayout = Loadable({
    loader: () => import('./layout/AdminLayout'),
    loading: Loader
});

const App =  () => {

    const layoutType = useSelector(state => state.reducerSlice.layoutType);
    const theme = createTheme({
        palette: {
            type: layoutType === "dark" ? "dark" : "light",
            primary: {
                light: '#757ce8',
                main: '#2d6dfc',
                dark: '#002884',
                contrastText: '#fff'
            },
            secondary: pink,
        },
        typography:{
            fontFamily:["Noto Kufi Arabic", "Open Sans", "sans-serif" ]
        }
    });
    useEffect( () => {
        themes.current(layoutType === "dark" ? "material.blue.dark" : "material.blue.light");
    }, [layoutType]);


    const menu = routes.map((route, index) => {
        return (route.component) ? (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                    <route.component {...props}/>
                )}/>
        ) : null;
    });
    return (
        <ThemeProvider theme={theme}>
            <Aux>
                <ScrollToTop>
                        <Suspense fallback={<Loader/>}>
                            <Switch>
                                {menu}
                                <Route path="/" component={AdminLayout}/>
                            </Switch>
                        </Suspense>
                </ScrollToTop>
            </Aux>
        </ThemeProvider>
    )
};

export default App
