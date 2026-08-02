import zlib from "node:zlib";

const serviceUrl = String(process.argv[2] || process.env.SOCIAL_SHARE_URL || "").trim().replace(/\/$/,"");
const allowedOrigin = String(process.env.SALITA_APP_ORIGIN || "https://costieman.github.io").trim().replace(/\/$/,"");
const META_USER_AGENTS = [
  "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
  "meta-externalagent/1.1 (+https://developers.facebook.com/docs/sharing/webmasters/crawler)"
];

function fail(message) { throw new Error(message); }
function assert(condition,message) { if (!condition) fail(message); }

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ ((crc & 1) ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type,data) {
  const typeBuffer = Buffer.from(type,"ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length,0);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([typeBuffer,data])),0);
  return Buffer.concat([length,typeBuffer,data,checksum]);
}

function solidPng(width,height,[red,green,blue,alpha=255]) {
  const signature = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width,0);
  ihdr.writeUInt32BE(height,4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  const row = Buffer.alloc(1 + width * 4);
  for (let x = 0; x < width; x += 1) {
    const offset = 1 + x * 4;
    row[offset] = red;
    row[offset + 1] = green;
    row[offset + 2] = blue;
    row[offset + 3] = alpha;
  }
  const raw = Buffer.alloc(row.length * height);
  for (let y = 0; y < height; y += 1) row.copy(raw,y * row.length);
  return Buffer.concat([
    signature,
    pngChunk("IHDR",ihdr),
    pngChunk("IDAT",zlib.deflateSync(raw,{level:9})),
    pngChunk("IEND",Buffer.alloc(0))
  ]);
}

function pngDataUrl(width,height,color) {
  return `data:image/png;base64,${solidPng(width,height,color).toString("base64")}`;
}

function pngDimensions(buffer) {
  const signature = Buffer.from([0x89,0x50,0x4e,0x47,0x0d,0x0a,0x1a,0x0a]);
  assert(buffer.length >= 24 && buffer.subarray(0,8).equals(signature),"Hosted image is not a valid PNG.");
  return {width:buffer.readUInt32BE(16),height:buffer.readUInt32BE(20)};
}

async function jsonResponse(response,label) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) fail(`${label} failed (${response.status}): ${data.message || "unknown response"}`);
  return data;
}

async function fetchPng(url,expectedWidth,expectedHeight,label,userAgent="") {
  const headers = {Accept:"image/png"};
  if (userAgent) headers["User-Agent"] = userAgent;
  const response = await fetch(url,{headers,redirect:"follow"});
  assert(response.ok,`${label} returned ${response.status}.`);
  assert(String(response.headers.get("content-type") || "").startsWith("image/png"),`${label} did not return image/png.`);
  assert(response.headers.get("content-length"),`${label} is missing Content-Length.`);
  assert(response.headers.get("accept-ranges") === "bytes",`${label} is missing byte-range support.`);
  const buffer = Buffer.from(await response.arrayBuffer());
  const dimensions = pngDimensions(buffer);
  assert(dimensions.width === expectedWidth && dimensions.height === expectedHeight,
    `${label} must be ${expectedWidth}×${expectedHeight}, received ${dimensions.width}×${dimensions.height}.`);
}

async function verifyCrawlerPage(shareUrl,imageUrl,userAgent) {
  const response = await fetch(shareUrl,{
    headers:{Accept:"text/html","User-Agent":userAgent},
    redirect:"follow",
    cache:"no-store"
  });
  assert(response.ok,`Meta crawler page request returned ${response.status}.`);
  assert(response.headers.get("x-robots-tag") === "all","Meta crawler page is not explicitly crawlable.");
  const page = await response.text();
  assert(!/noindex|nofollow/i.test(page),"Meta crawler page contains a blocking robots directive.");
  assert(page.includes('<meta name="robots" content="index,follow,max-image-preview:large">'),"Meta crawler page is missing the large-image robots directive.");
  assert(page.includes(`<meta property="og:url" content="${shareUrl}">`),"Meta crawler page is missing og:url.");
  assert(page.includes(`<meta property="og:image" content="${imageUrl}">`),"Meta crawler page is missing og:image.");
  assert(page.includes(`<meta property="og:image:url" content="${imageUrl}">`),"Meta crawler page is missing og:image:url.");
  assert(page.includes(`<link rel="image_src" href="${imageUrl}">`),"Meta crawler page is missing image_src.");
}

