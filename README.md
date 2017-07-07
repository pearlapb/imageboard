# Image Board SPA

This is an Image Board Single Page Application (for web comics! Because why not). It uses AngularJS for client-side rendering. This project was created during my 10th week of coding at SPICED Academy. Check it out [here](https://web-comics-board.herokuapp.com/#/) and upload your favourite comic! 

### Features:

- Upload pictures with your username, a title and a description.
- On the homepage there is a listing of uploaded images from most recent to less recent with the title, the username and a preview of the image and the description.
- You can search images by title on the homepage.
- Ability to click on an image preview and get to a single image page where the image is full size and the description is visible.
- On this page you can see and add a comment to the picture and like the picture (only once)

### Things I still need to amend/add:

1. Change the homepage *more* button into an ajax request to the database instead of querying everything at first and changing the amount of images that are displayed.
2. Make a *service* for getting images, uploading images, posting comments and posting likes.
3. Add hashtags to identify images and make a search by hashtag.
4. Clean up my CSS.

### Technologies Used:

- Angular.js
- Node.js
- Express.js
- PostgresSQL
