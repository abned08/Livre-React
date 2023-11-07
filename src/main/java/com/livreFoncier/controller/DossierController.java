package com.livreFoncier.controller;

import com.itextpdf.text.pdf.PdfReader;
import com.itextpdf.text.pdf.PdfStamper;
import com.itextpdf.text.xml.xmp.XmpWriter;
import com.livreFoncier.exception.LivreNotFoundException;
import com.livreFoncier.model.Dossier;
import com.livreFoncier.model.Establishment;
import com.livreFoncier.model.InitStat;
import com.livreFoncier.repo.DossierRepo;
import com.livreFoncier.repo.EstablishmentRepo;
import com.livreFoncier.repo.InitStatRepo;
import lombok.Data;
import net.sf.jasperreports.engine.*;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.HtmlExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleHtmlExporterOutput;
import org.apache.commons.io.FileUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.util.FileCopyUtils;
import org.springframework.util.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;
import java.io.*;
import java.net.URLConnection;
import java.util.*;
import java.util.stream.Collectors;

@CrossOrigin
@RestController
public class DossierController {

    @Data
    static class DossierCountMonth {
        String month;
        Number count;

        public DossierCountMonth(String month, Number count) {
            this.month = month;
            this.count = count;
        }
    }

    private final DossierRepo dossierRepo;
    private final EstablishmentRepo establishmentRepo;
    private final InitStatRepo initStatRepo;

    public DossierController(DossierRepo dossierRepo, EstablishmentRepo establishmentRepo, InitStatRepo initStatRepo) {
        this.dossierRepo = dossierRepo;
        this.establishmentRepo = establishmentRepo;
        this.initStatRepo = initStatRepo;
    }


    @GetMapping("/dossier")
    public ResponseEntity<List<Dossier>> getAllDossiers() {
        List<Dossier> dossiers = dossierRepo.findAllActivated();
        return new ResponseEntity<>(dossiers, HttpStatus.OK);
    }

    @GetMapping("/lastDossier")
    public ResponseEntity<Integer> getLastDossier() {
        Integer lastD = dossierRepo.lastDossier() != null ? dossierRepo.lastDossier() : 0;
        return new ResponseEntity<>(lastD, HttpStatus.OK);
    }

    @GetMapping("/dossier/{id}")
    public ResponseEntity<Dossier> getDossierById(@PathVariable("id") Long id) {
        Dossier dossier = dossierRepo.findById(id).orElseThrow(() -> new LivreNotFoundException("dossier not found"));
        return new ResponseEntity<>(dossier, HttpStatus.OK);
    }

    @PostMapping("/dossier")
    public ResponseEntity<Dossier> addDossier(@Valid Dossier dossier, BindingResult bindingResult, @RequestParam(value = "files", required = false) MultipartFile multipartFile) throws IOException {
        Dossier newDossier =new Dossier();
        if (multipartFile == null) {
            newDossier = dossierRepo.save(dossier);
        } else {
            try {
                String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                String newFileName = "dossier N°= " + dossier.getNum() + "." + FileUtils.getExtension(fileName);
                dossier.setPdfFile(newFileName);
                newDossier = dossierRepo.save(dossier);
                String uploadDir = "./dossierPdfs/" + newDossier.getId();
                File directory = new File(uploadDir);
                directory.mkdir();
                PdfReader readInputPDF = new PdfReader(multipartFile.getInputStream());
                PdfStamper stamper =new PdfStamper(readInputPDF, new FileOutputStream(uploadDir+ "/" + dossier.getPdfFile()));
                HashMap<String, String> hMap = readInputPDF.getInfo();
                hMap.put("Title", "dossier N°= " + dossier.getNum()+" - "+dossier.getPersonName());
                hMap.put("Subject", dossier.getPersonName());
                hMap.put("Keywords", "Extract PDF Metadata,Metadata Extraction,Remove Metadata from PDF");
                hMap.put("Creator", "Conservation Foncier App");
                hMap.put("Author", "Conservation Foncier App");
                stamper.setMoreInfo(hMap);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                XmpWriter xmp = new XmpWriter(baos, hMap);
                xmp.close();
                stamper.setXmpMetadata(baos.toByteArray());
                stamper.close();
//                FileUploadUtil.saveFile(uploadDir, newFileName,multipartFile);

            }catch (Exception e){
                System.out.println(e);
            }
        }
        return new ResponseEntity<>(newDossier, HttpStatus.CREATED);
    }

