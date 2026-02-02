package br.com.phteam.consultoria.api.infrastructure.exception;

/**
 * Exceção lançada quando um recurso não é encontrado pelo ID.
 * Deve resultar em HTTP 404 Not Found.
 */
public class RecursoNaoEncontradoException extends RuntimeException {

    /**
     * Cria uma nova instância da exceção.
     *
     * @param mensagem descrição da exceção
     */
    public RecursoNaoEncontradoException(String mensagem) {
        super(mensagem);
    }
}