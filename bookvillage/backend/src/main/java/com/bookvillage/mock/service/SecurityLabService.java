package com.bookvillage.mock.service;

import com.bookvillage.mock.dto.LabRequirementDto;
import com.bookvillage.mock.dto.LabSimulationResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
@RequiredArgsConstructor
public class SecurityLabService {

    private final JdbcTemplate jdbcTemplate;

    public List<LabRequirementDto> getRequirements() {
        try {
            return jdbcTemplate.query(
                    "SELECT req_id, major_category, middle_category, feature_name, requirement_text, security_topic, required_role " +
                            "FROM security_lab_requirements ORDER BY req_id",
                    (rs, rowNum) -> {
                        LabRequirementDto dto = new LabRequirementDto();
                        dto.setReqId(rs.getString("req_id"));
                        dto.setMajorCategory(rs.getString("major_category"));
                        dto.setMiddleCategory(rs.getString("middle_category"));
                        dto.setFeatureName(rs.getString("feature_name"));
                        dto.setRequirementText(rs.getString("requirement_text"));
                        dto.setSecurityTopic(rs.getString("security_topic"));
                        dto.setRequiredRole(rs.getString("required_role"));
                        return dto;
                    }
            );
        } catch (Exception e) {
            return List.of();
        }
    }

    public LabRequirementDto getRequirement(String reqId) {
        try {
            return jdbcTemplate.queryForObject(
                    "SELECT req_id, major_category, middle_category, feature_name, requirement_text, security_topic, required_role " +
                            "FROM security_lab_requirements WHERE req_id = ?",
                    (rs, rowNum) -> {
                        LabRequirementDto dto = new LabRequirementDto();
                        dto.setReqId(rs.getString("req_id"));
                        dto.setMajorCategory(rs.getString("major_category"));
                        dto.setMiddleCategory(rs.getString("middle_category"));
                        dto.setFeatureName(rs.getString("feature_name"));
                        dto.setRequirementText(rs.getString("requirement_text"));
                        dto.setSecurityTopic(rs.getString("security_topic"));
                        dto.setRequiredRole(rs.getString("required_role"));
                        return dto;
                    },
                    reqId
            );
        } catch (EmptyResultDataAccessException e) {
            return fallbackRequirement(reqId);
        } catch (Exception e) {
            return fallbackRequirement(reqId);
        }
    }

    public void assertRole(String reqId, String role) {
        LabRequirementDto requirement = getRequirement(reqId);
        String requiredRole = requirement.getRequiredRole() == null ? "USER" : requirement.getRequiredRole();
        if ("ADMIN".equalsIgnoreCase(requiredRole) && !"ADMIN".equalsIgnoreCase(role)) {
            throw new AccessDeniedException("Admin role is required for this requirement");
        }
    }

    public LabSimulationResponse simulate(String reqId, Long userId, String endpoint, String input) {
        LabRequirementDto requirement = getRequirement(reqId);
        boolean triggered = detectTriggered(requirement.getSecurityTopic(), input);
        String message = triggered
                ? "Risk pattern detected. Returning a controlled learning simulation instead of real exploitation."
                : "No high-risk pattern detected. Safe path executed with learning trace recorded.";
        String simulatedResult = simulatedResult(requirement.getSecurityTopic(), triggered);
        String recommendation = recommendation(requirement.getSecurityTopic());

        logEvent(reqId, userId, endpoint, triggered ? "TRIGGERED" : "NORMAL", input, simulatedResult);

        LabSimulationResponse response = new LabSimulationResponse();
        response.setReqId(requirement.getReqId());
        response.setFeatureName(requirement.getFeatureName());
        response.setSecurityTopic(requirement.getSecurityTopic());
        response.setTriggered(triggered);
        response.setMessage(message);
        response.setSimulatedResult(simulatedResult);
        response.setRecommendation(recommendation);
        response.setTimestamp(LocalDateTime.now());
        return response;
    }

    public void logEvent(String reqId, Long userId, String endpoint, String eventType, String input, String simulatedResult) {
        try {
            jdbcTemplate.update(
                    "INSERT INTO security_lab_events (req_id, user_id, endpoint, event_type, input_excerpt, simulated_result) VALUES (?, ?, ?, ?, ?, ?)",
                    reqId,
                    userId,
                    endpoint,
                    eventType,
                    abbreviate(input),
                    abbreviate(simulatedResult)
            );
        } catch (Exception ignored) {
            // Test profile may not include migration tables.
        }
    }

