package com.yes24.mock.dto;

import lombok.Data;

import java.util.Map;

@Data
public class LabSimulationRequest {
    private String input;
    private Map<String, String> metadata;
}
