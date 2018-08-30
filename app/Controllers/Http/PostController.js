'use strict'

//Bring in model
const Post = use('App/Models/Post')

//validator
const { validate } = use('Validator')

class PostController {
  async index({ view }) {
    //const posts = [
    //  {title:'Post One', body:'This is post one'},
    //  {title:'Post Two', body:'This is post two'},
    //  {title:'Post Malone', body:'This is a rapper'},
    //]
    const posts = await Post.all();

    return view.render('posts.index', {
      title: 'Latests Posts',
      posts: posts.toJSON()
    })
  }

  async details({params, view}){
    const post = await Post.find(params.id)
    return view.render('posts.details', {
      post: post
    })
  }

  async add({ view}) {
    return view.render('posts.add')
  }

  async store({ request, response, session }){
    const post = new Post()
    post.title = request.input('title')
    post.body = request.input('body')

    //validation
    const validation = await validate(request.all(), {
      title: 'required|min:3|max:254',
      body: 'required|min:3'
    })

    if(validation.fails()){
      session.withErrors(validation.messages()).flashAll()
      return response.redirect('back')
    }
    await post.save()

    session.flash({ notification: 'Post Added!' })


    return response.redirect('/posts')
  }
}


module.exports = PostController
