package com.bookvillage.mock.dto;

import lombok.Data;

@Data
public class LabRequirementDto {
    private String reqId;
    private String majorCategory;
    private String middleCategory;
    private String featureName;
    private String requirementText;
    private String securityTopic;
    private String requiredRole;
}
