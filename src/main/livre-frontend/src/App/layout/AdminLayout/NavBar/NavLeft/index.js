import React, {Component} from 'react';
import {connect} from 'react-redux';
import windowSize from 'react-window-size';

import NavSearch from './NavSearch';
import Aux from "../../../../../hoc/_Aux";
import {FULL_SCREEN} from "../../../../../store/reduceSlice";

class NavLeft extends Component {

    render() {
        return (
            <Aux>
                <ul className="navbar-nav mr-auto">
                    <li className="nav-item"><NavSearch/></li>
                </ul>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        isFullScreen: state.reducerSlice.isFullScreen,
        rtlLayout: state.reducerSlice.rtlLayout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onFullScreen: () => dispatch({type: FULL_SCREEN}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(windowSize(NavLeft));
