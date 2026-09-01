export declare const checkoutPaymentQuoteClaimsTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "checkout_payment_quote_claims";
    schema: undefined;
    columns: {
        tokenDigest: import("drizzle-orm/pg-core").PgColumn<{
            name: "token_digest";
            tableName: "checkout_payment_quote_claims";
            dataType: "string";
            columnType: "PgVarchar";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            length: 64;
        }>;
        expiresAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "expires_at";
            tableName: "checkout_payment_quote_claims";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        claimedAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "claimed_at";
            tableName: "checkout_payment_quote_claims";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
export type CheckoutPaymentQuoteClaim = typeof checkoutPaymentQuoteClaimsTable.$inferSelect;
//# sourceMappingURL=checkout_payment_quote_claims.d.ts.map