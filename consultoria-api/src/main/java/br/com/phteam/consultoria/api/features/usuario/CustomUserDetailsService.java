package br.com.phteam.consultoria.api.features.usuario;


import br.com.phteam.consultoria.api.features.cliente.model.Cliente;
import br.com.phteam.consultoria.api.features.cliente.repository.ClienteRepository;
import br.com.phteam.consultoria.api.features.consultor.model.Consultor;
import br.com.phteam.consultoria.api.features.consultor.repository.ConsultorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {


    private final ClienteRepository clienteRepository;
    private final ConsultorRepository consultorRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {


        Cliente cliente = clienteRepository.findByEmail(email).orElse(null);

        if (cliente != null) {

            return buildUserDetails(cliente.getEmail(), cliente.getSenha(), "CLIENTE");
        }


        Consultor consultor = consultorRepository.findByEmail(email).orElse(null);

        if (consultor != null) {

            return buildUserDetails(consultor.getEmail(), consultor.getSenha(), "CONSULTOR");
        }


        throw new UsernameNotFoundException("Usuário (Cliente ou Consultor) não encontrado com o email: " + email);
    }

    /**
     * Constrói o objeto UserDetails padrão do Spring Security a partir dos dados do seu modelo.
     */
    private UserDetails buildUserDetails(String email, String senhaHash, String role) {


        List<GrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()));


        return new User(
                email,
                senhaHash,
                authorities
        );
    }
}