import mongoose from "mongoose";
import bcrypt from "bcrypt"; 

const authorSchema = new mongoose.Schema({
    nome: { type: String },
    cognome: { type: String },
    email: { type: String, unique: true },
    dataDiNascita: { type: String },
    avatar: { type: String },
    password: { type: String },
    googleId: { type: String },
    githubId: { type: String },
  }, {
    timestamps: true,
    collection: "authors"
});

// NEW! Metodo per confrontare le password
authorSchema.methods.comparePassword = function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// NEW! Middleware per l'hashing delle password prima del salvataggio
authorSchema.pre("save", async function (next) {
  // Esegui l'hashing solo se la password è stata modificata (o è nuova)
  if (!this.isModified("password")) return next();

  try {
    // Genera un salt e hash la password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model('Author', authorSchema);