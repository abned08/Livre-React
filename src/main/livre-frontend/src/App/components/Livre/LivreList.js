import React, {useCallback, useEffect, useRef, useState} from 'react'
import {useDispatch, useSelector} from 'react-redux'
import {useHistory} from 'react-router-dom';
import Aux from '../../../hoc/_Aux'
import {fetchLivres} from './LivreSlice'
import Paper from '@material-ui/core/Paper';
import {Row, Col, Card} from 'react-bootstrap';
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
    Editing, Selection, Summary, GroupItem, TotalItem, HeaderFilter, Paging, Pager, Grouping, LoadPanel, Button
} from "devextreme-react/data-grid";
import {getYear} from 'date-fns';
import FindReplaceIcon from '@material-ui/icons/FindReplace';
import Tooltip from '@material-ui/core/Tooltip';
import Fab from "@material-ui/core/Fab";
import './style.css'
import {useTranslation} from "react-i18next";

const useStyles = makeStyles((theme) => ({
    rootForProg: {
        display: 'flex',
        '& > * + *': {
            marginLeft: theme.spacing(2),
        },
        justifyContent: 'center'
    },
}));
const LivreList = () => {
    const {t} = useTranslation()
    const classes = useStyles();
    const dispatch = useDispatch()
    const {livres, loading, error} = useSelector(state => ({
        livres: state.livre.livres,
        loading: state.livre.loading,
        error: state.livre.error,
    }))
    // const [openDialog, setOpenDialog] = useState(false);
    const dg = useRef(null)
    const d = useRef(null)
    // const psw = useRef("")
    const clearF = () => {
        dg.current.instance.clearFilter();
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
        let path = `/addLivre/${dtt.row.data.id}`
        history.push(path)
    }

    // const handleDialogClickOpen = (dtt) => {
    //     d.current = dtt.row.data
    //     setOpenDialog(true);
    // };

    // const handleDialogClose = () => {
    //     setOpenDialog(false);
    // };

    // const delLivre = () => {
    //     if (psw.current.value === "said1946") {
    //         dispatch(deleteLivre(d.current.id)).then(unwrapResult)
    //         setOpenDialog(false)
    //     }
    // }
    useEffect(() => {
        dispatch(fetchLivres())
    }, [dispatch])

    // function cellRenderNum(dt) {
    //     return <Link to={`/livres/${dt.data.id}`}
    //                  style={{color: "rgb(137 32 253)", textDecoration: "underline"}}>{dt.value}</Link>
    // }

    const [filterValues, setFilterValues] = useState([getYear(new Date())])
    const resetFilterValues = (e) => {
        if (e.fullName === "columns[1].filterValues") {
            setFilterValues([e.value])
        }
    }

    const selectLivre = ({selectedRowsData}) => {
        d.current = selectedRowsData[0]
    }
    const customizeText = useCallback((e) => {
        return t('count') + ": " + e.value;
    }, [t]);
    return (
        <Aux>
            {error && sweetAlertHandler({title: t('error'), type: 'error', text: error})}
            <Row>
                <Col>
                    <Card>
                        <Card.Header style={{display: 'flex', justifyContent: 'space-between'}}>
                            <Card.Title as="h5">{t('livres_list')}</Card.Title>
                            <Tooltip title="reset filters">
                                <Fab size={"small"} color="primary" aria-label={t('reset_filters')}
                                     onClick={() => clearF()}>
                                    <FindReplaceIcon/>
                                </Fab>
                            </Tooltip>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col xs={12} className={classes.rootForProg}>
                                    {/*{loading && <CircularProgress/>}*/}
                                    <Paper elevation={7}>
                                        <DataGrid id="dataGrid" ref={dg}
                                                  dataSource={livres}
                                                  keyExpr="id" height={730}
                                                  allowColumnReordering={true}
                                                  focusedRowEnabled={true}
                                                  showRowLines={true}
                                                  onOptionChanged={resetFilterValues}
                                                  onSelectionChanged={selectLivre}
                                                  showColumnLines={true}
                                                  wordWrapEnabled={true}
                                                  columnAutoWidth={false}
                                                  columnHidingEnabled={true}
                                                  onRowPrepared={(e) => {
                                                      if (e.rowType === "data") {
                                                          if (e.data.doubling === true) {
                                                              e.rowElement.style.backgroundColor = "#ffffff";
                                                              e.rowElement.style.backgroundImage = "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100%25' height='100%25' %3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' x2='0' y1='0' y2='1' gradientTransform='rotate(85,0.5,0.5)'%3E%3Cstop offset='0' stop-color='%2380F'/%3E%3Cstop offset='1' stop-color='%23f40'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpattern id='b' width='28' height='28' patternUnits='userSpaceOnUse'%3E%3Ccircle fill='%23ffffff' cx='14' cy='14' r='14'/%3E%3C/pattern%3E%3Crect width='100%25' height='100%25' fill='url(%23a)'/%3E%3Crect width='100%25' height='100%25' fill='url(%23b)' fill-opacity='0'/%3E%3C/svg%3E\")";
                                                              e.rowElement.style.backgroundAttachment = "fixed";
                                                              e.rowElement.style.backgroundSize = "cover";
                                                              e.rowElement.style.fontWeight = "bold";
                                                              // e.rowElement.style.color="white";
                                                          }
                                                      }
                                                  }}
                                        >
                                            <Sorting mode="multiple"/>
                                            {/*<Scrolling mode="virtual"/>*/}
                                            <LoadPanel enabled={loading}/>
                                            <HeaderFilter visible={true} allowSearch={true} texts={{
                                                cancel: t('cancel'),
                                                ok: t('ok'),
                                                emptyValue:t('empty')
                                            }}/>
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
                                            }} resetOperationText={t('reset')}
                                                       showAllText={t('all')}
                                                       betweenStartText={t('start')}
                                                       betweenEndText={t('end')}/>
                                            <SearchPanel visible={true} width={250} placeholder={t('search')}/>
                                            <Paging defaultPageSize={10}/>
                                            <Pager showPageSizeSelector={true}
                                                   showNavigationButtons={true}
                                                   allowedPageSizes={[5, 15, 20, 100]}
                                                   showInfo={true}
                                                   infoText={`${t('Page')} {0} ${t('of')} {1} ({2} ${t('items')})`}/>
                                            <Column dataField="town" dataType="string" caption={t('commune')}/>
                                            <Column dataField="section" caption={t('section')} dataType="number"
                                                    alignment='center' cssClass="cell-highlightedSection"/>
                                            <Column dataField="ilot" caption={t('ilot')} dataType="number"
                                                    alignment='center' cssClass="cell-highlightedIlot"/>
                                            <Column dataField="lot" caption={t('lot')} dataType="number"
                                                    alignment='center'
                                                    cssClass="cell-highlightedlot"/>
                                            <Column dataField="deliveryDate" defaultSortOrder="desc" sortIndex="0"
                                                    dataType="date" format={'dd/MM/yyyy'}
                                                    caption={t('delivery_date')} allowHeaderFiltering={true}
                                                    filterValues={filterValues} filterType="include"/>
                                            <Column dataField="recordNum" dataType="number" alignment='left'
                                                    caption={t('record_number')}
                                                    defaultSortOrder="desc" sortIndex="1"/>
                                            <Column dataField="arrangeNum" dataType="number" alignment='left'
                                                    caption={t('arrange_number')}
                                                    defaultSortOrder="desc" sortIndex="2"/>
                                            <Column dataField="deliveredTo" dataType="string"
                                                    caption={t('delivered_to')}/>
                                            <Column dataField="doubling" dataType="boolean" caption={t('doubling')}
                                                    trueText={t('true')} falseText={t('false')}/>
                                            <Column dataField="repeateOrCopie" dataType="boolean" caption={t('copy')}
                                                    trueText={t('true')} falseText={t('false')}/>
                                            <Column dataField="note" dataType="string" caption={t('note')}/>
                                            <Column type="buttons">
                                                <Button name="edit" onClick={(e) => routeChange(e)}/>
                                                {/*<Button name="delete" onClick={(e) => handleDialogClickOpen(e)}/>*/}
                                            </Column>
                                            <ColumnChooser enabled={true} mode="select" title={t('Column_chooser')}/>
                                            <GroupPanel visible={true} allowColumnDragging={true}
                                                        emptyPanelText={t('group_panel_text')}/>
                                            <Grouping autoExpandAll={false}/>
                                            <Editing
                                                allowUpdating={true}
                                                allowDeleting={false}
                                                allowAdding={false}
                                            />
                                            <Selection mode="single"/>
                                            <Summary>
                                                <GroupItem summaryType="count">
                                                </GroupItem>
                                                <TotalItem
                                                    column="deliveryDate"
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
    )
}
export default LivreList
