package br.com.phteam.consultoria.api.infrastructure.exception;

/**
 * Exceção lançada quando uma regra de negócio é violada.
 * Deve resultar em HTTP 400 Bad Request ou HTTP 422 Unprocessable Entity.
 */
public class RegraDeNegocioException extends RuntimeException {

    /**
     * Cria uma nova instância da exceção.
     *
     * @param mensagem descrição da regra de negócio violada
     */
    public RegraDeNegocioException(String mensagem) {
        super(mensagem);
    }
}