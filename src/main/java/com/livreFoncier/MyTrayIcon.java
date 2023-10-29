package com.livreFoncier;

import lombok.SneakyThrows;
import org.springframework.boot.ExitCodeGenerator;
import org.springframework.boot.SpringApplication;

import javax.annotation.PostConstruct;
import javax.swing.*;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.net.URI;
import java.net.URL;
import java.util.Objects;
public class MyTrayIcon extends TrayIcon {

    private static final String IMAGE_PATH = "/images/logo16.png";
    private static final String TOOLTIP = "برنامج المحافظة العقارية";
    private final PopupMenu popup;
    final SystemTray tray;

    public MyTrayIcon(){
        super(Objects.requireNonNull(createImage(IMAGE_PATH, TOOLTIP)),TOOLTIP);
        popup = new PopupMenu();
        tray = SystemTray.getSystemTray();
        try {
            setup();
        } catch (AWTException e) {
            e.printStackTrace();
        }
    }



    @PostConstruct
    private void setup() throws AWTException{
        // Create a pop-up menu components
        MenuItem exitItem = new MenuItem("إغلاق");
        MenuItem browseItem = new MenuItem("فتح");
        popup.add(browseItem);
        popup.add(exitItem);
        exitItem.addActionListener(e -> {
            final int exitCode = 0;
            ExitCodeGenerator exitCodeGenerator = () -> exitCode;

            tray.remove(MyTrayIcon.this);
            SpringApplication.exit(LivreApplication.context, exitCodeGenerator);

        });
        browseItem.addActionListener(new ActionListener() {
            @SneakyThrows
            @Override
            public void actionPerformed(ActionEvent e) {
                Desktop.getDesktop().browse(URI.create("http://localhost:8080/"));
            }
        });
        // popup.addSeparator();
        setPopupMenu(popup);
        tray.add(this);

    }

    protected static Image createImage(String path, String description){

        URL imageURL = MyTrayIcon.class.getResource(path);
        if(imageURL == null){
            System.err.println("Failed Creating Image. Resource not found: "+path);
            return null;
        }else {
            return new ImageIcon(imageURL,description).getImage();
        }
    }
}
