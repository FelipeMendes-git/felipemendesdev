/**
 * Páginas-conceito da vitrine: um estilo de landing page para cada tipo de
 * negócio. Nenhuma tem nome de empresa, de propósito, para ninguém confundir
 * com um estabelecimento real nem achar que é um cliente.
 *
 * As imagens são geradas a partir de design/conceitos/pagina.html (ver README).
 */
import medidas from '../assets/conceitos/medidas.json';
import hamburgueria from '../assets/conceitos/hamburgueria.webp';
import pilates from '../assets/conceitos/pilates.webp';
import odontologia from '../assets/conceitos/odontologia.webp';
import solar from '../assets/conceitos/solar.webp';
import barbearia from '../assets/conceitos/barbearia.webp';
import interiores from '../assets/conceitos/interiores.webp';

const conceito = (slug, ramo, imagem) => ({ slug, ramo, imagem, ...medidas[slug] });

export const CONCEITOS = [
  conceito('hamburgueria', 'Hamburgueria', hamburgueria),
  conceito('pilates', 'Pilates', pilates),
  conceito('odontologia', 'Odontologia', odontologia),
  conceito('solar', 'Energia solar', solar),
  conceito('barbearia', 'Barbearia', barbearia),
  conceito('interiores', 'Interiores', interiores),
];
