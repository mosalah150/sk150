async function testOembed(url) {
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
      }
    });
    console.log("oEmbed URL:", url);
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 500));
  } catch (e) {
    console.error("Error:", e);
  }
}

async function run() {
  const videoId = "2140881823152453";
  await testOembed(`https://www.facebook.com/plugins/video/oembed.json?url=https://www.facebook.com/watch/?v=${videoId}`);
  await testOembed(`https://www.facebook.com/plugins/video/oembed.json?url=https://www.facebook.com/reel/${videoId}/`);
}
run();