    @PutMapping("/dossier")
    public ResponseEntity<Dossier> updateDossier(@Valid Dossier dossier, BindingResult bindingResult, @RequestParam(value = "files", required = false) MultipartFile multipartFile) throws IOException {
//        Dossier updateDossier = dossierRepo.save(dossier);
        Dossier updateDossier =dossierRepo.findById(dossier.getId()).orElseThrow(() -> new LivreNotFoundException("dossier not found"));
        String uploadDir = "./dossierPdfs/" + updateDossier.getId();
        if (updateDossier.getLastDecisionDate()!= null && dossier.getLastDecisionDate()== null)
            dossier.setLastDecisionDate(updateDossier.getLastDecisionDate());
        if (multipartFile == null) {
            File fileDir = new File(uploadDir + "/" + updateDossier.getPdfFile());
            if (fileDir.exists()){
                fileDir.delete();
            }
            updateDossier.setPdfFile("");
            updateDossier = dossierRepo.save(dossier);
        } else {
            try {
                // String fileName = StringUtils.cleanPath(Objects.requireNonNull(multipartFile.getOriginalFilename()));
                String newFileName = "dossier N°= " + dossier.getNum() + ".pdf" ;
                dossier.setPdfFile(newFileName);
                updateDossier = dossierRepo.save(dossier);
                uploadDir = "./dossierPdfs/" + updateDossier.getId();
                File directory = new File(uploadDir);
                if (!directory.exists()) directory.mkdir();
                PdfReader readInputPDF = new PdfReader(multipartFile.getInputStream());
                PdfStamper stamper =new PdfStamper(readInputPDF, new FileOutputStream(uploadDir+ "/" + dossier.getPdfFile()));
                HashMap<String, String> hMap = readInputPDF.getInfo();
                hMap.put("Title", "dossier N°= " + dossier.getNum()+" - "+dossier.getPersonName());
                hMap.put("Subject", dossier.getPersonName());
                hMap.put("Keywords", "Extract PDF Metadata,Metadata Extraction,Remove Metadata from PDF");
                hMap.put("Creator", "Conservation Foncier App");
                hMap.put("Author", "Conservation Foncier App");
                stamper.setMoreInfo(hMap);
                ByteArrayOutputStream baos = new ByteArrayOutputStream();
                XmpWriter xmp = new XmpWriter(baos, hMap);
                xmp.close();
                stamper.setXmpMetadata(baos.toByteArray());
                stamper.close();
//                FileUploadUtil.saveFile(uploadDir, newFileName,multipartFile);

            }catch (Exception e){
                System.out.println(e);
            }
        }
        return new ResponseEntity<>(updateDossier, HttpStatus.OK);
    }

    @DeleteMapping("/dossier/{id}")
    public ResponseEntity<?> deleteDossier(@PathVariable("id") Long id) {
        dossierRepo.deleteById(id);
        return new ResponseEntity<>(id, HttpStatus.OK);

    }

    @PostMapping("/matchDossierLivre")
    public ResponseEntity<Dossier> getMatchDossierLivre (@Valid @RequestBody Dossier dossier) {
        Dossier foundLivre=dossierRepo.findFirstByCommuneAndSectionAndIlotAndLot(dossier.getCommune(),dossier.getSection(),dossier.getIlot(),dossier.getLot());
        if (foundLivre != null) {
            dossier = foundLivre;
        }else {
            dossier=null;
        }
        return new ResponseEntity<>(dossier, HttpStatus.OK);
    }

    @GetMapping("/lastLivreDossier")
    public ResponseEntity<Dossier> getLastLivreDossier() {
        Dossier lastL= dossierRepo.lastLivreDossier();
        return new ResponseEntity<>(lastL, HttpStatus.OK);
    }

