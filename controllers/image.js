//index.js file

///////////////////////////////////////////////////////////////////////////////////////////////////
// In this section, we set the user authentication, user and app ID, model details, and the URL
// of the image we want as an input. Change these strings to run your own example.
///////////////////////////////////////////////////////////////////////////////////////////////////

// Your PAT (Personal Access Token) can be found in the portal under Authentification
const PAT = '06602b8f397a41faa1f4c784a9198f5c';
// Specify the correct user_id/app_id pairings
// Since you're making inferences outside your app's scope
const USER_ID = 'mauriciotl27';
const APP_ID = 'brain-App';
// Change these to whatever model and image URL you want to use
const MODEL_ID = 'face-detection';
const MODEL_VERSION_ID = 'fe995da8cb73490f8556416ecf25cea3';
//const IMAGE_URL = ;

///////////////////////////////////////////////////////////////////////////////////
// YOU DO NOT NEED TO CHANGE ANYTHING BELOW THIS LINE TO RUN THIS EXAMPLE
///////////////////////////////////////////////////////////////////////////////////

const { ClarifaiStub, grpc } = require("clarifai-nodejs-grpc");

const stub = ClarifaiStub.grpc();

// This will be used by every Clarifai endpoint call
const metadata = new grpc.Metadata();
metadata.set("authorization", "Key " + PAT);

const handleApiCall = (req, res) => {
stub.PostModelOutputs(
    {
        user_app_id: {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        model_id: MODEL_ID,
        //version_id: MODEL_VERSION_ID, // This is optional. Defaults to the latest model version
        inputs: [
            { data: { image: { url: req.body.input, allow_duplicate_url: true } } }
        ]
    },
    metadata,
    (err, response) => {
        if (err) {
            console.log("Error:",err);
            return;
        }

        if (response.status.code !== 10000) {
            console.log("Post model outputs failed, status: " + response.status.description);
            return;
        }

        // Since we have one input, one output will exist here
        const output = response.outputs[0];

        console.log("Predicted concepts:");
        for (const concept of output.data.concepts) {
            console.log(concept.name + " " + concept.value);
        }

        res.json(response)
    }

);

/*.then(data => {
  res.json(data);
})
.catch(err => res.status(400).json("unable to work with API"))*/
}





/*
const returnClarifaiRequestOptions = (imageUrl) => {
      // Your PAT (Personal Access Token) can be found in the portal under Authentification
    const PAT = '06602b8f397a41faa1f4c784a9198f5c';
    // Specify the correct user_id/app_id pairings
    // Since you're making inferences outside your app's scope
    const USER_ID = 'mauriciotl27';       
    const APP_ID = 'brain-App;
    // Change these to whatever model and image URL you want to use
    const MODEL_ID = 'face-detection';
    //const MODEL_VERSION_ID = 'aa7f35c01e0642fda5cf400f543e7c40';
    const IMAGE_URL = imageUrl;

    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": "mauriciotl27",
            "app_id": "brain-App"
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": IMAGE_URL
                    }
                }
            }
        ]
    });
    


    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    };


    return requestOptions

  }

const handleApiCall = (req, res) => {
fetch("https://api.clarifai.com/v2/models/" + 'face-detection' + "/outputs", returnClarifaiRequestOptions(req.body.input))

.then(data => {
  res.json(data);
  console.log("This is happening");
})
.catch(err => res.status(400).json("unable to work with API"))
}
*/
const handleImage = (req,res,db) => {
	const {id} = req.body;
	db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
  	res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('Unable to get entries'))
  }	

  module.exports = {
    handleImage,
    handleApiCall
}