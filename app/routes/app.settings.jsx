import { json } from '@shopify/remix-oxygen';
import { Form, useLoaderData, useSubmit } from '@remix-run/react';
import { authenticate } from '../shopify.server';
import prisma from '../db.server';

export async function loader({ request, context }) {
  await authenticate.admin(request);
  const shop = context.shop; // Asumiendo que el contexto tiene la shop
  const settings = await prisma.customizationSetting.findUnique({
    where: { shopId: shop.id },
  });
  return json({ settings });
}

export async function action({ request, context }) {
  const formData = await request.formData();
  // Lógica para actualizar settings
  // Ej: parse formData y update en Prisma
  return json({ success: true });
}

export default function Settings() {
  const { settings } = useLoaderData();
  const submit = useSubmit();

  const handleSubmit = (event) => {
    event.preventDefault();
    submit(event.currentTarget, { method: 'post' });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Configuraciones</h1>
      <Form onSubmit={handleSubmit}>
        {/* Campos para precios, límites, features */}
        <label>Precio Iniciales: <input type="number" defaultValue={settings?.basePriceInitials} name="basePriceInitials" /></label>
        {/* Agregar más campos según el modelo */}
        <button type="submit">Guardar</button>
      </Form>
    </div>
  );
}