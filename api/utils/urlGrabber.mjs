import puppeteer from 'puppeteer';
export const getVideoSrc = async (id, quality = 480) => {
  if (!id.startsWith('tt')) return null;
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    const titleUrl = `https://www.imdb.com/title/${id}?ref_=nv_sr_srsg_0`;
    await page.goto(titleUrl, { waitUntil: 'load' });
    let videoId;
    try {
      await page.waitForSelector(
        'a[data-testid="video-player-slate-overlay"]',
        {
          visible: true,
          timeout: 30000,
        }
      );
      videoId = await page.evaluate(() => {
        // eslint-disable-next-line no-undef
        const href = document
          .querySelector('a[data-testid="video-player-slate-overlay"]')
          .getAttribute('href');
        const vid = href
          .split('/')
          .find((x) => x.startsWith('vi') && x !== 'video');
        return vid;
      });
    } catch (e) {
      console.log(e);
      videoId = await page.evaluate(() => {
        // eslint-disable-next-line no-undef
        const href = document
          .querySelector('a[data-testid="videos-slate-overlay-1"]')
          .getAttribute('href');

        const vid = href
          ? href.split('/').find((x) => x.startsWith('vi') && x !== 'video')
          : null;
        return vid;
      });
    }

    console.log('videoId', videoId);
    if (!videoId) {
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
  }
};
const getSrc = async (link) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  try {
    const page = await browser.newPage();
    await page.goto(link, {
      waitUntil: 'load',
      timeout: 30000,
    });
    await page.waitForSelector('.jw-video', { visible: true });
    const src = await page.evaluate(() => {
      // eslint-disable-next-line no-undef
      return document.getElementsByTagName('video')[0].getAttribute('src');
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