    @PostMapping("/matchRecArngNumDossierLivre")
    public ResponseEntity<Dossier> getMatchRecArngNumDossierLivre (@RequestBody Dossier dossier) {
        Dossier foundLivre=dossierRepo.findFirstByRecordNumAndArrangeNum(dossier.getRecordNum(),dossier.getArrangeNum());
        if (foundLivre != null) {
            dossier = foundLivre;
        }else {
            dossier=null;
        }
        return new ResponseEntity<>(dossier, HttpStatus.OK);
    }

    /////// Analyzing DATA

    @GetMapping("/dossier/countPerMonths")
    public ResponseEntity<List<DossierCountMonth>> getCountPerMonths() {
        List<Object[]> count = dossierRepo.dossierCountThisYearPerMonths();
        List<DossierCountMonth> listD = count.stream().map(x -> new DossierCountMonth(x[0].toString(), (Number) x[1])).collect(Collectors.toList());
        return new ResponseEntity<>(listD, HttpStatus.OK);
    }

    @GetMapping("/dossier/totalCountThisYear")
    public ResponseEntity<Integer> getTotalCountThisYear() {
        Integer count = dossierRepo.dossierTotalCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/completedCountThisYear")
    public ResponseEntity<Integer> getCompletedCountThisYear() {
        Integer count = dossierRepo.dossierCompletedCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/uncompletedCountThisYear")
    public ResponseEntity<Integer> getUncompletedCountThisYear() {
        Integer count = dossierRepo.dossierUncompletedCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/rejectedCountThisYear")
    public ResponseEntity<Integer> getRejectedCountThisYear() {
        Integer count = dossierRepo.dossierRejectedCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }


    @GetMapping("/dossier/rejectedTotalCount")
    public ResponseEntity<Integer> getRejectedTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierRejectedTotalCount() + i.getUrban_rejectedNum() + i.getRural_rejectedNum() + i.getDesert_rejectedNum();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/CompletedTotalCount")
    public ResponseEntity<Integer> getCompletedTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierCompletedTotalCount() + i.getUrban_livrePrepared() + i.getRural_livrePrepared() + i.getDesert_livrePrepared();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/checkNumThisYear")
    public ResponseEntity<Integer> checkNumThisYear(@RequestParam("num") String num) {
        Integer count = dossierRepo.dossierCheckNumThisYear(num);
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/urbanTotalCount")
    public ResponseEntity<Integer> getUrbanTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierUrbanTotalCount() + i.getUrban_ilotNum();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/ruralTotalCount")
    public ResponseEntity<Integer> getRuralTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierRuralTotalCount() + i.getRural_ilotNum();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/desertTotalCount")
    public ResponseEntity<Integer> getDesertTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierDesertTotalCount() + i.getDesert_ilotNum();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/dossierFinalTotalCount")
    public ResponseEntity<Integer> getDossierFinalTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierFinalTotalCount() + i.getUrban_ilotNumFinal() + i.getRural_ilotNumFinal() + i.getDesert_ilotNumFinal();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/dossierTempTotalCount")
    public ResponseEntity<Integer> getDossierTempTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.dossierTempTotalCount() + i.getUrban_ilotTempNum() + i.getRural_ilotTempNum() + i.getDesert_ilotTempNum();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }



    ////Analizing data livre
    @GetMapping("/dossier/livrecountPerMonths")
    public ResponseEntity<List<DossierCountMonth>> getLivreCountPerMonths() {
        List<Object[]> count = dossierRepo.livreCountThisYearPerMonths();
        List<DossierCountMonth> listD = count.stream().map(x -> new DossierCountMonth(x[0].toString(), (Number) x[1])).collect(Collectors.toList());
        return new ResponseEntity<>(listD, HttpStatus.OK);
    }

    @GetMapping("/dossier/livretotalCountThisYear")
    public ResponseEntity<Integer> getLivreTotalCountThisYear() {
        Integer count = dossierRepo.livreTotalCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/livredeliveredCountThisYear")
    public ResponseEntity<Integer> geLivreDeliveredCountThisYear() {
        Integer count = dossierRepo.livreDeliveredCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/livrecopyCountThisYear")
    public ResponseEntity<Integer> getLivreCopyCountThisYear() {
        Integer count = dossierRepo.livreCopyCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/livreNotDeliveredCountThisYear")
    public ResponseEntity<Integer> getLivreNotDeliveredCountThisYear() {
        Integer count = dossierRepo.livreNotDeliveredCountThisYear();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/livretotalCount")
    public ResponseEntity<Integer> getLivreTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.livreTotalCount() + i.getUrban_livreDelivered() + i.getRural_livreDelivered() + i.getDesert_livreDelivered();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }

    @GetMapping("/dossier/livredoublingTotalCount")
    public ResponseEntity<Integer> getLivreDoublingTotalCount() {
        InitStat i=initStatRepo.findFirstByOrderByIdDesc();
        Integer count = dossierRepo.livreDoublingTotalCount() + i.getUrban_ilotUnknownNum() + i.getRural_ilotUnknownNum() + i.getDesert_ilotUnknownNum();
        return new ResponseEntity<>(count, HttpStatus.OK);
    }



    ///// Report

    @RequestMapping("dossier/{id}/report")
    public void generateReport(@PathVariable("id") Long id, HttpServletResponse response) throws IOException, JRException {
        Dossier dossier = dossierRepo.findById(id).orElseThrow(() -> new LivreNotFoundException("dossier not found"));
        Establishment establishment = establishmentRepo.findTopByOrderByIdDesc();
        response.setContentType("text/html; charset=UTF-8");
        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(Collections.singleton(dossier));
        InputStream inputStream = this.getClass().getResourceAsStream("/reports/dossier.jrxml");
        JasperReport jasperReport = JasperCompileManager.compileReport(inputStream);
        Map<String, Object> parameters = new HashMap<>();

        parameters.put("id", id);
        parameters.put("wilaya", establishment.getWilaya());
        parameters.put("frWilaya", establishment.getFrWilaya());
        parameters.put("commune", establishment.getCommune());
        parameters.put("frCommune", establishment.getFrCommune());

        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
        HtmlExporter htmlExporter = new HtmlExporter(DefaultJasperReportsContext.getInstance());
        htmlExporter.setExporterInput(new SimpleExporterInput(jasperPrint));
        htmlExporter.setExporterOutput(new SimpleHtmlExporterOutput(response.getWriter()));
        htmlExporter.exportReport();

        //PDF report
//        response.setContentType("application/pdf");
//        JRBeanCollectionDataSource dataSource = new JRBeanCollectionDataSource(Collections.singleton(dossier));
//        InputStream jasperStream = this.getClass().getResourceAsStream("/reports/dossier.jrxml");
//        JasperReport jasperReport= JasperCompileManager.compileReport(jasperStream);
//        Map<String, Object> parameters = new HashMap<>();
//        parameters.put("id", id);
//        parameters.put("wilaya", establishment.getWilaya());
//        parameters.put("frWilaya", establishment.getFrWilaya());
//        parameters.put("commune", establishment.getCommune());
//        parameters.put("frCommune", establishment.getFrCommune());
//        JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, parameters, dataSource);
//
//        response.setHeader("Content-disposition", "inline; filename=dossier.pdf");
//
//        final ServletOutputStream outStream = response.getOutputStream();
//        JasperExportManager.exportReportToPdfStream(jasperPrint, outStream);
    }

    @RequestMapping("/download/{id}")
    public void downloadPDFResource(HttpServletResponse response, @PathVariable("id") Long id) throws IOException {
        Dossier dossier = dossierRepo.findById(id).orElseThrow(() -> new LivreNotFoundException("dossier not found"));
        String downloaddDir = "./dossierPdfs/" + dossier.getId() + "/" + dossier.getPdfFile();
        File file = new File(downloaddDir);
        if (file.exists()) {

            //get the mimetype
            String mimeType = URLConnection.guessContentTypeFromName(file.getName());
            if (mimeType == null) {
                //unknown mimetype so set the mimetype to application/octet-stream
                mimeType = "application/octet-stream";
            }

            response.setContentType(mimeType);
            response.setHeader("Content-Disposition", String.format("inline; filename=\"" + file.getName() + "\""));
            response.setContentLength((int) file.length());

            InputStream inputStream = new BufferedInputStream(new FileInputStream(file));
            FileCopyUtils.copy(inputStream, response.getOutputStream());

        }else {
            throw new LivreNotFoundException("dossier not found");
        }
    }
}
