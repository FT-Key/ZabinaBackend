import "../DB/config.js";
import express from "express";
import cors from "cors";

import path from "path";
import { fileURLToPath } from "url";

// Obtén el directorio del archivo actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

import productosRouter from "../routes/productos.routes.js";
import usuariosRouter from "../routes/usuarios.routes.js";
import loginRouter from "../routes/login.routes.js";
import registerRouter from "../routes/register.routes.js";
import favncartRouter from "../routes/favncart.routes.js";
import turnosRouter from "../routes/turnos.routes.js";
import animalsRouter from "../routes/animales.routes.js";
import plansRouter from "../routes/planes.routes.js";
import contactRouter from "../routes/contacto.routes.js";
import comentariosRouter from "../routes/comentarios.routes.js";

class Server {
  constructor(puerto) {
    this.app = express();
    this.port = process.env.PORT || puerto;
    this.middlewares();
    this.rutas();
  }

  middlewares() {
    const corsOptions = {
      origin: [
        "http://localhost:5173",
        "https://rollingvet104i.netlify.app",
      ],
      methods: "GET,POST,PUT,DELETE",
      allowedHeaders: "Content-Type,Authorization",
    };

    this.app.use(cors(corsOptions));

    this.app.use((req, res, next) => {
      res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
      res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
      next();
    });

    this.app.use(express.json());
  }

  rutas() {
    this.app.use("/productos", productosRouter);
    this.app.use("/usuarios", usuariosRouter);
    this.app.use("/login", loginRouter);
    this.app.use("/register", registerRouter);
    this.app.use("/favncart", favncartRouter);
    this.app.use("/turnos", turnosRouter);
    this.app.use("/animales", animalsRouter);
    this.app.use("/planes", plansRouter);
    this.app.use("/contacto", contactRouter);
    this.app.use("/comentarios", comentariosRouter);
    this.app.get("/api/hello", (req, res) => {
      res.json({ message: "Hello from the server!" });
    });

    // Ruta para servir el HTML
    this.app.get("/", (req, res) => {
      res.sendFile(path.join(__dirname, "../views/indice.html"));
    });
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log(`Servidor levantado en http://localhost:${this.port}`);
    });
  }
}

export default Server;