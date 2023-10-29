import axios from 'axios';

const baseUrl = process.env.REACT_APP_API_URL
const urlDossier = baseUrl + 'dossier';

export const fetchDossiers = () => axios.get(urlDossier);
export const lastDossier = () => axios.get(`${baseUrl}lastDossier`);
export const createDossier = (newDossier) => axios.post(urlDossier, newDossier);
export const updateDossier = (updatedDossier) => axios.put(urlDossier, updatedDossier);
export const deleteDossier = (id) => axios.delete(`${urlDossier}/${id}`);
export const checkNumThisYear = (numDoss) => axios.get(`${urlDossier}/checkNumThisYear`,{params: { num: numDoss}});
export const matchDossierLivre = (mDossierLivre) => axios.post(`${baseUrl}matchDossierLivre`, mDossierLivre);
export const lastLivreDossier = () => axios.get(`${baseUrl}lastLivreDossier`);
export const matchRecArngNumDossierLivre = (mLivre) => axios.post(`${baseUrl}matchRecArngNumDossierLivre`, mLivre);


const urlDecision = baseUrl + 'decision';

export const fetchDecisions = (dossierId) => axios.get(`${baseUrl}decisions/${dossierId}`);
export const createDecision = (dossierId, newDecision) => axios.post(`${urlDecision}/${dossierId}`, newDecision);
export const updateDecision = (updatedDecision) => axios.put(`${urlDecision}/`, updatedDecision);
export const deleteDecision = (id) => axios.delete(`${urlDecision}/${id}`);

const urlLivre = baseUrl + 'livre';

export const fetchLivres = () => axios.get(urlLivre);
export const lastLivre = () => axios.get(`${baseUrl}lastLivre`);
export const createLivre = (newLivre) => axios.post(urlLivre, newLivre);
export const updateLivre = (updatedLivre) => axios.put(urlLivre, updatedLivre);
export const deleteLivre = (id) => axios.delete(`${urlLivre}/${id}`);
export const matchLivre = (mLivre) => axios.post(`${baseUrl}matchLivre`, mLivre);
export const matchRecArngNumLivre = (mLivre) => axios.post(`${baseUrl}matchRecArngNumLivre`, mLivre);

const urlCommune = baseUrl + 'commune';

export const fetchCommunes = () => axios.get(urlCommune);
export const createCommune = (newCommune) => axios.post(urlCommune, newCommune);
export const updateCommune = (updatedCommune) => axios.put(urlCommune, updatedCommune);
export const deleteCommune = (id) => axios.delete(`${urlCommune}/${id}`);

const urlDecisionName = baseUrl + 'decisionName';

export const fetchDecisionNames = () => axios.get(urlDecisionName);
export const createDecisionName = (newDecisionName) => axios.post(urlDecisionName, newDecisionName);
export const updateDecisionName = (updatedDecisionName) => axios.put(urlDecisionName, updatedDecisionName);
export const deleteDecisionName = (id) => axios.delete(`${urlDecisionName}/${id}`);

// Dashboard
//Dossier
export const countPerMonths = () => axios.get(`${urlDossier}/countPerMonths`);
export const totalCountThisYear = () => axios.get(`${urlDossier}/totalCountThisYear`);
export const completedCountThisYear = () => axios.get(`${urlDossier}/completedCountThisYear`);
export const uncompletedCountThisYear = () => axios.get(`${urlDossier}/uncompletedCountThisYear`);
export const rejectedCountThisYear = () => axios.get(`${urlDossier}/rejectedCountThisYear`);
export const rejectedTotalCount = () => axios.get(`${urlDossier}/rejectedTotalCount`);
export const CompletedTotalCount = () => axios.get(`${urlDossier}/CompletedTotalCount`);
export const urbanTotalCount = () => axios.get(`${urlDossier}/urbanTotalCount`);
export const ruralTotalCount = () => axios.get(`${urlDossier}/ruralTotalCount`);
export const desertTotalCount = () => axios.get(`${urlDossier}/desertTotalCount`);
export const periodicCount = (sDate,eDate) => axios.get(`${baseUrl}initStat/periodic`, {params: {startDate:sDate,endDate:eDate}});
export const finalTotalCount = () => axios.get(`${urlDossier}/dossierFinalTotalCount`);
export const tempTotalCount = () => axios.get(`${urlDossier}/dossierTempTotalCount`);

//Livre
export const countPerMonthsLivre = () => axios.get(`${urlDossier}/livrecountPerMonths`);
export const totalCountThisYearLivre = () => axios.get(`${urlDossier}/livretotalCountThisYear`);
export const deliveredCountThisYearLivre = () => axios.get(`${urlDossier}/livredeliveredCountThisYear`);
export const copyCountThisYearLivre = () => axios.get(`${urlDossier}/livrecopyCountThisYear`);
export const notDeliveredCountThisYear = () => axios.get(`${urlDossier}/livreNotDeliveredCountThisYear`);
export const totalCountLivre = () => axios.get(`${urlDossier}/livretotalCount`);
export const doublingTotalCountLivre = () => axios.get(`${urlDossier}/livredoublingTotalCount`);

//print dossier
export const printDossier = (id) => axios.get(`${urlDossier}/${id}/report`);

//download dossier
export const downloadDossier = (id) => axios.get(`${baseUrl}download/${id}`,
    {
        responseType: 'blob',
        headers: {
            Accept: 'application/octet-stream',
        }
    })

//establishment
export const fetchEstablishment = () => axios.get(`${baseUrl}establishment`);
export const createEstablishment = (newEst) => axios.post(`${baseUrl}establishment`, newEst);

//init stats
export const fetchinitStats = () => axios.get(`${baseUrl}initStat`);
export const createinitStats = (newStat) => axios.post(`${baseUrl}initStat`, newStat);
