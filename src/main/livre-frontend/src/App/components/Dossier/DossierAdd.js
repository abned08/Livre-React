import React, {useState, useEffect, useRef, useCallback, useMemo} from "react";
import {useDispatch, useSelector} from "react-redux";
import {unwrapResult} from "@reduxjs/toolkit";
import {
    addDossiers,
    lastDossier,
    updDossier,
    downloadDossier,
    checkNumThisYear,
    matchDossierLivre,
    lastLivreDossier, matchRecArngNumDossierLivre, fetchDossiers
} from "./DossierSlice";
import "./style.css";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import CircularProgress from "@material-ui/core/CircularProgress";
import PostAddIcon from "@material-ui/icons/PostAdd";
import SaveIcon from "@material-ui/icons/Save";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import Snackbar from "@material-ui/core/Snackbar";
import {Alert, AlertTitle} from "@material-ui/lab";
import Collapse from "@material-ui/core/Collapse";
import {KeyboardDatePicker} from "@material-ui/pickers";
import {makeStyles} from "@material-ui/core/styles";
import {useForm, Controller} from "react-hook-form";
import {Row, Col, Card, Form} from "react-bootstrap";
import Aux from "../../../hoc/_Aux";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import MuiAlert from "@material-ui/lab/Alert";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary, FormControlLabel,
    FormHelperText,
} from "@material-ui/core";
import {useHistory} from "react-router-dom";
import Autocomplete from "@material-ui/lab/Autocomplete";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import CommuneList from "../Commune/CommuneList";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import {fetchCommunes} from "../Commune/CommuneSlice";
import {useTranslation} from "react-i18next";
import {FilePond, registerPlugin} from "react-filepond";
import "filepond/dist/filepond.min.css";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginPdfPreview from "filepond-plugin-pdf-preview";
import Badge from "@material-ui/core/Badge";
import withStyles from "@material-ui/core/styles/withStyles";
import Slide from "@material-ui/core/Slide";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// import {RHFInput} from "react-hook-form-input";
// import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    span: {
        fontWeight: "bold",
    },
}));

const initialValues = {
    num: "",
    dateDepot: new Date(),
    personName: "",
    commune: "",
    section: "",
    ilot: "",
    lot: "",
    locality: "",
    note: "",
    completed: false,
    rejected: false,
    recordNum: "",
    arrangeNum: "",
    deliveryDate: null,
    // doubling: false,
    repeateOrCopie: false,
    deliveredTo: "",
    finalReg:false,
    tempReg:false,
    unknown:false,
    crossedOut:0
}

const validationShape = {
    num: yup.string().required("required").max(4, "ilot_max_is_9999").nullable(),
    dateDepot: yup.date().typeError("must_be_a_date").required("required").nullable(),
    personName: yup.string().required("required"),
    commune: yup.string().required("required").nullable(),
    section: yup.string().max(3, "section_max_is_999").required("required"),
    ilot: yup.string().max(4, "ilot_max_is_9999").required("required"),
    lot: yup.string().max(3, "lot_max_is_999").nullable(true),
    locality: yup.string().required("required"),
}
const livreShape = {
    recordNum: yup.string().max(4, "field_max_is_9999").required("required"),
    arrangeNum: yup.string().required("required").max(4, "field_max_is_9999"),
    deliveryDate: yup.date().typeError("must_be_a_date").required("required").nullable(),
    deliveredTo: yup.string().required("required"),
}

function AlertSnack(props) {
    return <MuiAlert elevation={6} variant='filled' {...props} />;
}

const StyledBadge = withStyles((theme) => ({
    badge: {
        right: 19,
        top: 14,
        border: `2px solid ${theme.palette.background.paper}`,
        padding: "13px 10px",
        borderRadius: 50,
    },
}))(Badge);

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction='up' ref={ref} {...props} />;
});

