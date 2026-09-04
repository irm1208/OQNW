export declare const websiteLiveVisitorsTable: import("drizzle-orm/pg-core").PgTableWithColumns<{
    name: "website_live_visitors";
    schema: undefined;
    columns: {
        visitorId: import("drizzle-orm/pg-core").PgColumn<{
            name: "visitor_id";
            tableName: "website_live_visitors";
            dataType: "string";
            columnType: "PgText";
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
        }, {}, {}>;
        path: import("drizzle-orm/pg-core").PgColumn<{
            name: "path";
            tableName: "website_live_visitors";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        lastSeenAt: import("drizzle-orm/pg-core").PgColumn<{
            name: "last_seen_at";
            tableName: "website_live_visitors";
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
export type WebsiteLiveVisitor = typeof websiteLiveVisitorsTable.$inferSelect;
//# sourceMappingURL=website_live_visitors.d.ts.map