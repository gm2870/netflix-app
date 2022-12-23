import puppeteer from 'puppeteer';
export const getVideoSrc = async (id, quality = 480) => {
  if (!id.startsWith('tt')) return null;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    const titleUrl = `https://www.imdb.com`;
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    );

    await page.goto(titleUrl);
    let videoId;
    await page.waitForSelector('#suggestion-search',{visible:true});
    await page.type('input[id="suggestion-search"]', `${id}`, { delay: 300 });
    const href = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      const link = document
        .querySelector(
          '#react-autowhatever-1--item-1 a[data-testid="search-result--video"]'
        ) ||  document.querySelector(
          '#react-autowhatever-1--item-2 a[data-testid="search-result--video"]'
        );
        
        return link.getAttribute('href');
    });
    videoId = href
      .split('/')
      .find((x) => x.startsWith('vi') && x !== 'videoplayer');

    if (!videoId || !videoId.startsWith('vi')) {
      await browser.close();
      return null;
    }

    const sdSrc = await getSrcWithVideoId(videoId, 480);

    let hdSrc;
    if (quality === 1080) {
      hdSrc = await getSrcWithVideoId(videoId, 1080);
      return {
        videoId,
        SD: sdSrc,
        HD: hdSrc,
      };
    }
    return {
      videoId,

      SD: sdSrc,
    };
  } catch (error) {
    console.log(error);
    await browser.close();
    return;
  } finally {
    await browser.close();
  }
};
const getSrc = async (link) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
    );

    await page.goto(link);
    await page.waitForSelector('video[class="jw-video jw-reset"]', {
      visible: true,
      timeout: 30000,
    });
    const src = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      return document
        .querySelector('video[class="jw-video jw-reset"]')
        .getAttribute('src');
    });
    return src;
  } catch (err) {
    console.log(err);
  
  } finally {
    await browser.close();
  }
};

export const getSrcWithVideoId = async (videoId, quality = 480) => {
  let link;
  if (quality === 480) {
    link = `https://www.imdb.com/video/imdb/${videoId}/imdb/embed`;
  } else {
    link = `https://www.imdb.com/video/imdb/${videoId}/imdb/embed?autoplay=true&format=1080p&ref_=vi_res_1080p`;
  }
  return await getSrc(link);
};
