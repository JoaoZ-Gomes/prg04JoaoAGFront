import { Link } from 'react-router-dom'
import './Home.css'

export default function Home() {
  return (
    <div className="home-wrapper">
      {/* ===== HERO ===== */}
      <section className="hero">
        <div className="hero-left">
          <h1>Transforme seu treino.<br /> Alcance sua melhor versão.</h1>
          <p>Planos personalizados, acompanhamento por profissionais e estratégias com base em resultados — orientação completa para quem quer evoluir de verdade.</p>
          <div className="actions">
            <Link className="btn-cta" to="#contato">Avaliação Grátis</Link>
            <a href="#servicos" className="btn-secundario">Nossos serviços</a>
          </div>
        </div>

        <div className="hero-right">
          <img src="/assets/imagens/ph2.png" alt="Treino" />
        </div>
      </section>

      {/* ===== SERVIÇOS ===== */}
      <section id="servicos" className="services">
        <div className="service">
          <h3>Treino Personalizado</h3>
          <p>Programas criados para seu perfil, nível e objetivo — força, hipertrofia ou emagrecimento.</p>
        </div>
        <div className="service">
          <h3>Acompanhamento Online</h3>
          <p>Feedback contínuo, ajustes e monitoramento por profissionais certificados.</p>
        </div>
        <div className="service">
          <h3>Nutrição Estratégica</h3>
          <p>Orientação alimentar prática que funciona na sua rotina, sem dietas extremas.</p>
        </div>
      </section>

      {/* ===== PLANO DESTAQUE ===== */}
      <aside className="card-hero" id="planos">
        <div className="plano-info">
          <h3>Plano Mais Procurado</h3>
          <p className="descricao">Treino + Nutrição + Avaliações quinzenais</p>
        </div>
        <div className="botoes">
          <Link className="btn-cta" to="#contato">Quero esse plano</Link>
          <a href="#planos" className="btn-secundario">Ver outros</a>
        </div>
      </aside>

      {/* ===== SOBRE O PROFISSIONAL ===== */}
      <section id="sobre" className="profissional">
       <img src="/assets/imagens/ph.jpg" alt="Pedro Henrique" />
        <div>
          <h3>Pedro Henrique</h3>
          <p>Pedro Henrique é um profissional em formação na área de Educação Física, comprometido em oferecer treinos eficazes e personalizados. Com uma abordagem focada em desempenho, saúde e bem-estar, ele já conta com uma base de clientes satisfeitos que comprovam a qualidade e os resultados de seu trabalho.</p>
        </div>
      </section>

      {/* ===== CALL TO ACTION ===== */}
      <div className="callout" id="contato">
        <div className="left">
          <h3>Pronto pra começar?</h3>
          <p>Agende sua avaliação gratuita e descubra o plano ideal pro seu objetivo.</p>
        </div>
        <div>
          <Link className="btn-cta" to="/login">Agendar Avaliação</Link>
        </div>
      </div>
    </div>
  )
}
