const config = {
    defaultPath: '/home',
    basename: '', // only at build time to set, like ///able-pro/react/default
    layout: 'vertical', // vertical, horizontal
    subLayout: '', // horizontal-2
    collapseMenu: false, // mini-menu
    layoutType: localStorage.getItem("layoutType") || 'menu-light', // menu-dark, menu-light, dark
    headerBackColor: 'header-blue', // background-blue, background-red, background-purple, background-info, background-green, background-dark, background-grd-blue, background-grd-red, background-grd-purple, background-grd-info, background-grd-green, background-grd-dark, background-img-1, background-img-2, background-img-3, background-img-4, background-img-5, background-img-6
    rtlLayout: false,
    navFixedLayout: false,
    headerFixedLayout: false,
    boxLayout: false
};
export default config
