package br.com.phteam.consultoria.api.features.cliente.repository;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import br.com.phteam.consultoria.api.features.cliente.model.Cliente;

@DataJpaTest
class ClienteRepositoryTest {

	@Autowired
	private ClienteRepository repository;

	@Test
	void salvarERetornarPorEmail() {
		Cliente c = new Cliente();
		c.setNome("Joao");
		c.setEmail("joao@example.com");
		c.setSenha("senha");
		c.setCpf("12345678901");

		Cliente saved = repository.save(c);

		Optional<Cliente> found = repository.findByEmail("joao@example.com");
		assertThat(found).isPresent();
		assertThat(found.get().getId()).isEqualTo(saved.getId());
	}
}
