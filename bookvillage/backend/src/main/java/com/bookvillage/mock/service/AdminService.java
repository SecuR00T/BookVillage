package com.bookvillage.mock.service;

import com.bookvillage.mock.dto.AdminDashboardDto;
import com.bookvillage.mock.dto.BookDto;
import com.bookvillage.mock.dto.OrderDto;
import com.bookvillage.mock.dto.UserDto;
import com.bookvillage.mock.entity.*;
import com.bookvillage.mock.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final BookRepository bookRepository;
    private final OrderRepository orderRepository;
    private final CouponRepository couponRepository;
    private final CustomerServiceRepository customerServiceRepository;
    private final AccessLogRepository accessLogRepository;
    private final CustomerServiceService customerServiceService;
    private final JdbcTemplate jdbcTemplate;

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    public List<BookDto> getAllBooks() {
        return bookRepository.findAll().stream()
                .map(BookDto::from)
                .collect(Collectors.toList());
    }

    public BookDto createBook(Book book) {
        if (book.getPrice() == null || book.getPrice().doubleValue() <= 0) {
            throw new IllegalArgumentException("price must be positive");
        }
        if (book.getStock() == null || book.getStock() < 0) {
            throw new IllegalArgumentException("stock must be >= 0");
        }
        book = bookRepository.save(book);
        return BookDto.from(book);
    }

    public BookDto updateBook(Long id, Book book) {
        Book existing = bookRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Book not found"));
        existing.setTitle(book.getTitle());
        existing.setAuthor(book.getAuthor());
        existing.setPublisher(book.getPublisher());
        existing.setCategory(book.getCategory());
        existing.setPrice(book.getPrice());
        existing.setStock(book.getStock());
        existing.setDescription(book.getDescription());
        existing = bookRepository.save(existing);
        return BookDto.from(existing);
    }

    public void deleteBook(Long id) {
        bookRepository.deleteById(id);
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream()
                .map(OrderDto::from)
                .collect(Collectors.toList());
    }

    public List<Coupon> getAllCoupons() {
        return couponRepository.findAll();
    }

    public Coupon createCoupon(Coupon coupon) {
        return couponRepository.save(coupon);
    }

    public List<CustomerService> getAllCustomerService() {
        return customerServiceRepository.findAll();
    }

    public List<AccessLog> getAllLogs() {
        return accessLogRepository.findAll();
    }

    public AdminDashboardDto getDashboard() {
        AdminDashboardDto dto = new AdminDashboardDto();
        dto.setTotalUsers(userRepository.count());
        dto.setTotalBooks(bookRepository.count());
        dto.setTotalOrders(orderRepository.count());
        Long openInquiries = jdbcTemplate.queryForObject(
                "SELECT COUNT(1) FROM customer_service WHERE status = 'OPEN'",
                Long.class
        );
        Long events = jdbcTemplate.queryForObject("SELECT COUNT(1) FROM security_lab_events", Long.class);
        dto.setOpenInquiries(openInquiries != null ? openInquiries : 0L);
        dto.setSecurityEvents(events != null ? events : 0L);
        return dto;
    }

    @Transactional
    public OrderDto updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new IllegalArgumentException("Order not found"));
        String normalized = status == null ? "" : status.trim().toUpperCase(Locale.ROOT);
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException("status is required");
        }
        order.setStatus(normalized);
        return OrderDto.from(orderRepository.save(order));
    }

    @Transactional
    public UserDto updateUserStatus(Long userId, String status, String role) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (status != null && !status.trim().isEmpty()) {
            user.setStatus(status.trim().toUpperCase(Locale.ROOT));
        }
        if (role != null && !role.trim().isEmpty()) {
            user.setRole(role.trim().toUpperCase(Locale.ROOT));
        }
        return UserDto.from(userRepository.save(user));
    }

    public List<BookDto> getStockByFilter(String author, String isbn) {
        String normalizedAuthor = author == null ? "" : author.trim().toLowerCase(Locale.ROOT);
        String normalizedIsbn = isbn == null ? "" : isbn.trim().toLowerCase(Locale.ROOT);
        return bookRepository.findAll().stream()
                .filter(b -> normalizedAuthor.isEmpty() || (b.getAuthor() != null && b.getAuthor().toLowerCase(Locale.ROOT).contains(normalizedAuthor)))
                .filter(b -> normalizedIsbn.isEmpty() || (b.getIsbn() != null && b.getIsbn().toLowerCase(Locale.ROOT).contains(normalizedIsbn)))
                .map(BookDto::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public BookDto inboundBook(String isbn, Integer quantity) {
        if (isbn == null || isbn.trim().isEmpty()) {
            throw new IllegalArgumentException("isbn is required");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("quantity must be positive");
        }
        Book book = bookRepository.findAll().stream()
                .filter(b -> isbn.trim().equalsIgnoreCase(b.getIsbn()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Book not found for isbn"));

        int before = book.getStock() == null ? 0 : book.getStock();
        int after = before + quantity;
        book.setStock(after);
        bookRepository.save(book);

        jdbcTemplate.update(
                "INSERT INTO access_logs (user_id, endpoint, method, ip_address) VALUES (NULL, ?, 'ADMIN', '127.0.0.1')",
                "INBOUND isbn=" + isbn + " before=" + before + " after=" + after
        );
        return BookDto.from(book);
    }

    @Transactional
    public BookDto updateBookStock(Long bookId, Integer stock) {
        if (stock == null || stock < 0) {
            throw new IllegalArgumentException("stock must be >= 0");
        }
        Book book = bookRepository.findById(bookId)
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));
        book.setStock(stock);
        return BookDto.from(bookRepository.save(book));
    }

    public CustomerService replyInquiry(Long inquiryId, String answer) {
        return customerServiceService.reply(inquiryId, answer);
    }
}
