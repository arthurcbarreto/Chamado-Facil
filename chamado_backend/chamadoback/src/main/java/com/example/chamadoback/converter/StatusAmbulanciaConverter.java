package com.example.chamadoback.converter;

import com.example.chamadoback.enums.StatusAmbulanciaEnum;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.text.Normalizer;

@Converter(autoApply = true)
public class StatusAmbulanciaConverter implements AttributeConverter<StatusAmbulanciaEnum, String> {

    @Override
    public String convertToDatabaseColumn(StatusAmbulanciaEnum attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public StatusAmbulanciaEnum convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        // Normaliza: remove acentos, converte espaços em _ e maiúsculas
        String normalized = Normalizer.normalize(dbData, Normalizer.Form.NFD)
                .replaceAll("[^\\p{ASCII}]", "")
                .toUpperCase()
                .trim()
                .replace(" ", "_");
        try {
            return StatusAmbulanciaEnum.valueOf(normalized);
        } catch (IllegalArgumentException e) {
            // Mapeamentos legados
            return switch (dbData.toLowerCase().trim()) {
                case "disponível", "disponivel" -> StatusAmbulanciaEnum.DISPONIVEL;
                case "em deslocamento"           -> StatusAmbulanciaEnum.EM_DESLOCAMENTO;
                case "em atendimento"            -> StatusAmbulanciaEnum.EM_ATENDIMENTO;
                case "manutenção", "manutencao"  -> StatusAmbulanciaEnum.MANUTENCAO;
                default -> StatusAmbulanciaEnum.DISPONIVEL;
            };
        }
    }
}
