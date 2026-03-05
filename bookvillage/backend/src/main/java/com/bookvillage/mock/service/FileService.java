package com.bookvillage.mock.service;

import com.bookvillage.mock.entity.Order;
import lombok.RequiredArgsConstructor;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Service
@RequiredArgsConstructor
public class FileService {

    @Value("${file.storage-path:./uploads/receipts}")
    private String storagePath;

    private Path basePath;

    @PostConstruct
    public void init() {
        basePath = Paths.get(storagePath).toAbsolutePath().normalize();
        try {
            Files.createDirectories(basePath);
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory", e);
        }
    }

    public String generateReceipt(Order order) {
        String filename = "order_" + order.getOrderNumber() + ".pdf";
        Path filePath = basePath.resolve(filename).normalize();
        try (PDDocument document = new PDDocument()) {
            PDPage page = new PDPage();
            document.addPage(page);
            try (PDPageContentStream contentStream = new PDPageContentStream(document, page)) {
                contentStream.beginText();
                contentStream.setFont(PDType1Font.HELVETICA, 12);
                contentStream.newLineAtOffset(25, 700);
                contentStream.showText("Order: " + order.getOrderNumber());
                contentStream.newLineAtOffset(0, -20);
                contentStream.showText("Total: " + order.getTotalAmount());
                contentStream.endText();
            }
            document.save(filePath.toFile());
        } catch (IOException e) {
            throw new RuntimeException("Failed to generate receipt", e);
        }
        return filename;
    }

    public Resource loadFileAsResource(String filename) throws IOException {
        if (!isAllowedFileName(filename)) {
            throw new IOException("Invalid file name");
        }

        Path filePath = basePath.resolve(filename).normalize();
        if (!filePath.startsWith(basePath)) {
            throw new IOException("Invalid path");
        }

        Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists() && resource.isReadable()) {
            return resource;
        }
        throw new IOException("File not found: " + filename);
    }

    private boolean isAllowedFileName(String filename) {
        if (filename == null || filename.trim().isEmpty()) {
            return false;
        }
        if (filename.contains("..") || filename.contains("/") || filename.contains("\\")) {
            return false;
        }
        return filename.toLowerCase().endsWith(".pdf");
    }
}
