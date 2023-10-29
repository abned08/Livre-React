import React, { Suspense, useEffect, useState } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import windowSize from 'react-window-size';
import Navigation from './Navigation';
import NavBar from './NavBar';
import Breadcrumb from './Breadcrumb';
import Configuration from './Configuration';
import Loader from "../Loader";
import routes from "../../../routes";
import Aux from "../../../hoc/_Aux";
import { FULL_SCREEN_EXIT, COLLAPSE_MENU } from "../../../store/reduceSlice";
import i18next from "i18next";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import arLocale from "date-fns/locale/ar-DZ";
import enLocale from "date-fns/locale/en-US";
import frLocale from "date-fns/locale/fr";

//import '../../../app.scss';

const AdminLayout = React.forwardRef((props, ref) => {

    const fullScreenExitHandler = () => {
        if (!document.fullscreenElement && !document.webkitIsFullScreen && !document.mozFullScreen && !document.msFullscreenElement) {
            props.onFullScreenExit();
        }
    };

    const [locale, setLocal] = useState(arLocale);
    const currentLang = i18next.languages[0]

    const { onUNSAFE_componentWillMount } = props
    useEffect(() => {
        if (props.windowWidth > 992 && props.windowWidth <= 1024 && props.layout !== 'horizontal') {
            onUNSAFE_componentWillMount();
        }
        // eslint-disable-next-line
    }, [onUNSAFE_componentWillMount])
    useEffect(() => {
        if (currentLang === "ar")
            setLocal(() => arLocale);
        if (currentLang === "fr")
            setLocal(() => frLocale);
        if (currentLang === "en")
            setLocal(() => enLocale)

    }, [currentLang])

    const mobileOutClickHandler = () => {
        if (props.windowWidth < 992 && props.collapseMenu) {
            props.onUNSAFE_componentWillMount();
        }
    }


    /* full screen exit call */
    document.addEventListener('fullscreenchange', fullScreenExitHandler);
    document.addEventListener('webkitfullscreenchange', fullScreenExitHandler);
    document.addEventListener('mozfullscreenchange', fullScreenExitHandler);
    document.addEventListener('MSFullscreenChange', fullScreenExitHandler);

    const menu = routes.map((route, index) => {
        return (route.component) ? (
            <Route
                key={index}
                path={route.path}
                exact={route.exact}
                name={route.name}
                render={props => (
                    <route.component {...props} />
                )} />
        ) : null;
    });

    let mainClass = ['pcoded-wrapper'];
    if (props.layout === 'horizontal' && props.subLayout === 'horizontal-2') {
        mainClass = [...mainClass, 'container'];
    }

    return (
        <Aux>
            <Fullscreen enabled={props.isFullScreen}>
                <Navigation />
                <NavBar />
                <div className="pcoded-main-container" onClick={() => mobileOutClickHandler}>
                    <div className={mainClass.join(' ')}>
                        <div className="pcoded-content">
                            <div className="pcoded-inner-content">
                                <Breadcrumb />
                                <div className="main-body">
                                    <div className="page-wrapper">
                                        <Suspense fallback={<Loader />}>
                                            <MuiPickersUtilsProvider utils={DateFnsUtils} locale={locale}>
                                                <Switch>
                                                    {menu}
                                                    <Redirect from="/" to={props.defaultPath} />
                                                </Switch>
                                            </MuiPickersUtilsProvider>
                                        </Suspense>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Configuration />
            </Fullscreen>
        </Aux>
    );
});


const mapStateToProps = state => {
    return {
        defaultPath: state.reducerSlice.defaultPath,
        isFullScreen: state.reducerSlice.isFullScreen,
        collapseMenu: state.reducerSlice.collapseMenu,
        layout: state.reducerSlice.layout,
        subLayout: state.reducerSlice.subLayout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreenExit: () => dispatch({ type: FULL_SCREEN_EXIT }),
        onUNSAFE_componentWillMount: () => dispatch({ type: COLLAPSE_MENU })
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(AdminLayout));
