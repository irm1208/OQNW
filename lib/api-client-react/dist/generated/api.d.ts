import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";
import type { AdminCryptoTestPaymentSession, AdminLoginInput, AdminProduct, AdminSession, AdminWallidTestPaymentSession, ApiError, CatalogPriceSyncApplyRequest, CatalogPriceSyncApplyResponse, CatalogPriceSyncPreview, CatalogPriceSyncPreviewRequest, CatalogProduct, CatalogProductInput, CatalogProductPatch, CategoryRevenue, CustomerDetail, CustomerList, DashboardStats, DisableCatalogProductsWithoutJanoshikReportResponse, DiscountCode, DiscountCodeInput, DiscountCodePatch, EnableAllPeptideCatalogProductsResponse, GetNewCustomersChartParams, GetRevenueChartParams, HealthStatus, InventoryUpdate, ListAdminCustomersParams, ListAdminOrdersParams, ListAdminProductsParams, ListCatalogProductsParams, ListPublicProductsParams, NewCustomerDataPoint, Order, OrderDetail, OrderList, OrderStatusCount, OrderUpdate, PublicProduct, PublicProductDetail, RevenueDataPoint, TopProduct, VisibilityUpdate } from "./api.schemas";
import { customFetch } from "../custom-fetch";
import type { ErrorType, BodyType } from "../custom-fetch";
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
/**
 * @summary Health check
 */
export declare const getHealthCheckUrl: () => string;
export declare const healthCheck: (options?: RequestInit) => Promise<HealthStatus>;
export declare const getHealthCheckQueryKey: () => readonly ["/api/healthz"];
export declare const getHealthCheckQueryOptions: <TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData> & {
    queryKey: QueryKey;
};
export type HealthCheckQueryResult = NonNullable<Awaited<ReturnType<typeof healthCheck>>>;
export type HealthCheckQueryError = ErrorType<unknown>;
/**
 * @summary Health check
 */
export declare function useHealthCheck<TData = Awaited<ReturnType<typeof healthCheck>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof healthCheck>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Admin login
 */
export declare const getAdminLoginUrl: () => string;
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginInput>;
export type AdminLoginMutationError = ErrorType<ApiError>;
/**
 * @summary Admin login
 */
