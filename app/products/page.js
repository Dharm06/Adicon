import fs from "fs/promises";
import path from "path";
import Link from "next/link";
import Image from "next/image";

export const revalidate = 3600;

async function readImagesRecursively(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = await Promise.all(
    entries.map(async (entry) => {
      const fullPath = path.join(dirPath, entry.name);
      if (entry.isDirectory()) {
        return readImagesRecursively(fullPath);
      }
      return fullPath;
    }),
  );
  return files.flat();
}

function formatCategoryName(value) {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

const CATEGORY_PROFILES = {
  Pesticides: [
    "pesticide",
    "insecticide",
    "pest",
    "insects",
    "thrips",
    "mite",
    "aphid",
    "larva",
    "worm",
    "whitefly",
    "termite",
    "bollworm",
    "stem borer",
    "caterpillar",
  ],
  Herbicides: [
    "herbicide",
    "weedicide",
    "weed",
    "weedicides",
    "glyphosate",
    "pre-emergence",
    "post-emergence",
    "broadleaf",
    "grassy weed",
    "weed control",
  ],
  Fungicides: [
    "fungicide",
    "fungal",
    "mildew",
    "blight",
    "anthracnose",
    "rust",
    "rot",
    "damping off",
    "powdery mildew",
    "downy mildew",
    "leaf spot",
  ],
  "Micro-Nutrient Fertilisers": [
    "micronutrient",
    "micro nutrient",
    "zinc",
    "boron",
    "iron",
    "manganese",
    "chelated",
    "fertilizer",
    "fertiliser",
    "deficiency",
    "edta",
    "foliar feed",
  ],
  "Bio-Pesticides": [
    "bio pesticide",
    "biopesticide",
    "bio",
    "organic",
    "neem",
    "trichoderma",
    "bacillus",
    "beauveria",
    "metarhizium",
    "natural",
    "eco friendly",
  ],
  "Plant Growth Regulators": [
    "pgr",
    "plant growth regulator",
    "growth regulator",
    "gibberellic",
    "auxin",
    "cytokinin",
    "flowering",
    "fruit set",
    "rooting",
    "hormone",
  ],
};

function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function scoreTextAgainstProfile(normalizedText, keywords) {
  let score = 0;
  for (const keyword of keywords) {
    const normalizedKeyword = normalizeText(keyword);
    if (!normalizedKeyword) continue;

    if (normalizedText.includes(normalizedKeyword)) score += 2;
    const parts = normalizedKeyword.split(" ").filter(Boolean);
    if (
      parts.length > 1 &&
      parts.every((part) => normalizedText.includes(part))
    ) {
      score += 1;
    }
  }
  return score;
}

function classifyText(text) {
  const normalized = normalizeText(text || "");
  let bestCategory = "Uncategorized";
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(CATEGORY_PROFILES)) {
    const score = scoreTextAgainstProfile(normalized, keywords);
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestScore > 0 ? bestCategory : "Uncategorized";
}

async function classifyImagesBySimilarity(imagePathsAbs) {
  return imagePathsAbs.map((imageAbsPath) => ({
    imageAbsPath,
    category: classifyText(
      path.basename(imageAbsPath, path.extname(imageAbsPath)),
    ),
  }));
}

function toPublicImageSrc(imageAbsPath, publicRoot) {
  const publicRootWithSlash = `${publicRoot}${path.sep}`;
  if (
    imageAbsPath.startsWith(publicRootWithSlash) ||
    imageAbsPath.startsWith(publicRoot)
  ) {
    const relative = path.relative(publicRoot, imageAbsPath);
    return `/${relative.replace(/\\/g, "/")}`;
  }
  const normalized = imageAbsPath.replace(/\\/g, "/");
  const marker = "/public/";
  const idx = normalized.indexOf(marker);
  if (idx >= 0) {
    return `/${normalized.slice(idx + marker.length)}`;
  }
  return normalized.startsWith("/") ? normalized : `/${normalized}`;
}

export default async function ProductsPage() {
  const imagesRoot = path.join(process.cwd(), "public", "images");
  const allowedExt = new Set([
    ".jpg",
    ".jpeg",
    ".png",
    ".webp",
    ".avif",
    ".gif",
    ".svg",
  ]);
  const publicRoot = path.join(process.cwd(), "public");
  const hasImagesDirectory = await fs
    .access(imagesRoot)
    .then(() => true)
    .catch((error) => {
      if (error.code === "ENOENT") return false;
      throw error;
    });

  const productImages = hasImagesDirectory
    ? (await readImagesRecursively(imagesRoot))
        .filter((file) => allowedExt.has(path.extname(file).toLowerCase()))
        .map((file) => file.replace(/\\/g, "/"))
        .sort((a, b) =>
          a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }),
        )
    : [];

  const classified =
    productImages.length > 0
      ? await classifyImagesBySimilarity(productImages)
      : [];

  const groupedProducts = classified.reduce((acc, item) => {
    const category = formatCategoryName(item.category);
    const src = toPublicImageSrc(item.imageAbsPath, publicRoot);
    if (!acc[category]) acc[category] = [];
    acc[category].push(src);
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts)
    .sort((a, b) => {
      if (a === "Uncategorized") return 1;
      if (b === "Uncategorized") return -1;
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    })
    .filter((category) => category !== "Uncategorized");

  const uncategorizedImages = groupedProducts.Uncategorized ?? [];
  const shouldShowUngroupedGrid =
    categories.length === 0 && uncategorizedImages.length > 0;

  return (
    <>
      <nav>
        <Link href="/" className="logo-link nav-logo-link">
          <Image
            src="/logofinal.png"
            alt="Adicon Logo"
            width={280}
            height={90}
            priority
            className="logo-img nav-logo-img"
          />
        </Link>
        <ul className="nav-links">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/products">Products</Link>
          </li>
        </ul>
        <Link href="/" className="nav-cta">
          Back to Home
        </Link>
      </nav>

      <section className="section products-page">
        <div className="section-header reveal visible">
          <div className="section-tag">Our Catalogue</div>
          <h1 className="section-title">
            All <span>Products</span> by Category
          </h1>
          <p className="section-subtitle">
            Explore ADICON product images grouped with similarity
            classification.
          </p>
        </div>

        {categories.length > 0 || shouldShowUngroupedGrid ? (
          <div className="product-categories-wrap">
            {categories.map((category) => (
              <section className="product-category-block" key={category}>
                <div className="product-category-head">
                  <div className="section-tag product-category-tag">
                    {category}
                  </div>
                </div>
                <div className="product-gallery-grid">
                  {groupedProducts[category].map((src, idx) => (
                    <article
                      className="product-gallery-card reveal visible"
                      key={src}
                    >
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-gallery-image-link"
                        aria-label={`Open ADICON Product ${idx + 1}`}
                      >
                        <div className="product-gallery-image-wrap">
                          <Image
                            src={src}
                            alt={`ADICON Product ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="product-gallery-image"
                            priority={idx < 8}
                          />
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            ))}
            {shouldShowUngroupedGrid ? (
              <section className="product-category-block">
                <div className="product-gallery-grid">
                  {uncategorizedImages.map((src, idx) => (
                    <article
                      className="product-gallery-card reveal visible"
                      key={src}
                    >
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-gallery-image-link"
                        aria-label={`Open ADICON Product ${idx + 1}`}
                      >
                        <div className="product-gallery-image-wrap">
                          <Image
                            src={src}
                            alt={`ADICON Product ${idx + 1}`}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="product-gallery-image"
                            priority={idx < 8}
                          />
                        </div>
                      </a>
                    </article>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        ) : (
          <div className="product-gallery-empty">
            No images found in <strong>public/images</strong>.
          </div>
        )}
      </section>
    </>
  );
}
