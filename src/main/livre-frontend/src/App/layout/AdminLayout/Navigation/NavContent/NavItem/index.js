import React, {forwardRef} from 'react';
import {connect} from 'react-redux';
import {NavLink} from 'react-router-dom';
import {withRouter} from 'react-router-dom';
import windowSize from 'react-window-size';

import Aux from "../../../../../../hoc/_Aux";
import NavIcon from "./../NavIcon";
import NavBadge from "./../NavBadge";
import {COLLAPSE_MENU, NAV_CONTENT_LEAVE} from "../../../../../../store/reduceSlice";
import {useTranslation} from 'react-i18next';

const NavItem = forwardRef(( props , ref) => {
        const {t} = useTranslation();
        let itemTitle = props.item.title;
        if (props.item.icon) {
            itemTitle = <span className="pcoded-mtext">{t(props.item.title)}</span>;
        }

        let itemTarget = '';
        if (props.item.target) {
            itemTarget = '_blank';
        }

        let subContent;
        if (props.item.external) {
            subContent = (
                <a href={props.item.url} target='_blank' rel='noopener noreferrer'>
                    <NavIcon items={props.item}/>
                    {itemTitle}
                    <NavBadge layout={props.layout} items={props.item}/>
                </a>
            );
        } else {
            subContent = (
                <NavLink to={props.item.url} className="nav-link" exact={true} target={itemTarget}>
                    <NavIcon items={props.item}/>
                    {itemTitle}
                    <NavBadge layout={props.layout} items={props.item}/>
                </NavLink>
            );
        }
        let mainContent = '';
        if (props.layout === 'horizontal') {
            mainContent = (
                <li onClick={props.onItemLeave}>{subContent}</li>
            );
        } else {
            if (props.windowWidth < 992) {
                mainContent = (
                    <li className={props.item.classes} onClick={props.onItemClick}>{subContent}</li>
                );
            } else {
                mainContent = (
                    <li className={props.item.classes}>{subContent}</li>
                );
            }
        }

        return (
            <Aux>
                {mainContent}
            </Aux>
        );

})

const mapStateToProps = state => {
    return {
        layout: state.reducerSlice.layout,
        collapseMenu: state.reducerSlice.collapseMenu
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onItemClick: () => dispatch({type: COLLAPSE_MENU}),
        onItemLeave: () => dispatch({type: NAV_CONTENT_LEAVE})
    }
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(windowSize(NavItem)));
