package com.bookvillage.mock.service;

import com.bookvillage.mock.entity.User;
import com.bookvillage.mock.repository.UserRepository;
import com.bookvillage.mock.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String identifier) throws UsernameNotFoundException {
        User user = userRepository.findByEmailOrUsername(identifier)
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + identifier));
        return new UserPrincipal(user);
    }
}
