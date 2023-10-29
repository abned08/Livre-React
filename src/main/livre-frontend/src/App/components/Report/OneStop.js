import React, {useEffect, useMemo, useRef, useState} from "react"
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {fetchEstablishment, periodicCount} from "../Dashboard/DashboardSlice";
import {differenceInCalendarDays, format} from "date-fns";
import Typography from "@material-ui/core/Typography";
import {
    CircularProgress,
    Collapse,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {useReactToPrint} from "react-to-print";
import Aux from "../../../hoc/_Aux";
import {Card, Col, Row} from "react-bootstrap";
import {DatePicker} from "@material-ui/pickers";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import {PrintRounded} from "@material-ui/icons";

const OneStop = () =>{
    const {t} = useTranslation()
    const dispatch = useDispatch()
    const [selectedDate, handleDateChange] = useState(null)
    const [selectedDate2, handleDateChange2] = useState(new Date())
    const [checked, setChecked] = useState(false);
    const {loading, periodicStat, establishment} = useSelector((state) => ({
        loading: state.dashboard.loading,
        periodicStat: state.dashboard.periodicStat,
        establishment: state.dashboard.establishment
    }));
    const currentStat = useRef()
    const precedentStat = useRef()
    const divToPrint = useRef()

    useEffect(() => {
        establishment.length === 0 && dispatch(fetchEstablishment())
        if (selectedDate && selectedDate2 && differenceInCalendarDays(selectedDate2, selectedDate) > 0) {
            dispatch(periodicCount({sDate: selectedDate, eDate: selectedDate2})).then(setChecked(true))
        }else {
            setChecked(false)
        }
        // eslint-disable-next-line
    }, [dispatch, selectedDate, selectedDate2, establishment])
    useMemo(() => {
        if (periodicStat.length > 0) {
            currentStat.current = periodicStat[0]
            precedentStat.current = periodicStat[1]
        }
    }, [periodicStat])
    const StatsTables = () => {
        return (
            <>
                <div style={{padding: 13, borderRadius: 10, marginBottom: 5, background: 'rgb(218 221 225)'}}>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow scope="row">
                                    <TableCell align="center" style={{color: 'black'}}>عدد الملفات التي لا يمكن إعداد بشأنها دفاتر عقارية وخصص لها الرد المبرر قانونا</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر العقارية المسلمة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر العقارية المعدة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الطلبات المقيدة في السجل الخاص</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>الوضعية</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.urban_rejectedNum + currentStat.current?.rural_rejectedNum + currentStat.current?.desert_rejectedNum:""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.urban_livrePrepared + currentStat.current?.rural_livrePrepared + currentStat.current?.desert_livrePrepared:""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.urban_ilotNumFinal + currentStat.current?.rural_ilotNumFinal + currentStat.current?.desert_ilotNumFinal:""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.urban_ilotNum + currentStat.current?.rural_ilotNum + currentStat.current?.desert_ilotNum:""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>الحالية</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center" style={{color: 'black'}}>{precedentStat.current ? precedentStat.current?.urban_livreDelivered + precedentStat.current?.rural_livreDelivered + precedentStat.current?.desert_livreDelivered : ""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>{precedentStat.current ? precedentStat.current?.urban_livrePrepared + precedentStat.current?.rural_livrePrepared + precedentStat.current?.desert_livrePrepared : ""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>{precedentStat.current ? precedentStat.current?.urban_ilotNumFinal + precedentStat.current?.rural_ilotNumFinal + precedentStat.current?.desert_ilotNumFinal : ""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>{precedentStat.current ? precedentStat.current?.urban_ilotNum + precedentStat.current?.rural_ilotNum + precedentStat.current?.desert_ilotNum : ""}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>السابقة</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </>
        )
    }

    const printStat = useReactToPrint({
        content: () => divToPrint.current
    })
    return (
        <Aux>
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as='h5'>
                                {t("previous_period")}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DatePicker
                                variant='inline'
                                margin='normal'
                                orientation='landscape'
                                fullWidth
                                autoOk
                                disableFuture
                                value={selectedDate}
                                onChange={handleDateChange}
                                inputVariant='filled'
                                invalidDateMessage={t('must_be_a_date')}
                                label={t("previous_period")}
                                format='dd/MM/yyyy'
                                placeholder='00/00/0000'

                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header>
                            <Card.Title as='h5'>
                                {t("current_period")}
                            </Card.Title>
                        </Card.Header>
                        <Card.Body>
                            <DatePicker
                                variant='inline'
                                margin='normal'
                                orientation='landscape'
                                fullWidth
                                autoOk
                                disableFuture
                                value={selectedDate2}
                                onChange={handleDateChange2}
                                inputVariant='filled'
                                invalidDateMessage={t('must_be_a_date')}
                                label={t("current_period")}
                                format='dd/MM/yyyy'
                                placeholder='00/00/0000'

                            />
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12}>
                    <Card>
                        <Card.Header style={{display: 'flex', justifyContent: 'space-between',alignItems:'center'}}>
                            <Card.Title as='h5'>
                                {t("Report")}
                            </Card.Title>
                            <Tooltip title={t('printt')}>
                                <Fab size={"medium"} style={{backgroundColor: 'green', color: "white"}}
                                     aria-label="print" onClick={printStat} hidden={!checked}>
                                    <PrintRounded/>
                                </Fab>
                            </Tooltip>
                        </Card.Header>
                        <Card.Body>
                            <Collapse in={checked}>
                                {loading ? <CircularProgress/> : <StatsTables/>}
                            </Collapse>
                            <div id='printDiv' style={{display: 'none'}}>
                                <div ref={divToPrint} style={{padding: 20}}>
                                    <style>
                                        {`@media print {@page { size: A4; }}`}
                                    </style>
                                    <Typography
                                        style={{marginTop: 1, textAlign: 'center', marginBottom: 1, color: 'black',fontWeight:'bold'}}
                                        variant="h6"><span
                                        style={{textDecoration: 'underline'}}>الجمهورية الجزائرية الديمقراطية الشعبية</span></Typography>
                                    <Typography
                                        style={{marginTop: 1, textAlign: 'center', marginBottom: 1, color: 'black',fontWeight:'bold'}}
                                        variant="h6"><span
                                        style={{textDecoration: 'underline'}}>وزارة الـمـالـيـة</span></Typography>

                                    <Typography
                                        style={{marginTop: 1, textAlign: 'right', marginBottom: 1, color: 'black'}}
                                        variant="h6"><span
                                        style={{textDecoration: 'underline'}}>المديرية العامة للأملاك الوطنية</span></Typography>
                                    <Typography
                                        style={{marginTop: 1, textAlign: 'right', marginBottom: 1, color: 'black'}}
                                        variant="h6"><span
                                        style={{textDecoration: 'underline'}}>مديرية مسح الأراضي والحفظ العقاري لولاية {establishment.wilaya}</span></Typography>
                                    <Typography
                                        style={{marginTop: 1, textAlign: 'right', marginBottom: 1, color: 'black'}}
                                        variant="h6"><span
                                        style={{textDecoration: 'underline'}}>المحافظة العقارية {establishment.commune}</span></Typography>
                                    <Typography style={{
                                        marginTop: 1,
                                        textAlign: 'center',
                                        marginBottom: 1,
                                        fontWeight: 'bold',
                                        color: 'black'
                                    }} variant="h6">عمليــات إعـــداد وتسلـيــم الدفــاتــر العقـــاريــة</Typography>
                                    <Typography
                                        style={{marginTop: 1, textAlign: 'center', marginBottom: 25, color: 'black'}}
                                        variant="h6">الفترة من:  {selectedDate && format(selectedDate, "yyyy/MM/dd")} إلى:  {format(selectedDate2, "yyyy/MM/dd")}
                                    </Typography>
                                    <StatsTables/>
                                </div>
                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    )

}
export default OneStop
