import React, {useEffect, useRef, useState} from 'react';
// import Chart from "react-apexcharts";
import {Card, Col, Form, Row} from 'react-bootstrap';
import Grow from '@material-ui/core/Grow';
import Aux from "../../../hoc/_Aux";
// import DEMO from "../../../store/constant";
import SupportChart1 from '../chart/default-support-card-1';
import SupportChart2 from "../chart/default-support-card-2";
// import seoChart1 from '../chart/default-seo-chart-1';
// import seoChart2 from '../chart/default-seo-chart-2';
// import seoChart3 from '../chart/default-seo-chart-3';
// import powerCard1 from '../chart/default-power-card-1';
// import powerCard2 from '../chart/default-power-card-2';
import {useDispatch, useSelector} from "react-redux";
import {
    completedCountThisYear,
    CompletedTotalCount,
    copyCountThisYearLivre,
    countPerMonths,
    countPerMonthsLivre,
    deliveredCountThisYearLivre,
    doublingTotalCountLivre,
    rejectedCountThisYear,
    rejectedTotalCount,
    totalCountLivre,
    totalCountThisYear,
    totalCountThisYearLivre,
    uncompletedCountThisYear,
    fetchEstablishment,
    addEstablishment,
    fetchInitStat,
    addInitStat,
    UrbanTotalCount,
    RuralTotalCount,
    DesertTotalCount,
    NotDeliveredCountThisYearLivre,
    FinalTotalCount,
    TempTotalCount,

} from './DashboardSlice'
import {useTranslation} from "react-i18next";
import SystemUpdateIcon from '@material-ui/icons/SystemUpdate';
import {arDZ, enUS, fr} from 'date-fns/locale';
import i18next from "i18next";
import {format, parse} from "date-fns";
import Fab from "@material-ui/core/Fab";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";
import SaveIcon from "@material-ui/icons/Save";
import './style.css';
import {Accordion, AccordionDetails, AccordionSummary} from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Typography from "@material-ui/core/Typography";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    heading: {
        fontSize: theme.typography.pxToRem(18),
        // flexBasis: '33.33%',
        flexShrink: 0,
        margin: "auto"
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary,
    },
}));

let deferredPrompt
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});
const initialValues = {
    wilaya: "",
    frWilaya: "",
    commune: "",
    frCommune: "",
}
const initialValues2 = {
    rural_sectionNum: "",
    rural_ilotNum: "",
    rural_ilotNumFinal: "",
    rural_livrePrepared: "",
    rural_livreDelivered: "",
    rural_ilotTempNum: "",
    rural_ilotUnknownNum: "",
    urban_sectionNum: "",
    urban_ilotNum: "",
    urban_ilotNumFinal: "",
    urban_livrePrepared: "",
    urban_livreDelivered: "",
    urban_ilotTempNum: "",
    urban_ilotUnknownNum: "",
    desert_sectionNum: "",
    desert_ilotNum: "",
    desert_ilotNumFinal: "",
    desert_livrePrepared: "",
    desert_livreDelivered: "",
    desert_ilotTempNum: "",
    desert_ilotUnknownNum: "",
    crossedOutNum:0,
    precState: false
}

const schema = yup.object().shape({
    wilaya: yup.string().required('required'),
    frWilaya: yup.string().required('required'),
    commune: yup.string().required('required'),
    frCommune: yup.string().required('required')
});
const schema2 = yup.object().shape({
    rural_sectionNum: yup.string().required('required'),
    rural_ilotNum: yup.string().required('required'),
    rural_ilotNumFinal: yup.string().required('required'),
    rural_livrePrepared: yup.string().required('required'),
    rural_livreDelivered: yup.string().required('required'),
    rural_ilotTempNum: yup.string().required('required'),
    rural_ilotUnknownNum: yup.string().required('required'),
    rural_rejectedNum: yup.string().required('required'),
    urban_sectionNum: yup.string().required('required'),
    urban_ilotNum: yup.string().required('required'),
    urban_ilotNumFinal: yup.string().required('required'),
    urban_livrePrepared: yup.string().required('required'),
    urban_livreDelivered: yup.string().required('required'),
    urban_ilotTempNum: yup.string().required('required'),
    urban_ilotUnknownNum: yup.string().required('required'),
    urban_rejectedNum: yup.string().required('required'),
    desert_sectionNum: yup.string().required('required'),
    desert_ilotNum: yup.string().required('required'),
    desert_ilotNumFinal: yup.string().required('required'),
    desert_livrePrepared: yup.string().required('required'),
    desert_livreDelivered: yup.string().required('required'),
    desert_ilotTempNum: yup.string().required('required'),
    desert_ilotUnknownNum: yup.string().required('required'),
    desert_rejectedNum: yup.string().required('required'),
});

