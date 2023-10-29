import reducerSlice from "./reduceSlice";
import {configureStore} from "@reduxjs/toolkit";
import DossierSlice from "../App/components/Dossier/DossierSlice";
import DecisionSlice from "../App/components/Dossier/Decision/DecisionSlice";
import LivreSlice from "../App/components/Livre/LivreSlice";
import CommuneSlice from "../App/components/Commune/CommuneSlice";
import DashboardSlice from "../App/components/Dashboard/DashboardSlice";
import DecisionNameSlice from "../App/components/Dossier/Decision/DecisionName/DecisionNameSlice";

export default configureStore({
    reducer:{
        reducerSlice:reducerSlice,
        dossier:DossierSlice,
        decision: DecisionSlice,
        commune: CommuneSlice,
        decisionName: DecisionNameSlice,
        livre: LivreSlice,
        dashboard: DashboardSlice
    },
    middleware:(getDefaultMiddleware)=>getDefaultMiddleware({
        serializableCheck:false
    })
})
