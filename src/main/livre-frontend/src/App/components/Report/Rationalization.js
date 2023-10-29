import React, {useEffect, useMemo, useRef, useState} from "react"
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {fetchEstablishment, periodicCount} from "../Dashboard/DashboardSlice";
import {differenceInCalendarDays, format, toDate} from "date-fns";
import Typography from "@material-ui/core/Typography";
import {
  CircularProgress,
  Collapse,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow, TextField
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import {useReactToPrint} from "react-to-print";
import Aux from "../../../hoc/_Aux";
import {Card, Col, Row} from "react-bootstrap";
import {DatePicker} from "@material-ui/pickers";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import {PrintRounded} from "@material-ui/icons";

const Rationalization = () =>{
  const {t} = useTranslation()
  const dispatch = useDispatch()
  const [selectedDate, handleDateChange] = useState(null)
  const [selectedDate2, handleDateChange2] = useState(new Date())
  const [semester, setSemester] = useState(0)
  const [stockUntil, setStockUntil] = useState('')
  const [quantity, setQuantity] = useState('')
  const [checked, setChecked] = useState(false);
  const {loading, periodicStat, establishment} = useSelector((state) => ({
    loading: state.dashboard.loading,
    periodicStat: state.dashboard.periodicStat,
    establishment: state.dashboard.establishment
  }));
  const currentStat = useRef()
  const divToPrint = useRef()

  useEffect(() => {
    establishment.length === 0 && dispatch(fetchEstablishment())
    if (selectedDate && selectedDate2 && differenceInCalendarDays(selectedDate2, selectedDate) > 0 && stockUntil!=='' && quantity!=='') {
      dispatch(periodicCount({sDate: selectedDate, eDate: selectedDate2})).then(setChecked(true))
    }else {
      setChecked(false)
    }
    // eslint-disable-next-line
  }, [dispatch, selectedDate, selectedDate2,stockUntil,quantity, establishment])
  useMemo(() => {
    if (periodicStat.length > 0) {
      currentStat.current = periodicStat[0]
    }
  }, [periodicStat])

  useMemo(() => {
    selectedDate2 !=null && setSemester(Math.floor((toDate(selectedDate2).getMonth() + 6) / 6))
  }, [selectedDate2])

  const StatsTables = () => {
    return (
        <>
          <div style={{padding: 13, borderRadius: 10, marginBottom: 5, background: 'rgb(218 221 225)'}}>
            <TableContainer component={Paper}>
              <Table aria-label="customized table">
                <TableHead>
                  <TableRow scope="row">
                    <TableCell align="center" style={{color: 'black',direction:'rtl'}}>مخزون المحافظة العقارية</TableCell>
                    <TableCell align="center" style={{color: 'black',direction:'rtl'}}>الكمية المستهلكة (أ+ب)</TableCell>
                    <TableCell align="center" style={{color: 'black',direction:'rtl'}}>الدفاتر العقارية الملغاة أو المشطوبة (ب)</TableCell>
                    <TableCell align="center" style={{color: 'black',direction:'rtl'}}> الدفاتر العقارية المعدة (أ)</TableCell>
                    <TableCell align="center" style={{color: 'black',direction:'rtl'}}>الكمية المسلمة للمحافظة العقارية خلال سنة {selectedDate2.getFullYear()}</TableCell>
                    <TableCell align="center" style={{color: 'black',direction:'rtl'}}>المخزون إلى غاية {selectedDate!=null && format(selectedDate,"yyyy/MM/dd")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? parseInt(stockUntil) + parseInt(quantity) - (currentStat.current?.urban_livrePrepared + currentStat.current?.rural_livrePrepared + currentStat.current?.desert_livrePrepared + currentStat.current?.crossedOutNum):""}</TableCell>
                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.urban_livrePrepared + currentStat.current?.rural_livrePrepared + currentStat.current?.desert_livrePrepared + currentStat.current?.crossedOutNum:""}</TableCell>
                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.crossedOutNum:""}</TableCell>
                    <TableCell align="center" style={{color: 'black'}}>{currentStat.current ? currentStat.current?.urban_livrePrepared + currentStat.current?.rural_livrePrepared + currentStat.current?.desert_livrePrepared:""}</TableCell>
                    <TableCell align="center" style={{color: 'black'}}>{quantity}</TableCell>
                    <TableCell align="center" style={{color: 'black'}}>{stockUntil}</TableCell>
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

  const handlChange = (e) => {
    setStockUntil(e.target.value)
  }
  const handlChange2 = (e) => {
    setQuantity(e.target.value)
  }

  return (
      <Aux>
        <Row>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as='h5'>
                  {t("from")}
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
                    label={t("from")}
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
                  {t("to")}
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
                    label={t("to")}
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
                  {t("stock_until")} {selectedDate!==null ? format(selectedDate,"yyyy/MM/dd"):""}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <TextField
                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    onChange={handlChange}
                    label='0000'
                    value={stockUntil}
                    type='number'
                    margin='normal'
                    fullWidth
                />
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card>
              <Card.Header>
                <Card.Title as='h5'>
                  {t("quantity_delivered_year")} {selectedDate2.getFullYear()}
                </Card.Title>
              </Card.Header>
              <Card.Body>
                <TextField
                    onKeyDown={(evt) => ["e", "E", "+", "-", "."].includes(evt.key) && evt.preventDefault()}
                    onChange={handlChange2}
                    value={quantity}
                    label='0000'
                    type='number'
                    margin='normal'
                    fullWidth
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
                <div id='printDiv'
                     style={{display: 'none'}}
                >
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
                    }} variant="h6">جــدول ترشـيــد واستغــلال الدفــاتــر العقـــاريــة</Typography>
                    <Typography
                        style={{marginTop: 1, textAlign: 'center', marginBottom: 25, color: 'black'}}
                        variant="h6">السداسي {semester <= 1 ?'الأول':'الثاني'}:  {selectedDate && format(selectedDate, "yyyy/MM/dd")} إلى:  {format(selectedDate2, "yyyy/MM/dd")}
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
export default Rationalization
