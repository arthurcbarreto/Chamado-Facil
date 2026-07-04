package com.example.chamadoback.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * Lançada quando uma regra de negócio é violada.
 * Exemplos: ambulância não disponível (RN09), usuário sem plano ativo (RN02).
 */
@ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY)
public class BusinessException extends RuntimeException {

    private final String campo;

    public BusinessException(String mensagem) {
        super(mensagem);
        this.campo = null;
    }

    public BusinessException(String campo, String mensagem) {
        super(mensagem);
        this.campo = campo;
    }

    public String getCampo() {
        return campo;
    }
}
