package br.com.phteam.consultoria.api.infrastructure.auth.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.com.phteam.consultoria.api.infrastructure.auth.dto.request.LoginRequestDTO;
import br.com.phteam.consultoria.api.infrastructure.auth.dto.response.LoginResponseDTO;
import br.com.phteam.consultoria.api.infrastructure.auth.jwt.JwtTokenService;
import lombok.RequiredArgsConstructor;

/**
 * Controller responsável pela autenticação e geração do JWT.
 * Endpoint público: /api/auth/login
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenService jwtTokenService;

    // =====================================================
    // POST - LOGIN
    // =====================================================

    /**
     * Realiza login de Cliente ou Consultor.
     * Autentica o usuário e retorna JWT + email + tipo de usuário.
     *
     * @param request contém email e senha do usuário
     * @return ResponseEntity com LoginResponseDTO contendo token e dados do usuário
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody LoginRequestDTO request) {

        // Autentica email + senha
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.email(),
                        request.senha()
                )
        );

        // Usuário autenticado
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        // Extrai o tipo de usuário a partir da ROLE
        String tipoUsuario = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority) // ROLE_CLIENTE | ROLE_CONSULTOR
                .findFirst()
                .map(role -> role.replace("ROLE_", "")) // CLIENTE | CONSULTOR
                .map(String::toLowerCase)
                .map(s -> s.substring(0, 1).toUpperCase() + s.substring(1)) // Cliente | Consultor
                .orElse("Indefinido");

        // Gera o JWT
        String token = jwtTokenService.generateToken(authentication);

        // Retorno
        return ResponseEntity.ok(
                new LoginResponseDTO(
                        token,
                        userDetails.getUsername(),
                        tipoUsuario
                )
        );
    }
}
