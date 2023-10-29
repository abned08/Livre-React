import React from 'react';
import $ from 'jquery';

window.jQuery = $;
window.$ = $;
global.jQuery = $;

const DashboardDefault = React.lazy(() => import('./App/components/Dashboard/Default'));
const DossierList = React.lazy(() => import('./App/components/Dossier/DossierList'));
const AddDossier = React.lazy(() => import('./App/components/Dossier/DossierAdd'));
const DecisionList = React.lazy(() => import('./App/components/Dossier/Decision/DecisionList'));
const CommuneList = React.lazy(() => import('./App/components/Commune/CommuneList'));
const OneStop = React.lazy(() => import('./App/components/Report/OneStop'));
const Periodic = React.lazy(() => import('./App/components/Report/Periodic'));
const Rationalization = React.lazy(() => import('./App/components/Report/Rationalization'));
// const LivreList = React.lazy(() => import('./App/components/Livre/LivreList'));
// const AddLivre = React.lazy(() => import('./App/components/Livre/LivreAdd'));

const routes = [
    { path: '/home', exact: true, name: 'Home', component: DashboardDefault },
    { path: '/dossiers', exact: true, name: 'dossiers', component: DossierList },
    { path: '/addDossier', exact: true, name: 'dossiersAdd', component: AddDossier },
    { path: '/addDossier/:dossierId', exact: true, name: 'dossiersEdit', component: AddDossier },
    { path: '/dossiers/:dossierId', exact: true, name: 'decisions', component: DecisionList},
    // { path: '/livres', exact: true, name: 'livres', component: LivreList},
    // { path: '/addLivre', exact: true, name: 'livres', component: AddLivre },
    // { path: '/addLivre/:livreId', exact: true, name: 'livres', component: AddLivre },
    { path: '/communes', exact: true, name: 'communes', component: CommuneList },
    { path: '/oneStop', exact: true, name: 'oneStop', component: OneStop },
    { path: '/periodic', exact: true, name: 'periodic', component: Periodic },
    { path: '/rationalization', exact: true, name: 'rationalization', component: Rationalization },

];

export default routes;
