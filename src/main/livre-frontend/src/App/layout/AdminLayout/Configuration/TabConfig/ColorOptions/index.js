import React, {Component} from 'react';
import {connect} from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';

import Aux from "../../../../../../hoc/_Aux";
import {HEADER_BACK_COLOR} from "../../../../../../store/reduceSlice";
import DEMO from "../../../../../../store/constant";
import {withTranslation} from "react-i18next";

class ColorOptions extends Component {
    render() {
        const {t}=this.props
        let colorOptions = '';
        colorOptions = (
            <div>
                <h6 className=" text-dark">{t('Background Color')}</h6>
                <div className="theme-color background-color flat">
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-blue') && e.preventDefault()}} className={this.props.headerBackColor === 'background-blue' ? 'active' : ''} data-value="background-blue"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-red') && e.preventDefault()}} className={this.props.headerBackColor === 'background-red' ? 'active' : ''} data-value="background-red"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-purple') && e.preventDefault()}} className={this.props.headerBackColor === 'background-purple' ? 'active' : ''} data-value="background-purple"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-info') && e.preventDefault()}} className={this.props.headerBackColor === 'background-info' ? 'active' : ''} data-value="background-info"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-green') && e.preventDefault()}} className={this.props.headerBackColor === 'background-green' ? 'active' : ''} data-value="background-green"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-dark') && e.preventDefault()}} className={this.props.headerBackColor === 'background-dark' ? 'active' : ''} data-value="background-dark"><span/><span/></a>
                </div>
                <h6 className=" text-dark">{t('Background Gradient')}</h6>
                <div className="theme-color background-color gradient">
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-grd-blue') && e.preventDefault()}} className={this.props.headerBackColor === 'background-grd-blue' ? 'active' : ''} data-value="background-grd-blue"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-grd-red') && e.preventDefault()}} className={this.props.headerBackColor === 'background-grd-red' ? 'active' : ''} data-value="background-grd-red"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-grd-purple') && e.preventDefault()}} className={this.props.headerBackColor === 'background-grd-purple' ? 'active' : ''} data-value="background-grd-purple"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-grd-info') && e.preventDefault()}} className={this.props.headerBackColor === 'background-grd-info' ? 'active' : ''} data-value="background-grd-info"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-grd-green') && e.preventDefault()}} className={this.props.headerBackColor === 'background-grd-green' ? 'active' : ''} data-value="background-grd-green"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-grd-dark') && e.preventDefault()}} className={this.props.headerBackColor === 'background-grd-dark' ? 'active' : ''} data-value="background-grd-dark"><span/><span/></a>
                </div>
                <h6 className=" text-dark">{t('Background Image')}</h6>
                <div className="theme-color background-color image">
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-img-1') && e.preventDefault()}} className={this.props.headerBackColor === 'background-img-1' ? 'active' : ''} data-value="background-img-1"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-img-2') && e.preventDefault()}} className={this.props.headerBackColor === 'background-img-2' ? 'active' : ''} data-value="background-img-2"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-img-3') && e.preventDefault()}} className={this.props.headerBackColor === 'background-img-3' ? 'active' : ''} data-value="background-img-3"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-img-4') && e.preventDefault()}} className={this.props.headerBackColor === 'background-img-4' ? 'active' : ''} data-value="background-img-4"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-img-5') && e.preventDefault()}} className={this.props.headerBackColor === 'background-img-5' ? 'active' : ''} data-value="background-img-5"><span/><span/></a>
                    <a href={DEMO.BLANK_LINK} onClick={(e) => {this.props.onChangeHeaderBackColor('background-img-6') && e.preventDefault()}} className={this.props.headerBackColor === 'background-img-6' ? 'active' : ''} data-value="background-img-6"><span/><span/></a>
                </div>
            </div>
        );


        return (
            <Aux>
                <div className="config-scroll">
                    <PerfectScrollbar>
                        {colorOptions}
                    </PerfectScrollbar>
                </div>
            </Aux>
        );
    }
}

const mapStateToProps = state => {
    return {
        layout: state.reducerSlice.layout,
        headerBackColor: state.reducerSlice.headerBackColor
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onChangeHeaderBackColor: (headerBackColor) => dispatch({type: HEADER_BACK_COLOR, headerBackColor: headerBackColor})
    }
};

export default connect(mapStateToProps, mapDispatchToProps) (withTranslation()(ColorOptions));
