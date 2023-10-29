import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App/index';
import config from './config';
import './assets/scss/style.scss';
import store from "./store/store";
import 'flag-icon-css/css/flag-icon.min.css'
import i18next from "i18next";
import HttpApi from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import {initReactI18next} from "react-i18next";
import reportWebVitals from "./reportWebVitals";
import {HashRouter} from "react-router-dom";

i18next
    .use(HttpApi)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        supportedLngs: ['ar', 'en', 'fr'],
        fallbackLng: 'en',
        debug: false,
        // Options for language detector
        detection: {
            order: ['sessionStorage', 'path', 'cookie', 'htmlTag'],
            caches: ['cookie', 'sessionStorage'],
            lookupSessionStorage: 'i18nextLng',
            lookupCookie: 'i18next'
        },
        // react: { useSuspense: false },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        }
    })
if (!window.sessionStorage.getItem("i18nextLng")){
    window.sessionStorage.setItem("i18nextLng","ar")
    document.cookie="i18next=ar"
}
const app = (
    <Provider store={store}>
        <HashRouter basename={config.basename}>
            <App/>
        </HashRouter>
    </Provider>
);

ReactDOM.render(app, document.getElementById('root'));

reportWebVitals()