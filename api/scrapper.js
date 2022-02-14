const cheerio = require('cheerio');
const axios = require('axios');
const crypto = require('crypto');

async function latest(page) {

    //try{
    res = await axios.get(`https://www2.kickassanime.ro/api/get_anime_list/all/${page}`, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    return await (body)

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function anime(url) {

    //try{
    res = await axios.get(`https://www2.kickassanime.ro/anime/${url}`, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let pageScript = $('html').html()

    /*let path = pageScript.match(/appData = (.*)} |/g)
    let cleanedUrl = path.toString().replace('appData = "','').replace(' |','')*/

    let gotAnime = pageScript.match(/appData = {(.*)}/g)
    let cleanedResult = gotAnime.toString().replace('appData = ','').replace(' || {}','')
    let gotJSON = JSON.parse(cleanedResult)

     return await (gotJSON.anime)

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}


async function episode(anime,ep) {

    //try{
    res = await axios.get(`https://www2.kickassanime.ro/anime/${anime}/${ep}`, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let pageScript = $('html').html()

    /*let path = pageScript.match(/appData = (.*)} |/g)
    let cleanedUrl = path.toString().replace('appData = "','').replace(' |','')*/

    let gotAnime = pageScript.match(/appData = {(.*)}/g)
    let cleanedResult = gotAnime.toString().replace('appData = ','').replace(' || {}','')
    let gotJSON = JSON.parse(cleanedResult)


    newjsn = {
        anime: gotJSON.anime,
        episode: gotJSON.episode,
        ext_servers: gotJSON.ext_servers,
        episodes: gotJSON.episodes,
        sources: null,
        ext_src: null

    }

    let gotUrls;

    if(newjsn.episode.link1 !== ""){
        gotUrls = await fetchLink(newjsn.episode.link1)
    } else if(newjsn.episode.link4 !== "") {
        gotUrls = await fetchLink(newjsn.episode.link4)
    } else {
        gotUrls = null
    }
    
    let extUrl = (newjsn["ext_servers"].length != 0) ? await fetchExt(newjsn.ext_servers) : null

    newjsn.sources = gotUrls
    newjsn.ext_src = extUrl

     return await (newjsn)

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let pageScript = $('html').html()

    /*let path = pageScript.match(/appData = (.*)} |/g)
    let cleanedUrl = path.toString().replace('appData = "','').replace(' |','')*/

    let gotAnime = pageScript.match(/sources = \[{(.*)}\]/g)
    let cleanedResult = gotAnime ? gotAnime.toString().replace('sources = ','') : null

    let streamLinks = []
    if(cleanedResult){
        let gotJSON = JSON.parse(cleanedResult)

    //console.log(gotJSON)

     //return await (gotJSON[0].src.replace('player.php','pref.php'))

     //let gotUrls = fetchVRVLink(gotJSON[0].src.replace('player.php','pref.php'))

     pink = gotJSON.filter(e=>e.name == 'PINK-BIRD' || e.name ==  'DAILYMOTION' || e.name ==  'BETASERVER3' || e.name == "MAGENTA13" || e.name == 'MAVERICKKI' || e.name == 'THETA-ORIGINAL' || e.name == 'A-KICKASSANIME')

     alphaLink = pink.find(e=>e.name == 'PINK-BIRD')
     alphaLink = alphaLink ? alphaLink.src : null

     betaLink = pink.find(e=>e.name == 'DAILYMOTION')
     betaLink = betaLink ? betaLink.src : null

     gammaLink = pink.find(e=>e.name == 'BETASERVER3')
     gammaLink = gammaLink ? gammaLink.src : null

     deltaLink = pink.find(e=>e.name == 'MAGENTA13')
     deltaLink = deltaLink ? deltaLink.src : null

     epsilonLink = pink.find(e=>e.name == 'MAVERICKKI')
     epsilonLink = epsilonLink ? epsilonLink.src : null

     zetaLink = pink.find(e=>e.name == 'THETA-ORIGINAL')
     zetaLink = zetaLink ? zetaLink.src : null

     etaLink = pink.find(e=>e.name == 'A-KICKASSANIME')
     etaLink = etaLink ? etaLink.src : null

     //gammaLink = pink.find(e=>e.name == 'PINK-BIRD').src

     let alpha, beta, gamma, delta
     alpha = alphaLink ? await fetchVRVLink(alphaLink.replace('player.php','pref.php')) : null
     beta = betaLink ? await fetchDailymotionLink(betaLink.replace('player.php','pref.php')) : null
     gamma = gammaLink ? await fetchGoogleLink(gammaLink.replace('player.php','pref.php')) : null
     delta = deltaLink ? await fetchMagentaLink(deltaLink.replace('player.php','d.php')) : null
     epsilon = epsilonLink ? await fetchEpsilonLink(epsilonLink) : null
     zeta = zetaLink ? await fetchZetaLink(zetaLink.replace('player.php','d.php')) : null
     eta = etaLink ? await fetchEtaLink(etaLink.replace('player.php','d.php')) : null

     
     streamLinks.push({alpha, beta, gamma, delta, epsilon, zeta, eta})
 } else {
    streamLinks = {'error': 'not found stream links'}
 }
    

     return await (streamLinks)

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchVRVLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let b64 = $('script[type="text/javascript"]')

    let bval
    if(b64.eq(0).attr('src') == 'base64.js'){
        bval = 2
    } else {
        bval = 3
    }

    let b64js = b64.eq(bval).html()

    b64js = b64js.replace('document.write(Base64.decode("','').replace('"));','')
    jsn = Buffer.from(b64js, 'base64').toString()

    _ = cheerio.load(jsn)
    let source = _('video source').attr('src')

    source = Buffer.from(source).toString('hex')
     return await (source)

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchDailymotionLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let b64js = $('script[type="text/javascript"]').last().html()
    b64js = b64js.replace('document.body.innerHTML +=(Base64.decode("','').replace('"));','')
    jsn = Buffer.from(b64js, 'base64').toString()

    _ = cheerio.load(jsn)
    let source = _('iframe').attr('src')

     return await (source)

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchGoogleLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let pageScript = $('html').html()
    
    let gotAnime = pageScript.match(/sources: \[{(.*)}\]/g)
    let cleanedResult = gotAnime.toString().replace('sources: ','')
    let gotJSON = JSON.parse(cleanedResult)

    let newJson = []
    gotJSON.forEach((key)=>{

            if (key.file == ""){

            } else {
                ksize = key.label.replace('1080p',1080).replace('720p',720).replace('480p',480).replace('360p',360).replace('Auto',10)
            keyJson = {'src': key.file, 'type': key.type, 'size': parseInt(ksize)}

            newJson.push(keyJson)
            }
            
    })

    if(newJson.length != 0){
     return await (newJson)
    } else {
        return null
    }


 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchMagentaLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let b64js = $('.ctr-wrap').find('script').html()
    b64js = b64js.replace('document.write(Base64.decode("','').replace('"));','')
    jsn = Buffer.from(b64js, 'base64').toString()

    let sources = []

    _ = cheerio.load(jsn)

    _('a').each((index,found)=>{

        let stext = _(found).text().replace(' [Mp4]','').trim()
        let shref = _(found).attr('href')

        let source = {'src': shref, 'size':parseInt(stext), "type": "video/mp4"}

        sources.push(source)
    })

     return await (sources)


 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchEpsilonLink(url) {

    //try{

    url = url.replace('https://maverickki.com/embed/', '')
    url = 'https://maverickki.com/api/source/' + url

    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;

    hlslink = Buffer.from('https://prxy.anisite.repl.co/proxy'+body.hls+'&address=https://maverickki.com&ref=https://maverickki.com').toString('hex')

     return await (hlslink)


 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchZetaLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let b64js = $('.row').find('script').html()
    b64js = b64js.replace('document.write(Base64.decode("','').replace('"));','')
    jsn = Buffer.from(b64js, 'base64').toString()

    let sources = []

    _ = cheerio.load(jsn)

    _('a').each((index,found)=>{

        let stext = _(found).text().replace(' [Mp4]','').trim()
        let shref = _(found).attr('href')

        let url = new URL(shref)
        let origin = url.origin

        url = url.toString().replace(origin,'')
        url = 'https://prxy.anisite.repl.co/proxy'+url+'&address='+origin+'&ref='+origin


        let source = {'src': url, 'size':parseInt(stext), "type": "video/mp4"}

        sources.push(source)
    })

     return await (sources)


 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchEtaLink(url) {

    //try{
    res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let b64js = $('.row').find('script').html()
    b64js = b64js.replace('document.write(Base64.decode("','').replace('"));','')
    jsn = Buffer.from(b64js, 'base64').toString()

    let sources = []

    _ = cheerio.load(jsn)

    _('a').each((index,found)=>{

        let stext = _(found).text().replace(' [Mp4]','').trim()
        let shref = _(found).attr('href')

        let url = new URL(shref)
        let origin = url.origin

        url = url.toString().replace(origin,'')
        url = 'https://prxy.anisite.repl.co/proxy'+url+'&address='+origin+'&ref='+origin


        let source = {'src': url, 'size':parseInt(stext), "type": "video/mp4"}

        sources.push(source)
    })

     return await (sources)


 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function fetchExt(json) {

    //try{
    /*res = await axios.get(url, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;*/

    //let gotJSON = JSON.parse(json)

    //console.log(gotJSON)

     //return await (gotJSON[0].src.replace('player.php','pref.php'))

     //let gotUrls = fetchVRVLink(gotJSON[0].src.replace('player.php','pref.php'))

     pink = json.filter(e=>e.name == 'Vidstreaming')

     vidLink = pink.find(e=>e.name == 'Vidstreaming')
     vidLink = vidLink ? vidLink.link : null

     let urlParams = new URLSearchParams(vidLink)

     furl = 'https:'+urlParams.get('data').replace('https:','').replace('http','')
     let url = new URL(furl);
     let search_params = url.searchParams; 

     return await (search_params.get('id'))

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function allAnime() {

    //try{
    res = await axios.get(`https://www2.kickassanime.ro/anime-list`, {
      headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
    })
    const body = await res.data;
    const $ = cheerio.load(body)

    let pageScript = $('html').html()

    /*let path = pageScript.match(/appData = (.*)} |/g)
    let cleanedUrl = path.toString().replace('appData = "','').replace(' |','')*/

    let gotAnime = pageScript.match(/appData = {(.*)}/g)
    let cleanedResult = gotAnime.toString().replace('appData = ','').replace(' || {}','')
    let gotJSON = JSON.parse(cleanedResult)

    let genres={}
    Object.entries(gotJSON.genres).map(g=>{
        //if(g[1].genre_id == e) console.log(g[1].name)
        genres[g[1].genre_id] = g[1].name
    })

     return await ({'animes': gotJSON.animes, 'filters': gotJSON.filters, 'genres': genres})

 /*} catch (err) {
    return await ({"error": "Something went wrong, Refreshing Might Help!"})
 }*/
       
}

async function gogoFetch(phrase){

    let ENC_KEY = "3235373436353338353932393338333936373634363632383739383333323838" // set random encryption key
    let IV = "34323036393133333738303038313335" // set random initialisation vector
    // ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');
    ENC_KEY = Buffer.from(ENC_KEY, 'hex').toString('utf8')
    IV = Buffer.from(IV, 'hex').toString('utf8')

    //const phrase = "MTc4OTU2";

    var encrypt = ((val) => {
      let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV)
      let encrypted = cipher.update(val, 'utf8', 'base64')
      encrypted += cipher.final('base64')
      return encrypted
    })

    encrypted_key = encrypt(phrase);

    url = `https://gogoplay.io/encrypt-ajax.php?id=${encrypted_key}&mip=0.0.0.0&refer=https://www4.gogoanime.cm/&time=69420691337800813569`
    res = await axios.get(`${url}`, {
          headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0', 'X-Requested-With': 'XMLHttpRequest', 'Referer':'https://gogoplay.io' }
        })
      const body = await res.data;

      streamLinksJsn = {sources: null, hls:null, extra: null}
      let newJson = []

    body.source.forEach((key)=>{

            if (key.file == ""){

            } else {
                ksize = key.label.replace('1080p',1080).replace('720p',720).replace('480p',480).replace('360p',360).replace('Auto',10)
            
            let url = new URL(key.file)
            let origin = url.origin

            url = url.toString().replace(origin,'')
            url = 'https://prxy.anisite.repl.co/proxy'+url+'&address='+origin+'&ref=https://gogoanime.wiki'

            keyJson = {'src': url, 'type': 'video/mp4', 'size': parseInt(ksize)}

            newJson.push(keyJson)
            }
            
    })
    streamLinksJsn['sources'] = newJson

    let hurl = new URL(body.source_bk[0].file)
    let horigin = hurl.origin

    hurl = hurl.toString().replace(horigin,'')
    hurl = 'https://prxy.anisite.repl.co/proxy'+hurl+'&address='+horigin+'&ref=https://gogoplay.io'

    streamLinksJsn['hls'] = hurl

    streamLinksJsn['extra'] = body.linkiframe



      return await (streamLinksJsn)
}

async function gogoCode(episode_id) {
    let eps = []

    res = await axios.get(`https://gogoanime.pe/${episode_id}`, {
  headers: { 'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:92.0) Gecko/20100101 Firefox/92.0' }
})
    const body = await res.data;
    $ = cheerio.load(body)

    title = $('.entry-title').text()
    let ep

    if(title != '404'){
        episode_link = $('li.dowloads > a').attr('href')

        el = $('#episode_page')
        ep_end = el.children().last().find('a').attr('ep_end')

     let url = new URL(episode_link);
     let search_params = url.searchParams; 

      //ep = gogoFetch(search_params.get('id'))
      ep = {code: search_params.get('id')}
    } else {
        ep = {error: '404'}
    }

    return await ep
}

module.exports = {
	latest,
    anime,
    episode,
    allAnime,
    gogoFetch,
    gogoCode
}