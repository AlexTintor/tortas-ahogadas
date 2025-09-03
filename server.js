const express = require("express");

// ⚠️ Usar variable de entorno para seguridad
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const app = express();

// Middleware: parsear JSON primero
app.use(express.json());

// Servir archivos estáticos
app.use(express.static("public"));

// Ruta para iniciar el pago
app.post("/checkout", async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "mxn",
            product_data: { name: "Torta Ahogada" },
            unit_amount: 5000, // $50.00 pesos
          },
          quantity: 1,
        },
      ],
      success_url: "https://tortas-ahogadas.onrender.com/success.html",
      cancel_url: "https://tortas-ahogadas.onrender.com/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error en /checkout:", err);
    res.status(500).json({ error: err.message });
  }
});

// Puerto dinámico para Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));