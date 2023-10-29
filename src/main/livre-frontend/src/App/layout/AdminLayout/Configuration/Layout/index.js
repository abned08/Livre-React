import React, {Component} from 'react';
import {connect} from 'react-redux';

import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";
import {LAYOUT_TYPE,RESET} from "../../../../../store/reduceSlice";
import {withTranslation} from "react-i18next";

class Layout extends Component {
    render () {
        const {t}=this.props
        let layoutOption = '';
        layoutOption = (
            <div>
                <h6 className='text-dark'>{t('Themes')}</h6>
                <div className="theme-color layout-type">
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {
                        this.props.onChangeLayoutType('menu-dark')
                        e.preventDefault()
                    }} title={t("Default Layout")} className={this.props.layoutType === 'menu-dark' ? 'active' : ''} data-value="menu-dark"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {
                        this.props.onChangeLayoutType('menu-light')
                        e.preventDefault()
                    }} title={t("Light")} className={this.props.layoutType === 'menu-light' ? 'active' : ''} data-value="menu-light"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {
                        this.props.onChangeLayoutType('dark')
                        e.preventDefault()
                    }} title={t("Dark")} className={this.props.layoutType === 'dark' ? 'active' : ''} data-value="dark"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {
                        this.props.onReset('dark')
                        this.props.onChangeLayoutType('menu-light')
                        e.preventDefault()
                    }} title={t("Reset")} className={this.props.layoutType === 'reset' ? 'active' : ''} data-value="reset">{t("Reset to Default")}</a>
                </div>
            </div>
        );
        return (
            <Aux>
                {layoutOption}
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        layoutType: state.reducerSlice.layoutType
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeLayoutType: (layoutType) => {
            dispatch({type: LAYOUT_TYPE, layoutType: layoutType})
            window.localStorage.setItem("layoutType",layoutType)
        },
        onReset: (layoutType) => dispatch({type: RESET, layoutType: layoutType}),
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (withTranslation()(Layout));
