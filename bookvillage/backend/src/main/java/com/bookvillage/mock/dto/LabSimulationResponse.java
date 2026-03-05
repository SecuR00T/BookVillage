package com.bookvillage.mock.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LabSimulationResponse {
    private String reqId;
    private String featureName;
    private String securityTopic;
    private boolean triggered;
    private String message;
    private String simulatedResult;
    private String recommendation;
    private LocalDateTime timestamp;
}
