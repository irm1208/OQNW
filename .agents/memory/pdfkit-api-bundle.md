---
name: PDFKit in the API bundle
description: Runtime dependency needed when bundling PDFKit into the OmniQure API server.
---

When PDFKit is bundled into the API artifact, keep `@swc/helpers` as a direct runtime dependency.

**Why:** The API can typecheck and build successfully while fontkit's CommonJS output still fails at startup because `_define_property.cjs` is not resolvable unless the helper package is directly available.

**How to apply:** After changing PDF/PDFKit dependencies, restart the actual API workflow rather than trusting the build alone, and confirm the server reaches its listening state.