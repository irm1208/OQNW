# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-mobile.spec.ts >> mobile navigation, specialist tools, alerts, tabs, and dialogs remain usable
- Location: tests/admin-mobile/admin-mobile.spec.ts:122:5

# Error details

```
Test timeout of 180000ms exceeded.
```

```
Error: apiRequestContext._wrapApiCall: ENOENT: no such file or directory, open '/home/runner/workspace/test-results/.playwright-artifacts-2/traces/resources/page@19ff0f8f96471a79588ebf212ccfbd38-1789947840677.jpeg'
```

# Page snapshot

```yaml
- generic:
  - generic:
    - generic:
      - main:
        - generic:
          - generic:
            - button
          - generic:
            - generic:
              - button
            - generic:
              - button:
                - generic: "17"
        - generic:
          - generic:
            - generic:
              - generic:
                - generic:
                  - generic:
                    - heading [level=2]: Overview
                    - generic: 1 live
                  - paragraph: Monitor your store's performance and operations.
                - generic:
                  - generic:
                    - button: 7D
                    - button: 30D
                    - button: 90D
                    - button: 1Y
              - generic: "Read-only metrics: these values are system-derived operational history and cannot be edited or deleted."
              - generic:
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Today's Revenue
                        - generic: £0.00
                    - generic: 0 orders today
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Total Revenue
                        - generic: £118.99
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Total Orders
                        - generic: "17"
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Customers
                        - generic: "11"
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Avg Order Value
                        - generic: £118.99
                    - generic: "-"
                - generic:
                  - generic:
                    - generic:
                      - generic:
                        - paragraph: Low Stock Alerts
                        - generic: "16"
                    - generic: "-"
              - generic:
                - generic: Revenue Overview
                - generic:
                  - generic: Order Status
                  - generic:
                    - generic:
                      - generic:
                        - generic: "17"
                        - generic: Orders
                    - generic:
                      - generic:
                        - generic: awaiting payment
                        - generic: "15"
                      - generic:
                        - generic: payment received
                        - generic: "1"
                      - generic:
                        - generic: pending
                        - generic: "1"
              - generic:
                - generic:
                  - generic: New Customers
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - img:
                            - generic:
                              - generic:
                                - generic: 23 Aug
                                - generic: 28 Aug
                            - generic:
                              - generic:
                                - generic: "0"
                                - generic: "2"
                                - generic: "4"
                                - generic: "6"
                                - generic: "8"
                - generic:
                  - generic: Revenue by Category
                  - generic:
                    - generic:
                      - generic:
                        - generic:
                          - img:
                            - generic:
                              - generic:
                                - generic: £0
                                - generic: £30
                                - generic: £60
                                - generic: £90
                                - generic: £120
                            - generic:
                              - generic:
                                - generic: HealingPepti…
                                - generic: Accessories
                - generic:
                  - generic: Top Products
                  - generic:
                    - generic:
                      - generic:
                        - generic: "1"
                        - generic:
                          - paragraph: BPC-157 10mg
                          - paragraph: 1 units sold
                        - generic: £110.00
                      - generic:
                        - generic: "2"
                        - generic:
                          - paragraph: Bacteriostatic Water 10ml
                          - paragraph: 1 units sold
                        - generic: £8.99
    - list
  - generic: Healing Pepti…
  - dialog [ref=e2]:
    - button "Close" [active] [ref=e3]
    - generic [ref=e8]:
      - heading "Admin navigation" [level=2] [ref=e9]
      - paragraph [ref=e10]: Navigate to an admin section.
    - generic [ref=e11]:
      - img "OmniQure Admin" [ref=e13]
      - navigation [ref=e14]:
        - generic [ref=e15]:
          - link "Dashboard" [ref=e16] [cursor=pointer]:
            - /url: /dashboard
          - button "Orders" [ref=e24]
          - button "Products & Inventory" [ref=e33]
          - button "Customers" [ref=e42]
          - link "Fulfilment" [ref=e51] [cursor=pointer]:
            - /url: /fulfillment
          - button "Returns" [ref=e57]
          - button "Marketing" [ref=e65]
          - link "Reports" [ref=e73] [cursor=pointer]:
            - /url: /reports
          - button "Risk & Security" [ref=e78]
          - button "Settings" [ref=e85]
      - button "Logout" [ref=e93]
```