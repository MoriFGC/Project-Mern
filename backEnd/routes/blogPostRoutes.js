import express from 'express';
import BlogPosts from '../models/BlogPosts.js';
import cloudinaryUploader from "../config/cloudinaryConfig.js";
import { sendEmail } from "../services/emailServices.js";
import { authMiddleware } from "../middlewares/authMiddleware.js"; // dmiddleware di autenticazione
const router = express.Router();

// Proteggi le altre rotte con il middleware di autenticazione
router.use(authMiddleware);

router.get('/', async (req,res) => {
    try {
        let query = {};
        if(req.query.title) {
            query.title = {$regex: req.query.title, $options: 'i'}
        }
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 100;
        const sort = req.query.sort || 'name';
        const sortDirection = req.query.sortDirection === 'desc' ? -1 : 1;
        const skip = (page -1) * limit;

        const blogPosts = await BlogPosts.find(query)
         .sort({[sort]: sortDirection})
         .skip(skip)
         .limit(limit);

        const total = await BlogPosts.countDocuments(query);

        res.json({
            posts: blogPosts,
            currentPage: page,
            totalPages: Math.ceil(total / limit),
            totalPosts: total
        });
    } catch(err){
        res.status(500).json({message: err.message});
    }
});

router.get('/:id', async (req,res) => {
    try {
        const post = await BlogPosts.findById(req.params.id);
        if(!post) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json(post);
        }
    } catch(err){
        res.status(500).json({message: err.message});
    }})


router.get('/author/:author', async (req, res) => {
    try {
        const { author } = req.params;
        
        if (!author) {
            return res.status(400).json({ message: "L'email dell'autore è richiesta per la ricerca" });
        }

        const posts = await BlogPosts.find({ author: author });

        if (posts.length === 0) {
            return res.status(404).json({ message: "Nessun post trovato per questo autore" });
        }

        res.json(posts);
    } catch (error) {
        console.error("Errore durante la ricerca dei post dell'autore:", error);
        res.status(500).json({ message: "Errore interno del server" });
    }
});



router.post('/', cloudinaryUploader.single('cover'), async (req,res) => {
    try{
      const postData = req.body;
      if(req.file) {

        postData.cover = req.file.path; // cloudinary
      }
      const newPost = new BlogPosts(postData);
      await newPost.save();
      // CODICE PER INVIO MAIL con MAILGUN
      const htmlContent = `
        <h1>Il tuo post è stato pubblicato!</h1>
        <p>Ciao ${newPost.author},</p>
        <p>Il tuo post "${newPost.title}" è stato pubblicato con successo.</p>
        <p>Categoria: ${newPost.category}</p>
        <p>Grazie per il tuo contributo al blog!</p>`
      ;
      await sendEmail(newPost.author, 'Post pubblicato', htmlContent);
      res.status(201).json(newPost);
    }catch(err){
      console.error('Errore nella creazione', err);
      res.status(400).json({message: err.message});
    }
})
  

router.put('/:id', async (req,res) => {
    try{
        const updatePost = await BlogPosts.findByIdAndUpdate(
            req.params.id,
            req.body,
            {new: true}
        )
        if(!updatePost) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json(updatePost);
        }
    } catch(err){
        res.status(400).json({message: err.message});
    }
});

router.delete('/:id', async (req,res) => {
    try{
        const deletedPost = await BlogPosts.findByIdAndDelete(req.params.id);
        if(!deletedPost) {
            return res.status(404).json({message: 'Post non trovato'})
        } else {
            res.json({message: 'Post cancellato'});
        }
    } catch(err) {
        res.status(500).json({message: err.message});
    }
});



// PATCH /blogPosts/:blogPostId/cover: carica un'immagine di copertina per il post specificato
router.patch("/:blogPostId/cover", cloudinaryUploader.single("cover"), async (req, res) => {
  try {
    // Verifica se è stato caricato un file o meno
    if (!req.file) {
      return res.status(400).json({ message: "Ops, nessun file caricato" });
    }

    // Cerca il blog post nel db
    const blogPost = await BlogPosts.findById(req.params.blogPostId);
    if (!blogPost) {
      return res.status(404).json({ message: "Blog post non trovato" });
    }

    // Aggiorna l'URL della copertina del post con l'URL fornito da Cloudinary
    blogPost.cover = req.file.path;

    // Salva le modifiche nel db
    await blogPost.save();

    // Invia la risposta con il blog post aggiornato
    res.json(blogPost);
  } catch (error) {
    console.error("Errore durante l'aggiornamento della copertina:", error);
    res.status(500).json({ message: "Errore interno del server" });
  }
});

//----------------------- Comments routes -----------------------

router.get("/:id/comments", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      res.json(post.comments);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //GET /blogPosts/:id/comments/:commentId => ritorna un commento specifico di un post specifico

  router.get("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      res.json(comment);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  //POST /blogPosts/:id/comments => aggiungi un nuovo commento ad un post specifico

  router.post("/:id/comments", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const newComment = {
        name: req.body.name,
        email: req.body.email,
        content: req.body.content
      };
      post.comments.push(newComment);
      await post.save();
      res.status(201).json(newComment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  // PUT /blogPosts/:id/comments/:commentId => cambia un commento di un post specifico
  router.put("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      const comment = post.comments.id(req.params.commentId);
      if (!comment) {
        return res.status(404).json({ message: "Commento non trovato" });
      }
      comment.content = req.body.content;
      await post.save();
      res.json(comment);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  // DELETE /blogPosts/:id/comments/:commentId => elimina un commento specifico da un post specifico
  router.delete("/:id/comments/:commentId", async (req, res) => {
    try {
      const post = await BlogPosts.findById(req.params.id);
      if (!post) {
        return res.status(404).json({ message: "Post non trovato" });
      }
      
      // Usa il metodo pull per rimuovere il commento dall'array
      post.comments.pull({ _id: req.params.commentId });
      
      // Salva il post aggiornato
      await post.save();
      
      res.json({ message: "Commento eliminato con successo" });
    } catch (error) {
      console.error("Errore durante l'eliminazione del commento:", error);
      res.status(500).json({ message: error.message });
    }
  });
  
export default router;