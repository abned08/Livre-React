import React, {useEffect, useState, useRef, useCallback} from "react";
import Aux from "../../../../hoc/_Aux";
import {useDispatch, useSelector} from "react-redux";
import {Card, Col, Form, Row} from "react-bootstrap";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import FindReplaceIcon from "@material-ui/icons/FindReplace";
import Paper from "@material-ui/core/Paper";
import DataGrid, {
    Column, ColumnChooser,
    GroupItem,
    LoadPanel,
    SearchPanel, Selection,
    Sorting, Summary, TotalItem, Button, Paging, Pager, Editing
} from "devextreme-react/data-grid";
import {makeStyles} from "@material-ui/core/styles";
import {addDecision, deleteDesicion, fetchDecisions, updDesicion} from "./DecisionSlice";
import Avatar from "@material-ui/core/Avatar";
import PostAddIcon from "@material-ui/icons/PostAdd";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Buttonn from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
import {Controller, useForm} from "react-hook-form";
import {KeyboardDatePicker} from "@material-ui/pickers";
import SaveIcon from "@material-ui/icons/Save";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {unwrapResult} from "@reduxjs/toolkit";
import Collapse from "@material-ui/core/Collapse";
import {Alert, AlertTitle} from "@material-ui/lab";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogActions from "@material-ui/core/DialogActions";
import {useTranslation} from "react-i18next";
import AddIcon from "@material-ui/icons/Add";
import Autocomplete from "@material-ui/lab/Autocomplete";
import DecisionNameList from "./DecisionName/DecisionNameList";
import {fetchDecisionNames} from "./DecisionName/DecisionNameSlice";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
    rootForProg: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        justifyContent: 'center'
    },
    paper: {
        marginTop: theme.spacing(2),
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
    }
}));

const initialValues = {
    dscNum: "",
    dscCase: "",
    dscDate: new Date(),
}

const schema = yup.object().shape({
    dscNum: yup.string().required("required"),
    dscDate: yup.date().typeError("must_be_a_date").required("required").nullable(),
    dscCase: yup.string().required("required"),

});

