import express from 'express';
import Authors from '../models/Authors.js';
import BlogPosts from '../models/BlogPosts.js';
import cloudinaryUploader from "../config/cloudinaryConfig.js";
const router = express.Router();

// router.get('/', async (req,res) => {
//     try {
//         const authors = await Authors.find();
//         res.json(authors);
//     } catch(err){
//         res.status(500).json({message: err.message});
//     }
// });

router.get('/mail/:email', async (req, res) => {
    try {
        const { email } = req.params;
        
        if (!email) {
            return res.status(400).json({ message: "L'email è richiesta per la ricerca" });
        }

        const author = await Authors.findOne({ email: email });

        if (!author) {
            return res.status(404).json({ message: "Autore non trovato con questa email" });
        }

        res.json(author);
    } catch (error) {
        console.error("Errore durante la ricerca dell'autore:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});

router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sort = req.query.sort || 'nome';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        const skip = (page -1) * limit;
        const authors = await Authors.find({})
         .sort({[sort]: sortDirection})
         .skip(skip)
         .limit(limit)

         const total = await Authors.countDocuments();

         res.json({
            authors,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalAuthors: total
         })

    } catch (error) {
        res.status(500).json({message: error.message});
    }});

router.get('/:id', async (req,res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if(!author) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json(author);
        }
    } catch(err){
        res.status(500).json({message: err.message});
    }})

/*
router.post('/', async (req,res) => {
    const author = new Authors(req.body);
    try {
        const newAuthor = await author.save();
        res.status(201).json(newAuthor)
    }catch(err) {
        res.status(400).json({message: err.message});
    }
});
*/

// NEW! POST /authors: crea un nuovo autore
router.post("/", async (req, res) => {
    try {
      // Crea una nuova istanza di Author con i dati dalla richiesta
      const author = new Authors(req.body);
  
      // La password verrà automaticamente hashata grazie al middleware pre-save
      // che abbiamo aggiunto nello schema Author
  
      // Salva il nuovo autore nel database
      const newAuthor = await author.save();
  
      // Rimuovi la password dalla risposta per sicurezza
      const authorResponse = newAuthor.toObject();
      delete authorResponse.password;
  
      // Invia il nuovo autore creato come risposta JSON con status 201 (Created)
      res.status(201).json(authorResponse);
    } catch (err) {
      // In caso di errore (es. validazione fallita), invia una risposta di errore
      res.status(400).json({ message: err.message });
    }
  });

//   router.post("/", async (req, res) => {
//     console.log("Received registration request:", req.body);
//     try {
//       const author = new Authors(req.body);
//       const newAuthor = await author.save();
//       console.log("New author saved:", newAuthor);
//       const authorResponse = newAuthor.toObject();
//       delete authorResponse.password;
//       res.status(201).json(authorResponse);
//     } catch (err) {
//       console.error("Error during registration:", err);
//       res.status(400).json({ message: err.message });
//     }
//   });

router.put('/:id', async (req,res) => {
    try{
        const updateAuthor = await Authors.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!updateAuthor) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json(updateAuthor);
        }
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', async (req,res) => {
    try{
        const deletedAuthor = await Authors.findByIdAndDelete(req.params.id);
        if(!deletedAuthor) {
            return res.status(404).json({message: 'Autore non trovato'})
        } else {
            res.json({message: 'Autore cancellato'});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});


router.get('/:id/blogPosts', async (req,res) => {
    try {
        const author = await Authors.findById(req.params.id);
        if(!author) {
            return res.status(404).json({message: 'Autore non trovato'})
        }
        const blogPosts = await BlogPosts.find({
            author: author.email
        })
        res.json(blogPosts);
    } catch(err){
        res.status(500).json({message: err.message});
}})

// PATCH /authors/:authorId/avatar: carica un'immagine avatar per l'autore specificato
router.patch("/:authorId/avatar", cloudinaryUploader.single("avatar"), async (req, res) => {
    try {
      // Verifica se è stato caricato un file, se non l'ho caricato rispondo con un 400
      if (!req.file) {
        return res.status(400).json({ message: "Nessun file caricato" });
      }
  
      // Cerca l'autore nel database, se non esiste rispondo con una 404
      const author = await Authors.findById(req.params.authorId);
      if (!author) {
        return res.status(404).json({ message: "Autore non trovato" });
      }
  
      // Aggiorna l'URL dell'avatar dell'autore con l'URL fornito da Cloudinary
      author.avatar = req.file.path;
  
      // Salva le modifiche nel db
      await author.save();
  
      // Invia la risposta con l'autore aggiornato
      res.json(author);
    } catch (error) {
      console.error("Errore durante l'aggiornamento dell'avatar:", error);
      res.status(500).json({ message: "Errore interno del server" });
    }
  });


export default router;

