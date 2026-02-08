package com.saju.auth.repository;

import com.saju.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<String> findByUsername(String username);

    Optional<User> findByProviderAndProviderId(String provider, String providerId);
}
