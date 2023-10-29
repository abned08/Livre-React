import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom';
import windowSize from 'react-window-size';
import {isDesktop, CustomView} from 'react-device-detect';
import Aux from '../../../hoc/_Aux'
import {
    // deleteDossier,
    fetchDossiers,
    printDossier,
    downloadDossier,
    lastLivreDossier,
    matchRecArngNumDossierLivre, addDossiers, lastDossier, updDossier
} from './DossierSlice'
import Paper from '@material-ui/core/Paper';
import {Row, Col, Card, Form} from 'react-bootstrap';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import {makeStyles} from '@material-ui/core/styles';
import DataGrid, {
    Column,
    ColumnChooser,
    Sorting,
    FilterRow,
    SearchPanel,
    GroupPanel,
    Selection, Summary, GroupItem, TotalItem, HeaderFilter, Paging, Pager, Grouping, LoadPanel, Scrolling, Export
} from "devextreme-react/data-grid";
import {differenceInCalendarDays, getYear, parseISO} from 'date-fns';
import format from 'date-fns/format'
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from "@material-ui/core/Fab";
import './style.css'
import {Link} from "react-router-dom";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
// import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import Buttonn from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import {unwrapResult} from "@reduxjs/toolkit";
import TextField from "@material-ui/core/TextField";
import {useTranslation} from "react-i18next";
import Slide from "@material-ui/core/Slide";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import Typography from "@material-ui/core/Typography";
import {SpeedDialAction} from 'devextreme-react/speed-dial-action';
import config from 'devextreme/core/config';
import repaintFloatingActionButton from 'devextreme/ui/speed_dial_action/repaint_floating_action_button';
import Grid from "@material-ui/core/Grid";
import {Controller, useForm} from "react-hook-form";
import {KeyboardDatePicker} from "@material-ui/pickers";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import * as yup from "yup";
import {yupResolver} from "@hookform/resolvers/yup";
import {DialogContentText, Snackbar} from "@material-ui/core";
import MuiAlert from "@material-ui/lab/Alert";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver';
import { exportDataGrid } from 'devextreme/excel_exporter';

const useStyles = makeStyles((theme) => ({
    rootForProg: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        justifyContent: 'center'
    },
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },

}));

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const initialValues = {
    recordNum: "",
    arrangeNum: "",
    deliveryDate: new Date(),
    deliveredTo: "",
    note: ""

}

const validationSchema = yup.object().shape({
    recordNum: yup.string().max(4, "field_max_is_9999").required("required"),
    arrangeNum: yup.string().required("required").max(4, "field_max_is_9999"),
    deliveryDate: yup.date().typeError("must_be_a_date").required("required").nullable(),
    deliveredTo: yup.string().required("required"),
    note: yup.string().required("required"),
})

const validationSchema2 = yup.object().shape({
    canceledNote: yup.string().required("required"),
})

