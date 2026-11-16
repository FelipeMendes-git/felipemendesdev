/**
 * Fonte única de verdade para dados de contato e identidade.
 * Alterar aqui reflete no site inteiro.
 *
 * ATENÇÃO: `url` também está escrito no index.html (canonical, Open Graph e
 * JSON-LD). Ao trocar o domínio, atualize os dois lugares.
 */

export const SITE = {
  url: 'https://devfelipemendes.com.br',
  name: 'Felipe Mendes',
  owner: 'Felipe Dias Mendes',
  role: 'Desenvolvedor full-stack',
  city: 'Uberaba',
  state: 'MG',
};

const WHATSAPP_E164 = '5534991969192';

export const CONTACT = {
  linkedin: 'https://br.linkedin.com/in/felipe-dias-mendes-',
  whatsappNumber: '(34) 99196-9192',
  whatsapp: `https://wa.me/${WHATSAPP_E164}?text=${encodeURIComponent(
    'Olá, Felipe! Vi seu portfólio e gostaria de conversar.',
  )}`,
};
