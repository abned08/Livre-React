import React, {Component} from 'react';
import {connect} from 'react-redux';
import windowSize from 'react-window-size';
import NavLeft from "./NavLeft";
import NavRight from "./NavRight";
import Aux from "../../../../hoc/_Aux";
import DEMO from "../../../../store/constant";
import {COLLAPSE_MENU} from "../../../../store/reduceSlice";
import logo from '../../../../assets/images/logo2.png';
import ReactTooltip from 'react-tooltip';

class NavBar extends Component {
    state = {
        rightToggle: false
    }

    render() {
        let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', 'header-blue'];

        document.body.classList.remove('background-blue');
        document.body.classList.remove('background-red');
        document.body.classList.remove('background-purple');
        document.body.classList.remove('background-info');
        document.body.classList.remove('background-green');
        document.body.classList.remove('background-dark');

        document.body.classList.remove('background-grd-blue');
        document.body.classList.remove('background-grd-red');
        document.body.classList.remove('background-grd-purple');
        document.body.classList.remove('background-grd-info');
        document.body.classList.remove('background-grd-green');
        document.body.classList.remove('background-grd-dark');

        document.body.classList.remove('background-img-1');
        document.body.classList.remove('background-img-2');
        document.body.classList.remove('background-img-3');
        document.body.classList.remove('background-img-4');
        document.body.classList.remove('background-img-5');
        document.body.classList.remove('background-img-6');
        document.body.classList.add(this.props.headerBackColor);

        if (this.props.headerFixedLayout) {
            headerClass = [...headerClass, 'headerpos-fixed'];
        }

        let toggleClass = ['mobile-menu'];
        if (this.props.collapseMenu) {
            toggleClass = [...toggleClass, 'on'];
        }

        let mainLogo = logo;

        let navHtml;
        if(!this.state.rightToggle && this.props.windowWidth < 992) {
            navHtml = ''
        } else {
            navHtml = (
                <div className="collapse navbar-collapse d-flex">
                    <NavLeft/>
                    <NavRight rtlLayout={this.props.rtlLayout} />
                </div>
            );
        }

        let navBar = (
            <Aux>
                <div className="m-header">
                    <div style={{cursor:'pointer'}} className={toggleClass.join(' ')} id="mobile-collapse1" onClick={this.props.onToggleNavigation}><span/></div>
                    <a data-tip="Developed and Designed by<br/>Aboubaker Nedjimi<br/>abned08@gmail.com"
                       data-iscapture="true"
                       href={DEMO.BLANK_LINK} className="b-brand">
                        <img id="main-logo" src={mainLogo} alt="" className="logo" />
                    </a>
                    <ReactTooltip place="bottom" type="dark" effect="float" multiline={true} border={true}/>
                    <a className="mob-toggler" href={DEMO.BLANK_LINK} onClick={() => this.setState(prevState => {return {rightToggle: !prevState.rightToggle}})}><i className="feather icon-more-vertical"/></a>
                </div>
                {navHtml}
            </Aux>
        );

        if (this.props.layout === 'horizontal' && this.props.subLayout === 'horizontal-2') {
            navBar = (
                <div className="container">
                    {navBar}
                </div>
            );
        }

        return (
            <Aux>
                <header className={headerClass.join(' ')}>
                    {navBar}
                </header>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        rtlLayout: state.reducerSlice.rtlLayout,
        headerBackColor: state.reducerSlice.headerBackColor,
        headerFixedLayout: state.reducerSlice.headerFixedLayout,
        collapseMenu: state.reducerSlice.collapseMenu,
        layout: state.reducerSlice.layout,
        subLayout: state.reducerSlice.subLayout
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onToggleNavigation: () => dispatch({type: COLLAPSE_MENU}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (windowSize(NavBar));
