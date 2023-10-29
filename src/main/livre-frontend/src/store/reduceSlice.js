import { createSlice } from "@reduxjs/toolkit";
import config from "../config";
let trigger = []
let open = []
const initialState= {
    isOpen: [], //for active default menu
    isTrigger: [], //for active default menu, set blank for horizontal
    ...config,
    isFullScreen: false, // static can't change
}
export const reducerSlice = createSlice({
    name: 'reducer',
    initialState,
    reducers: {
        COLLAPSE_MENU: (state, action) => {
            return {
                ...state,
                collapseMenu: !state.collapseMenu
            }
        },
        COLLAPSE_TOGGLE: (state, action, open) => {
            if (action.menu.type === 'sub') {
                open = state.isOpen;
                trigger = state.isTrigger;

                const triggerIndex = trigger.indexOf(action.menu.id);
                if (triggerIndex > -1) {
                    open = open.filter(item => item !== action.menu.id);
                    trigger = trigger.filter(item => item !== action.menu.id);
                }

                if (triggerIndex === -1) {
                    open = [...open, action.menu.id];
                    trigger = [...trigger, action.menu.id];
                }
            } else {
                open = state.isOpen;
                const triggerIndex = (state.isTrigger).indexOf(action.menu.id);
                trigger = (triggerIndex === -1) ? [action.menu.id] : [];
                open = (triggerIndex === -1) ? [action.menu.id] : [];
            }

            return {
                ...state,
                isOpen: open,
                isTrigger: trigger
            }
        },
        NAV_CONTENT_LEAVE: (state, action) => {
            return {
                ...state,
                isOpen: open,
                isTrigger: trigger,
            }
        },
        NAV_COLLAPSE_LEAVE: (state, action) => {
            if (action.menu.type === 'sub') {
                open = state.isOpen;
                trigger = state.isTrigger;

                const triggerIndex = trigger.indexOf(action.menu.id);
                if (triggerIndex > -1) {
                    open = open.filter(item => item !== action.menu.id);
                    trigger = trigger.filter(item => item !== action.menu.id);
                }
                return {
                    ...state,
                    isOpen: open,
                    isTrigger: trigger,
                };
            }
            return { ...state }
        },
        FULL_SCREEN: (state, action) => {
            return {
                ...state,
                isFullScreen: !state.isFullScreen
            }
        },
        FULL_SCREEN_EXIT: (state, action) => {
            return {
                ...state,
                isFullScreen: false
            }
        },
        CHANGE_LAYOUT: (state, action) => {
            return {
                ...state,
                layout: action.layout
            }
        },
        CHANGE_SUB_LAYOUT: (state, action) => {
            return {
                ...state,
                subLayout: action.subLayout
            }
        },
        LAYOUT_TYPE: (state, action) => {
            return {
                ...state,
                layoutType: action.layoutType,
                headerBackColor: state.headerBackColor
            }
        },
        NAV_BACK_COLOR: (state, action) => {
            return {
                ...state,
                layoutType: (state.layoutType === 'menu-light') ? 'menu-dark' : state.layoutType
            }
        },
        HEADER_BACK_COLOR: (state, action) => {
            return {
                ...state,
                headerBackColor: action.headerBackColor
            }
        },
        RTL_LAYOUT: (state, action) => {
            return {
                ...state,
                rtlLayout: !state.rtlLayout
            }
        },
        NAV_FIXED_LAYOUT: (state, action) => {
            return {
                ...state,
                navFixedLayout: !state.navFixedLayout
            }
        },
        HEADER_FIXED_LAYOUT: (state, action) => {
            return {
                ...state,
                headerFixedLayout: !state.headerFixedLayout,
                headerBackColor: (!state.headerFixedLayout && state.headerBackColor === 'header-default') ? 'header-blue' : state.headerBackColor,
            }
        },
        BOX_LAYOUT: (state, action) => {
            return {
                ...state,
                boxLayout: !state.boxLayout
            }
        },
        RESET: (state, action) => {
            return {
                ...state,
                layout: initialState.layout,
                subLayout: initialState.subLayout,
                collapseMenu: initialState.collapseMenu,
                layoutType: initialState.layoutType,
                headerBackColor: initialState.headerBackColor,
                rtlLayout: initialState.rtlLayout,
                navFixedLayout: initialState.navFixedLayout,
                headerFixedLayout: initialState.headerFixedLayout,
                boxLayout: initialState.boxLayout
            }
        }
    }
});
export const { COLLAPSE_MENU, COLLAPSE_TOGGLE, NAV_CONTENT_LEAVE, NAV_COLLAPSE_LEAVE, FULL_SCREEN, FULL_SCREEN_EXIT, CHANGE_LAYOUT, CHANGE_SUB_LAYOUT, LAYOUT_TYPE, NAV_BACK_COLOR, HEADER_BACK_COLOR, RTL_LAYOUT, NAV_FIXED_LAYOUT, HEADER_FIXED_LAYOUT, BOX_LAYOUT, RESET } = reducerSlice.actions;
export default reducerSlice.reducer;
