import React, {useState, useEffect, useRef} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {unwrapResult} from '@reduxjs/toolkit'
import {addLivre, lastLivre, updLivre, matchLivre,matchRecArngNumLivre} from './LivreSlice'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import CircularProgress from '@material-ui/core/CircularProgress'
import PostAddIcon from '@material-ui/icons/PostAdd'
import SaveIcon from '@material-ui/icons/Save'
import Typography from '@material-ui/core/Typography'
import Snackbar from '@material-ui/core/Snackbar'
import {Alert, AlertTitle} from '@material-ui/lab'
import Collapse from '@material-ui/core/Collapse'
import 'date-fns'
import {KeyboardDatePicker} from '@material-ui/pickers'
import {makeStyles} from '@material-ui/core/styles'
import {useForm, Controller} from 'react-hook-form'
import {Row, Col, Card, Form} from 'react-bootstrap'
import Aux from '../../../hoc/_Aux'
import {yupResolver} from '@hookform/resolvers/yup'
import * as yup from "yup"
import MuiAlert from '@material-ui/lab/Alert'
import {useHistory} from "react-router-dom"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Switch from "@material-ui/core/Switch"
import {RHFInput} from "react-hook-form-input"
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Dialog from "@material-ui/core/Dialog";
import CommuneList from "../Commune/CommuneList";
import Fab from "@material-ui/core/Fab";
import AddIcon from '@material-ui/icons/Add';
import Tooltip from "@material-ui/core/Tooltip";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {fetchCommunes} from "../Commune/CommuneSlice";
import {useTranslation} from "react-i18next";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    span: {
        fontWeight: 'bold'
    },
    button:{
        margin: theme.spacing(1)
    }
}))

const initialValues = {
    town: "بشار",
    section: "",
    ilot: "",
    lot: "",
    doubling: false,
    deliveryDate: new Date(),
    recordNum: "",
    arrangeNum: "",
    repeateOrCopie: false,
    deliveredTo: "",
    note: ""
}

const schema = yup.object().shape({
    town: yup.string().required('required').nullable(),
    section: yup.number().required('required').max(999, "section_max_is_999").typeError("required"),
    ilot: yup.number().required("required").max(9999, "ilot_max_is_9999").typeError("required"),
    lot: yup.number().max(999, "lot_max_is_999").nullable()
        .transform((value, originalValue) => originalValue.trim() === "" ? null : value).typeError("must_be_a_number"),
    deliveryDate: yup.date().typeError("must_be_a_date").required("required").nullable(),
    recordNum: yup.number().required("required").max(9999, "field_max_is_9999").typeError("required"),
    arrangeNum: yup.number().required("required").max(9999, "field_max_is_9999").typeError("required"),
    deliveredTo: yup.string().required("required"),

})

