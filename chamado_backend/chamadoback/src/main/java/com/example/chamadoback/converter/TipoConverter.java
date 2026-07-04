package com.example.chamadoback.converter;

import com.example.chamadoback.enums.TipoEnum;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TipoConverter implements AttributeConverter<TipoEnum, String> {

    @Override
    public String convertToDatabaseColumn(TipoEnum attribute) {
        return attribute == null ? null : attribute.name();
    }

    @Override
    public TipoEnum convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return switch (dbData.toLowerCase().trim()) {
            case "uti", "uti móvel", "uti movel" -> TipoEnum.UTI;
            case "simples"                        -> TipoEnum.SIMPLES;
            default -> {
                try { yield TipoEnum.valueOf(dbData.toUpperCase().trim()); }
                catch (IllegalArgumentException e) { yield TipoEnum.SIMPLES; }
            }
        };
    }
}
