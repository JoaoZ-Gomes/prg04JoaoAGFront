import './Footer.css'

export default function Footer() {
  return (
    <footer>
      <div id="footer-content">
        <div id="footer-contacts">
          <div className="logo">
            <img src="/assets/imagens/ph_team.png" alt="Logo" />
          </div>
          <p className="subtitulo">"Transforme o esforço em resultado. O limite é só o começo."</p>

          <div id="footer-social-midia">
            <a href="https://www.instagram.com" className="footer-link" id="instagram" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://api.whatsapp.com/send?phone=557592179232" className="footer-link" id="whatsapp" target="_blank" rel="noreferrer">
              <i className="fab fa-whatsapp"></i>
            </a>
          </div>
        </div>

    


        <div id="footer-subscribe">
          <h3>Subscrição</h3>
          <p>Email de Contato</p>

          <div id="input-group">
            <input type="email" placeholder="seu@email.com" />
            <button>
              <i className="fas fa-check"></i>
            </button>
          </div>
        </div>
      </div>

      <div id="footer-bottom">
        <div id="footer-copyright">
          &copy; 2025 all rights reserved João Gomes Developer
        </div>
      </div>
    </footer>
  )
}