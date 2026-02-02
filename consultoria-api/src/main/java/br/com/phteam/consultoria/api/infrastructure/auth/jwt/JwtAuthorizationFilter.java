package br.com.phteam.consultoria.api.infrastructure.auth.jwt;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de autorização JWT.
 *
 * Este filtro é executado UMA VEZ por requisição e tem como responsabilidade:
 *  - Interceptar requisições HTTP
 *  - Extrair o token JWT do header Authorization
 *  - Validar o token
 *  - Autenticar o usuário no contexto do Spring Security
 *
 * Após este filtro, o Spring Security saberá:
 *  - Quem é o usuário logado
 *  - Qual o papel dele (ROLE_CLIENTE ou ROLE_CONSULTOR)
 */
@Component
@RequiredArgsConstructor
public class JwtAuthorizationFilter extends OncePerRequestFilter {

    /**
     * Serviço responsável por gerar, validar e extrair dados do JWT.
     */
    private final JwtTokenService jwtTokenService;

    /**
     * Serviço do Spring Security responsável por carregar o usuário
     * (Cliente ou Consultor) a partir do email.
     */
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        // Recupera o header Authorization da requisição
        final String authHeader = request.getHeader("Authorization");

        // Se não houver token ou não começar com "Bearer ", ignora e continua o fluxo
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Remove o prefixo "Bearer " e obtém apenas o token
        final String token = authHeader.substring(7);
        final String username;

        try {
            // Extrai o email (username) armazenado no token JWT
            username = jwtTokenService.getUsernameFromToken(token);
        } catch (Exception e) {
            // Token inválido, expirado ou malformado → ignora autenticação
            filterChain.doFilter(request, response);
            return;
        }

        /**
         * Se:
         *  - O username foi extraído corretamente
         *  - Ainda não existe autenticação no contexto do Spring Security
         */
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Carrega os dados do usuário (Cliente ou Consultor) do banco
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);

            // Valida o token comparando username e data de expiração
            if (jwtTokenService.validateToken(token, userDetails)) {

                // Cria o token de autenticação do Spring Security
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                // Adiciona detalhes da requisição (IP, session, etc.)
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // Define o usuário como autenticado no contexto de segurança
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
            }
        }

        // Continua o fluxo normal da requisição
        filterChain.doFilter(request, response);
    }
}
