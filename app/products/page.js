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

function toCategoryAnchorId(category, index) {
  const slug = category
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `category-${index + 1}-${slug || "section"}`;
}

function extractCategoryFromPath(imageAbsPath, imagesRoot) {
  const relativePath = path.relative(imagesRoot, imageAbsPath);
  const segments = relativePath.split(path.sep).filter(Boolean);
  return segments.length > 1
    ? formatCategoryName(segments[0])
    : "Uncategorized";
}

function extractProductTitle(imageAbsPath) {
  return path
    .basename(imageAbsPath, path.extname(imageAbsPath))
    .replace(/[_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function encodePublicPath(publicPath) {
  return publicPath
    .split("/")
    .map((segment) => (segment ? encodeURIComponent(segment) : ""))
    .join("/");
}

function toPublicImageSrc(imageAbsPath, publicRoot) {
  const publicRootWithSlash = `${publicRoot}${path.sep}`;
  if (
    imageAbsPath.startsWith(publicRootWithSlash) ||
    imageAbsPath.startsWith(publicRoot)
  ) {
    const relative = path.relative(publicRoot, imageAbsPath);
    return encodePublicPath(`/${relative.replace(/\\/g, "/")}`);
  }
  const normalized = imageAbsPath.replace(/\\/g, "/");
  const marker = "/public/";
  const idx = normalized.indexOf(marker);
  if (idx >= 0) {
    return encodePublicPath(`/${normalized.slice(idx + marker.length)}`);
  }
  return encodePublicPath(normalized.startsWith("/") ? normalized : `/${normalized}`);
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

  const groupedProducts = productImages.reduce((acc, imageAbsPath) => {
    const category = extractCategoryFromPath(imageAbsPath, imagesRoot);
    const src = toPublicImageSrc(imageAbsPath, publicRoot);
    const name = extractProductTitle(imageAbsPath);
    if (!acc[category]) acc[category] = [];
    acc[category].push({ src, name });
    return acc;
  }, {});

  const categories = Object.keys(groupedProducts)
    .sort((a, b) => {
      if (a === "Uncategorized") return 1;
      if (b === "Uncategorized") return -1;
      return a.localeCompare(b, undefined, { sensitivity: "base" });
    })
    .filter((category) => category !== "Uncategorized");

  Object.values(groupedProducts).forEach((items) => {
    items.sort((a, b) =>
      a.name.localeCompare(b.name, undefined, {
        numeric: true,
        sensitivity: "base",
      }),
    );
  });

  const uncategorizedImages = groupedProducts.Uncategorized ?? [];
  const shouldShowUngroupedGrid =
    categories.length === 0 && uncategorizedImages.length > 0;
  const categoryAnchors = categories.map((category, index) => ({
    category,
    id: toCategoryAnchorId(category, index),
  }));

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
          {categoryAnchors.length > 0 ? (
            <div className="section-actions category-jump-actions">
              {categoryAnchors.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="btn-primary category-jump-btn"
                >
                  {item.category}
                </a>
              ))}
            </div>
          ) : null}
        </div>

        {categories.length > 0 || shouldShowUngroupedGrid ? (
          <div className="product-categories-wrap" id="product-categories">
            {categoryAnchors.map((item) => (
              <section
                className="product-category-block"
                key={item.category}
                id={item.id}
              >
                <div className="product-category-head">
                  <div className="section-tag product-category-tag">
                    {item.category}
                  </div>
                </div>
                <div className="product-gallery-grid">
                  {groupedProducts[item.category].map((product, idx) => (
                    <article
                      className="product-gallery-card reveal visible"
                      key={product.src}
                    >
                      <a
                        href={product.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-gallery-image-link"
                        aria-label={`Open ${product.name}`}
                      >
                        <div className="product-gallery-image-wrap">
                          <Image
                            src={product.src}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="product-gallery-image"
                            priority={idx < 8}
                            unoptimized={product.src
                              .toLowerCase()
                              .endsWith(".svg")}
                          />
                        </div>
                        <div className="product-gallery-meta">
                          <h3>{product.name}</h3>
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
                  {uncategorizedImages.map((product, idx) => (
                    <article
                      className="product-gallery-card reveal visible"
                      key={product.src}
                    >
                      <a
                        href={product.src}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="product-gallery-image-link"
                        aria-label={`Open ${product.name}`}
                      >
                        <div className="product-gallery-image-wrap">
                          <Image
                            src={product.src}
                            alt={product.name}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className="product-gallery-image"
                            priority={idx < 8}
                            unoptimized={product.src
                              .toLowerCase()
                              .endsWith(".svg")}
                          />
                        </div>
                        <div className="product-gallery-meta">
                          <h3>{product.name}</h3>
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
