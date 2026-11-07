import './styles/base.css'
import './styles/comercial.css'
import { WHATSAPP, WHATSAPP_MENSAJE, PORTAFOLIO } from './config.js'

const $ = (sel) => document.querySelector(sel)
const $$ = (sel) => [...document.querySelectorAll(sel)]
const dinero = (n) => '$' + Math.round(n).toLocaleString('en-US')
const escapar = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))
const linkWhatsApp = (texto) => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`

$('[data-anio]').textContent = new Date().getFullYear()
$$('[data-whatsapp]').forEach((a) => (a.href = linkWhatsApp(WHATSAPP_MENSAJE)))
$$('[data-portafolio]').forEach((a) => (a.href = PORTAFOLIO))

// Paquetes que maneja el admin (/datos/precios-comercial.json).
// Si están apagados o no se pueden leer, se muestra "Próximamente".
async function cargarPaquetes() {
  try {
    const r = await fetch('/datos/precios-comercial.json', { cache: 'no-cache' })
    if (!r.ok || !r.headers.get('content-type')?.includes('json')) return null
    const d = await r.json()
    return d.activo && d.paquetes?.length ? d.paquetes : null
  } catch {
    return null
  }
}

function pintarPaquetes(paquetes) {
  if (!paquetes) {
    $('[data-proximamente]').hidden = false
    return
  }
  $('[data-paquetes]').innerHTML = paquetes.map((p, i) => `
    <article class="paquete revelar ${p.destacado ? 'destacado' : ''}" style="--retraso:${i * 80}ms">
      ${p.destacado ? '<span class="paquete-sello">Más pedido</span>' : ''}
      <h3>${escapar(p.nombre)}</h3>
      ${p.descripcion ? `<p class="paquete-desc">${escapar(p.descripcion)}</p>` : ''}
      <p class="paquete-precio">${dinero(p.precio)}<small> USD</small></p>
      ${p.incluye.length ? `<ul>${p.incluye.map((x) => `<li>${escapar(x)}</li>`).join('')}</ul>` : ''}
      <a class="boton ${p.destacado ? '' : 'boton-borde'}" target="_blank" rel="noopener"
         href="${linkWhatsApp(`Hola Ángel, me interesa el paquete "${p.nombre}" (${dinero(p.precio)} USD). ¿Tienes disponibilidad?`)}">Cotizar este paquete</a>
    </article>`).join('')
}

// Los bloques aparecen al entrar en pantalla (transición CSS, sin librerías).
// Si el navegador no tiene IntersectionObserver o pidió reducir movimiento, todo se ve desde el inicio.
function revelar() {
  const reducir = matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reducir || !('IntersectionObserver' in window)) return
  const obs = new IntersectionObserver((entradas) => {
    entradas.forEach((e) => {
      if (!e.isIntersecting) return
      e.target.classList.add('visible')
      obs.unobserve(e.target)
    })
  }, { rootMargin: '0px 0px -8% 0px' })
  $$('.revelar').forEach((el) => { el.classList.add('oculto'); obs.observe(el) })
}

cargarPaquetes().then((p) => { pintarPaquetes(p); revelar() })
