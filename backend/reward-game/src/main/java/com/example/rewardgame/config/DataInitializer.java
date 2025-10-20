package com.example.rewardgame.config;

import com.example.rewardgame.models.Reward;
import com.example.rewardgame.models.User;
import com.example.rewardgame.repositories.RewardRepository;
import com.example.rewardgame.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

@Configuration
public class DataInitializer {

    @Autowired
    private RewardRepository rewardRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Bean
    public CommandLineRunner initData() {
        return args -> {
            // Tạo tài khoản mặc định nếu chưa có người dùng nào
            if (userRepository.count() == 0) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@example.com");
                adminUser.setPassword(passwordEncoder.encode("admin123"));
                adminUser.setPoints(1000);
                
                Set<String> roles = new HashSet<>();
                roles.add("ROLE_ADMIN");
                roles.add("ROLE_USER");
                adminUser.setRoles(roles);
                
                userRepository.save(adminUser);
                
                User regularUser = new User();
                regularUser.setUsername("user");
                regularUser.setEmail("user@example.com");
                regularUser.setPassword(passwordEncoder.encode("user123"));
                regularUser.setPoints(100);
                
                Set<String> userRoles = new HashSet<>();
                userRoles.add("ROLE_USER");
                regularUser.setRoles(userRoles);
                
                userRepository.save(regularUser);
                
                System.out.println("Sample users initialized successfully");
            }
            
            // Chỉ seed data nếu bảng rewards trống
            if (rewardRepository.count() == 0) {
                Reward reward1 = new Reward();
                reward1.setName("Common Reward");
                reward1.setDescription("A common reward worth a few points");
                reward1.setRarity("Common");
                reward1.setProbability(0.6);
                reward1.setPoints(10);
                
                Reward reward2 = new Reward();
                reward2.setName("Uncommon Reward");
                reward2.setDescription("An uncommon reward worth some points");
                reward2.setRarity("Uncommon");
                reward2.setProbability(0.3);
                reward2.setPoints(50);
                
                Reward reward3 = new Reward();
                reward3.setName("Rare Reward");
                reward3.setDescription("A rare reward worth many points");
                reward3.setRarity("Rare");
                reward3.setProbability(0.08);
                reward3.setPoints(200);
                
                Reward reward4 = new Reward();
                reward4.setName("Epic Reward");
                reward4.setDescription("An epic reward worth a lot of points");
                reward4.setRarity("Epic");
                reward4.setProbability(0.018);
                reward4.setPoints(500);
                
                Reward reward5 = new Reward();
                reward5.setName("Legendary Reward");
                reward5.setDescription("A legendary reward worth tons of points");
                reward5.setRarity("Legendary");
                reward5.setProbability(0.002);
                reward5.setPoints(2000);
                
                rewardRepository.saveAll(Arrays.asList(reward1, reward2, reward3, reward4, reward5));
                
                System.out.println("Sample rewards initialized successfully");
            }
        };
    }
}