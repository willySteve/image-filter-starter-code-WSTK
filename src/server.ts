import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  /**************************************************************************** */
  app.get("/filteredimage", async (req : express.Request, res : express.Response) => {
    // Validate the image_url query
    const {image_url} = req.query;
    if (!image_url){
      res.status(400).send("Erro: The submitted url is empty please try /filteredimage?image_url={{}}");
    } else {
    // call filterImageFromURL(image_url) to filter the image
    // send the resulting file in the response and deletes any files on the server on finish of the response
      await filterImageFromURL(image_url).then( function (image_filtered){
        res.sendFile(image_filtered, () => {       
          deleteLocalFiles([image_filtered]);       
        });   
      }).catch(function(err){
        res.status(400).send("Error:" + err );
      });  

    }
  });
  //! END @TODO1
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();