async function verifyHeadAndRange(imageUrl,userAgent) {
  const head = await fetch(imageUrl,{method:"HEAD",headers:{"User-Agent":userAgent},redirect:"follow"});
  assert(head.ok,"Meta crawler image HEAD request failed.");
  assert(String(head.headers.get("content-type") || "").startsWith("image/png"),"Meta crawler image HEAD returned the wrong content type.");
  assert(head.headers.get("content-length"),"Meta crawler image HEAD is missing Content-Length.");
  assert(head.headers.get("accept-ranges") === "bytes","Meta crawler image HEAD is missing Accept-Ranges.");

  const range = await fetch(imageUrl,{
    headers:{"User-Agent":userAgent,Range:"bytes=0-1023",Accept:"image/png"},
    redirect:"follow"
  });
  assert(range.status === 206,`Meta crawler image range request returned ${range.status}, expected 206.`);
  assert(/^bytes 0-1023\//.test(String(range.headers.get("content-range") || "")),"Meta crawler range response is missing Content-Range.");
}

async function main() {
  assert(serviceUrl,"Usage: node services/social-share/verify-deployment.mjs https://SERVICE-URL");
  const base = new URL(serviceUrl);
  assert(base.protocol === "https:","The hosted sharing service must use HTTPS.");

  const healthResponse = await fetch(`${serviceUrl}/health`,{headers:{Accept:"application/json"},cache:"no-store"});
  const health = await jsonResponse(healthResponse,"Health check");
  assert(health.ok === true,"Health response did not report ok=true.");
  assert(health.bucketConfigured === true,"Hosted share storage is not configured.");
  assert(health.crawlerPreview === true,"The deployed service is not the crawler-compatible release.");
  for (const type of ["badge","badge_chest","avatar","avatar_case","level_up"]) {
    assert(health.supportedTypes?.includes(type),`Health response is missing share type: ${type}`);
  }

  const title = `Salita Quest deployment test ${new Date().toISOString()}`;
  const description = "A temporary verification card confirming public achievement sharing is ready.";
  const uploadResponse = await fetch(`${serviceUrl}/api/share-cards`,{
    method:"POST",
    credentials:"omit",
    headers:{"Content-Type":"application/json",Accept:"application/json",Origin:allowedOrigin},
    body:JSON.stringify({
      type:"avatar_case",
      title,
      description,
      learnerName:"Release verifier",
      course:"Tagalog",
      campaign:"deployment-verification",
      squareImageDataUrl:pngDataUrl(1080,1080,[15,118,110,255]),
      ogImageDataUrl:pngDataUrl(1200,630,[7,20,39,255])
    })
  });
  const card = await jsonResponse(uploadResponse,"Share-card creation");

  const shareUrl = new URL(card.shareUrl || "");
  const imageUrl = new URL(card.imageUrl || "");
  const squareImageUrl = new URL(card.squareImageUrl || "");
  const appUrl = new URL(card.appUrl || "");
  assert(shareUrl.origin === base.origin && shareUrl.pathname.startsWith("/share/"),"Share URL is not a public hosted achievement page.");
  assert(imageUrl.origin === base.origin && imageUrl.pathname.startsWith("/media/"),"Open Graph image URL is invalid.");
  assert(squareImageUrl.origin === base.origin && squareImageUrl.pathname.startsWith("/media/"),"Square image URL is invalid.");
  assert(appUrl.protocol === "https:","Learn-free destination is not HTTPS.");

  const pageResponse = await fetch(shareUrl,{headers:{Accept:"text/html"},redirect:"follow"});
  assert(pageResponse.ok,`Public share page returned ${pageResponse.status}.`);
  const page = await pageResponse.text();
  assert(page.includes('<meta property="og:image:width" content="1200">'),"Public page is missing the Open Graph width.");
  assert(page.includes('<meta property="og:image:height" content="630">'),"Public page is missing the Open Graph height.");
  assert(page.includes("Start learning a Filipino language free"),"Public page is missing the learn-free call to action.");
  assert(page.includes(`href="${String(appUrl).replace(/&/g,"&amp;")}"`) || page.includes(`href="${appUrl}"`),"Public page does not link to the Salita Quest destination.");
  assert(!/Learner Login/i.test(page),"Public achievement page incorrectly exposes the Learner Login preview.");

  await fetchPng(imageUrl,1200,630,"Open Graph image");
  await fetchPng(squareImageUrl,1080,1080,"Square achievement image");
  for (const userAgent of META_USER_AGENTS) {
    await verifyCrawlerPage(String(shareUrl),String(imageUrl),userAgent);
    await fetchPng(String(imageUrl),1200,630,"Meta crawler Open Graph image",userAgent);
    await verifyHeadAndRange(String(imageUrl),userAgent);
  }

  console.log(JSON.stringify({
    status:"PASS",
    serviceUrl,
    version:health.version,
    crawlerPreview:health.crawlerPreview,
    bucketConfigured:health.bucketConfigured,
    supportedTypes:health.supportedTypes,
    shareUrl:String(shareUrl),
    imageUrl:String(imageUrl),
    appUrl:String(appUrl),
    metaCrawlerChecks:META_USER_AGENTS.length
  },null,2));
}

main().catch(error => {
  console.error(`Hosted sharing verification failed: ${error.message}`);
  process.exitCode = 1;
});
