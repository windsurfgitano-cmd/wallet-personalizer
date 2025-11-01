import { json } from '@shopify/remix-oxygen';
import { useLoaderData } from '@remix-run/react';
import { authenticate } from '../shopify.server';

export async function loader({ request, context }) {
  const { admin } = await authenticate.admin(request);
  // Lógica para cargar datos del dashboard, ej: estadísticas, productos personalizables
  const products = await admin.graphql(`
    query {
      products(first: 10) {
        edges {
          node {
            id
            title
            handle
          }
        }
      }
    }
  `).then(res => res.json());

  return json({ products: products.data.products.edges });
}

export default function Dashboard() {
  const { products } = useLoaderData();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Dashboard</h1>
      <p>Aquí puedes ver estadísticas y productos personalizables.</p>
      <ul>
        {products.map(({ node }) => (
          <li key={node.id}>{node.title} ({node.handle})</li>
        ))}
      </ul>
    </div>
  );
}