/*
  Script: create-products.mjs
  Crea dos productos en la tienda vía Admin REST API:
   - "Grabado Personalización" con variantes "Iniciales" y "Frase"
   - "Billetera Titan" con variante "Standard"

  Requiere variables de entorno:
   - SHOPIFY_STORE_DOMAIN (ej: tu-tienda.myshopify.com)
   - SHOPIFY_ADMIN_API_ACCESS_TOKEN (token Admin con permisos de write_products)

  Uso:
   - Windows PowerShell:
     $env:SHOPIFY_STORE_DOMAIN="tu-tienda.myshopify.com"
     $env:SHOPIFY_ADMIN_API_ACCESS_TOKEN="xxxxx"
     npm run create:products
*/

import process from 'node:process';

const STORE_DOMAIN = process.env.SHOPIFY_STORE_DOMAIN;
const ADMIN_TOKEN = process.env.SHOPIFY_ADMIN_API_ACCESS_TOKEN;
const API_VERSION = '2024-10';

if (!STORE_DOMAIN || !ADMIN_TOKEN) {
  console.error('Faltan variables de entorno: SHOPIFY_STORE_DOMAIN y SHOPIFY_ADMIN_API_ACCESS_TOKEN');
  process.exit(1);
}

async function createProduct(product) {
  const url = `https://${STORE_DOMAIN}/admin/api/${API_VERSION}/products.json`;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': ADMIN_TOKEN,
    },
    body: JSON.stringify({ product }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando producto: ${res.status} ${res.statusText} -> ${text}`);
  }

  const data = await res.json();
  return data.product;
}

function logProduct(p) {
  console.log('Producto creado:', p.title, 'ID:', p.id);
  (p.variants || []).forEach(v => {
    console.log('  Variante:', v.title ?? v.option1, 'ID:', v.id, 'Precio:', v.price);
  });
}

async function main() {
  try {
    // 1) Grabado Personalización (dos variantes)
    const engraving = await createProduct({
      title: 'Grabado Personalización',
      status: 'active',
      product_type: 'Service',
      published_scope: 'web',
      options: ['Tipo'],
      variants: [
        { option1: 'Iniciales', price: '8.00', sku: 'GRAB-INICIALES' },
        { option1: 'Frase', price: '12.00', sku: 'GRAB-FRASE' },
      ],
    });
    logProduct(engraving);

    // 2) Billetera Titan (una variante)
    const wallet = await createProduct({
      title: 'Billetera Titan',
      status: 'active',
      product_type: 'Wallet',
      published_scope: 'web',
      options: ['Modelo'],
      variants: [
        { option1: 'Standard', price: '69.00', sku: 'WAL-TITAN-ST' },
      ],
    });
    logProduct(wallet);

    console.log('\nListo. Copia los IDs de variantes:');
    console.log(' - Iniciales:', engraving.variants[0]?.id);
    console.log(' - Frase:', engraving.variants[1]?.id);
    console.log('\nPégalos en extensions/wallet-personalizer-theme/src/PersonalizerBlock.tsx');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

main();