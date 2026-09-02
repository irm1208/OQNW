---
name: PDFKit in the API bundle
description: Runtime dependency needed when bundling PDFKit into the OmniQure API server.
---

When PDFKit is bundled into the API artifact, keep `@swc/helpers` as a direct runtime dependency and copy PDFKit's `js/data` directory beside the generated server bundle.

**Why:** The API can typecheck and build successfully while fontkit's CommonJS output fails at startup without `_define_property.cjs`, or invoice generation fails later because standard-font AFM files such as `Helvetica.afm` are resolved relative to the bundle.

**How to apply:** After changing PDF/PDFKit dependencies, restart the actual API workflow rather than trusting the build alone. Confirm the server listens and that the generated output contains PDFKit's standard-font data before testing invoice email delivery.