const Default = () => {
    const classes = useStyles();
    const [installable, setInstallable] = useState(false)
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const [openDialog, setOpenDialog] = useState(false)
    const [openDialogStats, setOpenDialogStats] = useState(false)
    const [expanded, setExpanded] = React.useState("panel1");

    const {
        initStats,
        establishment,
        dossierCountPerMonths,
        dossierTotalCountThisYear,
        dossierCompletedCountThisYear,
        dossierUncompletedCountThisYear,
        dossierRejectedCountThisYear,
        dossierRejectedTotalCount,
        dossierCompletedTotalCount,
        livrecountPerMonthsLivre,
        livretotalCountThisYearLivre,
        livredeliveredCountThisYearLivre,
        livrecopyCountThisYearLivre,
        livreNotDeliveredCountThisYearLivre,
        livretotalCountLivre,
        livredoublingTotalCountLivre,
        urbanTotalCount,
        ruralTotalCount,
        desertTotalCount,
        finalTotalCount,
        tempTotalCount
    } = useSelector(state => ({
        initStats: state.dashboard.initStats,
        establishment: state.dashboard.establishment,
        dossierCountPerMonths: state.dashboard.dossierCountPerMonths,
        dossierTotalCountThisYear: state.dashboard.dossierTotalCountThisYear,
        dossierCompletedCountThisYear: state.dashboard.dossierCompletedCountThisYear,
        dossierUncompletedCountThisYear: state.dashboard.dossierUncompletedCountThisYear,
        dossierRejectedCountThisYear: state.dashboard.dossierRejectedCountThisYear,
        dossierRejectedTotalCount: state.dashboard.dossierRejectedTotalCount,
        dossierCompletedTotalCount: state.dashboard.dossierCompletedTotalCount,
        livrecountPerMonthsLivre: state.dashboard.livrecountPerMonthsLivre,
        livretotalCountThisYearLivre: state.dashboard.livretotalCountThisYearLivre,
        livredoublingCountThisYearLivre: state.dashboard.livredoublingCountThisYearLivre,
        livrecopyCountThisYearLivre: state.dashboard.livrecopyCountThisYearLivre,
        livreNotDeliveredCountThisYearLivre: state.dashboard.livreNotDeliveredCountThisYearLivre,
        livretotalCountLivre: state.dashboard.livretotalCountLivre,
        livredeliveredCountThisYearLivre: state.dashboard.livredeliveredCountThisYearLivre,
        livredoublingTotalCountLivre: state.dashboard.livredoublingTotalCountLivre,
        urbanTotalCount: state.dashboard.urbanTotalCount,
        ruralTotalCount: state.dashboard.ruralTotalCount,
        desertTotalCount: state.dashboard.desertTotalCount,
        finalTotalCount: state.dashboard.finalTotalCount,
        tempTotalCount: state.dashboard.tempTotalCount,
        // loading: state.dashboard.loading,
        // error: state.dashboard.error,
        // success: state.dashboard.success,
    }))
    const [checked, setChecked] = useState(false);

    const {register, handleSubmit, errors} = useForm({
        defaultValues: initialValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })
    const {register: register2, handleSubmit: handleSubmit2, errors: errors2, formState} = useForm({
        defaultValues: initialValues2,
        mode: 'onChange',
        resolver: yupResolver(schema2)
    })
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    const notPrecInitS = useRef(null)
    // const est = useRef(null)
    // const ints = useRef(null)
    useEffect(() => {
        notPrecInitS.current = initStats.find(st => st.precState === false)
        establishment.length === 0 && dispatch(fetchEstablishment()).then((data) => {
            !data.payload && setOpenDialog(true)
        })
        initStats.length === 0 && dispatch(fetchInitStat()).then((dt) => {
            if (dt.payload.length === 0 && establishment.length !== 0) {
                setOpenDialogStats(true)
            }
        })
        if (establishment.length !== 0 && initStats.length !== 0) {
            setOpenDialog(false)
            setOpenDialogStats(false)
            dispatch(countPerMonths())
            dispatch(totalCountThisYear())
            dispatch(completedCountThisYear())
            dispatch(CompletedTotalCount())
            dispatch(rejectedCountThisYear())
            dispatch(rejectedTotalCount())
            dispatch(uncompletedCountThisYear())
            dispatch(countPerMonthsLivre())
            dispatch(totalCountThisYearLivre())
            dispatch(deliveredCountThisYearLivre())
            dispatch(copyCountThisYearLivre())
            dispatch(NotDeliveredCountThisYearLivre())
            dispatch(totalCountLivre())
            dispatch(doublingTotalCountLivre())
            dispatch(UrbanTotalCount())
            dispatch(RuralTotalCount())
            dispatch(DesertTotalCount())
            dispatch(FinalTotalCount())
            dispatch(TempTotalCount())
            setChecked(true)
        }
        // eslint-disable-next-line
    }, [establishment.length, initStats.length])

    useEffect(() => {
        window.addEventListener("beforeinstallprompt", (e) => {
            e.preventDefault();
            deferredPrompt = e;
            setInstallable(true);
        });

        window.addEventListener('appinstalled', () => {
        });
    }, [])

    const handleDialogClose = (event,reason) => {
        if(reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
            setOpenDialog(false);
            setOpenDialogStats(false)
        }
    };

    const handleInstallClick = (e) => {
        setInstallable(false)
        deferredPrompt.prompt()
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt')
            } else {
                console.log('User dismissed the install prompt')
            }
        });
    };

    const currentLang = i18next.languages[0]
    const apex = {
        series: [{
            name: t("Dossiers"),
            data: dossierCountPerMonths.map(d => d.count)
        }],
        xaxis: {
            categories: dossierCountPerMonths.map(d => {
                const parsedDate = parse(d.month, "MMM-yyyy", new Date())
                return format(parsedDate, "MMMM-yyyy", {locale: currentLang === 'ar' ? arDZ : currentLang === 'fr' ? fr : enUS})
            }),
        }
    }
    const apexLivre = {
        series: [{
            name: t("Land registers"),
            data: livrecountPerMonthsLivre.map(l => l.count)
        }],
        xaxis: {
            categories: livrecountPerMonthsLivre.map(d => {
                const parsedDate = parse(d.month, "MMM-yyyy", new Date());
                return format(parsedDate, "MMMM-yyyy", {locale: currentLang === 'ar' ? arDZ : currentLang === 'fr' ? fr : enUS})
            }),
        }
    }

    const submitForm = (data) => {
        dispatch(addEstablishment(data)).then(setOpenDialog(false)).then(() => dispatch(fetchEstablishment()))
    }
    const submitForm2 = (data) => {
        dispatch(addInitStat(data)).then(setOpenDialogStats(false)).then(() => dispatch(fetchInitStat()))

    }
    return (
        <Aux>
            {installable &&
            <div style={{position: 'relative'}}>
                <Fab size="medium" variant="extended"
                     style={{position: 'absolute', top: -152, right: 101, zIndex: 10000}}
                     color="secondary" onClick={handleInstallClick}>
                    <SystemUpdateIcon/>
                    {t('Install the App')}
                </Fab>
            </div>}

            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title" fullWidth={true}
                    maxWidth="sm" TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title" style={{margin: "auto"}}>{t('establishment')}</DialogTitle>
                <DialogContent>
                    <form noValidate onSubmit={handleSubmit(submitForm)}>
                        <Form.Row>
                            <Form.Group as={Col} xs={12}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            onKeyDown={(evt) => (!/^[\u0621-\u064A ]+$/.test(evt.key) && evt.key !== "Backspace" && evt.key !== "Tab") && evt.preventDefault()}
                                            // onChange={(e) => /^[\u0621-\u064A ]+$/.test(e.target.value) ? e.target.value : e.target.value = ""}
                                            variant="outlined"
                                            margin="normal"
                                            inputRef={register}
                                            fullWidth
                                            autoFocus
                                            label="ولاية ؟"
                                            name="wilaya"
                                            error={!!errors.wilaya}
                                            helperText={t(errors.wilaya?.message)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            onKeyDown={(evt) => (!/^[\u0621-\u064A ]+$/.test(evt.key) && evt.key !== "Backspace" && evt.key !== "Tab") && evt.preventDefault()}
                                            variant="outlined"
                                            margin="normal"
                                            inputRef={register}
                                            fullWidth
                                            label="المحافظة العقارية ؟"
                                            name="commune"
                                            error={!!errors.commune}
                                            helperText={t(errors.commune?.message)}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            onKeyDown={(evt) => (!/^[A-Za-z ]$/.test(evt.key) && evt.key !== "Backspace" && evt.key !== "Tab") && evt.preventDefault()}
                                            onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                            variant="outlined"
                                            margin="normal"
                                            inputRef={register}
                                            fullWidth
                                            label="Wilaya ?"
                                            name="frWilaya"
                                            error={!!errors.frWilaya}
                                            helperText={t(errors.frWilaya?.message)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            onKeyDown={(evt) => (!/^[A-Za-z ]$/.test(evt.key) && evt.key !== "Backspace" && evt.key !== "Tab") && evt.preventDefault()}
                                            onInput={(e) => e.target.value = e.target.value.toUpperCase()}
                                            variant="outlined"
                                            margin="normal"
                                            inputRef={register}
                                            fullWidth
                                            label="Conservation Foncier ?"
                                            name="frCommune"
                                            error={!!errors.frCommune}
                                            helperText={t(errors.frCommune?.message)}
                                        />
                                    </Grid>
                                </Grid>
                            </Form.Group>
                        </Form.Row>

                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                    startIcon={<SaveIcon/>}
                                >
                                    {t('save')}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    {/*<Button onClick={handleDialogClose} variant="contained" color="secondary">*/}
                    {/*    Close*/}
                    {/*</Button>*/}
                </DialogActions>
            </Dialog>
            <Dialog open={openDialogStats} onClose={handleDialogClose} aria-labelledby="form-dialog-title"
                    fullWidth={true}
                    maxWidth="md" TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title" style={{margin: "auto"}}>{t('initStats')}</DialogTitle>
                <DialogContent>
                    <form noValidate>
                        <Form.Row>
                            <Form.Group as={Col} xs={12}>
                                <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel1bh-content"
                                        id="panel1bh-header"
                                    >
                                        <Typography className={classes.heading}>{t('urban')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={1}>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_sectionNum'
                                                    label="عدد الأقسام المودعة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_sectionNum}
                                                    helperText={t(errors2.urban_sectionNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_ilotNum'
                                                    label="عدد مجموعات الملكية"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_ilotNum}
                                                    helperText={t(errors2.urban_ilotNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_ilotNumFinal'
                                                    label="عدد مجموعات الملكية موضوع ترقيم نهائي"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_ilotNumFinal}
                                                    helperText={t(errors2.urban_ilotNumFinal?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_livrePrepared'
                                                    label="عدد الدفاتر العقارية المعدة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_livrePrepared}
                                                    helperText={t(errors2.urban_livrePrepared?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_livreDelivered'
                                                    label="عدد الدفاتر العقارية المسلمة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_livreDelivered}
                                                    helperText={t(errors2.urban_livreDelivered?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_ilotTempNum'
                                                    label="عدد مجموعات الملكية موضوع ترقيم مؤقت"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_ilotTempNum}
                                                    helperText={t(errors2.urban_ilotTempNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_ilotUnknownNum'
                                                    label="عدد مجموعات الملكية في حساب المجهول"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_ilotUnknownNum}
                                                    helperText={t(errors2.urban_ilotUnknownNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='urban_rejectedNum'
                                                    label="عدد الملفات التي لا يمكن إعداد بشأنها دفاتر عقارية وخصص لها الرد المبرر قانونا"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.urban_rejectedNum}
                                                    helperText={t(errors2.urban_rejectedNum?.message)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel2bh-content"
                                        id="panel2bh-header"
                                    >
                                        <Typography className={classes.heading}>{t('rural')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={1}>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_sectionNum'
                                                    label="عدد الأقسام المودعة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_sectionNum}
                                                    helperText={t(errors2.rural_sectionNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_ilotNum'
                                                    label="عدد مجموعات الملكية"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_ilotNum}
                                                    helperText={t(errors2.rural_ilotNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_ilotNumFinal'
                                                    label="عدد مجموعات الملكية موضوع ترقيم نهائي"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_ilotNumFinal}
                                                    helperText={t(errors2.rural_ilotNumFinal?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_livrePrepared'
                                                    label="عدد الدفاتر العقارية المعدة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_livrePrepared}
                                                    helperText={t(errors2.rural_livrePrepared?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_livreDelivered'
                                                    label="عدد الدفاتر العقارية المسلمة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_livreDelivered}
                                                    helperText={t(errors2.rural_livreDelivered?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_ilotTempNum'
                                                    label="عدد مجموعات الملكية موضوع ترقيم مؤقت"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_ilotTempNum}
                                                    helperText={t(errors2.rural_ilotTempNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_ilotUnknownNum'
                                                    label="عدد مجموعات الملكية في حساب المجهول"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_ilotUnknownNum}
                                                    helperText={t(errors2.rural_ilotUnknownNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='rural_rejectedNum'
                                                    label="عدد الملفات التي لا يمكن إعداد بشأنها دفاتر عقارية وخصص لها الرد المبرر قانونا"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.rural_rejectedNum}
                                                    helperText={t(errors2.rural_rejectedNum?.message)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                                <Accordion expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
                                    <AccordionSummary
                                        expandIcon={<ExpandMoreIcon/>}
                                        aria-controls="panel3bh-content"
                                        id="panel3bh-header"
                                    >
                                        <Typography className={classes.heading}>{t('desert')}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails>
                                        <Grid container spacing={1}>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_sectionNum'
                                                    label="عدد الأقسام المودعة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_sectionNum}
                                                    helperText={t(errors2.desert_sectionNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_ilotNum'
                                                    label="عدد مجموعات الملكية"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_ilotNum}
                                                    helperText={t(errors2.desert_ilotNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_ilotNumFinal'
                                                    label="عدد مجموعات الملكية موضوع ترقيم نهائي"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_ilotNumFinal}
                                                    helperText={t(errors2.desert_ilotNumFinal?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_livrePrepared'
                                                    label="عدد الدفاتر العقارية المعدة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_livrePrepared}
                                                    helperText={t(errors2.desert_livrePrepared?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={3} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_livreDelivered'
                                                    label="عدد الدفاتر العقارية المسلمة"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_livreDelivered}
                                                    helperText={t(errors2.desert_livreDelivered?.message)}
                                                />
                                            </Grid>
                                            <Grid item md={6} xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_ilotTempNum'
                                                    label="عدد مجموعات الملكية موضوع ترقيم مؤقت"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_ilotTempNum}
                                                    helperText={t(errors2.desert_ilotTempNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_ilotUnknownNum'
                                                    label="عدد مجموعات الملكية في حساب المجهول"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_ilotUnknownNum}
                                                    helperText={t(errors2.desert_ilotUnknownNum?.message)}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                    onChange={(e) => e.target.value = e.target.value < 0 ? "" : e.target.value}
                                                    name='desert_rejectedNum'
                                                    label="عدد الملفات التي لا يمكن إعداد بشأنها دفاتر عقارية وخصص لها الرد المبرر قانونا"
                                                    variant='outlined'
                                                    type='number'
                                                    fullWidth
                                                    margin="normal"
                                                    inputRef={register2}
                                                    error={!!errors2.desert_rejectedNum}
                                                    helperText={t(errors2.desert_rejectedNum?.message)}
                                                />
                                            </Grid>
                                        </Grid>
                                    </AccordionDetails>
                                </Accordion>
                            </Form.Group>
                        </Form.Row>

                    </form>
                </DialogContent>
                <DialogActions>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                size="large"
                                startIcon={<SaveIcon/>}
                                onClick={handleSubmit2(submitForm2)}
                                disabled={!formState.isValid}
                            >
                                {t('save')}
                            </Button>
                        </Grid>
                    </Grid>
                </DialogActions>
            </Dialog>
            <Row>
                <Col xl={7} md={12}>
                    <Row>
                        <Col sm={6} col="true">
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 1000} : {})}>
                                <Card>
                                    <Card.Body className='pb-0'>
                                        <h2 className="m-0">{dossierTotalCountThisYear}</h2>
                                        <span className="text-c-green">{t('Total dossiers this year')}</span>
                                        <p className="mb-3 mt-3">{t('Total number of dossiers last 6 months')}</p>
                                    </Card.Body>
                                    <Card.Body className='p-0'>
                                        <SupportChart1 series={apex.series} xaxis={apex.xaxis}/>
                                    </Card.Body>
                                    <Card.Footer className='bg-primary text-white'>
                                        <Row className='text-center'>
                                            <Col>
                                                <h4 className="m-0 text-white">{dossierCompletedCountThisYear}</h4>
                                                <span style={{wordBreak: "break-all"}}>{t('completed')}</span>
                                            </Col>
                                            <Col>
                                                <h4 className="m-0 text-white">{dossierUncompletedCountThisYear}</h4>
                                                <span style={{wordBreak: "break-all"}}>{t('uncompleted')}</span>
                                            </Col>
                                            <Col>
                                                <h4 className="m-0 text-white">{dossierRejectedCountThisYear}</h4>
                                                <span style={{wordBreak: "break-all"}}>{t('rejected')}</span>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Grow>
                        </Col>
                        <Col sm={6} col="true">
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 1500} : {})}>
                                <Card>
                                    <Card.Body className='pb-0'>
                                        <h2 className="m-0">{livretotalCountThisYearLivre}</h2>
                                        <span className="text-c-blue">{t('Total land Registers this year')}</span>
                                        <p className="mb-3 mt-3">{t('Total number of land Registers last 6 months')}</p>
                                    </Card.Body>
                                    <Card.Body className='p-0'>
                                        <SupportChart2 series={apexLivre.series} xaxis={apexLivre.xaxis}/>
                                    </Card.Body>
                                    <Card.Footer className='bg-success text-white'>
                                        <Row className='text-center'>
                                            <Col>
                                                <h4 className="m-0 text-white">{livredeliveredCountThisYearLivre}</h4>
                                                <span style={{wordBreak: "break-all"}}>{t('delivered')}</span>
                                            </Col>
                                            <Col style={{minWidth: "fit-content"}}>
                                                <h4 className="m-0 text-white">{livreNotDeliveredCountThisYearLivre}</h4>
                                                <span style={{wordBreak: "break-all"}}>{t('undelivered')}</span>
                                            </Col>
                                            <Col>
                                                <h4 className="m-0 text-white">{livrecopyCountThisYearLivre}</h4>
                                                <span style={{wordBreak: "break-all"}}>{t('copy')}</span>
                                            </Col>
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Grow>
                        </Col>
                    </Row>
                </Col>
                <Col xl={5} md={12}>
                    <Row>
                        <Col>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 2000} : {})}>
                                <Card>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col sm={8}>
                                                <h4 className="text-c-yellow">{dossierRejectedTotalCount}</h4>
                                                <h6 className="text-muted m-b-0">{t('Dossiers')}</h6>
                                            </Col>
                                            <Col sm={4} className="text-right">
                                                <i className="feather icon-bar-chart-2 f-28"/>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer className="bg-c-yellow">
                                        <Row className="row align-items-center">
                                            <Col sm={9}>
                                                <p className="text-white m-b-0">{t('rejected')} - {t('Total count')}</p>
                                            </Col>
                                            {/*<Col sm={3} className="text-right">*/}
                                            {/*    <i className="feather icon-trending-up text-white f-16"/>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Grow>

                        </Col>
                        <Col>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 2500} : {})}>
                                <Card>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col sm={8}>
                                                <h4 className="text-c-green">{dossierCompletedTotalCount}</h4>
                                                <h6 className="text-muted m-b-0">{t('Dossiers')}</h6>
                                            </Col>
                                            <Col sm={4} className="text-right">
                                                <i className="feather icon-file-text f-28"/>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer className="bg-c-green">
                                        <Row className="row align-items-center">
                                            <Col sm={9}>
                                                <p className="text-white m-b-0">{t('completed')} - {t('Total count')}</p>
                                            </Col>
                                            {/*<Col sm={3} className="text-right">*/}
                                            {/*    <i className="feather icon-trending-up text-white f-16"/>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Grow>

                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 3000} : {})}>
                                <Card>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col sm={8}>
                                                <h4 className="text-c-blue">{livretotalCountLivre}</h4>
                                                <h6 className="text-muted m-b-0">{t('Land registers')}</h6>
                                            </Col>
                                            <Col sm={4} className="text-right">
                                                <i className="feather icon-calendar f-28"/>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer className="bg-c-blue">
                                        <Row className="row align-items-center">
                                            <Col sm={9}>
                                                <p className="text-white m-b-0">{t('delivered')} - {t('Total count')}</p>
                                            </Col>
                                            {/*<Col sm={3} className="text-right">*/}
                                            {/*    <i className="feather icon-trending-down text-white f-16"/>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Grow>

                        </Col>
                        <Col>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 3500} : {})}>
                                <Card>
                                    <Card.Body>
                                        <Row className="align-items-center">
                                            <Col sm={8}>
                                                <h4 className="text-c-red">{livredoublingTotalCountLivre}</h4>
                                                <h6 className="text-muted m-b-0">{t('Land registers')}</h6>
                                            </Col>
                                            <Col sm={4} className="text-right">
                                                <i className="feather icon-alert-circle f-28"/>
                                            </Col>
                                        </Row>
                                    </Card.Body>
                                    <Card.Footer className="bg-c-red">
                                        <Row className="row align-items-center">
                                            <Col sm={9}>
                                                <p className="text-white m-b-0">{t('unknown')} - {t('Total count')}</p>
                                            </Col>
                                            {/*<Col sm={3} className="text-right">*/}
                                            {/*    <i className="feather icon-trending-down text-white f-16"/>*/}
                                            {/*</Col>*/}
                                        </Row>
                                    </Card.Footer>
                                </Card>
                            </Grow>

                        </Col>
                    </Row>
                </Col>
                <Col xl={12}>
                    <Row>
                        <Col md={4}>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 4000} : {})}>
                                <Card className="bg-c-blue order-card">
                                    <Card.Body>
                                        <h5 className="mb-3 text-white">{t('urban')}</h5>
                                        <h2 className="text-white">{urbanTotalCount}</h2>
                                        <i className="card-icon feather icon-map-pin"/>
                                    </Card.Body>
                                </Card>
                            </Grow>
                        </Col>
                        <Col md={4}>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 4500} : {})}>
                                <Card className="bg-c-green order-card">
                                    <Card.Body>
                                        <h5 className="mb-3 text-white">{t('rural')}</h5>
                                        <h2 className="text-white">{ruralTotalCount}</h2>
                                        <i className="card-icon feather icon-wind"/>
                                    </Card.Body>
                                </Card>
                            </Grow>
                        </Col>
                        <Col md={4}>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 5000} : {})}>
                                <Card className="bg-c-yellow order-card">
                                    <Card.Body>
                                        <h5 className="mb-3 text-white">{t('desert')}</h5>
                                        <h2 className="text-white">{desertTotalCount}</h2>
                                        <i className="card-icon feather icon-sun"/>
                                    </Card.Body>
                                </Card>
                            </Grow>
                        </Col>
                    </Row>
                    <Row>
                        <Col md={6}>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 5500} : {})}>
                                <Card className="bg-c-green widget-visitor-card">
                                    <Card.Body className="text-center">
                                        <h5 className="mb-3 text-white">{t('finalReg')}</h5>
                                        <h2 className="text-white">{finalTotalCount}</h2>
                                        <i className="card-icon feather icon-check-circle"/>
                                    </Card.Body>
                                </Card>
                            </Grow>
                        </Col>
                        <Col md={6}>
                            <Grow in={checked} style={{transformOrigin: '0 0 0'}} {...(checked ? {timeout: 6000} : {})}>
                                <Card className="bg-c-purple widget-visitor-card">
                                    <Card.Body className="text-center">
                                        <h5 className="mb-3 text-white">{t('tempReg')}</h5>
                                        <h2 className="text-white">{tempTotalCount}</h2>
                                        <i className="card-icon feather icon-watch"/>
                                    </Card.Body>
                                </Card>
                            </Grow>
                        </Col>
                    </Row>
                </Col>
                {/*<Col md={6} xl={4}>*/}
                {/*    <Card>*/}
                {/*        <Card.Body>*/}
                {/*            <Row className="align-items-center">*/}
                {/*                <Col>*/}
                {/*                    <h3>$16,756</h3>*/}
                {/*                    <h6 className="text-muted m-b-0">Visits<i*/}
                {/*                        className="fa fa-caret-down text-c-red m-l-10"/></h6>*/}
                {/*                </Col>*/}
                {/*                <Col>*/}
                {/*                    <Chart {...seoChart1} />*/}
                {/*                </Col>*/}
                {/*            </Row>*/}
                {/*        </Card.Body>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col md={6} xl={4}>*/}
                {/*    <Card>*/}
                {/*        <Card.Body>*/}
                {/*            <Row className="align-items-center">*/}
                {/*                <Col>*/}
                {/*                    <h3>49.54%</h3>*/}
                {/*                    <h6 className="text-muted m-b-0">Bounce Rate<i*/}
                {/*                        className="fa fa-caret-up text-c-green m-l-10"/></h6>*/}
                {/*                </Col>*/}
                {/*                <Col>*/}
                {/*                    <Chart {...seoChart2} />*/}
                {/*                </Col>*/}
                {/*            </Row>*/}
                {/*        </Card.Body>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
                {/*<Col md={12} xl={4}>*/}
                {/*    <Card>*/}
                {/*        <Card.Body>*/}
                {/*            <Row className="align-items-center">*/}
                {/*                <Col>*/}
                {/*                    <h3>1,62,564</h3>*/}
                {/*                    <h6 className="text-muted m-b-0">Products<i*/}
                {/*                        className="fa fa-caret-down text-c-red m-l-10"/></h6>*/}
                {/*                </Col>*/}
                {/*                <Col>*/}
                {/*                    <Chart {...seoChart3} />*/}
                {/*                </Col>*/}
                {/*            </Row>*/}
                {/*        </Card.Body>*/}
                {/*    </Card>*/}
                {/*</Col>*/}

                {/*<Col xl={8} md={12}>*/}
                {/*    <Row>*/}
                {/*        <Col md={6}>*/}
                {/*            <Card>*/}
                {/*                <Card.Body>*/}
                {/*                    <h5 className="mb-3">Power</h5>*/}
                {/*                    <h2>2789<span className="text-muted m-l-5 f-14">kw</span></h2>*/}
                {/*                    <Chart {...powerCard1} />*/}
                {/*                    <Row>*/}
                {/*                        <Col sm='auto'>*/}
                {/*                            <div className="map-area">*/}
                {/*                                <h6 className="m-0">2876 <span> kw</span></h6>*/}
                {/*                                <p className="text-muted m-0">month</p>*/}
                {/*                            </div>*/}
                {/*                        </Col>*/}
                {/*                        <Col sm='auto'>*/}
                {/*                            <div className="map-area">*/}
                {/*                                <h6 className="m-0">234 <span> kw</span></h6>*/}
                {/*                                <p className="text-muted m-0">Today</p>*/}
                {/*                            </div>*/}
                {/*                        </Col>*/}
                {/*                    </Row>*/}
                {/*                </Card.Body>*/}
                {/*            </Card>*/}
                {/*        </Col>*/}
                {/*        <Col md={6}>*/}
                {/*            <Card>*/}
                {/*                <Card.Body>*/}
                {/*                    <h5 className="mb-3">Temperature</h5>*/}
                {/*                    <h2>7.3<span className="text-muted m-l-10 f-14">deg</span></h2>*/}
                {/*                    <Chart {...powerCard2} />*/}
                {/*                    <Row>*/}
                {/*                        <Col sm='auto'>*/}
                {/*                            <div className="map-area">*/}
                {/*                                <h6 className="m-0">4.5 <span> deg</span></h6>*/}
                {/*                                <p className="text-muted m-0">month</p>*/}
                {/*                            </div>*/}
                {/*                        </Col>*/}
                {/*                        <Col sm='auto'>*/}
                {/*                            <div className="map-area">*/}
                {/*                                <h6 className="m-0">0.5 <span> deg</span></h6>*/}
                {/*                                <p className="text-muted m-0">Today</p>*/}
                {/*                            </div>*/}
                {/*                        </Col>*/}
                {/*                    </Row>*/}
                {/*                </Card.Body>*/}
                {/*            </Card>*/}
                {/*        </Col>*/}
                {/*    </Row>*/}
                {/*</Col>*/}
                {/*<Col xl={4} md={12}>*/}

                {/*    <Card className="user-card2">*/}
                {/*        <Card.Body className="text-center">*/}
                {/*            <h6 className="m-b-15">Project Risk</h6>*/}
                {/*            <div className="risk-rate">*/}
                {/*                <span><b>5</b></span>*/}
                {/*            </div>*/}
                {/*            <h6 className="m-b-10 m-t-10">Balanced</h6>*/}
                {/*            <a href={DEMO.BLANK_LINK} className="text-c-green b-b-success">Change Your Risk</a>*/}
                {/*            <div className="row justify-content-center m-t-10 b-t-default m-l-0 m-r-0">*/}
                {/*                <div className="col m-t-15 b-r-default">*/}
                {/*                    <h6 className="text-muted">Nr</h6>*/}
                {/*                    <h6>AWS 2455</h6>*/}
                {/*                </div>*/}
                {/*                <div className="col m-t-15">*/}
                {/*                    <h6 className="text-muted">Created</h6>*/}
                {/*                    <h6>30th Sep</h6>*/}
                {/*                </div>*/}
                {/*            </div>*/}
                {/*        </Card.Body>*/}
                {/*        <button className="btn btn-success btn-block">Download Overall Report</button>*/}
                {/*    </Card>*/}
                {/*</Col>*/}
            </Row>
        </Aux>
    );
}

export default Default;
