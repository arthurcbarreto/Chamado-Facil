package com.example.chamadoback.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;


@ResponseStatus(HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {

    private final String recurso;
    private final Object identificador;

    public ResourceNotFoundException(String recurso, Object identificador) {
        super(String.format("%s com identificador '%s' não encontrado.", recurso, identificador));
        this.recurso       = recurso;
        this.identificador = identificador;
    }

    public String getRecurso()        { return recurso; }
    public Object getIdentificador()  { return identificador; }
}
