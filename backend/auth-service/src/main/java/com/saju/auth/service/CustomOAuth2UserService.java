package com.saju.auth.service;

import com.saju.auth.entity.User;
import com.saju.auth.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserService;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService implements OAuth2UserService<OAuth2UserRequest, OAuth2User> {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2UserService<OAuth2UserRequest, OAuth2User> delegate = new DefaultOAuth2UserService();
        OAuth2User oAuth2User = delegate.loadUser(userRequest);

        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String userNameAttributeName = userRequest.getClientRegistration().getProviderDetails()
                .getUserInfoEndpoint().getUserNameAttributeName();

        Map<String, Object> attributes = oAuth2User.getAttributes();

        // Naver returns attributes in a nested "response" object
        Map<String, Object> response = (Map<String, Object>) attributes.get("response");

        String providerId = (String) response.get("id");
        String email = (String) response.get("email");
        String name = (String) response.get("name");

        String username = registrationId + "_" + providerId;

        User user = userRepository.findByUsername(username)
                .orElse(User.builder()
                        .username(username)
                        .email(email)
                        .provider(registrationId)
                        .providerId(providerId)
                        .role("USER")
                        .build());

        userRepository.save(user);

        return oAuth2User;
    }
}