function AlertSnack(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />
}
const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const LivreAdd = ({match}) => {
    const {livreId} = match.params ? match.params : null
    const classes = useStyles()
    const {t} = useTranslation()
    const [checked, setChecked] = useState(false)
    const [openDialog, setOpenDialog] = useState(false);
    const dispatch = useDispatch()
    const {register, handleSubmit, errors, control, setValue, reset} = useForm({
        defaultValues: initialValues,
        mode: 'onChange',
        resolver: yupResolver(schema),
        shouldUnregister: false
    })
    const {loading, error, success, lastL, mtchLivre,mtchRecArngNumLivre, communes} = useSelector(state => ({
        loading: state.livre.loading,
        error: state.livre.error,
        success: state.livre.success,
        lastL: state.livre.lastL,
        mtchLivre: state.livre.mtchLivre,
        mtchRecArngNumLivre: state.livre.mtchRecArngNumLivre,
        communes: state.commune.communes
    }))

    const [open, setOpen] = useState(false)
    const [openRed, setOpenred] = useState(false)
    const [openRed2, setOpenred2] = useState(false)
    const livre = useSelector(state =>
        livreId && state.livre.livres.find(livre => livre.id === parseInt(livreId))
    )
    const d = useRef(null)

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return
        }
        setOpen(() => false)
        setOpenred(() => false)
        setOpenred2(() => false)
    }

    const handleDialogClickOpen = () => {
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false);
    };
    const fields = Object.keys(initialValues)
    useEffect(() => {
        dispatch(fetchCommunes())
        if (livre) {
            d.current = livre
            fields.forEach(field => setValue(field, d.current[field], {shouldValidate: true, shouldDirty: true}))
        } else {
            d.current = null
            dispatch(lastLivre()).then(setValue("recordNum", lastL.recordNum > 0 ? lastL.recordNum : 1), setValue("arrangeNum", lastL.arrangeNum + 1))
        }
        if (error) {
            setChecked(true)
            setTimeout(() => {
                setChecked(false)
            }, 5000)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [livre, error, lastL.recordNum, lastL.arrangeNum, success])

    const ml = useRef("")
    const mlRecArng = useRef("")
    useEffect(() => {
        ml.current = mtchLivre
        mlRecArng.current = mtchRecArngNumLivre
    }, [mtchLivre,mtchRecArngNumLivre])

    const createLivre = (data) => {
        dispatch(matchRecArngNumLivre(data)).then(()=>{
            if (mlRecArng.current)
                setOpenred2(() => true)
            else {
                if (!data.doubling && !data.repeateOrCopie) {
                    dispatch(matchLivre(data)).then(() => {
                        if (ml.current) {
                            setOpenred(() => true)
                        } else {
                            dispatch(addLivre(data)).then(unwrapResult).then(setOpen(() => true)).then(reset(initialValues))
                        }
                    })
                } else {
                    dispatch(addLivre(data)).then(unwrapResult).then(setOpen(() => true)).then(reset(initialValues))
                }
            }
        })
    }

    let history = useHistory()
    const updateLivre = (data) => {
        data.id = d.current.id
        dispatch(updLivre(data)).then(unwrapResult).then(setOpen(() => true)).then(setTimeout(() => history.push(`/livres`), 1000))
    }

    const submitForm = (data) => {
        console.log(data)
        return d.current
            ? updateLivre(data)
            : createLivre(data)
    }

    return (
        <Aux>
            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title" fullWidth={true}
                    maxWidth="md" TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title">{t('communes')}</DialogTitle>
                <DialogContent>
                    <CommuneList/>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose} variant="contained" color="secondary">
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>
            <Row>
                <Col>
                    <Card>
                        <Card.Header>
                            <Card.Title as="h5">{d.current ? t('edit') : t('add')} {t('livre')}</Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <Collapse in={checked}><Alert variant="filled"
                                                          severity="error"><AlertTitle>Error</AlertTitle>error
                                — <strong>{error}</strong></Alert></Collapse>
                            <Snackbar open={open} autoHideDuration={4000}
                                      anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose}>
                                <AlertSnack onClose={handleClose} severity="success">{t('saved_successfully')}
                                </AlertSnack>
                            </Snackbar>
                            <Snackbar open={openRed} autoHideDuration={4000}
                                      anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose}>
                                <AlertSnack onClose={handleClose} severity="error">{t('duplicated_livre')}
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
                                        <Typography component="h1" variant="h5">
                                            {d.current ? t('edit') : t('add')} {t('livre')}
                                        </Typography>
                                        {loading ? <CircularProgress/> : <form className={classes.form} noValidate
                                                                               onSubmit={handleSubmit(submitForm)}>
                                            <Form.Row>
                                                <Form.Group as={Col} md={6}>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={3} xs={12}>
                                                            <TextField
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                name="recordNum"
                                                                label={t('record_number')}
                                                                variant="outlined"
                                                                type="number"
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                margin="normal"
                                                                inputRef={register}
                                                                placeholder="0000"
                                                                error={!!errors.recordNum}
                                                                fullWidth
                                                                helperText={t(errors.recordNum?.message)}
                                                            />
                                                        </Grid>
                                                        <Grid item md={3} xs={12}>
                                                            <TextField
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                name="arrangeNum"
                                                                label={t('arrange_number')}
                                                                variant="outlined"
                                                                type="number"
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                margin="normal"
                                                                inputRef={register}
                                                                placeholder="0000"
                                                                error={!!errors.arrangeNum}
                                                                fullWidth
                                                                helperText={t(errors.arrangeNum?.message)}
                                                            />
                                                        </Grid>
                                                        <Grid item md={6} xs={12}>
                                                            <Controller
                                                                control={control}
                                                                name="deliveryDate"
                                                                render={({onChange, value}) => (
                                                                    <KeyboardDatePicker
                                                                        variant="dialog"
                                                                        margin="normal"
                                                                        autoOk
                                                                        fullWidth
                                                                        showTodayButton={true}
                                                                        disableFuture={true}
                                                                        orientation="landscape"
                                                                        cancelLabel={t('cancel')}
                                                                        okLabel={t('ok')}
                                                                        todayLabel={t('today')}
                                                                        inputVariant="outlined"
                                                                        label={t('delivery_date')}
                                                                        InputLabelProps={d.current && {shrink: true}}
                                                                        value={value}
                                                                        onChange={onChange}
                                                                        format="dd/MM/yyyy"
                                                                        placeholder="00/00/0000"
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                        error={!!errors.deliveryDate}
                                                                        helperText={t(errors.deliveryDate?.message)}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                variant="outlined"
                                                                margin="normal"
                                                                inputRef={register}
                                                                fullWidth
                                                                label={t('delivered_to')}
                                                                name="deliveredTo"
                                                                autoFocus
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                error={!!errors.deliveredTo}
                                                                helperText={t(errors.deliveredTo?.message)}
                                                            />

                                                        </Grid>
                                                        <Grid item md={1} style={{marginTop: 24, paddingLeft: 0}}>
                                                            <Tooltip title={t('add_commune')} aria-label="add">
                                                                <Fab color="primary" aria-label="add" size="small"
                                                                     onClick={() => handleDialogClickOpen()}>
                                                                    <AddIcon/>
                                                                </Fab>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item md={11} xs={12}>
                                                            <Controller
                                                                render={props => (
                                                                    <Autocomplete
                                                                        autoComplete
                                                                        {...props}
                                                                        options={communes.map((com) => com.communeName)}
                                                                        getOptionLabel={option => option}
                                                                        getOptionSelected={(option, value) => option === value}
                                                                        renderInput={params => (
                                                                            <TextField
                                                                                {...params}
                                                                                variant="outlined"
                                                                                margin="normal"
                                                                                fullWidth
                                                                                label={t('commune')}
                                                                                InputLabelProps={d.current && {shrink: true}}
                                                                                error={!!errors.town}
                                                                                helperText={t(errors.town?.message)}
                                                                            />
                                                                        )}
                                                                        onChange={(_, data) => props.onChange(data)}
                                                                    />
                                                                )}
                                                                name="town"
                                                                control={control}
                                                            />
                                                        </Grid>

                                                    </Grid>
                                                </Form.Group>
                                                <Form.Group as={Col} md={6}>
                                                    <Grid container spacing={2}>
                                                        <Grid item md={4} xs={12}>
                                                            <TextField
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                variant="outlined"
                                                                margin="normal"
                                                                type="number"
                                                                onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                inputRef={register}
                                                                fullWidth
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                label={t('section')}
                                                                name="section"
                                                                error={!!errors.section}
                                                                helperText={t(errors.section?.message)}
                                                            />

                                                        </Grid>
                                                        <Grid item md={4} xs={12}>
                                                            <TextField
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                variant="outlined"
                                                                margin="normal"
                                                                type="number"
                                                                onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                inputRef={register}
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                fullWidth
                                                                label={t('ilot')}
                                                                name="ilot"
                                                                error={!!errors.ilot}
                                                                helperText={t(errors.ilot?.message)}
                                                            />
                                                        </Grid>
                                                        <Grid item md={4} xs={12}>
                                                            <TextField
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                variant="outlined"
                                                                margin="normal"
                                                                type="number"
                                                                onChange={(e) => e.target.value <= 0 ? (e.target.value = "") : e.target.value}
                                                                inputRef={register}
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                fullWidth
                                                                label={t('lot')}
                                                                name="lot"
                                                                error={!!errors.lot}
                                                                helperText={t(errors.lot?.message)}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                variant="outlined"
                                                                margin="normal"
                                                                inputRef={register}
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                multiline
                                                                fullWidth
                                                                label={t('note')}
                                                                name="note"
                                                            />
                                                        </Grid>
                                                        <br/>
                                                        <br/>
                                                        <br/>
                                                        <br/>
                                                        <br/>
                                                        <br/>
                                                        <Grid item md={5} ml={1} xs={12} >
                                                            <RHFInput
                                                                style={{marginLeft:0}}
                                                                name="doubling"
                                                                type="checkbox"
                                                                register={register}
                                                                setValue={setValue}
                                                                as={<FormControlLabel
                                                                    control={
                                                                        <Switch/>
                                                                    }
                                                                    label={t('doubling')}
                                                                />}
                                                            />
                                                        </Grid>
                                                        <Grid item md={7} xs={12}>
                                                            <RHFInput
                                                                name="repeateOrCopie"
                                                                type="checkbox"
                                                                register={register}
                                                                setValue={setValue}
                                                                as={<FormControlLabel
                                                                    control={
                                                                        <Switch/>
                                                                    }
                                                                    label={t('copy')}
                                                                />}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Form.Group>
                                            </Form.Row>

                                            <Grid container spacing={2} >
                                                <Grid item sm={3} xs={12}>
                                                    <Button
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                        size="large"
                                                        className={classes.button}
                                                        startIcon={<SaveIcon/>}
                                                    >
                                                        {t('save')}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        </form>}

                                    </div>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    )
}
export default LivreAdd
