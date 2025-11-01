import { json } from '@shopify/remix-oxygen';
import { useLoaderData, Link } from '@remix-run/react';

export async function loader({ context }) {
  // Aquí puedes agregar lógica para verificar autenticación o cargar datos iniciales
  return json({ title: 'Wallet Personalizer Admin' });
}

export default function AdminIndex() {
  const data = useLoaderData();
  return (
    <div style={{ padding: '20px' }}>
      <h1>{data.title}</h1>
      <p>Bienvenido al panel de administración de Wallet Personalizer.</p>
      <nav>
        <ul>
          <li><Link to="/app/dashboard">Dashboard</Link></li>
          <li><Link to="/app/settings">Configuraciones</Link></li>
        </ul>
      </nav>
    </div>
  );
}