const DossierAdd = ({match}) => {
    const {dossierId} = match.params ? match.params : null;
    const classes = useStyles();
    const {t} = useTranslation();
    const [checked, setChecked] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [files, setFiles] = useState([]);
    const [expanded, setExpanded] = useState(false);
    registerPlugin(FilePondPluginFileValidateType, FilePondPluginPdfPreview);
    const dispatch = useDispatch();

    const validationSchema = yup.object().shape(expanded ? {...validationShape, ...livreShape} : validationShape)

    const {register, handleSubmit, errors, control, setValue, reset, getValues, watch, formState} = useForm({
        defaultValues: initialValues,
        mode: "onChange",
        resolver: yupResolver(validationSchema),
        shouldUnregister: false,
    });
    const {loading, error, lastD, lastLD, success, communes, matchDL, matchRecArngNumDL} = useSelector((state) => ({
        loading: state.dossier.loading,
        error: state.dossier.error,
        success: state.dossier.success,
        lastD: state.dossier.lastD,
        lastLD: state.dossier.lastLD,
        matchDL: state.dossier.matchDL,
        matchRecArngNumDL: state.dossier.mtchRecArngNumDL,
        communes: state.commune.communes,
    }));

    const [open, setOpen] = useState(false);
    const [openRed, setOpenred] = useState(false);
    const [openRed2, setOpenred2] = useState(false)
    const dossier = useSelector((state) => dossierId && state.dossier.dossiers.find((dossier) => dossier.id === parseInt(dossierId)));
    const d = useRef(null);

    const handleDialogClickOpen = () => {
        setOpenDialog(true);
    };
    const handleDialogClose = () => {
        setOpenDialog(false);
    };

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(() => false);
        setOpenred(() => false);
        setOpenred2(() => false);
    };

    const handleCheckboxes = (val) => {
        const comp = getValues(["completed", "rejected"]);
        if (Object.values(comp).every((el) => el === true)) {
            Object.keys(comp).forEach((key) => {
                setValue(key, false)
            });
            setValue(val, true)
        }
    }
    const handleCheckboxes2 = (val) => {
        const comp2 = getValues(["finalReg", "tempReg", "unknown"]);
         if (Object.values(comp2).find((el) => el === true)) {
            Object.keys(comp2).forEach((key) => {
                setValue(key, false)
            });
            setValue(val, true)
        }
    }

    const filePondRef = useRef(null);
    const fields = Object.keys(initialValues);
    useEffect(() => {
        // setExpanded(false)
        if (dossierId && !dossier) {
            dispatch(fetchDossiers())
        }
        dispatch(fetchCommunes())
        if (dossier) {
            d.current = dossier
            if (d.current.recordNum) {
                setExpanded(() => true)
            }
            fields.forEach((field) =>
                setValue(field, d.current[field], {
                    shouldValidate: true,
                    shouldDirty: true,
                })
            );
            if (dossier.pdfFile) {
                dispatch(downloadDossier(d.current.id))
                    .then(unwrapResult)
                    .then((res) => {
                        const blob = new Blob([res], {type: "application/pdf"});
                        var fileURL = URL.createObjectURL(blob);
                        setFiles(fileURL);
                        filePondRef.current = {
                            allowPdfPreview: true,
                            pdfPreviewHeight: 300,
                            pdfComponentExtraParams: "toolbar=0&view=fit&page=1",
                        };
                    })
                    .catch((er) => {
                        if (er?.data.size === 0) setFiles([]);
                    });
            }
        } else {
            d.current = null;
        }
        // eslint-disable-next-line
    }, [dossier]);

    useEffect(() => {
        !dossier && dispatch(lastDossier()).then(setValue("num", lastD + 1));
        // eslint-disable-next-line
    }, [lastD, success])

    const [duplicateNum, setDuplicateNum] = useState(0);
    const watchNum = watch("num");
    useEffect(() => {
        dispatch(checkNumThisYear(watchNum)).then((dt) => {
            setDuplicateNum(dt.payload);
        })
    }, [dispatch, watchNum]);
    useEffect(() => {
        if (error) {
            setChecked(true);
            setTimeout(() => {
                setChecked(false);
            }, 5000);
        }

    }, [error]);

    // const mdl = useRef(null)
    const createDossier = (data) => {
        if (!matchDL && !matchRecArngNumDL) {
            dispatch(addDossiers(data)).then(unwrapResult)
            if (success !== "") {
                setOpen(true)
                reset(initialValues)
                setFiles([])
                setExpanded(false)
            }
        } else {
            matchDL && setOpenred(true)
            matchRecArngNumDL && setOpenred2(true)
        }
    }

    const c = watch("commune")
    const s = watch("section")
    const i = watch("ilot")
    const l = watch("lot")
    useMemo(() => {
        if (c && s && i) {
            if (dossier?.commune === c && dossier?.section === s && dossier?.ilot === i && dossier?.lot === l) {
                openRed && setOpenred(() => false)
                return
            }
            openRed && setOpenred(() => false)
            dispatch(matchDossierLivre(getValues())).then((dt) => {
                if (dt.payload) {
                    setOpenred(() => true)
                }
            })
        }
        // eslint-disable-next-line
    }, [c, s, i, l])

    let history = useHistory();
    const updateDossier = (data) => {
        // data.id = d.current.id
        dispatch(updDossier(data)).then(unwrapResult)
        if (success !== "") {
            setOpen(true)
            setTimeout(() => history.push(`/dossiers`), 1000)
        }
    };

    const f = useRef("")
    const submitForm = (data) => {
        // const dataD={...data,dateDepot:format(new Date(data.dateDepot),"YYYY/MM/DD")}
        // console.log(format(data.dateDepot))
        const formData = new FormData()
        for (const key in data) {
            formData.append(key, data[key])
        }
        f.current = files.length > 0 ? files[0].file : ""
        formData.append("files", f.current)
        // for (var pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }
        d.current && formData.append("id", d.current.id)
        return d.current ? updateDossier(formData) : createDossier(formData)
    }


    const setInvisible = useCallback(() => {
        if (dossier) {
            if (watchNum === dossier.num) {
                return true;
            } else return duplicateNum < 1;
        } else {
            return duplicateNum < 1;
        }
    }, [watchNum, dossier, duplicateNum]);

    const rec = watch("recordNum")
    const arr = watch("arrangeNum")
    useMemo(() => {
        if (rec && arr) {
            if (dossier?.recordNum === rec && dossier?.arrangeNum === arr) {
                openRed2 && setOpenred2(() => false)
                return
            }
            openRed2 && setOpenred2(() => false)
            dispatch(matchRecArngNumDossierLivre(getValues())).then((dt) => {
                if (dt.payload) {
                    setOpenred2(() => true)
                }
            })
        }
        // eslint-disable-next-line
    }, [rec, arr])

    useEffect(() => {
        dispatch(lastLivreDossier())
        if (expanded) {
            if (!dossier || !dossier.recordNum) {
                setValue("recordNum", lastLD && lastLD.recordNum ? lastLD.recordNum : 1)
                setValue("arrangeNum", lastLD && lastLD.arrangeNum ? parseInt(lastLD.arrangeNum) + 1 : 1)
                setValue("deliveryDate", new Date())
                if (getValues("personName"))
                    setValue("deliveredTo", getValues("personName"))
            }
        } else {
            if (!dossier) {
                setValue("recordNum", "")
                setValue("arrangeNum", "")
                setValue("deliveryDate", null)
                setValue("deliveredTo", "")
            }
        }
        // eslint-disable-next-line
    }, [expanded])
    const expandConditions = () => {
      if (watch("completed")===true && watch("finalReg")===true)
            setExpanded(!expanded)
      else alert(t('dossier_alert'));
    }
    return (
        <Aux>
            <Dialog
                open={openDialog}
                onClose={handleDialogClose}
                aria-labelledby='form-dialog-title'
                fullWidth={true}
                maxWidth='md'
                TransitionComponent={Transition}
            >
                <DialogTitle id='form-dialog-title'>{t("communes")}</DialogTitle>
                <DialogContent>
                    <CommuneList/>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleDialogClose}
                        variant='contained'
                        color='secondary'
                    >
                        {t("close")}
                    </Button>
                </DialogActions>
            </Dialog>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as='h5'>
                                {d.current ? t("edit") : t("add")} {t("dossier")}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Collapse in={checked}>
                                <Alert variant='filled' severity='error'>
                                    <AlertTitle>{t("error")}</AlertTitle>There is an error —{" "}
                                    <strong>
                                        {error && (error?.data?.size === 0 ? t("error dossier deleted") : error)}
                                    </strong>
                                </Alert>
                            </Collapse>
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
                            <Snackbar
                                open={openRed}
                                autoHideDuration={4000}
                                anchorOrigin={{vertical: "top", horizontal: "right"}}
                                onClose={handleClose}
                            >
                                <AlertSnack onClose={handleClose} severity='error'>
                                    {t("delivered_dossier")}
                                </AlertSnack>
                            </Snackbar>
                            <Snackbar open={openRed2} autoHideDuration={4000}
                                      anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose}>
                                <AlertSnack onClose={handleClose} severity="error">{t('duplicated_livre_RecArng')}
                                </AlertSnack>
                            </Snackbar>
                            <Row>
                                <Col md={12}>
                                    <div className={classes.paper}>
                                        <Avatar className={classes.avatar}>
                                            <PostAddIcon/>
                                        </Avatar>
                                        <Typography component='h1' variant='h5'>
                                            {d.current ? t("edit") : t("add")} {t("dossier")}
                                        </Typography>
                                        {loading ? (
                                            <CircularProgress/>
                                        ) : (
                                            <form
                                                className={classes.form}
                                                noValidate
                                                onSubmit={handleSubmit(submitForm)}
                                            >
                                                <Form.Row>
                                                    <Form.Group as={Col} md={6}>
                                                        <Grid container spacing={2}>
                                                            <Grid item md={6} xs={12}>
                                                                <StyledBadge
                                                                    badgeContent={duplicateNum}
                                                                    color='error'
                                                                    overlap="rectangular"
                                                                    title={t("duplicate")}
                                                                    invisible={setInvisible()}
                                                                    max={99}
                                                                    style={{display: "flex"}}
                                                                >
                                                                    <TextField
                                                                        onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                                        onChange={(e) => e.target.value = e.target.value <= 0 ? "" : e.target.value}
                                                                        name='num'
                                                                        label={t("number")} variant='outlined'
                                                                        type='number'
                                                                        InputLabelProps={d.current && {shrink: true}}
                                                                        margin='normal'
                                                                        inputRef={register}
                                                                        placeholder='0000'
                                                                        error={!!errors.num}
                                                                        fullWidth
                                                                        helperText={t(errors.num?.message)}
                                                                    />
                                                                </StyledBadge>
                                                            </Grid>
                                                            <Grid item md={6} xs={12}>
                                                                <Controller
                                                                    control={control}
                                                                    name='dateDepot'
                                                                    defaultValue={new Date()}
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
                                                                            label={t("deposit_date")}
                                                                            InputLabelProps={d.current && {shrink: true}}
                                                                            value={value}
                                                                            onChange={onChange}
                                                                            format='dd/MM/yyyy'
                                                                            placeholder='00/00/0000'
                                                                            KeyboardButtonProps={{
                                                                                "aria-label": "change date",
                                                                            }}
                                                                            error={!!errors.dateDepot}
                                                                            helperText={t(errors.dateDepot?.message)}
                                                                        />
                                                                    )}
                                                                />
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <TextField
                                                                    onKeyPress={(e)=>/[0-9]/.test(e.key) && e.preventDefault()}
                                                                    variant='outlined'
                                                                    margin='normal'
                                                                    inputRef={register}
                                                                    fullWidth
                                                                    id='personName'
                                                                    label={t("person_name")}
                                                                    name='personName'
                                                                    autoFocus
                                                                    InputLabelProps={
                                                                        d.current && {shrink: true}
                                                                    }
                                                                    error={!!errors.personName}
                                                                    helperText={t(errors.personName?.message)}
                                                                />
                                                            </Grid>
                                                            <Grid item md={1} style={{marginTop: 24, paddingLeft: 0}}>
                                                                <Tooltip title={t("add_commune")} aria-label='add'>
                                                                    <Fab
                                                                        color='primary'
                                                                        aria-label='add'
                                                                        size='small'
                                                                        onClick={() => handleDialogClickOpen()}>
                                                                        <AddIcon/>
                                                                    </Fab>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item md={11} xs={12}>
                                                                <Controller
                                                                    render={(props) => (
                                                                        <Autocomplete
                                                                            autoComplete
                                                                            {...props}
                                                                            options={communes.map((com) => com.communeName)}
                                                                            getOptionLabel={(option) => option}
                                                                            getOptionSelected={(option, value) => option.name === value.name}
                                                                            renderInput={(params) => (
                                                                                <TextField
                                                                                    {...params}
                                                                                    variant='outlined'
                                                                                    margin='normal'
                                                                                    fullWidth
                                                                                    label={t("commune")}
                                                                                    InputLabelProps={d.current && {shrink: true}}
                                                                                    error={!!errors.commune}
                                                                                    helperText={t(errors.commune?.message)}
                                                                                />
                                                                            )}
                                                                            onChange={(_, data) =>
                                                                                props.onChange(data)
                                                                            }
                                                                        />
                                                                    )}
                                                                    name='commune'
                                                                    control={control}
                                                                />
                                                            </Grid>

                                                            <Grid item md={4} xs={12}>
                                                                <TextField
                                                                    onKeyDown={(evt) =>
                                                                        ["e", "E", "+", "-", "."].includes(evt.key) &&
                                                                        evt.preventDefault()
                                                                    }
                                                                    variant='outlined'
                                                                    margin='normal'
                                                                    type='number'
                                                                    onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                    inputRef={register}
                                                                    fullWidth
                                                                    InputLabelProps={d.current && {shrink: true}}
                                                                    label={t("section")}
                                                                    name='section'
                                                                    error={!!errors.section}
                                                                    helperText={t(errors.section?.message)}
                                                                />
                                                            </Grid>
                                                            <Grid item md={4} xs={12}>
                                                                <TextField
                                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                                    variant='outlined'
                                                                    margin='normal'
                                                                    type='number'
                                                                    onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                    inputRef={register}
                                                                    InputLabelProps={d.current && {shrink: true}}
                                                                    fullWidth
                                                                    label={t("ilot")}
                                                                    name='ilot'
                                                                    error={!!errors.ilot}
                                                                    helperText={t(errors.ilot?.message)}
                                                                />
                                                            </Grid>
                                                            <Grid item md={4} xs={12}>
                                                                <TextField
                                                                    onKeyDown={(evt) =>
                                                                        ["e", "E", "+", "-", "."].includes(evt.key) &&
                                                                        evt.preventDefault()
                                                                    }
                                                                    variant='outlined'
                                                                    margin='normal'
                                                                    type='number'
                                                                    onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                    inputRef={register}
                                                                    InputLabelProps={d.current && {shrink: true}}
                                                                    fullWidth
                                                                    label={t("lot")}
                                                                    name='lot'
                                                                    error={!!errors.lot}
                                                                    helperText={t(errors.lot?.message)}
                                                                />
                                                            </Grid>

                                                            <Grid item md={6} xs={12}>
                                                                <FormControl
                                                                    variant='outlined'
                                                                    fullWidth
                                                                    margin='normal'
                                                                    error={!!errors.locality}
                                                                >
                                                                    <InputLabel>{t("locality")}</InputLabel>
                                                                    <Controller
                                                                        control={control}
                                                                        name='locality'
                                                                        render={({onChange, value}) => (
                                                                            <Select
                                                                                label={t("locality")}
                                                                                onChange={onChange}
                                                                                value={value}
                                                                            >
                                                                                <MenuItem value=''>
                                                                                    <em>{t("None")}</em>
                                                                                </MenuItem>
                                                                                <MenuItem value='حضرية'>
                                                                                    {t("urban")}
                                                                                </MenuItem>
                                                                                <MenuItem value='ريفية'>
                                                                                    {t("rural")}
                                                                                </MenuItem>
                                                                                <MenuItem value='صحراوية'>
                                                                                    {t("desert")}
                                                                                </MenuItem>
                                                                            </Select>
                                                                        )}
                                                                    />
                                                                    <FormHelperText>
                                                                        {t(errors.locality?.message)}
                                                                    </FormHelperText>
                                                                </FormControl>
                                                            </Grid>
                                                            <Grid item md={6} xs={12}>
                                                                <TextField
                                                                    variant='outlined'
                                                                    margin='normal'
                                                                    inputRef={register}
                                                                    InputLabelProps={
                                                                        d.current && {shrink: true}
                                                                    }
                                                                    multiline
                                                                    // rows={3}
                                                                    fullWidth
                                                                    label={t("note")}
                                                                    name='note'
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Form.Group>
                                                    <Form.Group
                                                        as={Col}
                                                        md={6}
                                                        style={{paddingTop: 22}}
                                                    >
                                                        <Grid container spacing={2}>
                                                            <Grid item xs={12} style={{
                                                                backgroundColor: expanded ? "#C2F5C4" : "#EAEEF3",
                                                                borderRadius: 10,
                                                            }}
                                                            >
                                                                <Grid item xs={12}>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                name="checkedLivre"
                                                                                onChange={expandConditions}
                                                                                disabled={dossier && dossier?.recordNum !== ""}
                                                                                checked={expanded}
                                                                            />}
                                                                        label={t('deliver_livre')}
                                                                    />
                                                                </Grid>
                                                                <Accordion expanded={expanded} height={52}>
                                                                    <AccordionSummary
                                                                        expandIcon={<ExpandMoreIcon/>}
                                                                        aria-controls='panel1a-content'
                                                                        id='panel1a-header'
                                                                    >
                                                                        <Typography>{t("livre")}</Typography>
                                                                    </AccordionSummary>
                                                                    <AccordionDetails>
                                                                        <Grid container spacing={2}>

                                                                            <Grid item md={3} xs={12}>
                                                                                <TextField
                                                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                                                    onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                                    name='recordNum'
                                                                                    label={t("record_number")}
                                                                                    variant='outlined'
                                                                                    type='number'
                                                                                    InputLabelProps={expanded === true ? {shrink: true} : {shrink: false}}
                                                                                    margin='normal'
                                                                                    inputRef={register}
                                                                                    placeholder='0000'
                                                                                    error={!!errors.recordNum}
                                                                                    fullWidth
                                                                                    helperText={t(errors.recordNum?.message)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item md={3} xs={12}>
                                                                                <TextField
                                                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                                                    onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                                    name='arrangeNum'
                                                                                    label={t("arrange_number")}
                                                                                    variant='outlined'
                                                                                    type='number'
                                                                                    InputLabelProps={expanded === true ? {shrink: true} : {shrink: false}}
                                                                                    margin='normal'
                                                                                    inputRef={register}
                                                                                    placeholder='0000'
                                                                                    error={!!errors.arrangeNum}
                                                                                    fullWidth
                                                                                    helperText={t(errors.arrangeNum?.message)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item md={6} xs={12}>
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
                                                                                            InputLabelProps={expanded === true ? {shrink: true} : {shrink: false}}
                                                                                            value={value}
                                                                                            onChange={onChange}
                                                                                            format='dd/MM/yyyy'
                                                                                            placeholder='00/00/0000'
                                                                                            KeyboardButtonProps={{"aria-label": "change date",}}
                                                                                            disabled={!expanded}
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
                                                                                    InputLabelProps={expanded === true ? {shrink: true} : {shrink: false}}
                                                                                    error={!!errors.deliveredTo}
                                                                                    helperText={t(errors.deliveredTo?.message)}
                                                                                />
                                                                            </Grid>
                                                                            <Grid item xs={12}>
                                                                                <TextField
                                                                                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                                                                                    onChange={(e) => e.target.value <= 0 ? (e.target.value = "0") : e.target.value}
                                                                                    name='crossedOut'
                                                                                    label={t("crossedOut")}
                                                                                    variant='outlined'
                                                                                    type='number'
                                                                                    InputLabelProps={expanded === true ? {shrink: true} : {shrink: false}}
                                                                                    margin='normal'
                                                                                    inputRef={register}
                                                                                    placeholder='0000'
                                                                                    error={!!errors.crossedOut}
                                                                                    fullWidth
                                                                                    helperText={t(errors.crossedOut?.message)}
                                                                                />
                                                                            </Grid>
                                                                            <br/>
                                                                            <br/>
                                                                            {/*<Grid item md={7} xs={12}>*/}
                                                                            {/*    <RHFInput*/}
                                                                            {/*        name="repeateOrCopie"*/}
                                                                            {/*        type="checkbox"*/}
                                                                            {/*        register={register}*/}
                                                                            {/*        setValue={setValue}*/}
                                                                            {/*        as={<FormControlLabel*/}
                                                                            {/*            control={*/}
                                                                            {/*                <Switch/>*/}
                                                                            {/*            }*/}
                                                                            {/*            label={t('copy')}*/}
                                                                            {/*        />}*/}

                                                                            {/*    />*/}
                                                                            {/*</Grid>*/}
                                                                        </Grid>
                                                                    </AccordionDetails>
                                                                </Accordion>
                                                            </Grid>
                                                            <Grid item xs={12} style={{marginTop: 16, marginLeft: 6, marginBottom: 16}}>
                                                                <div className='pretty p-icon p-round p-tada p-toggle'
                                                                     style={{fontSize: 23}}>
                                                                    <input type='checkbox' name='completed'
                                                                           ref={register}
                                                                           onChange={(e) => handleCheckboxes(e.target.name)}/>
                                                                    <div className='state p-success p-on'>
                                                                        <div className='state p-success'>
                                                                            <i className='icon fas fa-check'/>
                                                                        </div>
                                                                        <label>{t("completed")}</label>
                                                                    </div>
                                                                    <div className='state p-warning-o p-off'>
                                                                        <div className='state p-warning-o'>
                                                                            <i className='icon fas fa-hourglass-half'/>
                                                                        </div>
                                                                        <label>{t("completed")}</label>
                                                                    </div>
                                                                </div>
                                                                <div className='pretty p-icon p-round p-tada p-toggle'
                                                                     style={{fontSize: 23}}>
                                                                    <input type='checkbox' name='rejected'
                                                                           ref={register}
                                                                           onChange={(e) => handleCheckboxes(e.target.name)}/>
                                                                    <div className='state p-danger p-on'>
                                                                        <div className='state p-danger'>
                                                                            <i className='icon fas fa-times'/>
                                                                        </div>
                                                                        <label>{t("rejected")}</label>
                                                                    </div>
                                                                    <div className='state p-warning-o p-off'>
                                                                        <div className='state p-warning-o'>
                                                                            <i className='icon fas fa-hourglass-half'/>
                                                                        </div>
                                                                        <label>{t("rejected")}</label>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12} style={{marginTop: 16, marginLeft: 6, marginBottom: 16}}>
                                                                <div className='pretty p-icon p-round p-smooth p-plain p-toggle'
                                                                     style={{fontSize: 23}}>
                                                                    <input type='checkbox' name='finalReg'
                                                                           ref={register}
                                                                           onChange={(e) => handleCheckboxes2(e.target.name)}/>
                                                                    <div className='state p-success p-on'>
                                                                        <div className='state p-success'>
                                                                            <i className='icon fas fa-award'/>
                                                                        </div>
                                                                        <label>{t("finalReg")}</label>
                                                                    </div>
                                                                    <div className='state p-warning-o p-off'>
                                                                        <div className='state p-warning-o'>
                                                                            <i className='icon fas fa-hourglass-half'/>
                                                                        </div>
                                                                        <label>{t("finalReg")}</label>
                                                                    </div>
                                                                </div>
                                                                <div className='pretty p-icon p-round p-smooth p-plain p-toggle'
                                                                     style={{fontSize: 23}}>
                                                                    <input type='checkbox' name='tempReg'
                                                                           ref={register}
                                                                           onChange={(e) => handleCheckboxes2(e.target.name)}/>
                                                                    <div className='state p-primary p-on'>
                                                                        <div className='state p-primary'>
                                                                            <i className='icon fas fa-clock'/>
                                                                        </div>
                                                                        <label>{t("tempReg")}</label>
                                                                    </div>
                                                                    <div className='state p-warning-o p-off'>
                                                                        <div className='state p-warning-o'>
                                                                            <i className='icon fas fa-hourglass-half'/>
                                                                        </div>
                                                                        <label>{t("tempReg")}</label>
                                                                    </div>
                                                                </div>
                                                                <div className='pretty p-icon p-round p-smooth p-plain p-toggle'
                                                                     style={{fontSize: 23}}>
                                                                    <input type='checkbox' name='unknown'
                                                                           ref={register}
                                                                           onChange={(e) => handleCheckboxes2(e.target.name)}/>
                                                                    <div className='state p-danger p-on'>
                                                                        <div className='state p-danger'>
                                                                            <i className='icon fas fa-fingerprint'/>
                                                                        </div>
                                                                        <label>{t("unknown")}</label>
                                                                    </div>
                                                                    <div className='state p-warning-o p-off'>
                                                                        <div className='state p-warning-o'>
                                                                            <i className='icon fas fa-hourglass-half'/>
                                                                        </div>
                                                                        <label>{t("unknown")}</label>
                                                                    </div>
                                                                </div>
                                                            </Grid>
                                                            <Grid item xs={12}>
                                                                <FilePond
                                                                    ref={filePondRef}
                                                                    name='files'
                                                                    files={files}
                                                                    onupdatefiles={setFiles}
                                                                    required={false}
                                                                    allowBrowse={true}
                                                                    allowProcess={false}
                                                                    maxFiles={1}
                                                                    instantUpload={false}
                                                                    acceptedFileTypes={["application/pdf"]}
                                                                    labelIdle={t("dnd", {
                                                                        brows: '<span class="filepond--label-action"> PDF</span>',
                                                                        interpolation: {escapeValue: false},
                                                                    })}
                                                                />
                                                            </Grid>
                                                        </Grid>
                                                    </Form.Group>
                                                </Form.Row>

                                                <Grid container spacing={2}>
                                                    <Grid item sm={3} xs={12}>
                                                        <Button
                                                            type='submit'
                                                            variant='contained'
                                                            color='primary'
                                                            fullWidth
                                                            size='large'
                                                            className={classes.button}
                                                            startIcon={<SaveIcon/>}
                                                            disabled={!formState.isValid}
                                                        >
                                                            {t("save")}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </form>
                                        )}
                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
};
export default DossierAdd;