function AlertSnack(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const DossierList = React.forwardRef((props, ref) => {
    const {t} = useTranslation()
    const classes = useStyles();
    const dispatch = useDispatch()
    const [openRed2, setOpenred2] = useState(false)
    const {dossiers, lastD, lastLD, matchRecArngNumDL, loading, error, success, rtlLayout} = useSelector(state => ({
        error: state.dossier.error,
        dossiers: state.dossier.dossiers,
        loading: state.dossier.loading,
        success: state.dossier.success,
        lastLD: state.dossier.lastLD,
        lastD: state.dossier.lastD,
        matchRecArngNumDL: state.dossier.mtchRecArngNumDL,
        rtlLayout: state.reducerSlice.rtlLayout
    }))

    const {register, handleSubmit, errors, watch, setValue, control, formState} = useForm({
        defaultValues: initialValues,
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        shouldUnregister: false,
    });

    const {
        register: register2,
        handleSubmit: handleSubmit2,
        errors: errors2,
        formState: formState2
    } = useForm({
        defaultValues: {canceledNote: ""},
        mode: "onChange",
        resolver: yupResolver(validationSchema2),
        shouldUnregister: false,
    });

    const [openDialog, setOpenDialog] = useState(false);
    const [openFormDialog, setOpenFormDialog] = useState(false);
    const [openFormCancelDialog, setOpenFormCancelDialog] = useState(false);
    const [open, setOpen] = useState(false);
    const dg = useRef(null)
    const d = useRef(null)
    const psw = useRef("")
    const clearF = () => {
        dg.current.instance.clearFilter("search");
        dg.current.instance.clearFilter("row");
    }

    const [openDown, setOpenDown] = useState(false);
    const handleCloseDown = () => {
        setOpenDown(false);
    }

    const handleClose = () => {
        setOpenred2(false);
        setOpen(false);
    }

    const sweetAlertHandler = (alert) => {
        const MySwal = withReactContent(Swal);
        MySwal.fire({
            title: alert.title,
            text: alert.text,
            type: alert.type
        });
    };

    let history = useHistory()
    const routeChange = (dtt) => {
        dtt = d.current.id
        let path = `/addDossier/${dtt}`
        history.push(path)
    }

    const handleDialogClickOpen = () => {
        setOpenDialog(true);
    }

    const handleDialogClose = () => {
        setOpenDialog(false);
    }

    const handleDialogFormClickOpen = () => {
        setOpenFormDialog(true);
    }

    const handleDialogFormClose = () => {
        setOpenFormDialog(false);
    }

    const handleDialogFormCancelClickOpen = () => {
        setOpenFormCancelDialog(true);
    }

    const handleDialogFormCancelClose = () => {
        setOpenFormCancelDialog(false);
    }

    const handleFAB = useCallback(() => {
        config({
            floatingActionButtonConfig: {
                shading: true,
                position:
                    rtlLayout ? {at: "left bottom", my: "left bottom", offset: "16 -16"} : {
                        at: "right bottom", my: "right bottom", offset: "-16 -16"
                    },
                icon: "edit",
            }
        })
        repaintFloatingActionButton()
    }, [rtlLayout])

    useEffect(() => {
        dispatch(fetchDossiers())
    }, [dispatch, success])

    function cellRenderNum(dt) {
        return <Tooltip title={t('decisions_list')}>
            <Link to={`/dossiers/${dt.data.id}`}
                  className="hovicon effect-1 sub-b">{dt.value}</Link>
        </Tooltip>
    }

    const [filterValues, setFilterValues] = useState([getYear(new Date())])
    const resetFilterValues = (e) => {
        if (e.fullName === "columns[1].filterValues") {
            setFilterValues([e.value])
        }
    }

    const [shPdf, setShPdf] = useState(false)
    const [selectedRowIndex, setSelectedRowIndex] = useState(-1)
    const selectDossier = (e) => {
        d.current = e.component.getSelectedRowsData(e.selectedRowsData[0])[0]
        d.current && setSelectedRowIndex(d.current.id)
        d.current && (d.current.pdfFile ? setShPdf(true) : setShPdf(false))
        handleFAB()
    }

    const customizeText = useCallback((e) => {
        return t('count') + ": " + e.value;
    }, [t]);

    const printDoss = (dt) => {
        dt = d.current.id
        dispatch(printDossier(dt)).then(unwrapResult).then((res) => {
            var div = document.getElementById("printerDiv").contentWindow
            div.document.open()
            div.document.write(res)
            div.document.close()
            div.focus()
            div.print()
        })
    }

    const downloadData = useRef(null)

    function downloadDoss(dt) {
        dt = d.current.id
        dispatch(downloadDossier(dt)).then(unwrapResult).then((res) => {
            const blob = new Blob([res], {type: 'application/pdf'})
            let fileURL = URL.createObjectURL(blob);
            downloadData.current = fileURL

        }).then(() => {
            !error && setOpenDown(() => true)
        })
    }

    useEffect(() => {
        dispatch(lastDossier())
        dispatch(lastLivreDossier())
        if (openFormDialog) {
            setValue("recordNum", lastLD && lastLD.recordNum ? lastLD.recordNum : 1)
            setValue("arrangeNum", lastLD && lastLD.arrangeNum ? parseInt(lastLD.arrangeNum) + 1 : 1)
            setValue("deliveryDate", new Date())
        }
        // eslint-disable-next-line
    }, [openFormDialog])

    const rec = watch("recordNum")
    const arr = watch("arrangeNum")
    useMemo(() => {
        if (rec && arr) {
            openRed2 && setOpenred2(() => false)
            const dc = {...d.current, recordNum: rec, arrangeNum: arr}
            dispatch(matchRecArngNumDossierLivre(dc)).then((dt) => {
                if (dt.payload) {
                    setOpenred2(() => true)
                }
            })
        }
        // eslint-disable-next-line
    }, [rec, arr])

    const submitForm = (data) => {
        const dc = {
            ...d.current, ...data,
            id: null,
            dateDepot: new Date(),
            completed: true,
            num: lastD + 1,
            repeateOrCopie: true,
            pdfFile: ""
        }
        if (!matchRecArngNumDL) {
            const formData = new FormData()
            for (const key in dc) {
                formData.append(key, dc[key])
            }
            dispatch(addDossiers(formData)).then(unwrapResult)
            if (success !== "") {
                setOpen(true)
                setOpenFormDialog(false)
            }
        } else {
            matchRecArngNumDL && setOpenred2(true)
        }
    }


    const submitForm2 = (data) => {
        const dc = {
            ...d.current, ...data,
            dateDepot: format(parseISO(d.current.dateDepot), 'yyyy/MM/dd HH:mm:ss'),
            canceled: true,
        }
        if (psw.current.value === "said1946") {
            const formData = new FormData()
            for (const key in dc) {
                formData.append(key, dc[key])
            }
            dispatch(updDossier(formData)).then(unwrapResult)
            if (success !== "") {
                setOpen(true)
                setOpenDialog(false)
                setOpenFormCancelDialog(false)
                setSelectedRowIndex(-1)
            }
        }

    }

    const onExporting = (e) => {
        const workbook = new Workbook();
        const worksheet = workbook.addWorksheet('Main');

        exportDataGrid({
            component: e.component,
            worksheet,
            autoFilterEnabled: true,
        }).then(() => {
            workbook.xlsx.writeBuffer().then((buffer) => {
                saveAs(new Blob([buffer], { type: 'application/octet-stream' }), 'Dossiers.xlsx');
            });
        });
        e.cancel = true;
    }

    return (
        <Aux>
            <iframe id="printerDiv" title="print Dossier" style={{display: "none"}}/>
            {error && (error?.data?.size === 0 ? sweetAlertHandler({
                title: t('error'),
                type: 'error',
                text: t('error dossier deleted')
            }) : sweetAlertHandler({title: 'Error', type: 'error', text: error}))}

            <Snackbar
                open={open}
                autoHideDuration={4000}
                anchorOrigin={{vertical: "top", horizontal: "right"}}
                onClose={handleClose}
            >
                <AlertSnack onClose={handleClose} severity='success'>
                    {t("saved_successfully")}
                </AlertSnack>
            </Snackbar>

            <Snackbar open={openRed2} autoHideDuration={4000}
                      anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose}>
                <AlertSnack onClose={handleClose} severity="error">{t('duplicated_livre_RecArng')}
                </AlertSnack>
            </Snackbar>

            <Dialog fullScreen open={openDown} onClose={handleCloseDown} TransitionComponent={Transition}>
                <AppBar className={classes.appBar}>
                    <Toolbar>
                        <Typography variant="h6" color="textPrimary" className={classes.title}>
                            {d.current && d.current.pdfFile}
                        </Typography>
                        <IconButton autoFocus color="inherit" onClick={handleCloseDown} aria-label="close">
                            <CloseIcon/>
                        </IconButton>
                    </Toolbar>
                </AppBar>
                <iframe
                    style={{width: "100%", height: "100%"}}
                    src={downloadData.current}
                    type='application/pdf'
                    title='title'
                />

            </Dialog>

            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{t('cancel')} {t('dossier')}</DialogTitle>
                <DialogContent>
                    <DialogContentText style={{color: "red"}}>
                        {t('ask_delete')}
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="normal"
                        label={t('password')}
                        type="password"
                        inputRef={psw}
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    {/*<Buttonn onClick={handleDialogClose} color="primary">*/}
                    {/*    {t('cancel')}*/}
                    {/*</Buttonn>*/}
                    <Buttonn onClick={handleSubmit2(submitForm2)} color="primary" fullWidth={true} autoFocus={true}>
                        {t('ok')}
                    </Buttonn>
                </DialogActions>
            </Dialog>

            <Dialog open={openFormDialog} onClose={handleDialogFormClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"
                             style={{margin: "auto"}}>{t('deliver_livre')} - {t('copy')}</DialogTitle>
                <DialogContent>
                    <form className={classes.form} noValidate>
                        <Form.Row>
                            <Form.Group as={Col} style={{paddingTop: 22}}>
                                <Grid container spacing={2} style={{color: "red"}}>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                            onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                            name='recordNum'
                                            label={t("record_number")}
                                            variant='outlined'
                                            type='number'
                                            margin='normal'
                                            inputRef={register}
                                            placeholder='0000'
                                            error={!!errors.recordNum}
                                            fullWidth
                                            helperText={t(errors.recordNum?.message)}
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <TextField
                                            onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                            onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                            name='arrangeNum'
                                            label={t("arrange_number")}
                                            variant='outlined'
                                            type='number'
                                            margin='normal'
                                            inputRef={register}
                                            placeholder='0000'
                                            error={!!errors.arrangeNum}
                                            fullWidth
                                            helperText={t(errors.arrangeNum?.message)}
                                        />
                                    </Grid>
                                    <Grid item md={4} xs={12}>
                                        <Controller
                                            control={control}
                                            name='deliveryDate'
                                            render={({onChange, value}) => (
                                                <KeyboardDatePicker
                                                    variant='dialog'
                                                    margin='normal'
                                                    autoOk
                                                    fullWidth
                                                    showTodayButton={true}
                                                    disableFuture={true}
                                                    orientation='landscape'
                                                    cancelLabel={t("cancel")}
                                                    okLabel={t("ok")}
                                                    todayLabel={t("today")}
                                                    inputVariant='outlined'
                                                    label={t("delivery_date")}
                                                    value={value}
                                                    onChange={onChange}
                                                    format='dd/MM/yyyy'
                                                    placeholder='00/00/0000'
                                                    KeyboardButtonProps={{"aria-label": "change date",}}
                                                    error={!!errors.deliveryDate}
                                                    helperText={t(errors.deliveryDate?.message)}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant='outlined'
                                            margin='normal'
                                            inputRef={register}
                                            fullWidth
                                            label={t("delivered_to")}
                                            name='deliveredTo'
                                            error={!!errors.deliveredTo}
                                            helperText={t(errors.deliveredTo?.message)}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant='outlined'
                                            margin='normal'
                                            inputRef={register}
                                            multiline
                                            // rows={3}
                                            fullWidth
                                            label={t("note")}
                                            name='note'
                                            error={!!errors.note}
                                            helperText={t(errors.note?.message)}
                                        />
                                    </Grid>
                                    <br/>
                                    <br/>
                                </Grid>
                            </Form.Group>
                        </Form.Row>

                        <Grid container spacing={2}>
                            <Grid item sm={3} xs={12}>

                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        size='large'
                        startIcon={<SaveIcon/>}
                        disabled={!formState.isValid}
                        onClick={handleSubmit(submitForm)}
                    >
                        {t("save")}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openFormCancelDialog} onClose={handleDialogFormCancelClose}
                    aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title"
                             style={{margin: "auto"}}>{t('cancel')} - {t('dossier')}</DialogTitle>
                <DialogContent>
                    <form className={classes.form} noValidate>
                        <Form.Row>
                            <Form.Group as={Col} style={{paddingTop: 22}}>
                                <Grid container spacing={2} style={{color: "red"}}>
                                    <Grid item xs={12}>
                                        <TextField
                                            variant='outlined'
                                            margin='normal'
                                            inputRef={register2}
                                            multiline
                                            // rows={3}
                                            fullWidth
                                            label={t("note")}
                                            name='canceledNote'
                                            error={!!errors2.canceledNote}
                                            helperText={t(errors2.canceledNote?.message)}
                                        />
                                    </Grid>
                                    <br/>
                                    <br/>
                                </Grid>
                            </Form.Group>
                        </Form.Row>
                    </form>
                </DialogContent>
                <DialogActions>
                    <Button
                        type='submit'
                        variant='contained'
                        color='primary'
                        fullWidth
                        size='large'
                        startIcon={<SaveIcon/>}
                        disabled={!formState2.isValid}
                        onClick={handleDialogClickOpen}
                    >
                        {t("save")}
                    </Button>
                </DialogActions>
            </Dialog>


            <Row>
                <Col>
                    <Card>
                        <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Card.Title as="h5">{t('dossiers_list')}</Card.Title>
                            <Tooltip title={t('reset_filters')}>
                                <Fab size={"small"} color="primary" aria-label="clear all filters"
                                     onClick={() => clearF()}>
                                    <FindReplaceIcon/>
                                </Fab>
                            </Tooltip>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} className={classes.rootForProg}>
                                    {/*{loading && <CircularProgress/>}*/}
                                    <Paper elevation={7} style={{maxWidth: '100%'}}>
                                        <DataGrid id="dataGrid" ref={dg}
                                                  dataSource={dossiers}
                                                  keyExpr="id"
                                                  height={730}
                                                  allowColumnReordering={true}
                                                  allowColumnResizing={true}
                                                  focusedRowEnabled={true}
                                                  showRowLines={true}
                                                  cellHintEnabled={true}
                                                  onOptionChanged={resetFilterValues}
                                                  onSelectionChanged={selectDossier}
                                                  wordWrapEnabled={false}
                                                  showBorders={true}
                                                  onExporting={onExporting}
                                            // showColumnLines={true}
                                            // columnHidingEnabled={true}
                                                  columnAutoWidth={true}
                                                  onRowPrepared={(e) => {
                                                      if (e.rowType === "data") {
                                                          if (e.data.repeateOrCopie === true) {
                                                              e.rowElement.style.backgroundColor = "#FA8BFF"
                                                              e.rowElement.style.backgroundImage = "linear-gradient(45deg, #FA8BFF 0%, #2BD2FF 52%, #2BFF88 90%)";
                                                              e.rowElement.style.backgroundAttachment = "fixed";
                                                              e.rowElement.style.backgroundSize = "cover";
                                                              e.rowElement.style.fontWeight = "bold";
                                                              // e.rowElement.style.color="white";
                                                          }
                                                          if (differenceInCalendarDays(new Date(), parseISO(e.data.lastDecisionDate)) > 14 && e.data.completed === false && e.data.rejected === false) {
                                                              e.rowElement.style.backgroundColor = "#ffffff";
                                                              e.rowElement.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(85,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%2380F'/%3E%3Cstop offset='1' stop-color='%23f40'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='28' height='28' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff' cx='14' cy='14' r='14'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)' fill-opacity='0'/%3E%3C/svg%3E\")";
                                                              e.rowElement.style.backgroundAttachment = "fixed";
                                                              e.rowElement.style.backgroundSize = "cover";
                                                              e.rowElement.style.fontWeight = "bold";
                                                              e.rowElement.style.color="white";
                                                          }
                                                          if (differenceInCalendarDays(new Date(), parseISO(e.data.dateDepot)) > 14 && e.data.lastDecisionDate === null && e.data.completed === false && e.data.rejected === false) {
                                                              e.rowElement.style.backgroundColor = "#ffffff";
                                                              e.rowElement.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(85,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%2380F'/%3E%3Cstop offset='1' stop-color='%23f40'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='28' height='28' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff' cx='14' cy='14' r='14'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)' fill-opacity='0'/%3E%3C/svg%3E\")";
                                                              e.rowElement.style.backgroundAttachment = "fixed";
                                                              e.rowElement.style.backgroundSize = "cover";
                                                              e.rowElement.style.fontWeight = "bold";
                                                              e.rowElement.style.color="white";
                                                          }

                                                      }
                                                  }}
                                        >
                                            <Export enabled={true} excelWrapTextEnabled={true} texts={{exportAll: t('exportAll')}}/>
                                            <Scrolling columnRenderingMode="vertical"/>
                                            <Sorting mode="multiple" ascendingText={t('sort_ascending')}
                                                     descendingText={t('sort_descending')}
                                                     clearText={t('clear_sorting')}/>
                                            {/*<Scrolling mode="virtual"/>*/}
                                            <LoadPanel enabled={loading}/>
                                            <HeaderFilter visible={true} allowSearch={true} texts={{cancel: t('cancel'), ok: t('ok'), emptyValue: t('empty')}}/>

                                            <FilterRow visible={true} operationDescriptions={{
                                                between: t('between'),
                                                contains: t('contains'),
                                                notContains: t('notContains'),
                                                equal: t('equal'),
                                                notEqual: t('notEqual'),
                                                endsWith: t('endsWith'),
                                                startsWith: t('startsWith'),
                                                greaterThan: t('greaterThan'),
                                                greaterThanOrEqual: t('greaterThanOrEqual'),
                                                lessThan: t('lessThan'),
                                                lessThanOrEqual: t('lessThanOrEqual')
                                            }} resetOperationText={t('reset')} showAllText={t('all')}
                                                       betweenStartText={t('start')}
                                                       betweenEndText={t('end')}/>
                                            <SearchPanel visible={true} width={250} placeholder={t('search')}/>
                                            <Paging defaultPageSize={10}/>
                                            <Pager showPageSizeSelector={true}
                                                   showNavigationButtons={true}
                                                   allowedPageSizes={[5, 15, 20, 100]}
                                                   showInfo={false}
                                                   infoText={`${t('Page')} {0} ${t('of')} {1} ({2} ${t('items')})`}/>

                                            <Column dataField="num" dataType="number" caption={t('number')}
                                                    defaultSortOrder="desc"
                                                    sortIndex="1" cellRender={cellRenderNum} fixed={true}/>
                                            <Column dataField="dateDepot" defaultSortOrder="desc" sortIndex="0"
                                                    dataType="date" format={'dd/MM/yyyy'}
                                                    caption={t('deposit_date')} allowHeaderFiltering={true}
                                                    filterValues={filterValues} filterType="include"/>
                                            <Column dataField="personName" dataType="string"
                                                    caption={t('person_name')}/>
                                            <Column dataField="commune" dataType="string" caption={t('commune')}
                                            />
                                            <Column dataField="section" caption={t('section')} dataType="number"
                                                    alignment='center' cssClass="cell-highlightedSection"/>
                                            <Column dataField="ilot" caption={t('ilot')} dataType="number"
                                                    alignment='center' cssClass="cell-highlightedIlot"/>
                                            <Column dataField="lot" caption={t('lot')} dataType="number"
                                                    alignment='center'
                                                    cssClass="cell-highlightedlot"/>
                                            <Column dataField="locality" dataType="string" caption={t('locality')}
                                                    allowSorting={false}/>
                                            <Column dataField="completed" dataType="boolean" caption={t('completed')}
                                                    trueText={t('true')} falseText={t('false')}/>
                                            <Column dataField="rejected" dataType="boolean" caption={t('rejected')}
                                                    trueText={t('true')} falseText={t('false')}/>
                                            <Column dataField="repeateOrCopie" dataType="boolean" caption={t('copy')}
                                                    trueText={t('true')} falseText={t('false')}/>
                                            <Column dataField="recordNum" dataType="number" alignment='left'
                                                    caption={t('record_number')}
                                                    defaultSortOrder="asc"/>
                                            <Column dataField="arrangeNum" dataType="number" alignment='left'
                                                    caption={t('arrange_number')}
                                                    defaultSortOrder="asc"/>
                                            <Column dataField="deliveryDate" defaultSortOrder="desc"
                                                    dataType="date" format={'dd/MM/yyyy'}
                                                    caption={t('delivery_date')}
                                                // allowHeaderFiltering={true}
                                                // filterValues={filterValues} filterType="include"
                                            />
                                            <Column dataField="deliveredTo" dataType="string"
                                                    caption={t('delivered_to')}/>
                                            <Column dataField="finalReg" dataType="boolean" caption={t('finalReg')}/>
                                            <Column dataField="tempReg" dataType="boolean" caption={t('tempReg')}/>
                                            <Column dataField="unknown" dataType="boolean" caption={t('unknown')}/>

                                            <Column dataField="note" dataType="string" caption={t('note')} width='180'/>
                                            <Column dataField="canceledNote" dataType="string" caption={t('canceledNote')} width='180'/>
                                            {/*<Column type="buttons">*/}
                                            {/*    /!*<Button icon="print" onClick={(e) => printDoss(e)}/>*!/*/}
                                            {/*    /!*<Button name="edit" onClick={(e) => routeChange(e)}/>*!/*/}
                                            {/*    /!*<Button name="delete" onClick={(e) => handleDialogClickOpen(e)}/>*!/*/}
                                            {/*    /!*<Button icon="exportpdf" visible={(e)=>showPdf(e)} onClick={(e) => downloadDoss(e)}/>*!/*/}

                                            {/*</Column>*/}
                                            <ColumnChooser enabled={true} mode="select" title={t('Column_chooser')}/>
                                            <GroupPanel visible={true} allowColumnDragging={true}
                                                        emptyPanelText={t('group_panel_text')}/>
                                            <Grouping autoExpandAll={false}/>
                                            {/*<Editing*/}
                                            {/*    allowUpdating={true}*/}
                                            {/*    allowDeleting={true}*/}
                                            {/*    allowAdding={false}*/}
                                            {/*/>*/}
                                            <Selection mode="single"/>
                                            <Summary>
                                                <GroupItem summaryType="count">
                                                </GroupItem>
                                                <TotalItem
                                                    column="num"
                                                    summaryType="count" customizeText={customizeText}/>
                                            </Summary>

                                        </DataGrid>
                                        <CustomView condition={isDesktop}>
                                            <SpeedDialAction
                                                icon="print"
                                                label={t('print')}
                                                index={1}
                                                visible={selectedRowIndex !== undefined && selectedRowIndex !== -1}
                                                onClick={(e) => printDoss(e)}/>
                                            <SpeedDialAction
                                                icon="edit"
                                                label={t('edit')}
                                                index={2}
                                                visible={selectedRowIndex !== undefined && selectedRowIndex !== -1 && d.current.canceled!==true}
                                                onClick={(e) => routeChange(e)}/>
                                            <SpeedDialAction
                                                icon="copy"
                                                label={t('copy')}
                                                index={2}
                                                visible={selectedRowIndex !== -1 && d.current.recordNum!==''}
                                                onClick={(e) => handleDialogFormClickOpen(e)}/>
                                            <SpeedDialAction
                                                icon="clearformat"
                                                label={t('cancel')}
                                                index={3}
                                                visible={selectedRowIndex !== -1 && d.current !== null && d.current.canceled!==true}
                                                onClick={() => handleDialogFormCancelClickOpen()}/>
                                            <SpeedDialAction
                                                icon="exportpdf"
                                                label={t('download dossier')}
                                                index={4}
                                                visible={shPdf === true && selectedRowIndex !== undefined && selectedRowIndex !== -1}
                                                onClick={(e) => downloadDoss(e)}/>
                                        </CustomView>
                                    </Paper>

                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    )
})


export default windowSize(DossierList)
