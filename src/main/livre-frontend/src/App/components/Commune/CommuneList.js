import React, {useEffect, useState, useRef, useCallback} from "react";
import Aux from "../../../hoc/_Aux";
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
import {addCommune, deleteCommune, fetchCommunes, updCommune} from "./CommuneSlice";
import Avatar from "@material-ui/core/Avatar";
import PostAddIcon from "@material-ui/icons/PostAdd";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import Buttonn from '@material-ui/core/Button';
import TextField from "@material-ui/core/TextField";
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
import {useForm} from "react-hook-form";
import {useTranslation} from "react-i18next";

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
    communeName: "",
}

const schema = yup.object().shape({
    communeName: yup.string().required('required')
});

function AlertSnack(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const CommuneList = () => {
    const classes = useStyles();
    const {t} = useTranslation()
    const [checked, setChecked] = useState(false);
    const [open, setOpen] = useState(false);

    const {register, handleSubmit, setValue, reset, errors} = useForm({
        defaultValues: initialValues,
        mode: 'onChange',
        resolver: yupResolver(schema)
    })
    const dispatch = useDispatch()
    const {communes, loading, error} = useSelector(state => ({
        communes: state.commune.communes,
        loading: state.commune.loading,
        error: state.commune.error,
    }))

    const dg = useRef(null)
    const d = useRef(null)
    const clearF = () => {
        dg.current.instance.clearFilter();
    }

    const [openDialog, setOpenDialog] = useState(false);

    const handleDialogClickOpen = (des) => {
        d.current = des.row.data
        setOpenDialog(() => true);
    };

    const handleDialogClose = () => {
        setOpenDialog(() => false);
        reset(initialValues)
        d.current = null
    };

    const delCommune = () => {
        dispatch(deleteCommune(d.current.id)).then(unwrapResult)
        d.current = null
        setOpenDialog(() => false)
    }

    const createCommune = (data) => {
        dispatch(addCommune(data)).then(unwrapResult).then(setOpen(() => true))
        d.current = null

    }
    const updateCommune = (data) => {
        data.id = d.current.id
        dispatch(updCommune(data)).then(unwrapResult).then(setOpen(() => true))
        d.current = null
    }
    const submitForm = (data) => {
        return d.current
            ? updateCommune(data)
            : createCommune(data);
    }

    const fields = Object.keys(initialValues)
    const selectCommune = ({selectedRowsData}) => {
        d.current = selectedRowsData[0]
        d.current && fields.forEach(field => setValue(field, d.current[field], {
            shouldValidate: true,
            shouldDirty: true
        }));
    }

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(() => false);
    };

    useEffect(() => {
        if (d.current == null) {
            reset(initialValues)
            dg.current.instance.deselectAll()
        }
    }, [d, reset])
    useEffect(() => {
        dispatch(fetchCommunes())
        if (error) {
            setChecked(true)
            setTimeout(() => {
                setChecked(false)
            }, 5000)
        }
    }, [dispatch, error, reset])

    const customizeText = useCallback((e) => {
        return t('count') + ": " + e.value;
    }, [t]);

    return (
        <Aux>
            <Dialog open={openDialog} onClose={handleDialogClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">{t('delete')}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {t('ask_delete')}
                    </DialogContentText>
                    {/*<TextField*/}
                    {/*    autoFocus*/}
                    {/*    margin="dense"*/}
                    {/*    id="name"*/}
                    {/*    label="Email Address"*/}
                    {/*    type="email"*/}
                    {/*    fullWidth*/}
                    {/*/>*/}
                </DialogContent>
                <DialogActions>
                    <Buttonn onClick={handleDialogClose} color="primary">
                        {t('cancel')}
                    </Buttonn>
                    <Buttonn onClick={(e) => delCommune(e)} color="primary">
                        {t('delete')}
                    </Buttonn>
                </DialogActions>
            </Dialog>

            <Row>
                <Col>
                    <Card>
                        <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Card.Title as="h5">{t('communes')}</Card.Title>
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
                                            severity="success">{t('saved_successfuly')}</AlertSnack></Snackbar>
                            <Row>
                                <Col xs={12} md={4}>
                                    <div className={classes.paper}>
                                        <Avatar className={classes.avatar}>
                                            <PostAddIcon/>
                                        </Avatar>
                                        <Typography component="h1" variant="h5">
                                            {d.current ? t('edit') : t('add')} {t('commune')}
                                        </Typography>
                                        {loading ? <CircularProgress/> : <form className={classes.form} noValidate
                                                                               onSubmit={handleSubmit(submitForm)}>
                                            <Form.Row>
                                                <Form.Group as={Col} xs={12}>
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={12}>
                                                            <TextField
                                                                onChange={(e) => /^[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z]+[\u0600-\u065F\u066A-\u06EF\u06FA-\u06FFa-zA-Z-_]*$/.test(e.target.value) ? e.target.value : e.target.value = ""}
                                                                variant="outlined"
                                                                margin="normal"
                                                                inputRef={register}
                                                                InputLabelProps={d.current && {shrink: true}}
                                                                fullWidth
                                                                autoFocus
                                                                label={t('commune')}
                                                                name="communeName"
                                                                error={!!errors.communeName}
                                                                helperText={t(errors.communeName?.message)}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Form.Group>
                                            </Form.Row>

                                            <Grid container spacing={2} >
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
                                    <Paper>
                                        <DataGrid id="dataGrid" ref={dg}
                                                  dataSource={communes}
                                                  keyExpr="id"
                                                  focusedRowEnabled={true}
                                                  defaultSelectedRowKeys={null}
                                                  onSelectionChanged={selectCommune}
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
                                                   showInfo={true}/>
                                            <Column dataField="communeName" caption={t('commune')}/>
                                            <Column type="buttons">
                                                <Button name="delete" onClick={(e) => handleDialogClickOpen(e)}/>
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
                                                    column="communeName"
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
export default CommuneList
