const scapper = require('./scrapper')
const express = require('express')
const { env } = require('process')
const cors = require('cors')

const app = express()
app.use(cors())

app.get('/api/', (req, res) => {
    res.send('Never gonna give you up x2 <br> Never gonna let you down <br> Never gonna run around and desert you <br> Never gonna make you cry <br> Never gonna say goodbye <br>Never gonna tell a lie and hurt you')
})

app.get('/api/anime/:query', async (req, res) => {

    const result = await scapper.anime(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result))
})

app.get('/api/episode/:anime/:ep', async (req, res) => {

    const result = await scapper.episode(req.params.anime,req.params.ep)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result))
})

app.get('/api/latest/:query', async (req, res) => {

    const result = await scapper.latest(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result))
})

app.get('/api/allAnime', async (req, res) => {

    const result = await scapper.allAnime()
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result))
})

app.get('/api/gogofetch/:query', async (req, res) => {

    const result = await scapper.gogoCode(req.params.query)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result))
})

app.get('/api/ramen-server/:gogoid', async (req, res) => {

    const result = await scapper.gogoFetch(req.params.gogoid)
    res.header("Content-Type", 'application/json');
    res.send(JSON.stringify(result))
})

app.get('/api/watch/alpha', async(req, res) => {
    const result = Buffer.from(req.query.id, 'hex').toString('ascii')
    res.setHeader('Cache-Control', 's-maxage=14400')

    if(result){
    
    res.end(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
  <meta name="referrer" content="no-referrer" />
  <link href="https://fonts.googleapis.com/css2?family=Lexend+Deca&display=swap" rel="stylesheet">
  <title>animeSite</title>
</head>
<body>
  <style>
      body{font-family: 'Lexend deca',sans-serif;background-color:black;margin:0;padding:0;}.plyr__video-wrapper{ background:black !important;}
      video{width:100%;height: 100vh;}
      .plyr{height:100vh;}
</style>

<script src="https://cdn.jsdelivr.net/npm/hls.js"></script>
    <link rel="stylesheet" href="https://cdn.plyr.io/3.6.8/plyr.css" />
  <script src="https://cdn.plyr.io/3.6.8/plyr.js"></script>

  <div class="container">
    <video controls playsinline>
    </video>
  </div>
<script>
  const source = '${result}';document.addEventListener("DOMContentLoaded",()=>{const e=document.querySelector("video"),n={};if(Hls.isSupported()){const o=new Hls;o.loadSource(source),o.on(Hls.Events.MANIFEST_PARSED,function(t,l){const s=o.levels.map(e=>e.height);n.quality={default:s[s.length-1],options:s.reverse(),forced:!0,onChange:e=>(function(e){window.hls.levels.forEach((n,o)=>{n.height===e&&(console.log("Found quality match with "+e),window.hls.currentLevel=o)})})(e)};new Plyr(e,n)}),o.attachMedia(e),window.hls=o}else{new Plyr(e,n)}});
</script>
</body>
</html>`)

} else {
    res.end('Please Choose Another Server!')
}
})


app.get('/api/*', function(req, res){
    res.status(404).send('Not Found!')
})


port = env.PORT || 3333
app.listen(port, () => {
    console.log(`Listening to port ${port}`)
})
