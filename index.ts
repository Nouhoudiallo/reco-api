import express from "express";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

const app = express();
const port = 3000;

// Ajoutez ce middleware pour analyser les requêtes JSON
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.post("/api/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({
        message: "le champs email ou password ne doivent pas être vide",
      });
      return;
    }

    const verify = await prisma.user.findFirst({
      where: {
        email: email,
      },
    });

    if (!verify) {
      res.json({
        message: "l'utilisateur n'existe pas",
      });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, verify.password);

    if (!isPasswordValid) {
      res.json({
        message: "le mot de passe est incorrect",
      });
      return;
    }

    res.json({
      message: "connexion réussie",
      user: {
        id: verify.id,
        email: verify.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: `une erreur est survenue lors de la request, ${error}`,
    });
  }
});

app.post("/api/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.json({
        message: "le champs email ou password ne doivent pas être vide",
      });
      return;
    }

    const verifyUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (verifyUser) {
      res.json({
        message: "cette addresse email est déjà utiliser",
      });
      return;
    }

    const hashPassword = await bcrypt.hashSync(password, 16);

    const inserUser = await prisma.user.create({
      data: {
        email,
        password: hashPassword,
      },
    });

    if (!inserUser) {
      res.json({
        message: "une erreur est survenue lors de la création de l'utilisateur",
      });
      return;
    }

    res.status(200).json({
      message: "utilisateur créer avec succès",
      user: inserUser,
    });
    return;
  } catch (error) {
    res.status(500).json({
      message: `une erreur est survenue lors de la request: ${error}`,
      erreur: error,
    });
    return;
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
