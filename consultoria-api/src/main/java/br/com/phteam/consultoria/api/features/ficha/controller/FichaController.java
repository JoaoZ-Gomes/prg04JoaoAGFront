package br.com.phteam.consultoria.api.features.ficha.controller;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaAtualizarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.request.FichaCriarRequestDTO;
import br.com.phteam.consultoria.api.features.ficha.dto.response.FichaResponseDTO;
import br.com.phteam.consultoria.api.features.ficha.service.FichaIService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/fichas")
@RequiredArgsConstructor
public class FichaController {

    private final FichaIService service;

    // =====================================================
    // POST
    // =====================================================

    /**
     * Cria uma nova ficha de treinamento.
     *
     * @param dto os dados da ficha a ser criada
     * @return ResponseEntity com a ficha criada e status 201
     */
    @PostMapping
    public ResponseEntity<FichaResponseDTO> criar(@RequestBody @Valid FichaCriarRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.save(dto));
    }

    // =====================================================
    // GET PAGINADO
    // =====================================================

    /**
     * Lista todas as fichas com paginação.
     *
     * @param pageable parâmetros de paginação
     * @return ResponseEntity com página de fichas
     */
    @GetMapping
    public ResponseEntity<Page<FichaResponseDTO>> listar(
            @PageableDefault(size = 10, sort = "nome") Pageable pageable) {

        return ResponseEntity.ok(service.findAllPaged(pageable));
    }

    // =====================================================
    // GET TODOS SEM PAGINAÇÃO
    // =====================================================

    /**
     * Lista todas as fichas sem paginação.
     *
     * @return ResponseEntity com lista de todas as fichas
     */
    @GetMapping("/all")
    public ResponseEntity<List<FichaResponseDTO>> listarTodos() {
        return ResponseEntity.ok(service.findAll());
    }

    // =====================================================
    // GET POR ID
    // =====================================================

    /**
     * Busca uma ficha pelo ID.
     *
     * @param id o identificador da ficha
     * @return ResponseEntity com os dados da ficha
     */
    @GetMapping("/{id}")
    public ResponseEntity<FichaResponseDTO> buscar(@PathVariable Long id) {
        return ResponseEntity.ok(service.findById(id));
    }

    // =====================================================
    // PUT
    // =====================================================

    /**
     * Atualiza uma ficha existente.
     *
     * @param id  o identificador da ficha
     * @param dto os dados para atualização
     * @return ResponseEntity com a ficha atualizada
     */
    @PutMapping("/{id}")
    public ResponseEntity<FichaResponseDTO> atualizar(
            @PathVariable Long id,
            @RequestBody @Valid FichaAtualizarRequestDTO dto) {

        FichaAtualizarRequestDTO withId = new FichaAtualizarRequestDTO(
                id,
                dto.nome(),
                dto.objetivo()
        );

        return ResponseEntity.ok(service.update(withId));
    }

    // =====================================================
    // DELETE
    // =====================================================

    /**
     * Deleta uma ficha pelo ID.
     *
     * @param id o identificador da ficha a ser deletada
     * @return ResponseEntity com status 204
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletar(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
