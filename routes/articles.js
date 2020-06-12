const express = require('express')
const Article = require('./../models/article')
const router = express.Router()


// Protected Create Articl Route

router.get('/new', (req, res) => {
    if (req.isAuthenticated()){
  res.render('articles/new', { article: new Article() })
    }else res.render("articles/403")
}) 


// Protected EDIT Route

router.get("/edit/:id", async (req,res) =>{
    if (req.isAuthenticated()){
    const article = await Article.findById(req.params.id)
    res.render("articles/edit", {article:article} )
    } else res.render("articles/403")
})

router.get("/:slug", async (req,res) => {
    const article = await Article.findOne({slug:req.params.slug})
    if (article == null) res.redirect("/")
    res.render("articles/show", {article:article})
})

router.post('/', async (req, res, next) => {
    req.article = new Article()
    next()
  }, saveArticleAndRedirect('new'))


router.post('/:id', async (req, res, next) => {
    req.article = await Article.findById(req.params.id)
    next()
  }, saveArticleAndRedirect('edit'))


// Protected DELETE Route

router.post("/delete/:id", async (req,res) =>{
    if (req.isAuthenticated()){
    await Article.findByIdAndDelete({_id:req.params.id})
    } else res.render("articles/403")
    try{
        const articles = await Article.find().sort({ createdAt:"desc" })
        res.render("articles/index", {articles:articles})
    }catch(e){
        console.error(e)
    } 
})



function saveArticleAndRedirect(path) {
    return async (req, res) => {
      let article = req.article
      article.title = req.body.title
      article.description = req.body.description
      article.markdown = req.body.markdown
      try {
        article = await article.save()
        res.redirect(`/articles/${article.slug}`)
      } catch (e) {
        res.render(`articles/${path}`, { article: article })
      }
    }
  }


module.exports = router 