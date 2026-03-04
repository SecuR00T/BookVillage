package com.yes24.mock.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.support.StaticListableBeanFactory;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.test.util.ReflectionTestUtils;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

class PasswordResetMailServiceTest {

    @Test
    void sendPasswordResetCodeSendsEmail() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        StaticListableBeanFactory beanFactory = new StaticListableBeanFactory();
        beanFactory.addBean("mailSender", mailSender);

        PasswordResetMailService service = new PasswordResetMailService(beanFactory.getBeanProvider(JavaMailSender.class));
        ReflectionTestUtils.setField(service, "fromAddress", "no-reply@ohyes24.local");

        service.sendPasswordResetCode("user@yes24.mock", "1234", LocalDateTime.of(2026, 3, 4, 10, 0));

        verify(mailSender).send(any(SimpleMailMessage.class));
    }

    @Test
    void sendPasswordResetCodeWithoutMailSenderThrows() {
        StaticListableBeanFactory beanFactory = new StaticListableBeanFactory();
        PasswordResetMailService service = new PasswordResetMailService(beanFactory.getBeanProvider(JavaMailSender.class));
        ReflectionTestUtils.setField(service, "fromAddress", "no-reply@ohyes24.local");

        IllegalStateException ex = assertThrows(IllegalStateException.class,
                () -> service.sendPasswordResetCode("user@yes24.mock", "1234", LocalDateTime.now()));

        assertEquals("Email service is not configured. Set SPRING_MAIL_HOST and related settings.", ex.getMessage());
    }
}
