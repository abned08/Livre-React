import React, {useEffect, useMemo, useRef, useState} from "react"
import Aux from "../../../hoc/_Aux"
import {Row, Col, Card} from "react-bootstrap"
import {useTranslation} from "react-i18next"
import {DatePicker} from "@material-ui/pickers"
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
import Typography from "@material-ui/core/Typography";
import {useDispatch, useSelector} from "react-redux";
import {fetchEstablishment, periodicCount} from "../Dashboard/DashboardSlice";
import {differenceInCalendarDays, format} from 'date-fns';
import Fab from "@material-ui/core/Fab";
import Tooltip from "@material-ui/core/Tooltip";
import {PrintRounded} from "@material-ui/icons";
import {useReactToPrint} from 'react-to-print'

const Periodic = () => {
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
                    <Typography style={{
                        marginTop: 1,
                        textAlign: 'right',
                        marginBottom: 1,
                        fontWeight: 'bold',
                        color: 'black',
                        textDecoration: 'underline'
                    }} variant="h6">:المناطق الحضرية</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow scope="row">
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية في حساب العقارات غير المطالب بها</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر
                                        العقارية المسلمة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر
                                        العقارية المعدة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية موضوع ترقيم نهائي</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الأقسام
                                        المودعة</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>الوضعية</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.urban_ilotUnknownNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.urban_livreDelivered}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.urban_livrePrepared}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.urban_ilotNumFinal}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.urban_ilotNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.urban_sectionNum}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>الحالية</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.urban_ilotUnknownNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.urban_livreDelivered}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.urban_livrePrepared}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.urban_ilotNumFinal}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.urban_ilotNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.urban_sectionNum}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>السابقة</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
                <div style={{padding: 13, borderRadius: 10, marginBottom: 5, background: 'rgb(218 221 225)'}}>
                    <Typography style={{
                        marginTop: 1,
                        textAlign: 'right',
                        marginBottom: 1,
                        fontWeight: 'bold',
                        color: 'black',
                        textDecoration: 'underline'
                    }} variant="h6">:المناطق الريفية</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow scope="row">
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية في حساب العقارات غير المطالب بها</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر
                                        العقارية المسلمة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر
                                        العقارية المعدة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية موضوع ترقيم نهائي</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الأقسام
                                        المودعة</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>الوضعية</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.rural_ilotUnknownNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.rural_livreDelivered}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.rural_livrePrepared}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.rural_ilotNumFinal}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.rural_ilotNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.rural_sectionNum}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>الحالية</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.rural_ilotUnknownNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.rural_livreDelivered}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.rural_livrePrepared}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.rural_ilotNumFinal}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.rural_ilotNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.rural_sectionNum}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>السابقة</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>

                </div>
                <div style={{padding: 13, borderRadius: 10, marginBottom: 5, background: 'rgb(218 221 225)'}}>
                    <Typography style={{
                        marginTop: 1,
                        textAlign: 'right',
                        marginBottom: 1,
                        fontWeight: 'bold',
                        color: 'black',
                        textDecoration: 'underline'
                    }} variant="h6">:المناطق الصحراوية</Typography>
                    <TableContainer component={Paper}>
                        <Table aria-label="customized table">
                            <TableHead>
                                <TableRow scope="row">
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية في حساب العقارات غير المطالب بها</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر
                                        العقارية المسلمة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الدفاتر
                                        العقارية المعدة</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية موضوع ترقيم نهائي</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد مجموعات
                                        الملكية</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>عدد الأقسام
                                        المودعة</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>الوضعية</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.desert_ilotUnknownNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.desert_livreDelivered}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.desert_livrePrepared}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.desert_ilotNumFinal}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.desert_ilotNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{currentStat.current?.desert_sectionNum}</TableCell>
                                    <TableCell align="center" style={{color: 'black'}}>الحالية</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.desert_ilotUnknownNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.desert_livreDelivered}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.desert_livrePrepared}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.desert_ilotNumFinal}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.desert_ilotNum}</TableCell>
                                    <TableCell align="center"
                                               style={{color: 'black'}}>{precedentStat.current?.desert_sectionNum}</TableCell>
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
    });
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
                                        {`@media print {@page { size: A3 landscape; }}`}
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
                                        style={{marginTop: 1, textAlign: 'center', marginBottom: 20, color: 'black'}}
                                        variant="h6">الفترة من:  {selectedDate && format(selectedDate, "yyyy/MM/dd")} إلى:  {format(selectedDate2, "yyyy/MM/dd")}
                                    </Typography>
                                    <StatsTables />
                                </div>

                            </div>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Aux>
    )

}
export default Periodic