function AlertSnack(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const DecisionList = ({match}) => {
    const {dossierId} = match.params
    const {t} = useTranslation()
    const classes = useStyles();
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);
    const dossier = useSelector(state =>
        state.dossier.dossiers.find(dossier => dossier.id === parseInt(dossierId))
    );
    const {register, handleSubmit, setValue, reset, errors, control} = useForm({
        defaultValues: initialValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })
    const dispatch = useDispatch()
    const {decisions, decisionNames, loading, error} = useSelector(state => ({
        decisions: state.decision.decisions,
        decisionNames: state.decisionName.decisionNames,
        loading: state.decision.loading,
        error: state.decision.error,
    }))

    const dg = useRef(null)
    const d = useRef(null)
    const clearF = () => {
        dg.current.instance.clearFilter();
    }

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClickOpen = (des) => {
        d.current = des.row.data
        setOpenDialog(true);
    };

    const handleDialogClose = () => {
        setOpenDialog(false)
        setOpenDialogDesName(false)
        reset(initialValues)
        d.current = null
    };

    const delDecision = () => {
        dispatch(deleteDesicion(d.current.id)).then(unwrapResult)
        d.current = null
        setOpenDialog(false)
    }

    const createDecision = (data) => {
        dispatch(addDecision({dossierId, newDecision: data})).then(unwrapResult).then(setOpen(() => true))
        d.current = null

    }
    const updateDecision = (data) => {
        data.id = d.current.id
        data.dossier = d.current.dossier
        dispatch(updDesicion(data)).then(unwrapResult).then(setOpen(() => true))
        d.current = null
    }
    const submitForm = (data) => {
        return d.current
            ? updateDecision(data)
            : createDecision(data);
    }

    const fields = Object.keys(initialValues)
    const selectDecision = ({selectedRowsData}) => {
        d.current = selectedRowsData[0]
        d.current && fields.forEach(field => setValue(field, d.current[field], {
            shouldValidate: true,
            shouldDirty: true
        }));
    }

    const customizeText = useCallback((e) => {
        return t('count') + ": " + e.value;
    }, [t]);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        dispatch(fetchDecisionNames())
        if (d.current == null) {
            reset(initialValues)
            dg.current.instance.deselectAll()
        }
    }, [d, reset, dispatch])
    useEffect(() => {
        if (decisions) {
            const lastDecs = decisions.length > 0 ? decisions[decisions.length - 1].dscNum : 0
            setValue("dscNum", lastDecs + 1)
        }
    }, [decisions, setValue])
    useEffect(() => {
        if (error) {
            setChecked(true)
            setTimeout(() => {
                setChecked(false)
            }, 5000)
        }
        dossier && dispatch(fetchDecisions(dossierId))
    }, [dispatch, dossier, dossierId, error, reset])

    const [openDialogDesName, setOpenDialogDesName] = useState(false)
    function handleDialogClickOpenDesName() {
        setOpenDialogDesName(true)
    }

    return (
        <Aux>
            <Dialog open={openDialogDesName} onClose={handleDialogClose} aria-labelledby="form-dialog-title1"
                    fullWidth={true}
                    maxWidth="md" TransitionComponent={Transition}>
                <DialogTitle id="form-dialog-title1">{t('decisionNames')}</DialogTitle>
                <DialogContent>
                    <DecisionNameList/>
                </DialogContent>
                <DialogActions>
                    <Buttonn onClick={handleDialogClose} variant="contained" color="secondary">
                        {t('close')}
                    </Buttonn>
                </DialogActions>
            </Dialog>

            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{t('delete')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('ask_delete')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Buttonn onClick={handleDialogClose} color="primary">
                        {t('cancel')}
                    </Buttonn>
                    <Buttonn onClick={(e) => delDecision(e)} color="primary">
                        {t('delete')}
                    </Buttonn>
                </DialogActions>
            </Dialog>

            <Row>
                <Col>
                    <Card>
                        <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Card.Title as="h5">{t('decisions_list')}</Card.Title>
                            <Tooltip title={t('reset_filters')}>
                                <Fab size={"small"} color="primary" aria-label="clear all filters"
                                     onClick={() => clearF()}>
                                    <FindReplaceIcon/>
                                </Fab>
                            </Tooltip>
                        </Card.Header>
                        <Card.Body>
                            <Collapse in={checked}><Alert variant="filled"
                                                          severity="error"><AlertTitle>Error</AlertTitle>There is an
                                error — <strong>{error}</strong></Alert></Collapse>
                            <Snackbar open={open} autoHideDuration={4000}
                                      anchorOrigin={{vertical: 'top', horizontal: 'right'}} onClose={handleClose}>
                                <AlertSnack onClose={handleClose}
                                            severity="success">{t('saved_successfully')}</AlertSnack></Snackbar>
                            <Row>
                                <Col xs={12} md={4}>
                                    <div className={classes.paper}>
                                        <Avatar className={classes.avatar}>
                                            <PostAddIcon/>
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                            {d.current ? t('edit') : t('add')} {t('decision')}
                                        </Typography>
                                        {loading ? <CircularProgress/> : <form className={classes.form} noValidate
                                                                               onSubmit={handleSubmit(submitForm)}>
                                            <Form.Row>
                                                <Form.Group as={Col} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                onKeyDown={(evt) => ["e", "E", "+", "-"].includes(evt.key) && evt.preventDefault()}
                                                                onChange={(e) => e.target.value < 0 ? (e.target.value = 0) : e.target.value}
                                                                name="dscNum"
                                                                label={t('number')}
                                                                variant="outlined"
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                type="number"
                                                                margin="normal"
                                                                inputRef={register}
                                                                error={!!errors.dscNum}
                                                                fullWidth
                                                                autoFocus
                                                                helperText={t(errors.dscNum?.message)}
                                                            />
                                                        </Grid>
                                                        <Grid item md={1} style={{marginTop: 24, paddingLeft: 0}}>
                                                            <Tooltip title={t('add_decisionName')} aria-label="add">
                                                                <Fab color="primary" aria-label="add" size="small"
                                                                     onClick={() => handleDialogClickOpenDesName()}>
                                                                    <AddIcon/>
                                                                </Fab>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item md={11} xs={11}>
                                                            <Controller
                                                                render={props => (
                                                                    <Autocomplete
                                                                        autoComplete
                                                                        {...props}
                                                                        options={decisionNames.map((dsn) => dsn.dscName)}
                                                                        getOptionLabel={option => option}
                                                                        getOptionSelected={(option, value) => option.value === value.value}
                                                                        renderInput={params => (
                                                                            <TextField
                                                                                {...params}
                                                                                variant="outlined"
                                                                                margin="normal"
                                                                                InputLabelProps={d.current && {shrink: true}}
                                                                                fullWidth
                                                                                label={t('case')}
                                                                                error={!!errors.dscCase}
                                                                                helperText={t(errors.dscCase?.message)}
                                                                            />
                                                                        )}
                                                                        onChange={(_, data) => props.onChange(data)}
                                                                    />
                                                                )}
                                                                name="dscCase"
                                                                control={control}
                                                            />
                                                        </Grid>
                                                        <Grid item xs={12}>
                                                            <Controller
                                                                control={control}
                                                                name="dscDate"
                                                                defaultValue={new Date()}
                                                                render={({onChange, value}) => (
                                                                    <KeyboardDatePicker
                                                                        variant="dialog"
                                                                        margin="normal"
                                                                        autoOk
                                                                        fullWidth
                                                                        disableFuture={true}
                                                                        InputLabelProps={d.current && {shrink: true}}
                                                                        inputVariant="outlined"
                                                                        label={t('date')}
                                                                        value={value}
                                                                        onChange={onChange}
                                                                        format="dd/MM/yyyy"
                                                                        placeholder="00/00/0000"
                                                                        KeyboardButtonProps={{
                                                                            'aria-label': 'change date',
                                                                        }}
                                                                        error={!!errors.dscDate}
                                                                        helperText={t(errors.dscDate?.message)}
                                                                    />
                                                                )}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Form.Group>
                                            </Form.Row>

                                            <Grid container spacing={2} id="Test for button">
                                                <Grid item xs={12}>
                                                    <Buttonn
                                                        type="submit"
                                                        variant="contained"
                                                        color="primary"
                                                        fullWidth
                                                        size="large"
                                                        className={classes.button}
                                                        startIcon={<SaveIcon/>}
                                                    >
                                                        {t('save')}
                                                    </Buttonn>
                                                    {/*<Buttonn*/}
                                                    {/*    variant="contained"*/}
                                                    {/*    color="primary"*/}
                                                    {/*    fullWidth*/}
                                                    {/*    size="large"*/}
                                                    {/*    className={classes.button}*/}
                                                    {/*    onClick={()=>reset(initialValues)}*/}
                                                    {/*>*/}
                                                    {/*    reset*/}
                                                    {/*</Buttonn>*/}
                                                </Grid>
                                            </Grid>
                                        </form>}

                                    </div>
                                </Col>
                                <Col xs={12} md={8} className={classes.rootForProg}>
                                    {/*{loading && <CircularProgress/>}*/}
                                    <Paper elevation={7}>
                                        <DataGrid id="dataGrid" ref={dg}
                                                  dataSource={decisions}
                                                  keyExpr="id"
                                                  height={500}
                                                  focusedRowEnabled={true}
                                                  defaultSelectedRowKeys={null}
                                                  onSelectionChanged={selectDecision}
                                                  allowColumnReordering={true}
                                                  showRowLines={true}
                                                  wordWrapEnabled={true}
                                                  columnHidingEnabled={true}
                                                  columnAutoWidth={true}>
                                            <Sorting mode="multiple"/>
                                            {/*<Scrolling mode="virtual"/>*/}
                                            <LoadPanel enabled={loading}/>
                                            <SearchPanel visible={true} width={250} placeholder={t('search')}/>
                                            <Paging defaultPageSize={10}/>
                                            <Pager showPageSizeSelector={true}
                                                   showNavigationButtons={true}
                                                   allowedPageSizes={[5, 15, 20, 100]}
                                                   showInfo={true}
                                                   infoText={`${t('Page')} {0} ${t('of')} {1} ({2} ${t('items')})`}/>
                                            <Column dataField="dscNum" dataType="number" caption={t('number')}
                                                    defaultSortOrder="desc" sortIndex="1"
                                                    alignment="center" width="200"/>
                                            <Column dataField="dscCase" caption={t('case')}/>
                                            <Column dataField="dscDate" dataType="date" defaultSortOrder="desc"
                                                    sortIndex="0" minWidth={120} format={'dd/MM/yyyy'}
                                                    caption={t('date')}/>
                                            <Column type="buttons">
                                                <Button name="delete" onClick={(e) => handleDialogClickOpen(e)}/>
                                                {/*<Button name="delete"/>*/}
                                            </Column>

                                            <ColumnChooser enabled={true} mode="select" title={t('Column_chooser')}/>

                                            <Selection mode="single"/>
                                            <Editing
                                                allowUpdating={false}
                                                allowDeleting={true}
                                                allowAdding={false}
                                            />
                                            <Summary>
                                                <GroupItem summaryType="count">
                                                </GroupItem>
                                                <TotalItem
                                                    column="dDate"
                                                    summaryType="count" customizeText={customizeText}/>
                                            </Summary>

                                        </DataGrid>
                                    </Paper>

                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    );
};
export default DecisionList
