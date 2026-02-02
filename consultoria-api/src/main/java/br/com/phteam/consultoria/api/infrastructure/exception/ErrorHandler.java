package br.com.phteam.consultoria.api.infrastructure.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * Manipulador global de exceções para a API.
 * Trata todas as exceções não capturadas e retorna respostas HTTP padronizadas.
 */
@RestControllerAdvice
public class ErrorHandler {

    // =====================================================
    // VALIDAÇÃO
    // =====================================================

    /**
     * Trata exceções de validação de campos.
     * Lançada quando @Valid falha em algum campo do RequestBody.
     *
     * @param ex a exceção de validação
     * @return ResponseEntity com mapa de erros de campo e HTTP 400
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = error instanceof FieldError ? ((FieldError) error).getField() : error.getObjectName();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);
    }

    // =====================================================
    // REGRA DE NEGÓCIO
    // =====================================================

    /**
     * Trata exceções de regra de negócio violada.
     * Exemplos: email duplicado, CPF inválido, dados inconsistentes.
     *
     * @param ex a exceção de regra de negócio
     * @return ResponseEntity com mensagem de erro e HTTP 400
     */
    @ExceptionHandler(RegraDeNegocioException.class)
    public ResponseEntity<String> handleRegraDeNegocioException(
            RegraDeNegocioException ex) {

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    // =====================================================
    // RECURSO NÃO ENCONTRADO
    // =====================================================

    /**
     * Trata exceções de recurso não encontrado.
     * Lançada quando uma consulta por ID retorna vazio.
     *
     * @param ex a exceção de recurso não encontrado
     * @return ResponseEntity com mensagem de erro e HTTP 404
     */
    @ExceptionHandler(RecursoNaoEncontradoException.class)
    public ResponseEntity<String> handleRecursoNaoEncontradoException(
            RecursoNaoEncontradoException ex) {

        return new ResponseEntity<>(ex.getMessage(), HttpStatus.NOT_FOUND);
    }
}