export declare const useAdminLogin: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, {
        data: BodyType<AdminLoginInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, {
    data: BodyType<AdminLoginInput>;
}, TContext>;
/**
 * @summary Admin logout
 */
export declare const getAdminLogoutUrl: () => string;
export declare const adminLogout: (options?: RequestInit) => Promise<void>;
export declare const getAdminLogoutMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
export type AdminLogoutMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogout>>>;
export type AdminLogoutMutationError = ErrorType<unknown>;
/**
 * @summary Admin logout
 */
export declare const useAdminLogout: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogout>>, TError, void, TContext>;
/**
 * @summary Check admin session
 */
export declare const getAdminMeUrl: () => string;
export declare const adminMe: (options?: RequestInit) => Promise<AdminSession>;
export declare const getAdminMeQueryKey: () => readonly ["/api/admin/auth/me"];
export declare const getAdminMeQueryOptions: <TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<ApiError>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData> & {
    queryKey: QueryKey;
};
export type AdminMeQueryResult = NonNullable<Awaited<ReturnType<typeof adminMe>>>;
export type AdminMeQueryError = ErrorType<ApiError>;
/**
 * @summary Check admin session
 */
export declare function useAdminMe<TData = Awaited<ReturnType<typeof adminMe>>, TError = ErrorType<ApiError>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof adminMe>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a one-time £1 Wallid test checkout
 */
export declare const getCreateAdminWallidTestPaymentSessionUrl: () => string;
export declare const createAdminWallidTestPaymentSession: (options?: RequestInit) => Promise<AdminWallidTestPaymentSession>;
export declare const getCreateAdminWallidTestPaymentSessionMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminWallidTestPaymentSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminWallidTestPaymentSession>>, TError, void, TContext>;
export type CreateAdminWallidTestPaymentSessionMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminWallidTestPaymentSession>>>;
export type CreateAdminWallidTestPaymentSessionMutationError = ErrorType<ApiError>;
/**
 * @summary Create a one-time £1 Wallid test checkout
 */
export declare const useCreateAdminWallidTestPaymentSession: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminWallidTestPaymentSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminWallidTestPaymentSession>>, TError, void, TContext>;
/**
 * @summary Create a one-time £1 crypto test checkout
 */
export declare const getCreateAdminCryptoTestPaymentSessionUrl: () => string;
export declare const createAdminCryptoTestPaymentSession: (options?: RequestInit) => Promise<AdminCryptoTestPaymentSession>;
export declare const getCreateAdminCryptoTestPaymentSessionMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminCryptoTestPaymentSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminCryptoTestPaymentSession>>, TError, void, TContext>;
export type CreateAdminCryptoTestPaymentSessionMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminCryptoTestPaymentSession>>>;
export type CreateAdminCryptoTestPaymentSessionMutationError = ErrorType<ApiError>;
/**
 * @summary Create a one-time £1 crypto test checkout
 */
export declare const useCreateAdminCryptoTestPaymentSession: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminCryptoTestPaymentSession>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminCryptoTestPaymentSession>>, TError, void, TContext>;
/**
 * @summary Get dashboard summary stats
 */
export declare const getGetAdminDashboardUrl: () => string;
export declare const getAdminDashboard: (options?: RequestInit) => Promise<DashboardStats>;
export declare const getGetAdminDashboardQueryKey: () => readonly ["/api/admin/dashboard"];
export declare const getGetAdminDashboardQueryOptions: <TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminDashboardQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminDashboard>>>;
export type GetAdminDashboardQueryError = ErrorType<unknown>;
/**
 * @summary Get dashboard summary stats
 */
export declare function useGetAdminDashboard<TData = Awaited<ReturnType<typeof getAdminDashboard>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminDashboard>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get daily revenue for the specified period
 */
export declare const getGetRevenueChartUrl: (params?: GetRevenueChartParams) => string;
export declare const getRevenueChart: (params?: GetRevenueChartParams, options?: RequestInit) => Promise<RevenueDataPoint[]>;
export declare const getGetRevenueChartQueryKey: (params?: GetRevenueChartParams) => readonly ["/api/admin/dashboard/revenue", ...GetRevenueChartParams[]];
export declare const getGetRevenueChartQueryOptions: <TData = Awaited<ReturnType<typeof getRevenueChart>>, TError = ErrorType<unknown>>(params?: GetRevenueChartParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRevenueChart>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRevenueChartQueryResult = NonNullable<Awaited<ReturnType<typeof getRevenueChart>>>;
export type GetRevenueChartQueryError = ErrorType<unknown>;
/**
 * @summary Get daily revenue for the specified period
 */
export declare function useGetRevenueChart<TData = Awaited<ReturnType<typeof getRevenueChart>>, TError = ErrorType<unknown>>(params?: GetRevenueChartParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get top selling products
 */
export declare const getGetTopProductsUrl: () => string;
export declare const getTopProducts: (options?: RequestInit) => Promise<TopProduct[]>;
export declare const getGetTopProductsQueryKey: () => readonly ["/api/admin/dashboard/top-products"];
export declare const getGetTopProductsQueryOptions: <TData = Awaited<ReturnType<typeof getTopProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getTopProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetTopProductsQueryResult = NonNullable<Awaited<ReturnType<typeof getTopProducts>>>;
export type GetTopProductsQueryError = ErrorType<unknown>;
/**
 * @summary Get top selling products
 */
export declare function useGetTopProducts<TData = Awaited<ReturnType<typeof getTopProducts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getTopProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get daily new customer registrations for the specified period
 */
export declare const getGetNewCustomersChartUrl: (params?: GetNewCustomersChartParams) => string;
export declare const getNewCustomersChart: (params?: GetNewCustomersChartParams, options?: RequestInit) => Promise<NewCustomerDataPoint[]>;
export declare const getGetNewCustomersChartQueryKey: (params?: GetNewCustomersChartParams) => readonly ["/api/admin/dashboard/new-customers", ...GetNewCustomersChartParams[]];
export declare const getGetNewCustomersChartQueryOptions: <TData = Awaited<ReturnType<typeof getNewCustomersChart>>, TError = ErrorType<unknown>>(params?: GetNewCustomersChartParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNewCustomersChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getNewCustomersChart>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetNewCustomersChartQueryResult = NonNullable<Awaited<ReturnType<typeof getNewCustomersChart>>>;
export type GetNewCustomersChartQueryError = ErrorType<unknown>;
/**
 * @summary Get daily new customer registrations for the specified period
 */
export declare function useGetNewCustomersChart<TData = Awaited<ReturnType<typeof getNewCustomersChart>>, TError = ErrorType<unknown>>(params?: GetNewCustomersChartParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getNewCustomersChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get order counts grouped by status
 */
export declare const getGetOrderStatusBreakdownUrl: () => string;
export declare const getOrderStatusBreakdown: (options?: RequestInit) => Promise<OrderStatusCount[]>;
export declare const getGetOrderStatusBreakdownQueryKey: () => readonly ["/api/admin/dashboard/order-status"];
export declare const getGetOrderStatusBreakdownQueryOptions: <TData = Awaited<ReturnType<typeof getOrderStatusBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrderStatusBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getOrderStatusBreakdown>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetOrderStatusBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof getOrderStatusBreakdown>>>;
export type GetOrderStatusBreakdownQueryError = ErrorType<unknown>;
/**
 * @summary Get order counts grouped by status
 */
export declare function useGetOrderStatusBreakdown<TData = Awaited<ReturnType<typeof getOrderStatusBreakdown>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getOrderStatusBreakdown>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get total revenue grouped by product category
 */
export declare const getGetRevenueByCategoryChartUrl: () => string;
export declare const getRevenueByCategoryChart: (options?: RequestInit) => Promise<CategoryRevenue[]>;
export declare const getGetRevenueByCategoryChartQueryKey: () => readonly ["/api/admin/dashboard/revenue-by-category"];
export declare const getGetRevenueByCategoryChartQueryOptions: <TData = Awaited<ReturnType<typeof getRevenueByCategoryChart>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueByCategoryChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getRevenueByCategoryChart>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetRevenueByCategoryChartQueryResult = NonNullable<Awaited<ReturnType<typeof getRevenueByCategoryChart>>>;
export type GetRevenueByCategoryChartQueryError = ErrorType<unknown>;
/**
 * @summary Get total revenue grouped by product category
 */
export declare function useGetRevenueByCategoryChart<TData = Awaited<ReturnType<typeof getRevenueByCategoryChart>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getRevenueByCategoryChart>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all orders with optional filters
 */
export declare const getListAdminOrdersUrl: (params?: ListAdminOrdersParams) => string;
export declare const listAdminOrders: (params?: ListAdminOrdersParams, options?: RequestInit) => Promise<OrderList>;
export declare const getListAdminOrdersQueryKey: (params?: ListAdminOrdersParams) => readonly ["/api/admin/orders", ...ListAdminOrdersParams[]];
export declare const getListAdminOrdersQueryOptions: <TData = Awaited<ReturnType<typeof listAdminOrders>>, TError = ErrorType<unknown>>(params?: ListAdminOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminOrdersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminOrders>>>;
export type ListAdminOrdersQueryError = ErrorType<unknown>;
/**
 * @summary List all orders with optional filters
 */
export declare function useListAdminOrders<TData = Awaited<ReturnType<typeof listAdminOrders>>, TError = ErrorType<unknown>>(params?: ListAdminOrdersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminOrders>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get order detail with items
 */
export declare const getGetAdminOrderUrl: (id: number) => string;
export declare const getAdminOrder: (id: number, options?: RequestInit) => Promise<OrderDetail>;
export declare const getGetAdminOrderQueryKey: (id: number) => readonly [`/api/admin/orders/${number}`];
export declare const getGetAdminOrderQueryOptions: <TData = Awaited<ReturnType<typeof getAdminOrder>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminOrderQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminOrder>>>;
export type GetAdminOrderQueryError = ErrorType<ApiError>;
/**
 * @summary Get order detail with items
 */
export declare function useGetAdminOrder<TData = Awaited<ReturnType<typeof getAdminOrder>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update order status, tracking, or notes
 */
export declare const getUpdateAdminOrderUrl: (id: number) => string;
export declare const updateAdminOrder: (id: number, orderUpdate: OrderUpdate, options?: RequestInit) => Promise<Order>;
export declare const getUpdateAdminOrderMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrder>>, TError, {
        id: number;
        data: BodyType<OrderUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrder>>, TError, {
    id: number;
    data: BodyType<OrderUpdate>;
}, TContext>;
export type UpdateAdminOrderMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminOrder>>>;
export type UpdateAdminOrderMutationBody = BodyType<OrderUpdate>;
export type UpdateAdminOrderMutationError = ErrorType<ApiError>;
/**
 * @summary Update order status, tracking, or notes
 */
export declare const useUpdateAdminOrder: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrder>>, TError, {
        id: number;
        data: BodyType<OrderUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminOrder>>, TError, {
    id: number;
    data: BodyType<OrderUpdate>;
}, TContext>;
/**
 * @summary List all customers
 */
export declare const getListAdminCustomersUrl: (params?: ListAdminCustomersParams) => string;
export declare const listAdminCustomers: (params?: ListAdminCustomersParams, options?: RequestInit) => Promise<CustomerList>;
export declare const getListAdminCustomersQueryKey: (params?: ListAdminCustomersParams) => readonly ["/api/admin/customers", ...ListAdminCustomersParams[]];
export declare const getListAdminCustomersQueryOptions: <TData = Awaited<ReturnType<typeof listAdminCustomers>>, TError = ErrorType<unknown>>(params?: ListAdminCustomersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminCustomers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminCustomers>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminCustomersQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminCustomers>>>;
export type ListAdminCustomersQueryError = ErrorType<unknown>;
/**
 * @summary List all customers
 */
export declare function useListAdminCustomers<TData = Awaited<ReturnType<typeof listAdminCustomers>>, TError = ErrorType<unknown>>(params?: ListAdminCustomersParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminCustomers>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get customer detail with order history
 */
export declare const getGetAdminCustomerUrl: (id: number) => string;
export declare const getAdminCustomer: (id: number, options?: RequestInit) => Promise<CustomerDetail>;
export declare const getGetAdminCustomerQueryKey: (id: number) => readonly [`/api/admin/customers/${number}`];
export declare const getGetAdminCustomerQueryOptions: <TData = Awaited<ReturnType<typeof getAdminCustomer>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminCustomer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminCustomer>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminCustomerQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminCustomer>>>;
export type GetAdminCustomerQueryError = ErrorType<ApiError>;
/**
 * @summary Get customer detail with order history
 */
export declare function useGetAdminCustomer<TData = Awaited<ReturnType<typeof getAdminCustomer>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminCustomer>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary List all products with stock levels
 */
export declare const getListAdminProductsUrl: (params?: ListAdminProductsParams) => string;
export declare const listAdminProducts: (params?: ListAdminProductsParams, options?: RequestInit) => Promise<AdminProduct[]>;
export declare const getListAdminProductsQueryKey: (params?: ListAdminProductsParams) => readonly ["/api/admin/products", ...ListAdminProductsParams[]];
export declare const getListAdminProductsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminProducts>>, TError = ErrorType<unknown>>(params?: ListAdminProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminProducts>>>;
export type ListAdminProductsQueryError = ErrorType<unknown>;
/**
 * @summary List all products with stock levels
 */
export declare function useListAdminProducts<TData = Awaited<ReturnType<typeof listAdminProducts>>, TError = ErrorType<unknown>>(params?: ListAdminProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update product stock level and threshold
 */
export declare const getUpdateProductInventoryUrl: (id: number) => string;
export declare const updateProductInventory: (id: number, inventoryUpdate: InventoryUpdate, options?: RequestInit) => Promise<AdminProduct>;
export declare const getUpdateProductInventoryMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductInventory>>, TError, {
        id: number;
        data: BodyType<InventoryUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProductInventory>>, TError, {
    id: number;
    data: BodyType<InventoryUpdate>;
}, TContext>;
export type UpdateProductInventoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateProductInventory>>>;
export type UpdateProductInventoryMutationBody = BodyType<InventoryUpdate>;
export type UpdateProductInventoryMutationError = ErrorType<ApiError>;
/**
 * @summary Update product stock level and threshold
 */
export declare const useUpdateProductInventory: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductInventory>>, TError, {
        id: number;
        data: BodyType<InventoryUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProductInventory>>, TError, {
    id: number;
    data: BodyType<InventoryUpdate>;
}, TContext>;
/**
 * @summary Toggle product published/draft status
 */
export declare const getUpdateProductVisibilityUrl: (id: number) => string;
export declare const updateProductVisibility: (id: number, visibilityUpdate: VisibilityUpdate, options?: RequestInit) => Promise<AdminProduct>;
export declare const getUpdateProductVisibilityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductVisibility>>, TError, {
        id: number;
        data: BodyType<VisibilityUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProductVisibility>>, TError, {
    id: number;
    data: BodyType<VisibilityUpdate>;
}, TContext>;
export type UpdateProductVisibilityMutationResult = NonNullable<Awaited<ReturnType<typeof updateProductVisibility>>>;
export type UpdateProductVisibilityMutationBody = BodyType<VisibilityUpdate>;
export type UpdateProductVisibilityMutationError = ErrorType<unknown>;
/**
 * @summary Toggle product published/draft status
 */
export declare const useUpdateProductVisibility: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductVisibility>>, TError, {
        id: number;
        data: BodyType<VisibilityUpdate>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProductVisibility>>, TError, {
    id: number;
    data: BodyType<VisibilityUpdate>;
}, TContext>;
/**
 * @summary List all discount codes
 */
export declare const getListAdminDiscountsUrl: () => string;
export declare const listAdminDiscounts: (options?: RequestInit) => Promise<DiscountCode[]>;
export declare const getListAdminDiscountsQueryKey: () => readonly ["/api/admin/discounts"];
export declare const getListAdminDiscountsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminDiscounts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminDiscounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminDiscounts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminDiscountsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminDiscounts>>>;
export type ListAdminDiscountsQueryError = ErrorType<unknown>;
/**
 * @summary List all discount codes
 */
export declare function useListAdminDiscounts<TData = Awaited<ReturnType<typeof listAdminDiscounts>>, TError = ErrorType<unknown>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminDiscounts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new discount code
 */
export declare const getCreateAdminDiscountUrl: () => string;
export declare const createAdminDiscount: (discountCodeInput: DiscountCodeInput, options?: RequestInit) => Promise<DiscountCode>;
export declare const getCreateAdminDiscountMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminDiscount>>, TError, {
        data: BodyType<DiscountCodeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminDiscount>>, TError, {
    data: BodyType<DiscountCodeInput>;
}, TContext>;
export type CreateAdminDiscountMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminDiscount>>>;
export type CreateAdminDiscountMutationBody = BodyType<DiscountCodeInput>;
export type CreateAdminDiscountMutationError = ErrorType<ApiError>;
/**
 * @summary Create a new discount code
 */
export declare const useCreateAdminDiscount: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminDiscount>>, TError, {
        data: BodyType<DiscountCodeInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminDiscount>>, TError, {
    data: BodyType<DiscountCodeInput>;
}, TContext>;
/**
 * @summary Update a discount code
 */
export declare const getUpdateAdminDiscountUrl: (id: number) => string;
export declare const updateAdminDiscount: (id: number, discountCodePatch: DiscountCodePatch, options?: RequestInit) => Promise<DiscountCode>;
export declare const getUpdateAdminDiscountMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, {
        id: number;
        data: BodyType<DiscountCodePatch>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, {
    id: number;
    data: BodyType<DiscountCodePatch>;
}, TContext>;
export type UpdateAdminDiscountMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminDiscount>>>;
export type UpdateAdminDiscountMutationBody = BodyType<DiscountCodePatch>;
export type UpdateAdminDiscountMutationError = ErrorType<ApiError>;
/**
 * @summary Update a discount code
 */
export declare const useUpdateAdminDiscount: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, {
        id: number;
        data: BodyType<DiscountCodePatch>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, {
    id: number;
    data: BodyType<DiscountCodePatch>;
}, TContext>;
/**
 * @summary Delete a discount code
 */
export declare const getDeleteAdminDiscountUrl: (id: number) => string;
export declare const deleteAdminDiscount: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteAdminDiscountMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, {
    id: number;
}, TContext>;
export type DeleteAdminDiscountMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAdminDiscount>>>;
export type DeleteAdminDiscountMutationError = ErrorType<ApiError>;
/**
 * @summary Delete a discount code
 */
export declare const useDeleteAdminDiscount: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List all products in the catalog
 */
export declare const getListCatalogProductsUrl: (params?: ListCatalogProductsParams) => string;
export declare const listCatalogProducts: (params?: ListCatalogProductsParams, options?: RequestInit) => Promise<CatalogProduct[]>;
export declare const getListCatalogProductsQueryKey: (params?: ListCatalogProductsParams) => readonly ["/api/admin/catalog", ...ListCatalogProductsParams[]];
export declare const getListCatalogProductsQueryOptions: <TData = Awaited<ReturnType<typeof listCatalogProducts>>, TError = ErrorType<unknown>>(params?: ListCatalogProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCatalogProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listCatalogProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListCatalogProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listCatalogProducts>>>;
export type ListCatalogProductsQueryError = ErrorType<unknown>;
/**
 * @summary List all products in the catalog
 */
export declare function useListCatalogProducts<TData = Awaited<ReturnType<typeof listCatalogProducts>>, TError = ErrorType<unknown>>(params?: ListCatalogProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listCatalogProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Create a new product
 */
export declare const getCreateCatalogProductUrl: () => string;
export declare const createCatalogProduct: (catalogProductInput: CatalogProductInput, options?: RequestInit) => Promise<CatalogProduct>;
export declare const getCreateCatalogProductMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCatalogProduct>>, TError, {
        data: BodyType<CatalogProductInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCatalogProduct>>, TError, {
    data: BodyType<CatalogProductInput>;
}, TContext>;
export type CreateCatalogProductMutationResult = NonNullable<Awaited<ReturnType<typeof createCatalogProduct>>>;
export type CreateCatalogProductMutationBody = BodyType<CatalogProductInput>;
export type CreateCatalogProductMutationError = ErrorType<ApiError>;
/**
 * @summary Create a new product
 */
export declare const useCreateCatalogProduct: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCatalogProduct>>, TError, {
        data: BodyType<CatalogProductInput>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCatalogProduct>>, TError, {
    data: BodyType<CatalogProductInput>;
}, TContext>;
/**
 * @summary Disable catalog products without a Janoshik report
 */
export declare const getDisableCatalogProductsWithoutJanoshikReportUrl: () => string;
export declare const disableCatalogProductsWithoutJanoshikReport: (options?: RequestInit) => Promise<DisableCatalogProductsWithoutJanoshikReportResponse>;
export declare const getDisableCatalogProductsWithoutJanoshikReportMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof disableCatalogProductsWithoutJanoshikReport>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof disableCatalogProductsWithoutJanoshikReport>>, TError, void, TContext>;
export type DisableCatalogProductsWithoutJanoshikReportMutationResult = NonNullable<Awaited<ReturnType<typeof disableCatalogProductsWithoutJanoshikReport>>>;
export type DisableCatalogProductsWithoutJanoshikReportMutationError = ErrorType<ApiError>;
/**
 * @summary Disable catalog products without a Janoshik report
 */
export declare const useDisableCatalogProductsWithoutJanoshikReport: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof disableCatalogProductsWithoutJanoshikReport>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof disableCatalogProductsWithoutJanoshikReport>>, TError, void, TContext>;
/**
 * @summary Re-enable all peptide products in the catalog
 */
export declare const getEnableAllPeptideCatalogProductsUrl: () => string;
export declare const enableAllPeptideCatalogProducts: (options?: RequestInit) => Promise<EnableAllPeptideCatalogProductsResponse>;
export declare const getEnableAllPeptideCatalogProductsMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof enableAllPeptideCatalogProducts>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof enableAllPeptideCatalogProducts>>, TError, void, TContext>;
export type EnableAllPeptideCatalogProductsMutationResult = NonNullable<Awaited<ReturnType<typeof enableAllPeptideCatalogProducts>>>;
export type EnableAllPeptideCatalogProductsMutationError = ErrorType<ApiError>;
/**
 * @summary Re-enable all peptide products in the catalog
 */
export declare const useEnableAllPeptideCatalogProducts: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof enableAllPeptideCatalogProducts>>, TError, void, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof enableAllPeptideCatalogProducts>>, TError, void, TContext>;
/**
 * @summary Preview a slug-keyed price-only catalogue sync
 */
export declare const getPreviewCatalogPriceSyncUrl: () => string;
export declare const previewCatalogPriceSync: (catalogPriceSyncPreviewRequest: CatalogPriceSyncPreviewRequest, options?: RequestInit) => Promise<CatalogPriceSyncPreview>;
export declare const getPreviewCatalogPriceSyncMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, {
        data: BodyType<CatalogPriceSyncPreviewRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, {
    data: BodyType<CatalogPriceSyncPreviewRequest>;
}, TContext>;
export type PreviewCatalogPriceSyncMutationResult = NonNullable<Awaited<ReturnType<typeof previewCatalogPriceSync>>>;
export type PreviewCatalogPriceSyncMutationBody = BodyType<CatalogPriceSyncPreviewRequest>;
export type PreviewCatalogPriceSyncMutationError = ErrorType<ApiError>;
/**
 * @summary Preview a slug-keyed price-only catalogue sync
 */
export declare const usePreviewCatalogPriceSync: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, {
        data: BodyType<CatalogPriceSyncPreviewRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, {
    data: BodyType<CatalogPriceSyncPreviewRequest>;
}, TContext>;
/**
 * @summary Apply an explicitly confirmed price-only catalogue sync
 */
export declare const getApplyCatalogPriceSyncUrl: () => string;
export declare const applyCatalogPriceSync: (catalogPriceSyncApplyRequest: CatalogPriceSyncApplyRequest, options?: RequestInit) => Promise<CatalogPriceSyncApplyResponse>;
export declare const getApplyCatalogPriceSyncMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, {
        data: BodyType<CatalogPriceSyncApplyRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, {
    data: BodyType<CatalogPriceSyncApplyRequest>;
}, TContext>;
export type ApplyCatalogPriceSyncMutationResult = NonNullable<Awaited<ReturnType<typeof applyCatalogPriceSync>>>;
export type ApplyCatalogPriceSyncMutationBody = BodyType<CatalogPriceSyncApplyRequest>;
export type ApplyCatalogPriceSyncMutationError = ErrorType<ApiError>;
/**
 * @summary Apply an explicitly confirmed price-only catalogue sync
 */
export declare const useApplyCatalogPriceSync: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, {
        data: BodyType<CatalogPriceSyncApplyRequest>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, {
    data: BodyType<CatalogPriceSyncApplyRequest>;
}, TContext>;
/**
 * @summary Get a single catalog product
 */
export declare const getGetCatalogProductUrl: (id: number) => string;
export declare const getCatalogProduct: (id: number, options?: RequestInit) => Promise<CatalogProduct>;
export declare const getGetCatalogProductQueryKey: (id: number) => readonly [`/api/admin/catalog/${number}`];
export declare const getGetCatalogProductQueryOptions: <TData = Awaited<ReturnType<typeof getCatalogProduct>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCatalogProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getCatalogProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetCatalogProductQueryResult = NonNullable<Awaited<ReturnType<typeof getCatalogProduct>>>;
export type GetCatalogProductQueryError = ErrorType<ApiError>;
/**
 * @summary Get a single catalog product
 */
export declare function useGetCatalogProduct<TData = Awaited<ReturnType<typeof getCatalogProduct>>, TError = ErrorType<ApiError>>(id: number, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getCatalogProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Update a catalog product
 */
export declare const getUpdateCatalogProductUrl: (id: number) => string;
export declare const updateCatalogProduct: (id: number, catalogProductPatch: CatalogProductPatch, options?: RequestInit) => Promise<CatalogProduct>;
export declare const getUpdateCatalogProductMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, {
        id: number;
        data: BodyType<CatalogProductPatch>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, {
    id: number;
    data: BodyType<CatalogProductPatch>;
}, TContext>;
export type UpdateCatalogProductMutationResult = NonNullable<Awaited<ReturnType<typeof updateCatalogProduct>>>;
export type UpdateCatalogProductMutationBody = BodyType<CatalogProductPatch>;
export type UpdateCatalogProductMutationError = ErrorType<ApiError>;
/**
 * @summary Update a catalog product
 */
export declare const useUpdateCatalogProduct: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, {
        id: number;
        data: BodyType<CatalogProductPatch>;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, {
    id: number;
    data: BodyType<CatalogProductPatch>;
}, TContext>;
/**
 * @summary Delete a catalog product
 */
export declare const getDeleteCatalogProductUrl: (id: number) => string;
export declare const deleteCatalogProduct: (id: number, options?: RequestInit) => Promise<void>;
export declare const getDeleteCatalogProductMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, {
    id: number;
}, TContext>;
export type DeleteCatalogProductMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCatalogProduct>>>;
export type DeleteCatalogProductMutationError = ErrorType<ApiError>;
/**
 * @summary Delete a catalog product
 */
export declare const useDeleteCatalogProduct: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, {
        id: number;
    }, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, {
    id: number;
}, TContext>;
/**
 * @summary List published products for the storefront
 */
export declare const getListPublicProductsUrl: (params?: ListPublicProductsParams) => string;
export declare const listPublicProducts: (params?: ListPublicProductsParams, options?: RequestInit) => Promise<PublicProduct[]>;
export declare const getListPublicProductsQueryKey: (params?: ListPublicProductsParams) => readonly ["/api/products", ...ListPublicProductsParams[]];
export declare const getListPublicProductsQueryOptions: <TData = Awaited<ReturnType<typeof listPublicProducts>>, TError = ErrorType<unknown>>(params?: ListPublicProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listPublicProducts>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListPublicProductsQueryResult = NonNullable<Awaited<ReturnType<typeof listPublicProducts>>>;
export type ListPublicProductsQueryError = ErrorType<unknown>;
/**
 * @summary List published products for the storefront
 */
export declare function useListPublicProducts<TData = Awaited<ReturnType<typeof listPublicProducts>>, TError = ErrorType<unknown>>(params?: ListPublicProductsParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listPublicProducts>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
/**
 * @summary Get a single published product by slug
 */
export declare const getGetPublicProductUrl: (slug: string) => string;
export declare const getPublicProduct: (slug: string, options?: RequestInit) => Promise<PublicProductDetail>;
export declare const getGetPublicProductQueryKey: (slug: string) => readonly [`/api/products/${string}`];
export declare const getGetPublicProductQueryOptions: <TData = Awaited<ReturnType<typeof getPublicProduct>>, TError = ErrorType<ApiError>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getPublicProduct>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetPublicProductQueryResult = NonNullable<Awaited<ReturnType<typeof getPublicProduct>>>;
export type GetPublicProductQueryError = ErrorType<ApiError>;
/**
 * @summary Get a single published product by slug
 */
export declare function useGetPublicProduct<TData = Awaited<ReturnType<typeof getPublicProduct>>, TError = ErrorType<ApiError>>(slug: string, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getPublicProduct>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export {};
//# sourceMappingURL=api.d.ts.map