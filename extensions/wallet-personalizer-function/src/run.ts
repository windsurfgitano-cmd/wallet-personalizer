import type { RunInput, FunctionRunResult } from "../generated/api";

interface CartLine {
  id: string;
  quantity: number;
  merchandise: {
    title: string;
  };
  attribute?: (key: string) => { value: string } | null;
  cost: {
    amountPerQuantity: {
      amount: string;
    };
  };
}

export function run(input: RunInput): FunctionRunResult {
  const operations = input.cart.lines
    .map((line: CartLine) => {
      // Leer atributos de personalización
      const customTextAttr = line.attribute?.("Texto Personalizado");
      const typeAttr = line.attribute?.("Tipo Personalización");

      // Si no hay personalización, sin cambios
      if (!customTextAttr || !customTextAttr.value) {
        return null;
      }

      const customText = customTextAttr.value;
      const type = typeAttr?.value || "iniciales";

      // Calcular precio adicional
      let additionalPrice = 0;

      if (type === "iniciales") {
        additionalPrice = 8.0;
      } else if (type === "frase") {
        additionalPrice = 12.0;
      }

      if (additionalPrice === 0) return null;

      try {
        const currentPrice = parseFloat(line.cost.amountPerQuantity.amount);
        const newPrice = (currentPrice + additionalPrice).toFixed(2);

        return {
          lineUpdate: {
            cartLineId: line.id,
            title: `${line.merchandise.title} - Personalizado: "${customText}"`,
            price: {
              adjustment: {
                fixedPricePerUnit: {
                  amount: newPrice,
                },
              },
            },
          },
        };
      } catch (e) {
        console.error("Error calculating price:", e);
        return null;
      }
    })
    .filter((op) => op !== null);

  return { operations };
}