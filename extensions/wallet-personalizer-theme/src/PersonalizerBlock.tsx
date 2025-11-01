import React, { useState, useEffect } from "react";
import styles from "./PersonalizerBlock.module.css";

interface PersonalizerProps {
  productId: string;
  productTitle: string;
}

export function PersonalizerBlock({
  productId,
  productTitle,
}: PersonalizerProps) {
  // IDs de variantes del producto oculto "Grabado Personalización".
  // REEMPLAZA estos valores por los IDs reales de tus variantes.
  // Obtén los IDs desde Admin > Producto "Grabado" > Variante > URL (…/variants/1234567890)
  const feeVariantIds: { [key: string]: number } = {
    iniciales: 0, // <-- REEMPLAZA por el ID real de la variante "Iniciales"
    frase: 0, // <-- REEMPLAZA por el ID real de la variante "Frase"
  };

  const [type, setType] = useState("iniciales");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("ABC");

  useEffect(() => {
    // Actualizar properties en el form
    updateFormProperties();
  }, [text, type]);

  const updateFormProperties = () => {
    const form = document.querySelector("form[action*='/cart/add']");
    if (!form) return;

    // Crear o actualizar inputs ocultos
    let input1 = form.querySelector(
      'input[name="properties[Texto Personalizado]"]'
    );
    if (!input1) {
      input1 = document.createElement("input");
      input1.type = "hidden";
      input1.name = "properties[Texto Personalizado]";
      form.appendChild(input1);
    }
    input1.value = text;

    let input2 = form.querySelector(
      'input[name="properties[Tipo Personalización]"]'
    );
    if (!input2) {
      input2 = document.createElement("input");
      input2.type = "hidden";
      input2.name = "properties[Tipo Personalización]";
      form.appendChild(input2);
    }
    input2.value = type;
  };

  // Interceptar el submit para añadir el ítem de recargo al carrito
  useEffect(() => {
    const form = document.querySelector("form[action*='/cart/add']");
    if (!form) return;

    const onSubmit = async (e: Event) => {
      // Si no hay texto, no interceptar: dejar comportamiento normal
      const customText = text.trim();
      if (!customText) return;

      const feeVariantId = feeVariantIds[type];
      if (!feeVariantId || feeVariantId <= 0) {
        alert("Falta configurar los IDs de variantes del producto 'Grabado'.");
        return;
      }

      e.preventDefault();

      // Asegurar que las properties estén actualizadas
      updateFormProperties();

      const targetForm = form as HTMLFormElement;
      const variantInput = targetForm.querySelector(
        "input[name='id'], input[name='id[]']"
      ) as HTMLInputElement | null;
      const qtyInput = targetForm.querySelector(
        "input[name='quantity']"
      ) as HTMLInputElement | null;

      const variantId = variantInput?.value;
      const quantity = parseInt(qtyInput?.value || "1", 10);

      if (!variantId) {
        alert("No se encontró la variante del producto principal.");
        return;
      }

      const payload = {
        items: [
          {
            id: Number(variantId),
            quantity,
            properties: {
              "Texto Personalizado": customText,
              "Tipo Personalización": type,
            },
          },
          {
            id: Number(feeVariantId),
            quantity,
          },
        ],
      };

      try {
        const res = await fetch("/cart/add.js", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("No se pudo agregar al carrito");

        // Redirigir al carrito; ajusta si usas drawer de carrito
        window.location.href = "/cart";
      } catch (err) {
        console.error(err);
        alert("Hubo un problema al agregar al carrito.");
      }
    };

    form.addEventListener("submit", onSubmit);
    return () => {
      form.removeEventListener("submit", onSubmit);
    };
  }, [text, type]);

  const handleTypeChange = (newType) => {
    setType(newType);
    setText("");
    setPreview(newType === "iniciales" ? "ABC" : "Tu texto aquí");
  };

  const handleTextChange = (e) => {
    let value = e.target.value;

    if (type === "iniciales") {
      value = value.toUpperCase().slice(0, 3);
    } else {
      value = value.slice(0, 20);
    }

    setText(value);
    setPreview(value || (type === "iniciales" ? "ABC" : "Tu texto aquí"));
  };

  return (
    <div className={styles.personalizer}>
      <h3>✨ Personaliza tu Billetera</h3>

      <fieldset className={styles.typeSelection}>
        <legend>Tipo de Personalización:</legend>

        <label className={styles.option}>
          <input
            type="radio"
            value="iniciales"
            checked={type === "iniciales"}
            onChange={() => handleTypeChange("iniciales")}
          />
          <span>Iniciales (3 letras) - +$8</span>
        </label>

        <label className={styles.option}>
          <input
            type="radio"
            value="frase"
            checked={type === "frase"}
            onChange={() => handleTypeChange("frase")}
          />
          <span>Frase (20 caracteres) - +$12</span>
        </label>
      </fieldset>

      <div className={styles.inputGroup}>
        <label>
          Tu texto:{" "}
          <span className={styles.counter}>
            {text.length}/{type === "iniciales" ? 3 : 20}
          </span>
        </label>
        <input
          type="text"
          value={text}
          onChange={handleTextChange}
          placeholder="Escribe aquí..."
          className={styles.textInput}
        />
      </div>

      <div className={styles.preview}>
        <p>Vista previa:</p>
        <div className={styles.previewBox}>{preview}</div>
      </div>
    </div>
  );
}