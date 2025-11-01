import { AppLoadContext, createCookieFactory, createSessionStorageFactory } from '@shopify/remix-oxygen';
import { sign, verify } from '@shopify/remix-oxygen/crypto';
import prisma from './db.server';

export const sessionStorage = createSessionStorageFactory(createCookieFactory(sign, verify))({
  cookie: {
    name: '__session',
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 24 hours
    path: '/',
    sameSite: 'strict',
    secrets: [process.env.SESSION_SECRET],
    secure: process.env.NODE_ENV === 'production',
  },
  async getSession(cookieHeader) {
    const cookie = cookieHeader ? await this.cookie.parse(cookieHeader) : null;
    if (!cookie) return null;

    const session = await prisma.session.findUnique({ where: { id: cookie } });
    return session ? session.data : null;
  },
  async commitSession(session, options) {
    const data = session.getData();
    const id = session.id || crypto.randomUUID();

    await prisma.session.upsert({
      where: { id },
      update: { data },
      create: { id, data },
    });

    return this.cookie.serialize(id, options);
  },
  async destroySession(session) {
    if (session.id) {
      await prisma.session.delete({ where: { id: session.id } });
    }
    return this.cookie.serialize('', { maxAge: 0 });
  },
});

export async function createShopifyClient(context) {
  const { storefront } = context;
  return storefront;
}

// Webhook handling would go here if needed
export async function registerWebhooks(context) {
  // From guide: register 'app/uninstalled' webhook
  const registration = await context.shopify.registerWebhook({
    address: `${process.env.APP_URL}/webhooks/app_uninstalled`,
    topic: 'APP_UNINSTALLED',
    deliveryMethod: 'http',
  });

  if (registration.success) {
    console.log('Webhook registered successfully');
  } else {
    console.error('Failed to register webhook', registration);
  }
}

// Add more configurations as per guide
