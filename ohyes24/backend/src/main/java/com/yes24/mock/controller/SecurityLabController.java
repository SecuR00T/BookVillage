package com.yes24.mock.controller;

import com.yes24.mock.dto.LabRequirementDto;
import com.yes24.mock.dto.LabSimulationRequest;
import com.yes24.mock.dto.LabSimulationResponse;
import com.yes24.mock.security.UserPrincipal;
import com.yes24.mock.service.SecurityLabService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/labs")
@RequiredArgsConstructor
public class SecurityLabController {

    private final SecurityLabService securityLabService;

    @GetMapping("/requirements")
    public ResponseEntity<List<LabRequirementDto>> getRequirements() {
        return ResponseEntity.ok(securityLabService.getRequirements());
    }

    @PostMapping("/{reqId}/simulate")
    public ResponseEntity<LabSimulationResponse> simulate(
            @PathVariable String reqId,
            @RequestBody(required = false) LabSimulationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {

        String role = principal != null ? principal.getRole() : "ANONYMOUS";
        securityLabService.assertRole(reqId, role);

        String input = request != null ? request.getInput() : null;
        Long userId = principal != null ? principal.getUserId() : null;
        LabSimulationResponse response = securityLabService.simulate(reqId, userId, "/api/labs/" + reqId + "/simulate", input);
        return ResponseEntity.ok(response);
    }
}