    private boolean detectTriggered(String securityTopic, String input) {
        if (input == null || input.trim().isEmpty()) {
            return false;
        }

        String normalized = input.toLowerCase(Locale.ROOT);
        String topic = securityTopic == null ? "" : securityTopic.toLowerCase(Locale.ROOT);

        if (topic.contains("xss")) {
            return normalized.contains("<script") || normalized.contains("javascript:") || normalized.contains("onerror=");
        }
        if (topic.contains("sqli") || topic.contains("sql injection")) {
            return normalized.contains("' or") || normalized.contains("union select") || normalized.contains("--") || normalized.contains(";drop");
        }
        if (topic.contains("idor") || topic.contains("broken auth") || topic.contains("access control")) {
            return normalized.contains("../") || normalized.contains("user_id=") || normalized.contains("admin=true") || normalized.contains("role=admin");
        }
        if (topic.contains("csrf")) {
            return normalized.contains("auto-submit") || normalized.contains("forged") || normalized.contains("cross-site");
        }
        if (topic.contains("ssrf")) {
            return normalized.contains("169.254.169.254") || normalized.contains("localhost") || normalized.contains("127.0.0.1") || normalized.contains("internal");
        }
        if (topic.contains("command injection")) {
            return normalized.contains(";") || normalized.contains("&&") || normalized.contains("|") || normalized.contains("$(");
        }
        if (topic.contains("path traversal") || topic.contains("file download")) {
            return normalized.contains("../") || normalized.contains("..\\") || normalized.contains("/etc/");
        }
        if (topic.contains("race") || topic.contains("abuse") || topic.contains("dos") || topic.contains("rate limiting")) {
            return normalized.contains("burst") || normalized.contains("flood") || normalized.contains("1000") || normalized.contains("parallel");
        }
        if (topic.contains("logic") || topic.contains("tampering")) {
            return normalized.contains("skip") || normalized.contains("override") || normalized.contains("price=0") || normalized.contains("qty=-");
        }
        return normalized.length() > 140;
    }

    private String simulatedResult(String securityTopic, boolean triggered) {
        if (!triggered) {
            return "Learning event logged. No exploitable action was executed.";
        }

        String topic = securityTopic == null ? "" : securityTopic.toLowerCase(Locale.ROOT);
        if (topic.contains("idor")) {
            return "Simulated outcome: unauthorized object access would expose masked profile/order metadata only.";
        }
        if (topic.contains("xss")) {
            return "Simulated outcome: browser script execution was blocked and rendered as plain text banner.";
        }
        if (topic.contains("sqli")) {
            return "Simulated outcome: injected query shape detected; fake dataset count=0 returned.";
        }
        if (topic.contains("csrf")) {
            return "Simulated outcome: cross-site request rejected due to missing anti-forgery context.";
        }
        if (topic.contains("ssrf")) {
            return "Simulated outcome: outbound call blocked; internal network addresses are never requested.";
        }
        if (topic.contains("command injection")) {
            return "Simulated outcome: command-like payload detected; OS execution replaced by audit-only flow.";
        }
        if (topic.contains("path traversal") || topic.contains("file download")) {
            return "Simulated outcome: filesystem traversal attempt blocked; safe sample file metadata returned.";
        }
        if (topic.contains("race")) {
            return "Simulated outcome: concurrent misuse detected; transactional guard simulated and request throttled.";
        }
        return "Simulated outcome: risky pattern detected and converted into controlled training response.";
    }

    private String recommendation(String securityTopic) {
        String topic = securityTopic == null ? "" : securityTopic.toLowerCase(Locale.ROOT);
        if (topic.contains("xss")) return "Encode untrusted output, validate rich text allowlists, and apply CSP.";
        if (topic.contains("sqli")) return "Use prepared statements and strict query parameter validation.";
        if (topic.contains("idor") || topic.contains("access control")) return "Always enforce object-level authorization using authenticated identity.";
        if (topic.contains("csrf")) return "Require CSRF tokens and same-site cookie strategy for state-changing requests.";
        if (topic.contains("ssrf")) return "Allowlist outbound hosts and block private/metadata IP ranges.";
        if (topic.contains("command injection")) return "Never execute user input as shell commands; use fixed command APIs.";
        if (topic.contains("path traversal")) return "Normalize canonical paths and block directory traversal sequences.";
        if (topic.contains("logic") || topic.contains("tampering")) return "Recompute critical values server-side and enforce invariant checks.";
        if (topic.contains("rate") || topic.contains("dos") || topic.contains("abuse")) return "Apply rate limiting, quotas, and abuse anomaly detection.";
        return "Apply layered validation, strict authorization, and detailed security logging.";
    }

    private String abbreviate(String value) {
        if (value == null) {
            return null;
        }
        if (value.length() <= 500) {
            return value;
        }
        return value.substring(0, 500);
    }

    private LabRequirementDto fallbackRequirement(String reqId) {
        LabRequirementDto dto = new LabRequirementDto();
        dto.setReqId(reqId);
        dto.setMajorCategory("LAB");
        dto.setMiddleCategory("SIMULATION");
        dto.setFeatureName(reqId);
        dto.setRequirementText("Fallback requirement metadata");
        dto.setSecurityTopic("Generic");
        dto.setRequiredRole("USER");
        return dto;
    }
}
