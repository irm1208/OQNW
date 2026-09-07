import type { QueryKey, UseMutationOptions, UseMutationResult, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import type { AdminCryptoTestPaymentSession, AdminLoginInput, AdminProduct, AdminSession, AdminWallidTestPaymentSession, ApiError, CatalogPriceSyncApplyRequest, CatalogPriceSyncApplyResponse, CatalogPriceSyncPreview, CatalogPriceSyncPreviewRequest, CatalogProduct, CatalogProductInput, CatalogProductPatch, CategoryRevenue, CustomerDetail, CustomerList, CustomerSegmentDetail, CustomerSegmentInput, CustomerSegmentList, CustomerSegmentPatch, CustomerSegmentResponse, DashboardStats, DisableCatalogProductsWithoutJanoshikReportResponse, DiscountCode, DiscountCodeInput, DiscountCodePatch, DispatchOrderInput, DispatchOrderResponse, EnableAllPeptideCatalogProductsResponse, GetAdminCustomerSegmentParams, GetNewCustomersChartParams, GetRevenueChartParams, HealthStatus, InventoryUpdate, ListAdminCustomersParams, ListAdminOrdersParams, ListAdminProductsParams, ListCatalogProductsParams, ListPublicProductsParams, NewCustomerDataPoint, NotificationResult, Order, OrderDetail, OrderList, OrderStatusCount, OrderUpdate, PublicOrderTracking, PublicProduct, PublicProductDetail, RevenueDataPoint, TopProduct, TrackPublicOrderParams, VisibilityUpdate } from './api.schemas';
import { customFetch } from '../custom-fetch';
import type { ErrorType, BodyType } from '../custom-fetch';
type AwaitedInput<T> = PromiseLike<T> | T;
type Awaited<O> = O extends AwaitedInput<infer T> ? T : never;
type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];
export declare const getHealthCheckUrl: () => string;
/**
 * @summary Health check
 */
export declare const healthCheck: (options?: Parameters<typeof customFetch>[1]) => Promise<HealthStatus>;
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
export declare const getAdminLoginUrl: () => string;
/**
 * @summary Admin login
 */
export declare const adminLogin: (adminLoginInput: AdminLoginInput, options?: Parameters<typeof customFetch>[1]) => Promise<AdminSession>;
export declare const getAdminLoginMutationKey: () => readonly ["adminLogin"];
export declare const getAdminLoginMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
export type AdminLoginMutationResult = NonNullable<Awaited<ReturnType<typeof adminLogin>>>;
export type AdminLoginMutationBody = BodyType<AdminLoginInput>;
export type AdminLoginMutationError = ErrorType<ApiError>;
export type AdminLoginMutationVariables = {
    data: BodyType<AdminLoginInput>;
};
/**
* @summary Admin login
*/
export declare const useAdminLogin: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof adminLogin>>, TError, AdminLoginMutationVariables, TContext>;
export declare const getAdminLogoutUrl: () => string;
/**
 * @summary Admin logout
 */
