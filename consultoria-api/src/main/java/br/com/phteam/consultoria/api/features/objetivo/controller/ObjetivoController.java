package br.com.phteam.consultoria.api.features.objetivo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoRequestDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoResponseDTO;
import br.com.phteam.consultoria.api.features.objetivo.dto.ObjetivoUpdateDTO;
import br.com.phteam.consultoria.api.features.objetivo.service.ObjetivoIService;

import java.util.List;

@RestController
@RequestMapping("/api/objetivos")
@RequiredArgsConstructor
public class ObjetivoController {

    private final ObjetivoIService service;

    // =====================================================
    // POST
    // =====================================================

    /**
     * Cria um novo objetivo.
     *
     * @param dto os dados do objetivo a ser criado
     * @return ResponseEntity com o objetivo criado e status 201
     */
    @PostMapping
    public ResponseEntity<ObjetivoResponseDTO> criar(@RequestBody @Valid ObjetivoRequestDTO dto) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.criar(dto));
    }

    // =====================================================
    // GET PAGINADO
    // =====================================================

    /**
     * Lista todos os objetivos com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return ResponseEntity com página de objetivos
     */
    @GetMapping
    public ResponseEntity<Page<ObjetivoResponseDTO>> listar(
            @PageableDefault(size = 10, sort = "tipo") Pageable pageable) {
        return ResponseEntity.ok(service.listarTodos(pageable));
    }

    // =====================================================
    // GET ATIVOS
    // =====================================================

    /**
     * Lista apenas os objetivos ativos.
     *
     * @return ResponseEntity com lista de objetivos ativos
     */
    @GetMapping("/ativos")
    public ResponseEntity<List<ObjetivoResponseDTO>> listarAtivos() {
        return ResponseEntity.ok(
                service.listarTodos(org.springframework.data.domain.Pageable.unpaged())
                        .stream()
                        .filter(obj -> obj.ativo())
                        .toList()
        );
    }

    // =====================================================
    // GET POR ID
    // =====================================================

    /**
     * Busca um objetivo pelo ID.
     *
     * @param id o identificador do objetivo
     * @return ResponseEntity com os dados do objetivo
     */
    @GetMapping("/{id}")
    public ResponseEntity<ObjetivoResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.buscarPorId(id));
    }

    // =====================================================
    // PUT
    // =====================================================

    /**
     * Atualiza um objetivo existente.
     *
     * @param id  o identificador do objetivo
     * @param dto os dados para atualização
     * @return ResponseEntity com o objetivo atualizado
     */
    @PutMapping("/{id}")
    public ResponseEntity<ObjetivoResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid ObjetivoUpdateDTO dto) {
        return ResponseEntity.ok(service.atualizar(id, dto));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta um objetivo pelo ID.
     *
     * @param id o identificador do objetivo a ser deletado
     * @return ResponseEntity com status 204
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.deletar(id);
        return ResponseEntity.noContent().build();
    }

    // =====================================================
    // PATCH - DESATIVAR
    // =====================================================

    /**
     * Desativa um objetivo sem deletar.
     *
     * @param id o identificador do objetivo a ser desativado
     * @return ResponseEntity com o objetivo atualizado
     */
    @PatchMapping("/{id}/desativar")
    public ResponseEntity<ObjetivoResponseDTO> desativar(@PathVariable Long id) {
        return ResponseEntity.ok(service.desativar(id));
    }

    // =====================================================
    // PATCH - ATIVAR
    // =====================================================

    /**
     * Ativa um objetivo.
     *
     * @param id o identificador do objetivo a ser ativado
     * @return ResponseEntity com o objetivo atualizado
     */
    @PatchMapping("/{id}/ativar")
    public ResponseEntity<ObjetivoResponseDTO> ativar(@PathVariable Long id) {
        return ResponseEntity.ok(service.ativar(id));
    }
}
