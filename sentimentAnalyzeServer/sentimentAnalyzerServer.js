const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

async function GetNLUInstance(data){
    let api_key = process.env.API_KEY;
    let api_url = process.env.API_URL;

    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const {IamAuthenticator} = require('ibm-watson/auth');
    const NLU = new NaturalLanguageUnderstandingV1({
        version: '2020-08-01',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    let response = await NLU.analyze(data)
    .then(analysisResults => {
        return JSON.stringify(analysisResults, null, 2);
    })
    .catch(err => {
        return 'error:', err;
    });

    return response;
}

const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());

app.get("/",(req,res)=>{
    res.render('index.html');
  });

// url
app.get("/url/emotion/:url", (req,res) => {

    return res.send({"happy":"90","sad":"10"});
});

app.get("/url/sentiment/:text", (req,res) => {
    return res.send("url sentiment for "+req.query.url);
});

// text
app.get("/text/emotion/:text", async (req,res) => {
    let dataArray = req.params.text.split(" ");
    const analyzeParams = {
    'text': req.params.text,
        'features': {
            'emotion': {
                'targets': dataArray
            }
        }
    };
    let data = await GetNLUInstance(analyzeParams);
    let Tabledata = await ParseEmotionTable(data)
    return res.send(Tabledata);
});

app.get("/text/sentiment/:text", async (req,res) => {
    let dataArray = req.params.text.split(" ");
    const analyzeParams = {
        'text': req.params.text,
        'features': {
            'sentiment': {
            'targets': dataArray
            }
        }
    };
    let data = await GetNLUInstance(analyzeParams);
    let Tabledata = await ParseSentimentTable(data);
    return res.send(Tabledata);
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})

function ParseEmotionTable(data){
    data = JSON.parse(data);
    let resultsArray = data["result"]["emotion"]["targets"];
    // sadness joy fear disgust anger
    let results = [
        {
            "Sadness": 0
        },
        {
            "Joy": 0
        },
        {
            "Fear": 0
        },
        {
            "Disgust": 0
        },
        {
            "Anger": 0
        }
    ]
    // can access data JSON.stringify(resultsArray[1]["emotion"]["sadness"]);
    for(i=0;i<resultsArray.length;i++){
        let sad = JSON.stringify(resultsArray[i]["emotion"]["sadness"]);
        let joy = JSON.stringify(resultsArray[i]["emotion"]["joy"]);
        let fear = JSON.stringify(resultsArray[i]["emotion"]["fear"]);
        let disgust = JSON.stringify(resultsArray[i]["emotion"]["disgust"]);
        let anger = JSON.stringify(resultsArray[i]["emotion"]["anger"]);

        results[0].Sadness += parseFloat(sad);
        results[1].Joy += parseFloat(joy);
        results[2].Fear += parseFloat(fear);
        results[3].Disgust += parseFloat(disgust);
        results[4].Anger += parseFloat(anger);
    }

        results[0].Sadness /= resultsArray.length;
        results[1].Joy /= resultsArray.length;
        results[2].Fear /= resultsArray.length;
        results[3].Disgust /= resultsArray.length;
        results[4].Anger /= resultsArray.length;

    return results;
}
function ParseSentimentTable(data){
    data = JSON.parse(data);
    return data["result"]["sentiment"]["document"]["label"];
}
