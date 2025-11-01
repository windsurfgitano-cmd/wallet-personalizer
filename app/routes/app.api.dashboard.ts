import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { authenticate } from "~/shopify.server";
import prisma from "~/db.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { session } = await authenticate.admin(request);

  const settings = await prisma.customizationSetting.findUnique({
    where: { shopId: session.shop.id },
  });

  const products = await prisma.productCustomization.count({
    where: { shopId: session.shop.id },
  });

  return json({
    customizationsSet: !!settings,
    productsEnabled: products,
  });
}