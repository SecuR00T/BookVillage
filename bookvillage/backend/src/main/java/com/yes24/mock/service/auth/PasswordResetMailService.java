package com.yes24.mock.service.auth;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class PasswordResetMailService {

    private static final DateTimeFormatter EXPIRES_AT_FORMAT = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
    private final ObjectProvider<JavaMailSender> mailSenderProvider;

    @Value("${app.mail.from:no-reply@bookchon.local}")
    private String fromAddress;

    @Value("${spring.mail.username:}")
    private String smtpUsername;

    public PasswordResetMailService(ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.mailSenderProvider = mailSenderProvider;
    }

    public void sendPasswordResetCode(String toEmail, String token, LocalDateTime expiresAt) {
        if (toEmail == null || toEmail.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (token == null || token.trim().isEmpty()) {
            throw new IllegalArgumentException("Reset token is required");
        }

        JavaMailSender mailSender = mailSenderProvider.getIfAvailable();
        if (mailSender == null) {
            throw new IllegalStateException("Email service is not configured. Set SPRING_MAIL_HOST and related settings.");
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail.trim());
        message.setFrom(resolveFromAddress());
        message.setSubject("[BOOKCHON] Password reset code");
        message.setText(buildBody(token, expiresAt));

        try {
            mailSender.send(message);
        } catch (MailException ex) {
            throw new IllegalStateException("Failed to send password reset email. Check SMTP settings.", ex);
        }
    }

    private String buildBody(String token, LocalDateTime expiresAt) {
        String expires = expiresAt != null ? EXPIRES_AT_FORMAT.format(expiresAt) : "soon";
        return "Hello,\n\n"
                + "Your BOOKCHON password reset verification code is:\n\n"
                + token + "\n\n"
                + "This code expires at " + expires + ".\n"
                + "If you did not request this reset, you can ignore this email.\n\n"
                + "BOOKCHON Team";
    }

    private String resolveFromAddress() {
        if (fromAddress != null && !fromAddress.trim().isEmpty()) {
            return fromAddress.trim();
        }
        if (smtpUsername != null && !smtpUsername.trim().isEmpty()) {
            return smtpUsername.trim();
        }
        throw new IllegalStateException("APP_MAIL_FROM or SPRING_MAIL_USERNAME must be configured.");
    }
}


