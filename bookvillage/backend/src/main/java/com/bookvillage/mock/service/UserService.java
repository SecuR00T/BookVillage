package com.bookvillage.mock.service;

import com.bookvillage.mock.dto.OrderDto;
import com.bookvillage.mock.dto.UserDto;
import com.bookvillage.mock.entity.Order;
import com.bookvillage.mock.entity.User;
import com.bookvillage.mock.repository.AccessLogRepository;
import com.bookvillage.mock.repository.CustomerServiceRepository;
import com.bookvillage.mock.repository.OrderRepository;
import com.bookvillage.mock.repository.ReviewRepository;
import com.bookvillage.mock.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * ?띯뫁鍮?? IDOR - userId 野꺜筌?嚥≪뮇彛??袁⑥뵭
 * getById, update, getOrdersByUserId?癒?퐣 ?遺욧퍕??userId??域밸챶?嚥?????
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ReviewRepository reviewRepository;
    private final CustomerServiceRepository customerServiceRepository;
    private final AccessLogRepository accessLogRepository;
    private final PasswordEncoder passwordEncoder;

    public UserDto getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        return UserDto.from(user);
    }

    public UserDto updateUser(Long userId, UserDto updateDto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (updateDto.getName() != null) user.setName(updateDto.getName());
        if (updateDto.getPhone() != null) user.setPhone(updateDto.getPhone());
        if (updateDto.getAddress() != null) user.setAddress(updateDto.getAddress());
        user = userRepository.save(user);
        return UserDto.from(user);
    }

    public List<OrderDto> getOrdersByUserId(Long userId) {
        List<Order> orders = orderRepository.findByUserId(userId);
        return orders.stream().map(OrderDto::from).collect(Collectors.toList());
    }

    @Transactional
    public void changeMyPassword(Long userId, String currentPassword, String newPassword) {
        if (currentPassword == null || currentPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("Current password is required");
        }
        if (newPassword == null || newPassword.trim().isEmpty()) {
            throw new IllegalArgumentException("New password is required");
        }
        if (newPassword.length() < 8) {
            throw new IllegalArgumentException("New password must be at least 8 characters");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!passwordEncoder.matches(currentPassword, user.getPassword())) {
            throw new IllegalArgumentException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    @Transactional
    public void deleteMyAccount(Long userId, String password) {
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new IllegalArgumentException("Invalid password");
        }

        deleteUserAndRelatedData(user);
    }

    @Transactional
    public void deleteAccountWithoutReAuth(Long targetUserId) {
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        deleteUserAndRelatedData(target);
    }

    private void deleteUserAndRelatedData(User user) {
        Long userId = user.getId();

        customerServiceRepository.deleteByUserId(userId);
        reviewRepository.deleteByUserId(userId);
        accessLogRepository.deleteByUserId(userId);

        List<Order> orders = orderRepository.findByUserId(userId);
        orderRepository.deleteAll(orders);

        userRepository.delete(user);
    }
}
