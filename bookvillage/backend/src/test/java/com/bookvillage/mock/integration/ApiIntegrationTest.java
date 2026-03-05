package com.bookvillage.mock.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.bookvillage.mock.entity.Book;
import com.bookvillage.mock.entity.Coupon;
import com.bookvillage.mock.entity.User;
import com.bookvillage.mock.repository.BookRepository;
import com.bookvillage.mock.repository.CouponRepository;
import com.bookvillage.mock.repository.OrderRepository;
import com.bookvillage.mock.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BookRepository bookRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private CouponRepository couponRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private String userAuth;
    private String adminAuth;
    private Long bookId;

    @BeforeEach
    void setUp() {
        ensureAuxTables();

        orderRepository.deleteAll();
        couponRepository.deleteAll();
        bookRepository.deleteAll();
        userRepository.deleteAll();
        jdbcTemplate.update("DELETE FROM point_histories");
        jdbcTemplate.update("DELETE FROM payment_transactions");
        jdbcTemplate.update("DELETE FROM cart_items");
        jdbcTemplate.update("DELETE FROM security_lab_events");

        User admin = new User();
        admin.setEmail("admin@bookvillage.mock");
        admin.setPassword(passwordEncoder.encode("password"));
        admin.setName("Admin");
        admin.setRole("ADMIN");
        admin.setStatus("ACTIVE");
        userRepository.save(admin);

        User user = new User();
        user.setEmail("user@bookvillage.mock");
        user.setPassword(passwordEncoder.encode("password"));
        user.setName("User");
        user.setRole("USER");
        user.setStatus("ACTIVE");
        user = userRepository.save(user);

        Book book = new Book();
        book.setIsbn("978-1-1111-111-1");
        book.setTitle("Test Driven Learning");
        book.setAuthor("Test Author");
        book.setPublisher("Test Publisher");
        book.setCategory("IT");
        book.setPrice(BigDecimal.valueOf(20000));
        book.setStock(100);
        book.setDescription("test book");
        book = bookRepository.save(book);
        bookId = book.getId();

        Coupon coupon = new Coupon();
        coupon.setCode("WELCOME10");
        coupon.setDiscountType("PERCENT");
        coupon.setDiscountValue(BigDecimal.TEN);
        coupon.setRemainingCount(10);
        couponRepository.save(coupon);

        jdbcTemplate.update(
                "INSERT INTO point_histories (user_id, change_type, amount, balance_after, description) VALUES (?, 'EARN', ?, ?, ?)",
                user.getId(),
                5000,
                5000,
                "seed points"
        );

        userAuth = basic("user@bookvillage.mock", "password");
        adminAuth = basic("admin@bookvillage.mock", "password");
    }

    @Test
    void registerSuccess() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "new@bookvillage.mock",
                                "password", "newpassword",
                                "name", "New User"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("new@bookvillage.mock"));
    }

    @Test
    void loginSuccess() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "user@bookvillage.mock",
                                "password", "password"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("user@bookvillage.mock"));
    }

    @Test
    void loginFailWithWrongPassword() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "email", "user@bookvillage.mock",
                                "password", "wrong-password"
                        ))))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void bookSearchWorks() throws Exception {
        mockMvc.perform(get("/api/books/search").param("q", "Driven"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Driven Learning"));
    }

    @Test
    void categoryListWorks() throws Exception {
        mockMvc.perform(get("/api/books/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0]").value("IT"));
    }

    @Test
    void checkoutWorks() throws Exception {
        mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "items", new Object[]{Map.of("bookId", bookId, "quantity", 2)},
                                "paymentMethod", "CARD",
                                "couponCode", "WELCOME10",
                                "usePoints", 1000,
                                "shippingAddress", "Seoul"
                        ))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PAID"));
    }

    @Test
    void orderListWorks() throws Exception {
        checkoutWorks();

        mockMvc.perform(get("/api/orders").header("Authorization", userAuth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderNumber").exists());
    }

    @Test
    void guestLookupReturnsMaskedAddress() throws Exception {
        String response = mockMvc.perform(post("/api/orders/checkout")
                        .header("Authorization", userAuth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "items", new Object[]{Map.of("bookId", bookId, "quantity", 1)},
                                "paymentMethod", "CARD",
                                "shippingAddress", "Seoul Gangnam 123"
                        ))))
                .andExpect(status().isOk())
                .andReturn().getResponse().getContentAsString();

        String orderNumber = objectMapper.readTree(response).get("orderNumber").asText();

        mockMvc.perform(get("/api/orders/lookup").param("orderNumber", orderNumber))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderNumber").value(orderNumber))
                .andExpect(jsonPath("$.maskedShippingAddress").exists());
    }

    @Test
    void adminDashboardForbiddenForUser() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard").header("Authorization", userAuth))
                .andExpect(status().isForbidden());
    }

    @Test
    void adminDashboardWorksForAdmin() throws Exception {
        mockMvc.perform(get("/api/admin/dashboard").header("Authorization", adminAuth))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalUsers").exists())
                .andExpect(jsonPath("$.totalBooks").exists())
                .andExpect(jsonPath("$.securityEvents").exists());
    }

    private void ensureAuxTables() {
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS point_histories (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, change_type VARCHAR(20), amount INT, balance_after INT, description VARCHAR(255), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS payment_transactions (id BIGINT AUTO_INCREMENT PRIMARY KEY, order_id BIGINT, user_id BIGINT, payment_method VARCHAR(30), coupon_code VARCHAR(50), point_used INT, amount DECIMAL(12,2), status VARCHAR(20), learning_note VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS cart_items (id BIGINT AUTO_INCREMENT PRIMARY KEY, user_id BIGINT, book_id BIGINT, quantity INT, unit_price DECIMAL(12,2), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
        jdbcTemplate.execute("CREATE TABLE IF NOT EXISTS security_lab_events (id BIGINT AUTO_INCREMENT PRIMARY KEY, req_id VARCHAR(20), user_id BIGINT, endpoint VARCHAR(255), event_type VARCHAR(50), input_excerpt VARCHAR(500), simulated_result VARCHAR(500), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    }

    private String basic(String email, String password) {
        String token = Base64.getEncoder().encodeToString((email + ":" + password).getBytes(StandardCharsets.UTF_8));
        return "Basic " + token;
    }
}
