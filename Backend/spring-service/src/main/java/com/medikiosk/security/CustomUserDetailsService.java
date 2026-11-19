package com.medikiosk.security;

import com.medikiosk.entity.User;
import com.medikiosk.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(username.trim().toLowerCase())
                .orElseThrow(() -> new UsernameNotFoundException("Invalid credentials"));
        return org.springframework.security.core.userdetails.User.withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(user.getUserRoles().stream()
                        .map(r -> new SimpleGrantedAuthority("ROLE_" + r.getRole().getName().name()))
                        .toList())
                .disabled(!user.isEnabled() || user.getAccountStatus() != com.medikiosk.enums.AccountStatus.ACTIVE)
                .accountLocked(user.isAccountLocked())
                .build();
    }
}
