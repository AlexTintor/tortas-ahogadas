const express = require("express");
//const Stripe = require("stripe");

// ⚠️ Pon aquí tu Secret Key de Stripe (sk_test_...)
//const stripe = Stripe("sk_test_51S1tIuGR9Ku22KmuaJj0Cn2XbU31vAghrfEms5v9A48LbRMCUStcefYXKalK3TiZHSAyyhGQIwnkmsX2q99NsgFc009oV7QTCu");
const stripe = require("stripe")("sk_test_51S1tIuGR9Ku22KmuaJj0Cn2XbU31vAghrfEms5v9A48LbRMCUStcefYXKalK3TiZHSAyyhGQIwnkmsX2q99NsgFc009oV7QTCu");



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
      success_url: "http://localhost:3000/success.html",
      cancel_url: "http://localhost:3000/cancel.html",
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error("Error en /checkout:", err);
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(3000, () => console.log("Servidor corriendo en http://localhost:3000"));