export declare const adminLogout: (options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getAdminLogoutMutationKey: () => readonly ["adminLogout"];
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
export declare const getAdminMeUrl: () => string;
/**
 * @summary Check admin session
 */
export declare const adminMe: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminSession>;
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
export declare const getCreateAdminWallidTestPaymentSessionUrl: () => string;
/**
 * @summary Create a one-time £1 Wallid test checkout
 */
export declare const createAdminWallidTestPaymentSession: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminWallidTestPaymentSession>;
export declare const getCreateAdminWallidTestPaymentSessionMutationKey: () => readonly ["createAdminWallidTestPaymentSession"];
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
export declare const getCreateAdminCryptoTestPaymentSessionUrl: () => string;
/**
 * @summary Create a one-time £1 crypto test checkout
 */
export declare const createAdminCryptoTestPaymentSession: (options?: Parameters<typeof customFetch>[1]) => Promise<AdminCryptoTestPaymentSession>;
export declare const getCreateAdminCryptoTestPaymentSessionMutationKey: () => readonly ["createAdminCryptoTestPaymentSession"];
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
export declare const getGetAdminDashboardUrl: () => string;
/**
 * @summary Get dashboard summary stats
 */
export declare const getAdminDashboard: (options?: Parameters<typeof customFetch>[1]) => Promise<DashboardStats>;
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
export declare const getGetRevenueChartUrl: (params?: GetRevenueChartParams) => string;
/**
 * @summary Get daily revenue for the specified period
 */
export declare const getRevenueChart: (params?: GetRevenueChartParams, options?: Parameters<typeof customFetch>[1]) => Promise<RevenueDataPoint[]>;
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
export declare const getGetTopProductsUrl: () => string;
/**
 * @summary Get top selling products
 */
export declare const getTopProducts: (options?: Parameters<typeof customFetch>[1]) => Promise<TopProduct[]>;
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
export declare const getGetNewCustomersChartUrl: (params?: GetNewCustomersChartParams) => string;
/**
 * @summary Get daily new customer registrations for the specified period
 */
export declare const getNewCustomersChart: (params?: GetNewCustomersChartParams, options?: Parameters<typeof customFetch>[1]) => Promise<NewCustomerDataPoint[]>;
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
export declare const getGetOrderStatusBreakdownUrl: () => string;
/**
 * @summary Get order counts grouped by status
 */
export declare const getOrderStatusBreakdown: (options?: Parameters<typeof customFetch>[1]) => Promise<OrderStatusCount[]>;
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
export declare const getGetRevenueByCategoryChartUrl: () => string;
/**
 * @summary Get total revenue grouped by product category
 */
export declare const getRevenueByCategoryChart: (options?: Parameters<typeof customFetch>[1]) => Promise<CategoryRevenue[]>;
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
export declare const getListAdminOrdersUrl: (params?: ListAdminOrdersParams) => string;
/**
 * @summary List all orders with optional filters
 */
export declare const listAdminOrders: (params?: ListAdminOrdersParams, options?: Parameters<typeof customFetch>[1]) => Promise<OrderList>;
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
export declare const getGetAdminOrderUrl: (id: number) => string;
/**
 * @summary Get order detail with items
 */
export declare const getAdminOrder: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<OrderDetail>;
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
export declare const getUpdateAdminOrderUrl: (id: number) => string;
/**
 * @summary Update order status, tracking, or notes
 */
export declare const updateAdminOrder: (id: number, orderUpdate: OrderUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<Order>;
export declare const getUpdateAdminOrderMutationKey: () => readonly ["updateAdminOrder"];
export declare const getUpdateAdminOrderMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrder>>, TError, UpdateAdminOrderMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrder>>, TError, UpdateAdminOrderMutationVariables, TContext>;
export type UpdateAdminOrderMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminOrder>>>;
export type UpdateAdminOrderMutationBody = BodyType<OrderUpdate>;
export type UpdateAdminOrderMutationError = ErrorType<ApiError>;
export type UpdateAdminOrderMutationVariables = {
    id: number;
    data: BodyType<OrderUpdate>;
};
/**
* @summary Update order status, tracking, or notes
*/
export declare const useUpdateAdminOrder: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminOrder>>, TError, UpdateAdminOrderMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminOrder>>, TError, UpdateAdminOrderMutationVariables, TContext>;
export declare const getDispatchAdminOrderUrl: (id: number) => string;
/**
 * @summary Dispatch an order and send its tracking notification
 */
export declare const dispatchAdminOrder: (id: number, dispatchOrderInput: DispatchOrderInput, options?: Parameters<typeof customFetch>[1]) => Promise<DispatchOrderResponse>;
export declare const getDispatchAdminOrderMutationKey: () => readonly ["dispatchAdminOrder"];
export declare const getDispatchAdminOrderMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof dispatchAdminOrder>>, TError, DispatchAdminOrderMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof dispatchAdminOrder>>, TError, DispatchAdminOrderMutationVariables, TContext>;
export type DispatchAdminOrderMutationResult = NonNullable<Awaited<ReturnType<typeof dispatchAdminOrder>>>;
export type DispatchAdminOrderMutationBody = BodyType<DispatchOrderInput>;
export type DispatchAdminOrderMutationError = ErrorType<ApiError>;
export type DispatchAdminOrderMutationVariables = {
    id: number;
    data: BodyType<DispatchOrderInput>;
};
/**
* @summary Dispatch an order and send its tracking notification
*/
export declare const useDispatchAdminOrder: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof dispatchAdminOrder>>, TError, DispatchAdminOrderMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof dispatchAdminOrder>>, TError, DispatchAdminOrderMutationVariables, TContext>;
export declare const getResendAdminOrderTrackingUrl: (id: number) => string;
/**
 * @summary Resend the tracking notification for a dispatched order
 */
export declare const resendAdminOrderTracking: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<NotificationResult>;
export declare const getResendAdminOrderTrackingMutationKey: () => readonly ["resendAdminOrderTracking"];
export declare const getResendAdminOrderTrackingMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resendAdminOrderTracking>>, TError, ResendAdminOrderTrackingMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof resendAdminOrderTracking>>, TError, ResendAdminOrderTrackingMutationVariables, TContext>;
export type ResendAdminOrderTrackingMutationResult = NonNullable<Awaited<ReturnType<typeof resendAdminOrderTracking>>>;
export type ResendAdminOrderTrackingMutationError = ErrorType<ApiError>;
export type ResendAdminOrderTrackingMutationVariables = {
    id: number;
};
/**
* @summary Resend the tracking notification for a dispatched order
*/
export declare const useResendAdminOrderTracking: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof resendAdminOrderTracking>>, TError, ResendAdminOrderTrackingMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof resendAdminOrderTracking>>, TError, ResendAdminOrderTrackingMutationVariables, TContext>;
export declare const getTrackPublicOrderUrl: (params: TrackPublicOrderParams) => string;
/**
 * @summary Track an order by its public order number
 */
export declare const trackPublicOrder: (params: TrackPublicOrderParams, options?: Parameters<typeof customFetch>[1]) => Promise<PublicOrderTracking>;
export declare const getTrackPublicOrderQueryKey: (params?: TrackPublicOrderParams) => readonly ["/api/orders/track", ...TrackPublicOrderParams[]];
export declare const getTrackPublicOrderQueryOptions: <TData = Awaited<ReturnType<typeof trackPublicOrder>>, TError = ErrorType<ApiError>>(params: TrackPublicOrderParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof trackPublicOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof trackPublicOrder>>, TError, TData> & {
    queryKey: QueryKey;
};
export type TrackPublicOrderQueryResult = NonNullable<Awaited<ReturnType<typeof trackPublicOrder>>>;
export type TrackPublicOrderQueryError = ErrorType<ApiError>;
/**
 * @summary Track an order by its public order number
 */
export declare function useTrackPublicOrder<TData = Awaited<ReturnType<typeof trackPublicOrder>>, TError = ErrorType<ApiError>>(params: TrackPublicOrderParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof trackPublicOrder>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getListAdminCustomersUrl: (params?: ListAdminCustomersParams) => string;
/**
 * @summary List all customers
 */
export declare const listAdminCustomers: (params?: ListAdminCustomersParams, options?: Parameters<typeof customFetch>[1]) => Promise<CustomerList>;
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
export declare const getGetAdminCustomerUrl: (id: number) => string;
/**
 * @summary Get customer detail with order history
 */
export declare const getAdminCustomer: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<CustomerDetail>;
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
export declare const getListAdminCustomerSegmentsUrl: () => string;
/**
 * @summary List active dynamic customer segments with live match counts
 */
export declare const listAdminCustomerSegments: (options?: Parameters<typeof customFetch>[1]) => Promise<CustomerSegmentList>;
export declare const getListAdminCustomerSegmentsQueryKey: () => readonly ["/api/admin/customer-segments"];
export declare const getListAdminCustomerSegmentsQueryOptions: <TData = Awaited<ReturnType<typeof listAdminCustomerSegments>>, TError = ErrorType<ApiError>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminCustomerSegments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof listAdminCustomerSegments>>, TError, TData> & {
    queryKey: QueryKey;
};
export type ListAdminCustomerSegmentsQueryResult = NonNullable<Awaited<ReturnType<typeof listAdminCustomerSegments>>>;
export type ListAdminCustomerSegmentsQueryError = ErrorType<ApiError>;
/**
 * @summary List active dynamic customer segments with live match counts
 */
export declare function useListAdminCustomerSegments<TData = Awaited<ReturnType<typeof listAdminCustomerSegments>>, TError = ErrorType<ApiError>>(options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof listAdminCustomerSegments>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getCreateAdminCustomerSegmentUrl: () => string;
/**
 * @summary Create a dynamic customer segment
 */
export declare const createAdminCustomerSegment: (customerSegmentInput: CustomerSegmentInput, options?: Parameters<typeof customFetch>[1]) => Promise<CustomerSegmentResponse>;
export declare const getCreateAdminCustomerSegmentMutationKey: () => readonly ["createAdminCustomerSegment"];
export declare const getCreateAdminCustomerSegmentMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminCustomerSegment>>, TError, CreateAdminCustomerSegmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminCustomerSegment>>, TError, CreateAdminCustomerSegmentMutationVariables, TContext>;
export type CreateAdminCustomerSegmentMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminCustomerSegment>>>;
export type CreateAdminCustomerSegmentMutationBody = BodyType<CustomerSegmentInput>;
export type CreateAdminCustomerSegmentMutationError = ErrorType<ApiError>;
export type CreateAdminCustomerSegmentMutationVariables = {
    data: BodyType<CustomerSegmentInput>;
};
/**
* @summary Create a dynamic customer segment
*/
export declare const useCreateAdminCustomerSegment: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminCustomerSegment>>, TError, CreateAdminCustomerSegmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminCustomerSegment>>, TError, CreateAdminCustomerSegmentMutationVariables, TContext>;
export declare const getGetAdminCustomerSegmentUrl: (id: number, params?: GetAdminCustomerSegmentParams) => string;
/**
 * @summary Get a segment and paginated live matching members
 */
export declare const getAdminCustomerSegment: (id: number, params?: GetAdminCustomerSegmentParams, options?: Parameters<typeof customFetch>[1]) => Promise<CustomerSegmentDetail>;
export declare const getGetAdminCustomerSegmentQueryKey: (id: number, params?: GetAdminCustomerSegmentParams) => readonly [`/api/admin/customer-segments/${number}`, ...GetAdminCustomerSegmentParams[]];
export declare const getGetAdminCustomerSegmentQueryOptions: <TData = Awaited<ReturnType<typeof getAdminCustomerSegment>>, TError = ErrorType<ApiError>>(id: number, params?: GetAdminCustomerSegmentParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminCustomerSegment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}) => UseQueryOptions<Awaited<ReturnType<typeof getAdminCustomerSegment>>, TError, TData> & {
    queryKey: QueryKey;
};
export type GetAdminCustomerSegmentQueryResult = NonNullable<Awaited<ReturnType<typeof getAdminCustomerSegment>>>;
export type GetAdminCustomerSegmentQueryError = ErrorType<ApiError>;
/**
 * @summary Get a segment and paginated live matching members
 */
export declare function useGetAdminCustomerSegment<TData = Awaited<ReturnType<typeof getAdminCustomerSegment>>, TError = ErrorType<ApiError>>(id: number, params?: GetAdminCustomerSegmentParams, options?: {
    query?: UseQueryOptions<Awaited<ReturnType<typeof getAdminCustomerSegment>>, TError, TData>;
    request?: SecondParameter<typeof customFetch>;
}): UseQueryResult<TData, TError> & {
    queryKey: QueryKey;
};
export declare const getUpdateAdminCustomerSegmentUrl: (id: number) => string;
/**
 * @summary Update a dynamic customer segment
 */
export declare const updateAdminCustomerSegment: (id: number, customerSegmentPatch: CustomerSegmentPatch, options?: Parameters<typeof customFetch>[1]) => Promise<CustomerSegmentResponse>;
export declare const getUpdateAdminCustomerSegmentMutationKey: () => readonly ["updateAdminCustomerSegment"];
export declare const getUpdateAdminCustomerSegmentMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminCustomerSegment>>, TError, UpdateAdminCustomerSegmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminCustomerSegment>>, TError, UpdateAdminCustomerSegmentMutationVariables, TContext>;
export type UpdateAdminCustomerSegmentMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminCustomerSegment>>>;
export type UpdateAdminCustomerSegmentMutationBody = BodyType<CustomerSegmentPatch>;
export type UpdateAdminCustomerSegmentMutationError = ErrorType<ApiError>;
export type UpdateAdminCustomerSegmentMutationVariables = {
    id: number;
    data: BodyType<CustomerSegmentPatch>;
};
/**
* @summary Update a dynamic customer segment
*/
export declare const useUpdateAdminCustomerSegment: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminCustomerSegment>>, TError, UpdateAdminCustomerSegmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminCustomerSegment>>, TError, UpdateAdminCustomerSegmentMutationVariables, TContext>;
export declare const getArchiveAdminCustomerSegmentUrl: (id: number) => string;
/**
 * @summary Archive a customer segment
 */
export declare const archiveAdminCustomerSegment: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getArchiveAdminCustomerSegmentMutationKey: () => readonly ["archiveAdminCustomerSegment"];
export declare const getArchiveAdminCustomerSegmentMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof archiveAdminCustomerSegment>>, TError, ArchiveAdminCustomerSegmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof archiveAdminCustomerSegment>>, TError, ArchiveAdminCustomerSegmentMutationVariables, TContext>;
export type ArchiveAdminCustomerSegmentMutationResult = NonNullable<Awaited<ReturnType<typeof archiveAdminCustomerSegment>>>;
export type ArchiveAdminCustomerSegmentMutationError = ErrorType<ApiError>;
export type ArchiveAdminCustomerSegmentMutationVariables = {
    id: number;
};
/**
* @summary Archive a customer segment
*/
export declare const useArchiveAdminCustomerSegment: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof archiveAdminCustomerSegment>>, TError, ArchiveAdminCustomerSegmentMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof archiveAdminCustomerSegment>>, TError, ArchiveAdminCustomerSegmentMutationVariables, TContext>;
export declare const getListAdminProductsUrl: (params?: ListAdminProductsParams) => string;
/**
 * @summary List all products with stock levels
 */
export declare const listAdminProducts: (params?: ListAdminProductsParams, options?: Parameters<typeof customFetch>[1]) => Promise<AdminProduct[]>;
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
export declare const getUpdateProductInventoryUrl: (id: number) => string;
/**
 * @summary Update product stock level and threshold
 */
export declare const updateProductInventory: (id: number, inventoryUpdate: InventoryUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<AdminProduct>;
export declare const getUpdateProductInventoryMutationKey: () => readonly ["updateProductInventory"];
export declare const getUpdateProductInventoryMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductInventory>>, TError, UpdateProductInventoryMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProductInventory>>, TError, UpdateProductInventoryMutationVariables, TContext>;
export type UpdateProductInventoryMutationResult = NonNullable<Awaited<ReturnType<typeof updateProductInventory>>>;
export type UpdateProductInventoryMutationBody = BodyType<InventoryUpdate>;
export type UpdateProductInventoryMutationError = ErrorType<ApiError>;
export type UpdateProductInventoryMutationVariables = {
    id: number;
    data: BodyType<InventoryUpdate>;
};
/**
* @summary Update product stock level and threshold
*/
export declare const useUpdateProductInventory: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductInventory>>, TError, UpdateProductInventoryMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProductInventory>>, TError, UpdateProductInventoryMutationVariables, TContext>;
export declare const getUpdateProductVisibilityUrl: (id: number) => string;
/**
 * @summary Toggle product published/draft status
 */
export declare const updateProductVisibility: (id: number, visibilityUpdate: VisibilityUpdate, options?: Parameters<typeof customFetch>[1]) => Promise<AdminProduct>;
export declare const getUpdateProductVisibilityMutationKey: () => readonly ["updateProductVisibility"];
export declare const getUpdateProductVisibilityMutationOptions: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductVisibility>>, TError, UpdateProductVisibilityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateProductVisibility>>, TError, UpdateProductVisibilityMutationVariables, TContext>;
export type UpdateProductVisibilityMutationResult = NonNullable<Awaited<ReturnType<typeof updateProductVisibility>>>;
export type UpdateProductVisibilityMutationBody = BodyType<VisibilityUpdate>;
export type UpdateProductVisibilityMutationError = ErrorType<unknown>;
export type UpdateProductVisibilityMutationVariables = {
    id: number;
    data: BodyType<VisibilityUpdate>;
};
/**
* @summary Toggle product published/draft status
*/
export declare const useUpdateProductVisibility: <TError = ErrorType<unknown>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateProductVisibility>>, TError, UpdateProductVisibilityMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateProductVisibility>>, TError, UpdateProductVisibilityMutationVariables, TContext>;
export declare const getListAdminDiscountsUrl: () => string;
/**
 * @summary List all discount codes
 */
export declare const listAdminDiscounts: (options?: Parameters<typeof customFetch>[1]) => Promise<DiscountCode[]>;
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
export declare const getCreateAdminDiscountUrl: () => string;
/**
 * @summary Create a new discount code
 */
export declare const createAdminDiscount: (discountCodeInput: DiscountCodeInput, options?: Parameters<typeof customFetch>[1]) => Promise<DiscountCode>;
export declare const getCreateAdminDiscountMutationKey: () => readonly ["createAdminDiscount"];
export declare const getCreateAdminDiscountMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminDiscount>>, TError, CreateAdminDiscountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createAdminDiscount>>, TError, CreateAdminDiscountMutationVariables, TContext>;
export type CreateAdminDiscountMutationResult = NonNullable<Awaited<ReturnType<typeof createAdminDiscount>>>;
export type CreateAdminDiscountMutationBody = BodyType<DiscountCodeInput>;
export type CreateAdminDiscountMutationError = ErrorType<ApiError>;
export type CreateAdminDiscountMutationVariables = {
    data: BodyType<DiscountCodeInput>;
};
/**
* @summary Create a new discount code
*/
export declare const useCreateAdminDiscount: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createAdminDiscount>>, TError, CreateAdminDiscountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createAdminDiscount>>, TError, CreateAdminDiscountMutationVariables, TContext>;
export declare const getUpdateAdminDiscountUrl: (id: number) => string;
/**
 * @summary Update a discount code
 */
export declare const updateAdminDiscount: (id: number, discountCodePatch: DiscountCodePatch, options?: Parameters<typeof customFetch>[1]) => Promise<DiscountCode>;
export declare const getUpdateAdminDiscountMutationKey: () => readonly ["updateAdminDiscount"];
export declare const getUpdateAdminDiscountMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, UpdateAdminDiscountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, UpdateAdminDiscountMutationVariables, TContext>;
export type UpdateAdminDiscountMutationResult = NonNullable<Awaited<ReturnType<typeof updateAdminDiscount>>>;
export type UpdateAdminDiscountMutationBody = BodyType<DiscountCodePatch>;
export type UpdateAdminDiscountMutationError = ErrorType<ApiError>;
export type UpdateAdminDiscountMutationVariables = {
    id: number;
    data: BodyType<DiscountCodePatch>;
};
/**
* @summary Update a discount code
*/
export declare const useUpdateAdminDiscount: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, UpdateAdminDiscountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateAdminDiscount>>, TError, UpdateAdminDiscountMutationVariables, TContext>;
export declare const getDeleteAdminDiscountUrl: (id: number) => string;
/**
 * @summary Delete a discount code
 */
export declare const deleteAdminDiscount: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteAdminDiscountMutationKey: () => readonly ["deleteAdminDiscount"];
export declare const getDeleteAdminDiscountMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, DeleteAdminDiscountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, DeleteAdminDiscountMutationVariables, TContext>;
export type DeleteAdminDiscountMutationResult = NonNullable<Awaited<ReturnType<typeof deleteAdminDiscount>>>;
export type DeleteAdminDiscountMutationError = ErrorType<ApiError>;
export type DeleteAdminDiscountMutationVariables = {
    id: number;
};
/**
* @summary Delete a discount code
*/
export declare const useDeleteAdminDiscount: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, DeleteAdminDiscountMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteAdminDiscount>>, TError, DeleteAdminDiscountMutationVariables, TContext>;
export declare const getListCatalogProductsUrl: (params?: ListCatalogProductsParams) => string;
/**
 * @summary List all products in the catalog
 */
export declare const listCatalogProducts: (params?: ListCatalogProductsParams, options?: Parameters<typeof customFetch>[1]) => Promise<CatalogProduct[]>;
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
export declare const getCreateCatalogProductUrl: () => string;
/**
 * @summary Create a new product
 */
export declare const createCatalogProduct: (catalogProductInput: CatalogProductInput, options?: Parameters<typeof customFetch>[1]) => Promise<CatalogProduct>;
export declare const getCreateCatalogProductMutationKey: () => readonly ["createCatalogProduct"];
export declare const getCreateCatalogProductMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCatalogProduct>>, TError, CreateCatalogProductMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof createCatalogProduct>>, TError, CreateCatalogProductMutationVariables, TContext>;
export type CreateCatalogProductMutationResult = NonNullable<Awaited<ReturnType<typeof createCatalogProduct>>>;
export type CreateCatalogProductMutationBody = BodyType<CatalogProductInput>;
export type CreateCatalogProductMutationError = ErrorType<ApiError>;
export type CreateCatalogProductMutationVariables = {
    data: BodyType<CatalogProductInput>;
};
/**
* @summary Create a new product
*/
export declare const useCreateCatalogProduct: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof createCatalogProduct>>, TError, CreateCatalogProductMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof createCatalogProduct>>, TError, CreateCatalogProductMutationVariables, TContext>;
export declare const getDisableCatalogProductsWithoutJanoshikReportUrl: () => string;
/**
 * @summary Disable catalog products without a Janoshik report
 */
export declare const disableCatalogProductsWithoutJanoshikReport: (options?: Parameters<typeof customFetch>[1]) => Promise<DisableCatalogProductsWithoutJanoshikReportResponse>;
export declare const getDisableCatalogProductsWithoutJanoshikReportMutationKey: () => readonly ["disableCatalogProductsWithoutJanoshikReport"];
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
export declare const getEnableAllPeptideCatalogProductsUrl: () => string;
/**
 * @summary Re-enable all peptide products in the catalog
 */
export declare const enableAllPeptideCatalogProducts: (options?: Parameters<typeof customFetch>[1]) => Promise<EnableAllPeptideCatalogProductsResponse>;
export declare const getEnableAllPeptideCatalogProductsMutationKey: () => readonly ["enableAllPeptideCatalogProducts"];
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
export declare const getPreviewCatalogPriceSyncUrl: () => string;
/**
 * @summary Preview a slug-keyed price-only catalogue sync
 */
export declare const previewCatalogPriceSync: (catalogPriceSyncPreviewRequest: CatalogPriceSyncPreviewRequest, options?: Parameters<typeof customFetch>[1]) => Promise<CatalogPriceSyncPreview>;
export declare const getPreviewCatalogPriceSyncMutationKey: () => readonly ["previewCatalogPriceSync"];
export declare const getPreviewCatalogPriceSyncMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, PreviewCatalogPriceSyncMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, PreviewCatalogPriceSyncMutationVariables, TContext>;
export type PreviewCatalogPriceSyncMutationResult = NonNullable<Awaited<ReturnType<typeof previewCatalogPriceSync>>>;
export type PreviewCatalogPriceSyncMutationBody = BodyType<CatalogPriceSyncPreviewRequest>;
export type PreviewCatalogPriceSyncMutationError = ErrorType<ApiError>;
export type PreviewCatalogPriceSyncMutationVariables = {
    data: BodyType<CatalogPriceSyncPreviewRequest>;
};
/**
* @summary Preview a slug-keyed price-only catalogue sync
*/
export declare const usePreviewCatalogPriceSync: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, PreviewCatalogPriceSyncMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof previewCatalogPriceSync>>, TError, PreviewCatalogPriceSyncMutationVariables, TContext>;
export declare const getApplyCatalogPriceSyncUrl: () => string;
/**
 * @summary Apply an explicitly confirmed price-only catalogue sync
 */
export declare const applyCatalogPriceSync: (catalogPriceSyncApplyRequest: CatalogPriceSyncApplyRequest, options?: Parameters<typeof customFetch>[1]) => Promise<CatalogPriceSyncApplyResponse>;
export declare const getApplyCatalogPriceSyncMutationKey: () => readonly ["applyCatalogPriceSync"];
export declare const getApplyCatalogPriceSyncMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, ApplyCatalogPriceSyncMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, ApplyCatalogPriceSyncMutationVariables, TContext>;
export type ApplyCatalogPriceSyncMutationResult = NonNullable<Awaited<ReturnType<typeof applyCatalogPriceSync>>>;
export type ApplyCatalogPriceSyncMutationBody = BodyType<CatalogPriceSyncApplyRequest>;
export type ApplyCatalogPriceSyncMutationError = ErrorType<ApiError>;
export type ApplyCatalogPriceSyncMutationVariables = {
    data: BodyType<CatalogPriceSyncApplyRequest>;
};
/**
* @summary Apply an explicitly confirmed price-only catalogue sync
*/
export declare const useApplyCatalogPriceSync: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, ApplyCatalogPriceSyncMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof applyCatalogPriceSync>>, TError, ApplyCatalogPriceSyncMutationVariables, TContext>;
export declare const getGetCatalogProductUrl: (id: number) => string;
/**
 * @summary Get a single catalog product
 */
export declare const getCatalogProduct: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<CatalogProduct>;
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
export declare const getUpdateCatalogProductUrl: (id: number) => string;
/**
 * @summary Update a catalog product
 */
export declare const updateCatalogProduct: (id: number, catalogProductPatch: CatalogProductPatch, options?: Parameters<typeof customFetch>[1]) => Promise<CatalogProduct>;
export declare const getUpdateCatalogProductMutationKey: () => readonly ["updateCatalogProduct"];
export declare const getUpdateCatalogProductMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, UpdateCatalogProductMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, UpdateCatalogProductMutationVariables, TContext>;
export type UpdateCatalogProductMutationResult = NonNullable<Awaited<ReturnType<typeof updateCatalogProduct>>>;
export type UpdateCatalogProductMutationBody = BodyType<CatalogProductPatch>;
export type UpdateCatalogProductMutationError = ErrorType<ApiError>;
export type UpdateCatalogProductMutationVariables = {
    id: number;
    data: BodyType<CatalogProductPatch>;
};
/**
* @summary Update a catalog product
*/
export declare const useUpdateCatalogProduct: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, UpdateCatalogProductMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof updateCatalogProduct>>, TError, UpdateCatalogProductMutationVariables, TContext>;
export declare const getDeleteCatalogProductUrl: (id: number) => string;
/**
 * @summary Delete a catalog product
 */
export declare const deleteCatalogProduct: (id: number, options?: Parameters<typeof customFetch>[1]) => Promise<void>;
export declare const getDeleteCatalogProductMutationKey: () => readonly ["deleteCatalogProduct"];
export declare const getDeleteCatalogProductMutationOptions: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, DeleteCatalogProductMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationOptions<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, DeleteCatalogProductMutationVariables, TContext>;
export type DeleteCatalogProductMutationResult = NonNullable<Awaited<ReturnType<typeof deleteCatalogProduct>>>;
export type DeleteCatalogProductMutationError = ErrorType<ApiError>;
export type DeleteCatalogProductMutationVariables = {
    id: number;
};
/**
* @summary Delete a catalog product
*/
export declare const useDeleteCatalogProduct: <TError = ErrorType<ApiError>, TContext = unknown>(options?: {
    mutation?: UseMutationOptions<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, DeleteCatalogProductMutationVariables, TContext>;
    request?: SecondParameter<typeof customFetch>;
}) => UseMutationResult<Awaited<ReturnType<typeof deleteCatalogProduct>>, TError, DeleteCatalogProductMutationVariables, TContext>;
export declare const getListPublicProductsUrl: (params?: ListPublicProductsParams) => string;
/**
 * @summary List published products for the storefront
 */
export declare const listPublicProducts: (params?: ListPublicProductsParams, options?: Parameters<typeof customFetch>[1]) => Promise<PublicProduct[]>;
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
export declare const getGetPublicProductUrl: (slug: string) => string;
/**
 * @summary Get a single published product by slug
 */
export declare const getPublicProduct: (slug: string, options?: Parameters<typeof customFetch>[1]) => Promise<PublicProductDetail>;
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