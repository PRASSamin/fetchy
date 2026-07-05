# Fetchy Neon

**Fetchy Neon** is the all-new, fully reimagined version of Fetchy — an open-source media downloader built to be fast, flexible, and beautifully modern. Whether you're here to build, contribute, or just peep under the hood, you're in for a treat.

## Live Now

[https://gofetchy.pras.me](https://gofetchy.pras.me)

## What’s New in Neon (v3.0.0)

* Massive codebase restructure for better readability and scalability
* Migrated to **Tailwind CSS v4** and **Next.js 15.3**
* Brand new **FumaDocs powered blog system** to deliver rich SEO content
* Tools now follow a frontmatter based system using custom Next.js plugins
* Dynamic tool architecture inspired by FumaDocs, clean and modular
* Revamped UI/UX, fresh layout, smooth transitions, and mobile-first polish
* Unified API responses, consistent format across all download tools
* New version naming strategy based on **periodic table elements** (like Android uses desserts 🍬)

## Built With

* **Next.js 15.3**: The foundation of Fetchy Neon’s frontend, routing, and dynamic rendering.
* **Tailwind CSS v4**: Crisp, modern styling with full dark mode support and zero-runtime utility power.
* **Bun**: Lightning-fast dev server, task runner, and bundler. Used across dev/build to keep things snappy.
* **Vercel**: Now handles **rate limiting natively**, replacing custom limits for streamlined control at the edge.
* **Upstash Redis**:
  * **Logging**: Every API call logs success/errors. Success logs auto-expire; errors persist until resolved.
  * **Temporary CDN Keys**: Secure mapping between real resource URLs and temp-access links to shield the original source.
* **Cloudinary**: Temporary file storage for downloaded media. Files are cached and served via Cloudinary’s CDN for speed and media optimization.
* **FumaDocs**: Powers the blog system and inspired the dynamic tool metadata structure & custom plugins (frontmatter + mapper).

## License

Licensed under the [Business Source License 1.1](LICENSE.md)
Use it, fork it, remix it — just give credits where due.

## Contributing

We welcome contributions to improve and expand Fetchy. If you’d like to contribute.

- Fork the repository.

```bash
git clone https://github.com/your-username/fetchy.git
bun install
bun dev
```

- Open a pull request, and we'll review it promptly.

---

**Fetchy Neon**: blazing fast downloads, glowing UI, and a codebase you’ll actually enjoy reading.
