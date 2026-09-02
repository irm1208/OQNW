---
name: PDFKit in the API bundle
description: Runtime dependency needed when bundling PDFKit into the OmniQure API server.
---

When PDFKit is bundled into the API artifact, keep `@swc/helpers` as a direct runtime dependency and copy PDFKit's `js/data` directory plus any invoice image assets beside the generated server bundle.

**Why:** The API can typecheck and build successfully while fontkit's CommonJS output fails at startup without `_define_property.cjs`, or invoice generation fails later because fonts and branded images are resolved relative to the bundle.

**How to apply:** After changing PDF/PDFKit dependencies or artwork, restart the actual API workflow rather than trusting the build alone. Confirm the server listens, required assets exist beside the bundle, and render a sample PDF before testing invoice email delivery.