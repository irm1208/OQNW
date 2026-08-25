--
-- PostgreSQL database dump
--

\restrict gimyoF4eDJCLw7TfHGecw5HDGDGf95ZknQelptydGK1Hil0wl2Dz9o3CEpLVGg3

-- Dumped from database version 16.14 (9e89e5a)
-- Dumped by pg_dump version 16.10

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: abandoned_carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.abandoned_carts (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    customer_email text NOT NULL,
    customer_name text NOT NULL,
    items_json text NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    email_sent_at timestamp with time zone,
    converted_at timestamp with time zone
);


--
-- Name: abandoned_carts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.abandoned_carts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: abandoned_carts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.abandoned_carts_id_seq OWNED BY public.abandoned_carts.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admin_users (
    id integer NOT NULL,
    email text NOT NULL,
    name text NOT NULL,
    password_hash text NOT NULL,
    role text DEFAULT 'viewer'::text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    last_login_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admin_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admin_users_id_seq OWNED BY public.admin_users.id;


--
-- Name: blocked_ips; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blocked_ips (
    id integer NOT NULL,
    ip text NOT NULL,
    reason text,
    blocked_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blocked_ips_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blocked_ips_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blocked_ips_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blocked_ips_id_seq OWNED BY public.blocked_ips.id;


--
-- Name: blog_posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.blog_posts (
    id integer NOT NULL,
    title text NOT NULL,
    slug text NOT NULL,
    excerpt text,
    content text DEFAULT ''::text NOT NULL,
    author text DEFAULT 'OmniQure Team'::text NOT NULL,
    tags text[] DEFAULT '{}'::text[] NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    featured_image_url text,
    seo_title text,
    seo_description text,
    published_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.blog_posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: blog_posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.blog_posts_id_seq OWNED BY public.blog_posts.id;


--
-- Name: customer_credit_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_credit_transactions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    amount_pence integer NOT NULL,
    type text NOT NULL,
    reason text NOT NULL,
    admin_note text,
    order_id integer,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: customer_credit_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_credit_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_credit_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_credit_transactions_id_seq OWNED BY public.customer_credit_transactions.id;


--
-- Name: customer_credits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customer_credits (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    balance_pence integer DEFAULT 0 NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: customer_credits_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customer_credits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customer_credits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customer_credits_id_seq OWNED BY public.customer_credits.id;


--
-- Name: customers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.customers (
    id integer NOT NULL,
    email text NOT NULL,
    first_name text NOT NULL,
    last_name text NOT NULL,
    password_hash text,
    phone text,
    address1 text,
    address2 text,
    city text,
    county text,
    postcode text,
    country text,
    total_orders integer DEFAULT 0 NOT NULL,
    total_spend_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    reset_token text,
    reset_token_expires_at timestamp with time zone,
    referral_code text,
    referred_by text,
    referral_credit_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    last_seen_ip text,
    last_seen_country text,
    known_ips text[],
    referral_abuse_flag boolean DEFAULT false NOT NULL
);


--
-- Name: customers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.customers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: customers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.customers_id_seq OWNED BY public.customers.id;


--
-- Name: discount_codes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discount_codes (
    id integer NOT NULL,
    code text NOT NULL,
    type text NOT NULL,
    value numeric(10,2) NOT NULL,
    min_spend numeric(10,2),
    usage_limit integer,
    usage_count integer DEFAULT 0 NOT NULL,
    expires_at timestamp with time zone,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: discount_codes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.discount_codes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: discount_codes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.discount_codes_id_seq OWNED BY public.discount_codes.id;


--
-- Name: email_logs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.email_logs (
    id integer NOT NULL,
    to_email text NOT NULL,
    subject text NOT NULL,
    type text NOT NULL,
    status text DEFAULT 'sent'::text NOT NULL,
    resend_id text,
    order_number text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: email_logs_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.email_logs_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: email_logs_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.email_logs_id_seq OWNED BY public.email_logs.id;


--
-- Name: inventory_audit_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.inventory_audit_log (
    id integer NOT NULL,
    product_id integer NOT NULL,
    product_name text NOT NULL,
    change_type text NOT NULL,
    quantity_before integer NOT NULL,
    quantity_after integer NOT NULL,
    quantity_change integer NOT NULL,
    reason text,
    reference_id text,
    reference_type text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: inventory_audit_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.inventory_audit_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: inventory_audit_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.inventory_audit_log_id_seq OWNED BY public.inventory_audit_log.id;


--
-- Name: loyalty_transactions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.loyalty_transactions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    order_id integer,
    type character varying(20) NOT NULL,
    points integer NOT NULL,
    description text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL
);


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.loyalty_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.loyalty_transactions_id_seq OWNED BY public.loyalty_transactions.id;


--
-- Name: newsletter_subscribers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.newsletter_subscribers (
    id integer NOT NULL,
    email character varying(255) NOT NULL,
    first_name character varying(100),
    is_active boolean DEFAULT true NOT NULL,
    source character varying(50) DEFAULT 'website'::character varying NOT NULL,
    subscribed_at timestamp without time zone DEFAULT now() NOT NULL,
    unsubscribed_at timestamp without time zone
);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.newsletter_subscribers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.newsletter_subscribers_id_seq OWNED BY public.newsletter_subscribers.id;


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id integer NOT NULL,
    order_id integer NOT NULL,
    product_id integer NOT NULL,
    product_name text NOT NULL,
    product_category text NOT NULL,
    quantity integer DEFAULT 1 NOT NULL,
    price_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: order_items_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.order_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: order_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.order_items_id_seq OWNED BY public.order_items.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    order_number text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    customer_email text NOT NULL,
    customer_name text NOT NULL,
    customer_id integer,
    phone text,
    address1 text,
    address2 text,
    city text,
    county text,
    postcode text,
    country text,
    subtotal_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    bundle_discount_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    shipping_cost_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    tax_amount_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    total_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    refunded_amount_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    refund_status text DEFAULT 'none'::text NOT NULL,
    shipping_method text,
    shipping_rate_id integer,
    tracking_number text,
    notes text,
    fraud_score integer DEFAULT 0 NOT NULL,
    fraud_flags text[] DEFAULT '{}'::text[] NOT NULL,
    fraud_reviewed boolean DEFAULT false NOT NULL,
    fraud_review_note text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    review_request_sent_at timestamp with time zone
);


--
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- Name: product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_reviews (
    id integer NOT NULL,
    product_id integer NOT NULL,
    customer_id integer NOT NULL,
    customer_name text NOT NULL,
    rating integer NOT NULL,
    title text NOT NULL,
    body text NOT NULL,
    is_approved boolean DEFAULT false NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.product_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: product_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.product_reviews_id_seq OWNED BY public.product_reviews.id;


--
-- Name: products_catalog; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_catalog (
    id integer NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    category text NOT NULL,
    price_gbp numeric(10,2),
    short_description text,
    description text,
    image_url text,
    purity text,
    also_known_as text,
    molecular_weight text,
    cas_number text,
    formula text,
    sequence text,
    storage text,
    appearance text,
    solubility text,
    half_life text,
    coa_url text,
    ms_image_url text,
    is_published boolean DEFAULT true NOT NULL,
    is_featured boolean DEFAULT false NOT NULL,
    sort_order integer DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: products_catalog_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_catalog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_catalog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_catalog_id_seq OWNED BY public.products_catalog.id;


--
-- Name: products_inventory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.products_inventory (
    id integer NOT NULL,
    product_id integer NOT NULL,
    product_name text NOT NULL,
    product_category text NOT NULL,
    product_image text,
    stock_level integer DEFAULT 100 NOT NULL,
    low_stock_threshold integer DEFAULT 10 NOT NULL,
    is_published boolean DEFAULT true NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: products_inventory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.products_inventory_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: products_inventory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.products_inventory_id_seq OWNED BY public.products_inventory.id;


--
-- Name: refunds_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refunds_log (
    id integer NOT NULL,
    order_id integer NOT NULL,
    order_number text NOT NULL,
    amount_gbp numeric(10,2) NOT NULL,
    type text DEFAULT 'partial'::text NOT NULL,
    reason text NOT NULL,
    notes text,
    restore_inventory boolean DEFAULT false NOT NULL,
    line_items_json text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refunds_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refunds_log_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refunds_log_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refunds_log_id_seq OWNED BY public.refunds_log.id;


--
-- Name: returns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.returns (
    id integer NOT NULL,
    order_id integer NOT NULL,
    order_number text NOT NULL,
    customer_name text NOT NULL,
    customer_email text NOT NULL,
    reason text NOT NULL,
    status text DEFAULT 'requested'::text NOT NULL,
    refund_amount_gbp numeric(10,2),
    admin_notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: returns_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.returns_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: returns_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.returns_id_seq OWNED BY public.returns.id;


--
-- Name: shipping_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_rates (
    id integer NOT NULL,
    zone_id integer NOT NULL,
    name text NOT NULL,
    carrier text DEFAULT 'Royal Mail'::text NOT NULL,
    price_gbp numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    free_above_gbp numeric(10,2),
    estimated_days_min integer DEFAULT 2 NOT NULL,
    estimated_days_max integer DEFAULT 5 NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: shipping_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_rates_id_seq OWNED BY public.shipping_rates.id;


--
-- Name: shipping_zones; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.shipping_zones (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    country_codes text[] DEFAULT '{}'::text[] NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: shipping_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.shipping_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: shipping_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.shipping_zones_id_seq OWNED BY public.shipping_zones.id;


--
-- Name: stock_alerts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock_alerts (
    id integer NOT NULL,
    product_id integer NOT NULL,
    product_name text NOT NULL,
    customer_email text NOT NULL,
    customer_name text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    notified_at timestamp with time zone
);


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.stock_alerts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.stock_alerts_id_seq OWNED BY public.stock_alerts.id;


--
-- Name: store_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.store_settings (
    id integer NOT NULL,
    store_name text DEFAULT 'OmniQure'::text NOT NULL,
    support_email text,
    support_phone text,
    currency text DEFAULT 'GBP'::text NOT NULL,
    order_prefix text DEFAULT 'OQ'::text NOT NULL,
    address_line1 text,
    address_line2 text,
    city text,
    postcode text,
    country text,
    announcement_banner text,
    maintenance_mode boolean DEFAULT false NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: store_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.store_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: store_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.store_settings_id_seq OWNED BY public.store_settings.id;


--
-- Name: subscriptions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.subscriptions (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    items_json text NOT NULL,
    interval_days integer DEFAULT 30 NOT NULL,
    next_renewal_at timestamp with time zone NOT NULL,
    discount_pct integer DEFAULT 5 NOT NULL,
    status text DEFAULT 'active'::text NOT NULL,
    paused_at timestamp with time zone,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.subscriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: subscriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.subscriptions_id_seq OWNED BY public.subscriptions.id;


--
-- Name: tax_rates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tax_rates (
    id integer NOT NULL,
    name text NOT NULL,
    country_code text NOT NULL,
    country_name text NOT NULL,
    region text,
    rate numeric(6,4) NOT NULL,
    is_inclusive boolean DEFAULT true NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: tax_rates_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tax_rates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tax_rates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tax_rates_id_seq OWNED BY public.tax_rates.id;


--
-- Name: webhook_deliveries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhook_deliveries (
    id integer NOT NULL,
    webhook_id integer NOT NULL,
    event_type text NOT NULL,
    payload_json text NOT NULL,
    status text DEFAULT 'pending'::text NOT NULL,
    response_code integer,
    response_body text,
    attempted_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.webhook_deliveries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.webhook_deliveries_id_seq OWNED BY public.webhook_deliveries.id;


--
-- Name: webhooks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.webhooks (
    id integer NOT NULL,
    url text NOT NULL,
    events text[] DEFAULT '{}'::text[] NOT NULL,
    secret text NOT NULL,
    is_active boolean DEFAULT true NOT NULL,
    description text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: webhooks_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.webhooks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: webhooks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.webhooks_id_seq OWNED BY public.webhooks.id;


--
-- Name: wishlists; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wishlists (
    id integer NOT NULL,
    customer_id integer NOT NULL,
    product_id integer NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: wishlists_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.wishlists_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: wishlists_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.wishlists_id_seq OWNED BY public.wishlists.id;


--
-- Name: abandoned_carts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abandoned_carts ALTER COLUMN id SET DEFAULT nextval('public.abandoned_carts_id_seq'::regclass);


--
-- Name: admin_users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users ALTER COLUMN id SET DEFAULT nextval('public.admin_users_id_seq'::regclass);


--
-- Name: blocked_ips id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_ips ALTER COLUMN id SET DEFAULT nextval('public.blocked_ips_id_seq'::regclass);


--
-- Name: blog_posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts ALTER COLUMN id SET DEFAULT nextval('public.blog_posts_id_seq'::regclass);


--
-- Name: customer_credit_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_credit_transactions ALTER COLUMN id SET DEFAULT nextval('public.customer_credit_transactions_id_seq'::regclass);


--
-- Name: customer_credits id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_credits ALTER COLUMN id SET DEFAULT nextval('public.customer_credits_id_seq'::regclass);


--
-- Name: customers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers ALTER COLUMN id SET DEFAULT nextval('public.customers_id_seq'::regclass);


--
-- Name: discount_codes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_codes ALTER COLUMN id SET DEFAULT nextval('public.discount_codes_id_seq'::regclass);


--
-- Name: email_logs id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs ALTER COLUMN id SET DEFAULT nextval('public.email_logs_id_seq'::regclass);


--
-- Name: inventory_audit_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_audit_log ALTER COLUMN id SET DEFAULT nextval('public.inventory_audit_log_id_seq'::regclass);


--
-- Name: loyalty_transactions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_transactions ALTER COLUMN id SET DEFAULT nextval('public.loyalty_transactions_id_seq'::regclass);


--
-- Name: newsletter_subscribers id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers ALTER COLUMN id SET DEFAULT nextval('public.newsletter_subscribers_id_seq'::regclass);


--
-- Name: order_items id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items ALTER COLUMN id SET DEFAULT nextval('public.order_items_id_seq'::regclass);


--
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- Name: product_reviews id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews ALTER COLUMN id SET DEFAULT nextval('public.product_reviews_id_seq'::regclass);


--
-- Name: products_catalog id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_catalog ALTER COLUMN id SET DEFAULT nextval('public.products_catalog_id_seq'::regclass);


--
-- Name: products_inventory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_inventory ALTER COLUMN id SET DEFAULT nextval('public.products_inventory_id_seq'::regclass);


--
-- Name: refunds_log id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds_log ALTER COLUMN id SET DEFAULT nextval('public.refunds_log_id_seq'::regclass);


--
-- Name: returns id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns ALTER COLUMN id SET DEFAULT nextval('public.returns_id_seq'::regclass);


--
-- Name: shipping_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates ALTER COLUMN id SET DEFAULT nextval('public.shipping_rates_id_seq'::regclass);


--
-- Name: shipping_zones id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zones ALTER COLUMN id SET DEFAULT nextval('public.shipping_zones_id_seq'::regclass);


--
-- Name: stock_alerts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts ALTER COLUMN id SET DEFAULT nextval('public.stock_alerts_id_seq'::regclass);


--
-- Name: store_settings id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_settings ALTER COLUMN id SET DEFAULT nextval('public.store_settings_id_seq'::regclass);


--
-- Name: subscriptions id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions ALTER COLUMN id SET DEFAULT nextval('public.subscriptions_id_seq'::regclass);


--
-- Name: tax_rates id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rates ALTER COLUMN id SET DEFAULT nextval('public.tax_rates_id_seq'::regclass);


--
-- Name: webhook_deliveries id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries ALTER COLUMN id SET DEFAULT nextval('public.webhook_deliveries_id_seq'::regclass);


--
-- Name: webhooks id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks ALTER COLUMN id SET DEFAULT nextval('public.webhooks_id_seq'::regclass);


--
-- Name: wishlists id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists ALTER COLUMN id SET DEFAULT nextval('public.wishlists_id_seq'::regclass);


--
-- Data for Name: abandoned_carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.abandoned_carts (id, customer_id, customer_email, customer_name, items_json, updated_at, email_sent_at, converted_at) FROM stdin;
\.


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admin_users (id, email, name, password_hash, role, is_active, last_login_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: blocked_ips; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blocked_ips (id, ip, reason, blocked_at) FROM stdin;
\.


--
-- Data for Name: blog_posts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.blog_posts (id, title, slug, excerpt, content, author, tags, status, featured_image_url, seo_title, seo_description, published_at, created_at, updated_at) FROM stdin;
1	KPV: The Anti-Inflammatory Tripeptide in Preclinical Research	kpv-peptide-research	KPV (Lys-Pro-Val) is a C-terminal fragment of α-MSH that retains anti-inflammatory, antimicrobial, and gut-protective properties without melanocortin receptor-mediated side effects.	## What is KPV?\n\nKPV is a tripeptide consisting of lysine, proline, and valine — the C-terminal three amino acids of α-melanocyte-stimulating hormone (α-MSH). It was identified as the minimal sequence required for many of α-MSH's anti-inflammatory properties, while lacking the melanocortin receptor activity responsible for pigmentation and other central effects.\n\n## Anti-Inflammatory Mechanisms\n\nKPV's anti-inflammatory activity operates through several converging pathways:\n\n- **NF-κB inhibition**: KPV directly inhibits NF-κB nuclear translocation in macrophages and epithelial cells, reducing transcription of pro-inflammatory cytokines including IL-1β, IL-6, and TNF-α.\n- **Direct cell entry**: Unlike most peptides, KPV has been shown to enter cells and interact with intracellular inflammatory signalling machinery.\n- **MC receptor-independent**: Activity persists even when melanocortin receptors are blocked, confirming a distinct mechanism.\n\n## Gastrointestinal Research\n\nKPV has attracted significant interest in inflammatory bowel disease (IBD) models:\n\n- Reduced colonic inflammation and mucosal damage in murine colitis models\n- Oral and rectal administration both demonstrate local intestinal anti-inflammatory effects\n- Nanoparticle-encapsulated KPV has been studied for targeted colon delivery, improving stability and bioavailability\n\n## Antimicrobial Properties\n\nKPV demonstrates direct antimicrobial activity against several pathogens including *Staphylococcus aureus* and *Candida albicans*, suggesting a dual role in infection-associated inflammation.\n\n## Research Considerations\n\nKPV is a research compound with no approved therapeutic applications. Its short sequence and good aqueous solubility make it straightforward to reconstitute and work with in cell culture and animal models.\n\n## Conclusion\n\nKPV represents a well-characterised anti-inflammatory tripeptide with a mechanistically distinct profile from glucocorticoids and NSAIDs. Its intestinal research applications and intracellular signalling access make it a compelling tool for inflammatory disease research.	OmniQure Research Team	{KPV,Anti-Inflammatory,NF-κB,IBD,α-MSH}	published	https://cdn.pixabay.com/photo/2020/03/22/13/01/virus-4957673_640.jpg	KPV Anti-Inflammatory Tripeptide Research | OmniQure	Overview of KPV peptide research covering NF-κB inhibition, gastrointestinal models, antimicrobial activity, and its mechanistic distinction from α-MSH.	2026-05-01 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
2	5-Amino-1MQ: NNMT Inhibition, NAD⁺ Metabolism and Fat Mass Research	5-amino-1mq-nnmt-inhibitor	5-Amino-1MQ is a selective inhibitor of nicotinamide N-methyltransferase (NNMT), an enzyme increasingly linked to obesity, metabolic dysfunction, and cellular energy regulation.	## Background\n\n5-Amino-1-methylquinolinium (5-Amino-1MQ) is a small molecule that selectively inhibits nicotinamide N-methyltransferase (NNMT) — an enzyme that methylates nicotinamide, diverting it from NAD⁺ biosynthesis. NNMT is overexpressed in adipose tissue and several cancer types, making it an emerging target in metabolic research.\n\n## NNMT Biology\n\nNNMT consumes S-adenosylmethionine (SAM) to methylate nicotinamide, producing 1-methylnicotinamide (MNA). This has two consequences:\n1. Reduced availability of nicotinamide for NAD⁺ synthesis\n2. Depletion of SAM, affecting the methyl donor pool used in epigenetic regulation\n\nNNMT activity is elevated in obesity and type 2 diabetes, and correlates with adipogenesis and insulin resistance in preclinical models.\n\n## Metabolic Research Findings\n\nStudies in rodent models with 5-Amino-1MQ have reported:\n\n- **Reduced fat mass**: Decreased white adipose tissue without changes in food intake\n- **Increased energy expenditure**: Upregulation of thermogenic gene expression in brown and beige fat\n- **Improved insulin sensitivity**: Reduction in fasting glucose and insulin in diet-induced obesity models\n- **NAD⁺ restoration**: Increased intracellular NAD⁺ levels secondary to NNMT inhibition\n\n## Mechanism of Fat Loss\n\nThe proposed mechanism involves NNMT inhibition → increased nicotinamide → increased NAD⁺ → SIRT1 and SIRT3 activation → enhanced mitochondrial biogenesis and fatty acid oxidation. This makes 5-Amino-1MQ mechanistically distinct from direct lipolytic agents.\n\n## Research Considerations\n\n5-Amino-1MQ is a selective tool compound for NNMT research. Its stability and cell permeability make it suitable for in vitro NNMT inhibition assays. Researchers should note that NNMT has also been studied in cancer biology, making this compound potentially relevant across therapeutic areas.\n\n## Conclusion\n\n5-Amino-1MQ provides a selective pharmacological probe for investigating NNMT's role in metabolic disease, offering mechanistic insights into the NAD⁺/SAM axis and adipose tissue biology.	OmniQure Research Team	{5-Amino-1MQ,NNMT,NAD+,Metabolism,"Fat Loss"}	published	https://cdn.pixabay.com/photo/2018/07/11/21/51/formula-3530682_640.jpg	5-Amino-1MQ NNMT Inhibitor Metabolic Research | OmniQure	Research overview of 5-Amino-1MQ, covering NNMT inhibition, NAD+ restoration, fat mass reduction, and metabolic findings in preclinical models.	2026-05-02 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
3	MOTS-C: The Mitochondrial-Derived Peptide in Metabolic Research	mots-c-mitochondrial-peptide	MOTS-C is a 16-amino acid peptide encoded by the mitochondrial genome, studied for its roles in insulin sensitivity, exercise mimicry, anti-ageing, and metabolic homeostasis.	## Discovery and Origin\n\nMOTS-C (Mitochondrial Open Reading Frame of the 12S rRNA-c) is unique among peptides in being encoded within the mitochondrial genome rather than the nuclear genome. It was identified in 2015 by Lee et al. and found to be secreted from mitochondria and cells, acting as a mitokine — a mitochondria-derived signalling molecule.\n\n## Metabolic Actions\n\nMOTS-C has been studied extensively in the context of metabolic disease:\n\n### Insulin Sensitivity\nMOTS-C activates AMPK and increases GLUT4 translocation in skeletal muscle, improving glucose uptake independent of insulin signalling. In rodent models, exogenous MOTS-C administration reversed diet-induced insulin resistance.\n\n### Exercise Mimicry\nEndogenous MOTS-C levels rise in response to exercise in both rodents and humans. The peptide appears to mediate some of the metabolic benefits of physical activity, including improved mitochondrial function and reduced adiposity.\n\n### AICAR Pathway\nMOTS-C promotes the accumulation of AICAR (5-aminoimidazole-4-carboxamide ribonucleotide), an AMPK activator, via inhibition of the folate cycle. This is a distinctive mechanistic feature not shared by other metabolic peptides.\n\n## Anti-Ageing Research\n\nMOTS-C levels decline with age. Supplementation in aged mice has shown:\n- Improved physical performance\n- Reduced metabolic dysfunction\n- Extended healthspan in some models\n\n## Stress Response\n\nMOTS-C translocates to the nucleus under stress conditions, where it regulates gene expression related to antioxidant defence and mitochondrial stress response pathways.\n\n## Conclusion\n\nMOTS-C represents a fascinating bridge between mitochondrial biology and systemic metabolic regulation. Its role as an exercise mimetic and insulin sensitiser makes it a valuable research tool in metabolic disease and ageing research.	OmniQure Research Team	{MOTS-C,Mitochondria,"Insulin Sensitivity",AMPK,Anti-Ageing}	published	https://cdn.pixabay.com/photo/2021/09/13/11/13/mitochondria-6621844_640.jpg	MOTS-C Mitochondrial Peptide Metabolic Research | OmniQure	Research overview of MOTS-C, the mitochondria-derived peptide, covering AMPK activation, insulin sensitivity, exercise mimicry, and anti-ageing findings.	2026-05-03 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
4	NAD+: Cellular Energy, DNA Repair and Longevity Research	nad-plus-cellular-energy	Nicotinamide adenine dinucleotide (NAD+) is a central coenzyme in cellular metabolism and a substrate for longevity-linked enzymes including sirtuins and PARPs. Its decline with age has made it a major target in geroscience research.	## The Centrality of NAD+\n\nNicotinamide adenine dinucleotide (NAD+) is one of the most abundant molecules in living cells, serving as a cofactor in over 500 enzymatic reactions. It exists in both oxidised (NAD+) and reduced (NADH) forms, cycling between them as electrons are transferred in metabolic reactions.\n\n## Key Biological Roles\n\n### Energy Metabolism\nNAD+ is essential to glycolysis, the tricarboxylic acid (TCA) cycle, and the electron transport chain. It accepts electrons from fuel oxidation and passes them to mitochondrial complex I, driving ATP synthesis.\n\n### Sirtuin Activation\nSirtuins (SIRT1–SIRT7) are NAD+-dependent deacylases that regulate gene expression, mitochondrial biogenesis, inflammation, and stress responses. SIRT1 and SIRT3 in particular are central to metabolic health and lifespan extension in model organisms.\n\n### PARP Activity\nPoly(ADP-ribose) polymerases (PARPs) consume NAD+ during DNA repair. Under conditions of high DNA damage, PARP hyperactivation can deplete NAD+ pools, impairing energy metabolism.\n\n### CD38 and NAD+ Decline\nCD38, an NAD+ hydrolase, increases with age and inflammation. CD38-mediated NAD+ consumption is a major driver of the age-related NAD+ decline observed across tissues.\n\n## Age-Related Decline\n\nNAD+ levels decline substantially with age — by as much as 50% between young and middle-aged adults in some tissues. This decline correlates with reduced mitochondrial function, impaired DNA repair, and increased inflammation.\n\n## Preclinical Research Findings\n\nNAD+ repletion in aged animal models has shown:\n- Improved mitochondrial function and exercise capacity\n- Enhanced cognitive performance\n- Reduced markers of inflammation and cellular senescence\n- Life extension in yeast, worms, and some mouse studies\n\n## Research Considerations\n\nNAD+ can be administered directly or via precursors (NMN, NR). Direct NAD+ has lower oral bioavailability than precursors, but injectable and IV administration bypasses this limitation for research purposes.\n\n## Conclusion\n\nNAD+ sits at the intersection of energy metabolism, genomic stability, and longevity signalling. Its decline with age and its role as a sirtuin substrate make it one of the most studied molecules in the geroscience field.	OmniQure Research Team	{NAD+,Sirtuins,"DNA Repair",Longevity,Mitochondria}	published	https://cdn.pixabay.com/photo/2017/02/14/04/13/dna-2064062_640.jpg	NAD+ Cellular Energy and Longevity Research | OmniQure	Comprehensive overview of NAD+ biology covering sirtuins, PARP, DNA repair, age-related decline, and longevity research findings.	2026-05-04 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
5	SS-31: Mitochondria-Targeted Peptide and Cardioprotection Research	ss-31-mitochondria-targeted-peptide	SS-31 (Elamipretide) is a synthetic tetrapeptide that targets the inner mitochondrial membrane, reducing oxidative stress and improving mitochondrial function in preclinical models of cardiac and renal disease.	## Background\n\nSS-31 (also known as Elamipretide or MTP-131) is a synthetic tetrapeptide with the sequence D-Arg-Dmt-Lys-Phe-NH2. It was developed by Hazel Szeto and Peter Schiller and belongs to the SS (Szeto-Schiller) peptide series. The inclusion of 2',6'-dimethyltyrosine (Dmt) gives it antioxidant properties and a distinctive pharmacological profile.\n\n## Mechanism: Cardiolipin Targeting\n\nSS-31's primary mechanism is selective binding to cardiolipin — a phospholipid found almost exclusively in the inner mitochondrial membrane. Cardiolipin interacts with and stabilises the mitochondrial electron transport chain complexes. In disease states, cardiolipin undergoes peroxidation, impairing electron transport and increasing reactive oxygen species (ROS) production.\n\nBy binding cardiolipin, SS-31:\n- Stabilises cristae structure\n- Prevents cytochrome c from becoming a peroxidase\n- Reduces electron leak and ROS generation\n- Restores electron transport efficiency\n\n## Cardiovascular Research\n\nSS-31 has been extensively studied in cardiac ischaemia-reperfusion (I/R) injury models:\n- Reduced infarct size when administered before or during reperfusion\n- Preserved ejection fraction in heart failure models\n- Improved mitochondrial morphology and reduced cardiomyocyte apoptosis\n- Clinical phase II trials (EMBRACE STEMI) have examined its use in ST-elevation MI\n\n## Renal Research\n\nIn models of acute kidney injury (AKI) and chronic kidney disease (CKD):\n- Reduced cisplatin- and ischaemia-induced tubular injury\n- Preserved mitochondrial function in proximal tubular cells\n- Reduced fibrosis in CKD models\n\n## Ageing and Skeletal Muscle\n\nSS-31 has shown efficacy in reversing age-related mitochondrial dysfunction in skeletal muscle, improving exercise capacity and reducing oxidative stress markers in aged rodents.\n\n## Conclusion\n\nSS-31 represents one of the most mechanistically well-defined mitochondria-targeted research peptides, with a substantial evidence base across cardiac, renal, and ageing biology. Its cardiolipin-targeting mechanism makes it a unique tool for studying mitochondrial dysfunction.	OmniQure Research Team	{SS-31,Mitochondria,Cardiolipin,Cardioprotection,"Oxidative Stress"}	published	https://cdn.pixabay.com/photo/2017/08/03/19/14/brain-2578410_640.jpg	SS-31 Elamipretide Mitochondrial Research | OmniQure	Research overview of SS-31 (Elamipretide) covering cardiolipin targeting, cardioprotection, renal research, and mitochondrial dysfunction models.	2026-05-05 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
6	P21: CNTF-Derived Peptide and Neurotrophic Research	p21-cntf-derived-nootropic	P21 is a synthetic peptide derived from ciliary neurotrophic factor (CNTF) that has been studied for neurogenesis promotion, cognitive enhancement, and weight regulation in preclinical models.	## Origin and Structure\n\nP21 is a 21-amino acid synthetic peptide derived from the CNTF (ciliary neurotrophic factor) sequence. CNTF is a potent neurotrophic cytokine that promotes neuronal survival, differentiation, and proliferation, but its full-length form has poor CNS penetration and peripheral side effects. P21 was designed to capture the neurotrophic properties of CNTF in a smaller, more accessible molecule.\n\n## Neurogenesis Research\n\nThe most extensively studied property of P21 is its ability to promote adult neurogenesis — the generation of new neurons from neural progenitor cells — particularly in the hippocampus:\n\n- Increased BrdU-positive newly born cells in the dentate gyrus\n- Enhanced hippocampal neurogenesis in both young and aged rodent models\n- Upregulation of BDNF and VEGF expression in hippocampal tissue\n\n## Cognitive Effects\n\nAssociated with neurogenesis promotion, P21 has demonstrated cognitive improvements in rodent models:\n- Improved performance in spatial memory tasks (Morris water maze)\n- Enhanced novel object recognition\n- Reversal of cognitive deficits in aged animals\n\n## STAT3 Signalling\n\nP21 activates STAT3 signalling pathways, which are downstream of CNTF receptor activation. STAT3 is involved in neural stem cell proliferation and has been implicated in the regulation of mood and cognitive function.\n\n## Weight and Appetite Research\n\nIn a notable finding, P21 reduced food intake and body weight in rodent models, possibly via central CNTF-mediated appetite suppression pathways. This dual neurotrophic/metabolic profile is unusual among nootropic peptides.\n\n## Research Considerations\n\nP21 is a research-stage compound with no clinical applications. Its activity at CNTF-related pathways distinguishes it from conventional neurotrophic peptides like BDNF and NGF.\n\n## Conclusion\n\nP21 offers a unique angle on neurotrophic research — combining hippocampal neurogenesis promotion, cognitive enhancement, and appetite modulation in a single small peptide derived from a well-characterised neurotrophic factor.	OmniQure Research Team	{P21,CNTF,Neurogenesis,"Cognitive Enhancement",BDNF}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	P21 CNTF-Derived Peptide Neurogenesis Research | OmniQure	Research overview of P21 peptide covering CNTF-derived neurotrophic activity, hippocampal neurogenesis, cognitive enhancement, and appetite modulation.	2026-05-06 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
7	PE-22-28: TREK-1 Channel Modulation and Antidepressant Research	pe-22-28-trek1-antidepressant	PE-22-28 is a synthetic analogue of spadin that targets TREK-1 potassium channels. It has demonstrated rapid antidepressant-like effects and neurogenic activity in preclinical models.	## Background\n\nPE-22-28 is a synthetic heptapeptide analogue of spadin — itself a natural peptide derived from the propeptide of the neurotensin receptor NTSR3/sortilin. The key research interest in PE-22-28 centres on its interaction with TREK-1, a two-pore domain potassium channel (K2P) that has emerged as a novel target in depression research.\n\n## TREK-1 and Depression\n\nTREK-1 is a mechanosensitive, background K+ channel expressed throughout the brain, particularly in regions implicated in mood regulation (prefrontal cortex, hippocampus, amygdala, raphe nuclei). Key findings connecting TREK-1 to depression:\n\n- TREK-1 knockout mice display antidepressant-like behaviour in the forced swim test and tail suspension test\n- TREK-1 modulates serotonergic neurotransmission by influencing the excitability of dorsal raphe neurons\n- Spadin was identified as an endogenous TREK-1 blocker with antidepressant properties\n\n## PE-22-28 vs Spadin\n\nPE-22-28 was developed as an optimised version of spadin with enhanced stability and potency. Key improvements:\n- Resistant to proteolytic degradation\n- More potent TREK-1 blockade at lower concentrations\n- Retained antidepressant-like effects in validated rodent models\n\n## Antidepressant Research Findings\n\nIn preclinical models, PE-22-28 has shown:\n- Rapid onset of antidepressant-like effects (within days, compared to weeks for SSRIs)\n- Efficacy in forced swim test, novelty-suppressed feeding, and chronic mild stress models\n- Synergistic effects with fluoxetine in some protocols\n- Hippocampal neurogenesis promotion comparable to conventional antidepressants\n\n## Mechanism\n\nPE-22-28 blocks TREK-1 → increases neuronal excitability in serotonergic raphe neurons → enhanced serotonin release → downstream antidepressant effects. This mechanism is distinct from all currently approved antidepressants.\n\n## Conclusion\n\nPE-22-28 represents a novel mechanistic approach to antidepressant research through TREK-1 channel modulation. Its rapid onset profile and unique mechanism make it an interesting tool compound for mood disorder research.	OmniQure Research Team	{PE-22-28,TREK-1,Antidepressant,Serotonin,"Potassium Channels"}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	PE-22-28 TREK-1 Antidepressant Peptide Research | OmniQure	Research overview of PE-22-28, covering TREK-1 potassium channel modulation, rapid antidepressant-like effects, and neurogenesis promotion.	2026-05-07 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
8	Somatropin (Recombinant HGH): Anabolic, Lipolytic and IGF-1 Research	somatropin-hgh-research	Somatropin is recombinant human growth hormone, structurally identical to pituitary-derived HGH. It has been studied extensively for its anabolic, lipolytic, and IGF-1-mediated effects across numerous research domains.	## What is Somatropin?\n\nSomatropin is a recombinant form of human growth hormone (hGH), a 191-amino acid single-chain polypeptide produced by the anterior pituitary. It is biosynthetically identical to naturally secreted HGH and has been used clinically for decades in GH deficiency, paediatric growth disorders, and HIV-associated wasting.\n\n## Physiological Actions\n\n### Direct GH Receptor Effects\nGrowth hormone binds GH receptors on multiple tissues, directly stimulating:\n- Lipolysis in adipocytes (triglyceride hydrolysis and fatty acid release)\n- Glucose counter-regulation (anti-insulin effects on glucose uptake)\n- Protein synthesis in skeletal muscle\n\n### IGF-1-Mediated Effects\nThe majority of HGH's anabolic effects are mediated indirectly through hepatic IGF-1 secretion:\n- IGF-1 stimulates skeletal muscle protein synthesis via PI3K/Akt/mTOR\n- Promotes chondrocyte proliferation and linear bone growth\n- Stimulates satellite cell activation in muscle\n\n## Research Applications\n\n### Body Composition\nHGH and somatropin have been extensively studied for their effects on lean mass accretion and fat mass reduction, both independently and in combination with other anabolic agents.\n\n### Wound and Tissue Healing\nGH receptors are present on fibroblasts and keratinocytes. Somatropin has been studied for accelerating wound healing and soft tissue repair in animal models.\n\n### Bone Metabolism\nHGH stimulates osteoblast activity and IGF-1-dependent bone mineral density increases, relevant to osteoporosis research.\n\n### Cognitive and Neurological Research\nGH receptors are expressed in the brain. Some studies suggest GH replacement in GH-deficient subjects improves cognitive function, though the mechanism remains an area of active investigation.\n\n## Pharmacology\n\nSomatropin has a short half-life (approximately 20–30 minutes IV, 3–5 hours SC) and is typically administered subcutaneously in research protocols. It is measured in IU (International Units): 1 mg ≈ 3 IU.\n\n## Conclusion\n\nSomatropin provides a well-characterised research tool for studying the GH/IGF-1 axis across anabolic, metabolic, and regenerative biology. Its clinical history provides a wealth of pharmacological reference data unavailable for most research peptides.	OmniQure Research Team	{HGH,Somatropin,IGF-1,Anabolic,Lipolysis}	published	https://media.istockphoto.com/id/1044228822/photo/nmr-science-lab-research-into-cancer-diabetes-dementia-or-autism.jpg?s=612x612&w=0&k=20&c=rxA58ckwj9z14n18UXB4xb82m1EP7LNsrdWzExqKNWo=	Somatropin Recombinant HGH Research Overview | OmniQure	Research overview of somatropin (recombinant HGH) covering anabolic effects, lipolysis, IGF-1 axis, body composition, and tissue healing research.	2026-05-08 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
9	Tesamorelin: Stabilised GHRH Analogue and Body Composition Research	tesamorelin-ghrh-analogue	Tesamorelin is a modified GHRH(1-44) analogue with a trans-3-hexenoic acid modification that stabilises it against DPP-IV cleavage. It is clinically approved for HIV-associated lipodystrophy and studied for body composition and GH axis research.	## Structure and Stability\n\nTesamorelin is a synthetic analogue of GHRH(1-44) with a trans-3-hexenoic acid group conjugated to the N-terminus. This modification protects the peptide from cleavage by dipeptidyl peptidase-IV (DPP-IV) at the Ala²-position, extending its half-life from approximately 7 minutes (native GHRH) to approximately 26 minutes.\n\n## Mechanism of Action\n\nLike native GHRH, tesamorelin binds the GHRH receptor on pituitary somatotrophs and stimulates pulsatile GH secretion via cAMP/PKA signalling. The resulting GH pulses then drive hepatic IGF-1 production. Critically, tesamorelin preserves the physiological feedback regulation of GH secretion — somatostatin inhibition remains intact, preventing the tonic GH elevation seen with GH administration.\n\n## Clinical Background\n\nTesamorelin is approved by the FDA (as Egrifta) for the treatment of HIV-associated lipodystrophy — excess visceral fat accumulation caused by antiretroviral therapy. Clinical trials demonstrated:\n- 15–20% reduction in visceral adipose tissue (VAT) on CT scan\n- Reduced triglycerides and improved lipid profiles\n- No significant insulin resistance\n\nThis clinical dataset provides a uniquely well-characterised pharmacological reference for body composition research.\n\n## Research Beyond Lipodystrophy\n\n### Alzheimer's Disease\nA series of studies from the University of Washington demonstrated that tesamorelin improved cognition and reduced amyloid burden in mild cognitive impairment and early Alzheimer's research models, potentially via IGF-1-mediated amyloid clearance.\n\n### Non-Alcoholic Fatty Liver Disease\nTesamorelin has been studied for reducing hepatic fat and liver stiffness in NAFLD/NASH models secondary to its visceral fat reduction effects.\n\n### Body Composition in Non-HIV Populations\nResearch is ongoing in non-HIV populations with metabolic syndrome and age-related GH decline.\n\n## Conclusion\n\nTesamorelin is one of the most clinically validated GH secretagogues available, providing researchers with a pharmacologically well-defined GHRH analogue for body composition, metabolic, and neurological research.	OmniQure Research Team	{Tesamorelin,GHRH,"Growth Hormone","Visceral Fat",Lipodystrophy}	published	https://media.istockphoto.com/id/182807377/photo/molecule.jpg?s=612x612&w=0&k=20&c=882ccFgZWW-568bFc8eMIpLgnyKpMH33M_YxqYUQLWY=	Tesamorelin GHRH Analogue Body Composition Research | OmniQure	Research overview of tesamorelin covering GHRH receptor activation, visceral fat reduction, clinical lipodystrophy data, and Alzheimer's research applications.	2026-05-09 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
10	AOD-9604: The Lipolytic hGH Fragment in Metabolic Research	aod-9604-lipolytic-fragment	AOD-9604 is a synthetic analogue of the C-terminal fragment of human growth hormone (residues 176–191), studied for lipolytic activity and fat metabolism without the insulin-desensitising effects of full-length HGH.	## Background\n\nAOD-9604 (Anti-Obesity Drug 9604) is a modified form of the hGH fragment 176-191, with a disulphide bridge added at the N-terminus for stability. It was developed by researchers at Monash University and subsequently studied as a potential treatment for obesity, with a phase III clinical trial conducted (though ultimately unsuccessful for regulatory approval as a drug).\n\n## Mechanism: Separating Lipolysis from Growth\n\nFull-length HGH exerts lipolytic effects via the C-terminal domain of the molecule. AOD-9604 retains this lipolytic activity while lacking the N-terminal domain responsible for IGF-1 stimulation and insulin resistance. This separation of metabolic functions makes it a useful research tool for studying fat metabolism independent of anabolic effects.\n\nThe proposed mechanism involves:\n- β3-adrenergic receptor stimulation in adipocytes\n- Upregulation of lipase activity → triglyceride hydrolysis\n- Inhibition of lipogenesis (fat synthesis from carbohydrates)\n\n## Preclinical Research\n\nIn rodent models:\n- Reduced body fat percentage without changes in lean mass\n- No increase in blood glucose or insulin resistance\n- No effect on IGF-1 levels\n- Preserved bone density (unlike some lipolytic agents)\n\n## Human Research\n\nA phase IIb clinical trial in obese adults showed modest but significant weight loss. The compound passed phase II safety endpoints, providing reassurance about its metabolic safety profile in human subjects.\n\n## Research Considerations\n\nAOD-9604 is freely available for research purposes as no therapeutic approval was obtained. Its clean metabolic safety profile and selective lipolytic mechanism make it a useful comparator in fat metabolism research designs.\n\n## Conclusion\n\nAOD-9604 provides a selective lipolytic research tool derived from the hGH sequence, with a well-characterised mechanism and human pharmacological data from clinical trials. It is particularly useful for research isolating fat metabolism from GH axis effects.	OmniQure Research Team	{AOD-9604,Lipolysis,"hGH Fragment","Fat Metabolism","Obesity Research"}	published	https://cdn.pixabay.com/photo/2020/05/18/16/17/cat-5184743_640.jpg	AOD-9604 hGH Fragment Lipolytic Research | OmniQure	Research overview of AOD-9604 covering its lipolytic mechanism, separation from anabolic HGH effects, preclinical findings, and human clinical trial data.	2026-05-10 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
11	GHRP-2: Potent GH Secretagogue via the Ghrelin Receptor	ghrp-2-growth-hormone-secretagogue	GHRP-2 is a synthetic hexapeptide that potently stimulates GH release through the ghrelin receptor (GHS-R1a), making it a widely used research tool for the GH secretagogue axis.	## Background\n\nGHRP-2 (Growth Hormone Releasing Peptide-2) is a synthetic hexapeptide (D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH2) developed from the enkephalin series. It was one of the first peptides found to directly stimulate GH release independent of GHRH, leading to the discovery of the ghrelin receptor (GHS-R1a).\n\n## Ghrelin Receptor Pharmacology\n\nGHRP-2 is a full agonist at GHS-R1a (Growth Hormone Secretagogue Receptor 1a). This receptor mediates:\n- Pulsatile GH secretion from pituitary somatotrophs\n- Appetite stimulation (though less pronounced with GHRP-2 than GHRP-6)\n- Partial inhibition of somatostatin release\n\n## GH Release Profile\n\nGHRP-2 produces a robust GH pulse with characteristics relevant to research design:\n- Onset: 15–30 minutes post-administration\n- Peak: approximately 30–60 minutes\n- Duration: 2–3 hours\n- Synergistic with GHRH or GHRH analogues (e.g., CJC-1295)\n\n## Comparison with GHRP-6\n\nGHRP-2 and GHRP-6 are frequently compared in research:\n- GHRP-2 produces greater GH release per unit dose\n- GHRP-2 causes less appetite stimulation than GHRP-6\n- Both elevate cortisol and prolactin, though GHRP-2 tends to do so more\n- GHRP-6 has a stronger orexigenic effect via ghrelin pathway activation\n\n## Research Applications\n\nBeyond GH axis research, GHRP-2 has been investigated for:\n- Cardioprotective effects (GHS-R1a is expressed in cardiac tissue)\n- Neuroprotective properties in CNS injury models\n- Hepatoprotection in models of liver damage\n\n## Conclusion\n\nGHRP-2 is a well-characterised GH secretagogue with a wealth of published research data. Its potent and predictable GH-releasing activity makes it a reliable tool for GH axis research and a useful comparator when studying newer secretagogues.	OmniQure Research Team	{GHRP-2,"Growth Hormone","Ghrelin Receptor","GH Secretagogue",GHS-R1a}	published	https://cdn.pixabay.com/photo/2018/07/11/21/51/formula-3530682_640.jpg	GHRP-2 Growth Hormone Secretagogue Research | OmniQure	Research overview of GHRP-2 covering ghrelin receptor pharmacology, GH release profile, comparison with GHRP-6, and cardioprotective applications.	2026-05-11 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
12	GHRP-6: Growth Hormone Secretagogue with Orexigenic Effects	ghrp-6-orexigenic-secretagogue	GHRP-6 is one of the first synthetic GH secretagogues, notable for its potent GH release and pronounced appetite-stimulating effects via ghrelin receptor activation. It remains a key research reference compound.	## Historical Significance\n\nGHRP-6 (His-D-Trp-Ala-Trp-D-Phe-Lys-NH2) holds an important place in peptide pharmacology history. It was among the first synthetic GH secretagogues to demonstrate that GH release could be pharmacologically stimulated independent of GHRH. This discovery eventually led to the identification of ghrelin itself.\n\n## Mechanism of Action\n\nGHRP-6 is an agonist at GHS-R1a (the ghrelin receptor), stimulating GH release through the same receptor as endogenous ghrelin. Key aspects of its pharmacology:\n- Amplifies GH pulsatility without creating a tonic, non-physiological GH signal\n- Partially inhibits somatostatin release, removing the braking signal on GH secretion\n- Acts synergistically with GHRH — combination produces 2–4x greater GH release than either alone\n\n## Orexigenic Effects\n\nGHRP-6's most distinctive feature is its potent appetite-stimulating activity. This occurs because:\n1. GHS-R1a is expressed in the hypothalamic arcuate nucleus, mediating appetite signalling\n2. GHRP-6's ghrelin-mimetic activity activates the NPY/AgRP orexigenic pathway\n3. In rodent models, GHRP-6 produces significant food intake increases within 30 minutes of administration\n\nThis orexigenic property has made GHRP-6 an interesting research tool in appetite regulation and cachexia models, while also being a consideration in research designs focused primarily on GH effects.\n\n## Cytoprotective Research\n\nBeyond the GH axis, GHRP-6 has been studied for direct tissue protection:\n- Hepatoprotection in models of carbon tetrachloride-induced liver injury\n- Cardioprotection via GHS-R1a signalling in cardiomyocytes\n- Wound healing acceleration in dermal models\n\n## Conclusion\n\nGHRP-6 remains a foundational GH secretagogue research tool, with decades of published data and a distinctive orexigenic profile that distinguishes it from the broader secretagogue class. It is particularly valuable in appetite and cachexia research alongside GH axis studies.	OmniQure Research Team	{GHRP-6,"Growth Hormone",Ghrelin,Appetite,Orexigenic}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	GHRP-6 Orexigenic GH Secretagogue Research | OmniQure	Research overview of GHRP-6 covering ghrelin receptor pharmacology, GH release, appetite stimulation, and cytoprotective applications.	2026-05-12 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
13	Hexarelin: High-Affinity GH Secretagogue and Cardioprotection Research	hexarelin-cardioprotective-secretagogue	Hexarelin is a synthetic hexapeptide with the highest GHS-R1a binding affinity in its class, studied for potent GH secretion and direct cardioprotective effects via CD36 receptor activation.	## Background and Potency\n\nHexarelin (His-D-2-MeAla-Trp-D-Phe-Lys-NH2) is a synthetic hexapeptide GH secretagogue and the most potent in its class at GHS-R1a. The 2-methylalanine substitution at position 2 (compared to GHRP-6's D-Trp) increases receptor binding affinity and metabolic stability.\n\n## GH Secretagogue Activity\n\nHexarelin produces robust, dose-dependent GH release:\n- More potent GH release per molar dose than GHRP-2 or GHRP-6\n- Minimal appetite stimulation compared to GHRP-6\n- Cortisol and prolactin elevations are observed (less selective than Ipamorelin)\n- Desensitisation occurs with chronic administration — a property studied in its own right\n\n## Cardioprotective Mechanisms: CD36\n\nA highly distinctive feature of hexarelin is its activity at the CD36 scavenger receptor, independent of GHS-R1a. CD36 is expressed on:\n- Cardiomyocytes\n- Endothelial cells\n- Macrophages\n\nHexarelin's CD36 binding mediates:\n- Direct cardioprotection independent of GH/IGF-1 elevation\n- Reduced cardiomyocyte apoptosis in ischaemia-reperfusion models\n- Improved cardiac function in GH-deficient and normal animals\n- Anti-atherosclerotic effects via macrophage cholesterol efflux\n\n## Cardiac Research Applications\n\nThe dual GHS-R1a/CD36 mechanism makes hexarelin particularly valuable in cardiovascular research where the GH-independent cardiac effects can be isolated using GH-deficient animal models or GHS-R1a-null mice.\n\n## Desensitisation Studies\n\nHexarelin's tendency to desensitise GHS-R1a with repeated dosing has made it a useful research tool for studying GH secretagogue receptor regulation and recovery.\n\n## Conclusion\n\nHexarelin's combination of maximal GHS-R1a potency and GH-independent cardioprotection via CD36 gives it a unique dual-mechanism profile unmatched in the secretagogue class. It is an essential reference compound in GH and cardiac research.	OmniQure Research Team	{Hexarelin,"GH Secretagogue",Cardioprotection,CD36,GHS-R1a}	published	https://cdn.pixabay.com/photo/2017/08/03/19/14/brain-2578410_640.jpg	Hexarelin GH Secretagogue and Cardioprotection Research | OmniQure	Research overview of hexarelin covering GHS-R1a binding, GH release potency, CD36-mediated cardioprotection, and desensitisation studies.	2026-05-13 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
14	IGF-1 LR3: Long-Acting Insulin-Like Growth Factor-1 Analogue Research	igf-1-lr3-anabolic-research	IGF-1 LR3 is a recombinant analogue of IGF-1 with a 13-amino acid N-terminal extension and an Arg³→Arg3 substitution, greatly extending its half-life by reducing IGF-binding protein affinity.	## What is IGF-1 LR3?\n\nIGF-1 LR3 (Long R3 IGF-1) is a synthetic analogue of insulin-like growth factor-1 (IGF-1) with two key modifications:\n1. An N-terminal 13-amino acid extension\n2. Substitution of arginine at position 3 for glutamic acid (R→E at position 3)\n\nThese changes reduce binding to IGF-binding proteins (IGFBPs) by approximately 1000-fold, extending the biological half-life from 12–15 hours (native IGF-1) to 20–30 hours while maintaining receptor binding affinity.\n\n## IGF-1 Receptor Biology\n\nIGF-1 acts through the IGF-1 receptor (IGF-1R), a receptor tyrosine kinase that activates:\n- **PI3K/Akt/mTOR**: Protein synthesis, cell growth, survival\n- **RAS/ERK/MAPK**: Cell proliferation, differentiation\n- **Metabolic regulation**: Glucose uptake, glycogen synthesis\n\n## Anabolic and Cellular Research\n\nIGF-1 LR3's extended bioavailability makes it particularly useful for studying:\n\n### Skeletal Muscle\n- Satellite cell activation and differentiation\n- mTOR-dependent protein synthesis\n- Anti-catabolic effects (IGF-1 inhibits FoxO transcription factors that drive muscle atrophy gene expression)\n\n### Bone Biology\n- Osteoblast proliferation and differentiation\n- Bone mineral density in osteoporosis models\n- Chondrocyte growth plate research\n\n### Cellular Proliferation\n- IGF-1R signalling in cancer cell lines (both a research tool and a safety consideration)\n- Tissue engineering scaffold studies\n\n## Half-Life Advantage\n\nBecause native IGF-1 is rapidly sequestered by IGFBPs (particularly IGFBP-3), its free fraction in circulation is typically <1%. IGF-1 LR3 bypasses this sequestration, providing sustained receptor activation useful for studying downstream signalling cascades.\n\n## Conclusion\n\nIGF-1 LR3 is a powerful research tool for studying the IGF-1 signalling axis with minimal IGFBP interference. Its extended half-life and preserved receptor affinity make it the preferred choice for in vitro and in vivo IGF-1 research across anabolic, bone, and metabolic biology.	OmniQure Research Team	{"IGF-1 LR3",IGF-1,Anabolic,mTOR,"Cell Proliferation"}	published	https://media.istockphoto.com/id/182807377/photo/molecule.jpg?s=612x612&w=0&k=20&c=882ccFgZWW-568bFc8eMIpLgnyKpMH33M_YxqYUQLWY=	IGF-1 LR3 Long-Acting Analogue Research | OmniQure	Research overview of IGF-1 LR3 covering IGFBP resistance, extended half-life, IGF-1R signalling, anabolic effects, and bone biology applications.	2026-05-14 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
15	PEG MGF: PEGylated Mechano Growth Factor and Muscle Satellite Cell Research	peg-mgf-muscle-repair	PEG MGF (PEGylated Mechano Growth Factor) is a stabilised splice variant of IGF-1 studied for satellite cell activation, muscle repair, and recovery from mechanical stress.	## What is MGF?\n\nMechano Growth Factor (MGF) is a splice variant of the IGF-1 gene, specifically IGF-1Ec in humans. Unlike liver-derived IGF-1, MGF is produced locally in skeletal muscle in response to mechanical load and microtrauma. Its C-terminal E-domain peptide (the last 24 amino acids) has biological activities distinct from the common IGF-1 sequence.\n\n## PEGylation and Stability\n\nNative MGF has an extremely short half-life (minutes) due to rapid proteolytic cleavage and poor aqueous stability. PEGylation — the attachment of polyethylene glycol chains — dramatically improves:\n- Half-life: from minutes to 96+ hours\n- Aqueous solubility\n- Resistance to enzymatic degradation\n- Bioavailability for in vivo research\n\n## Satellite Cell Activation\n\nThe most studied action of MGF/PEG MGF is activation of muscle satellite cells — the resident stem cells of skeletal muscle responsible for repair and hypertrophy:\n- MGF E-domain peptide directly activates satellite cell proliferation\n- This occurs through a receptor distinct from the IGF-1R\n- Satellite cell activation by MGF precedes the differentiation signal from IGF-1\n\n## Muscle Repair Research\n\nIn animal models of muscle injury, PEG MGF has shown:\n- Accelerated satellite cell proliferation at injury sites\n- Faster restoration of muscle function after crush injury\n- Reduced fibrosis and scarring in healing muscle tissue\n- Improved regeneration in dystrophic muscle models\n\n## Cardiac Research\n\nMGF has also been studied in cardiac muscle, where it may activate cardiomyocyte progenitors and provide protection against ischaemic injury.\n\n## Conclusion\n\nPEG MGF provides a stable, bioavailable form of Mechano Growth Factor for research into the satellite cell response to mechanical stress and injury. Its distinct mechanism from conventional IGF-1 makes it a complementary tool in muscle biology research.	OmniQure Research Team	{"PEG MGF","Mechano Growth Factor","Satellite Cells","Muscle Repair",IGF-1}	published	https://cdn.pixabay.com/photo/2022/01/28/12/05/microbiology-6974451_640.jpg	PEG MGF Mechano Growth Factor Muscle Research | OmniQure	Research overview of PEG MGF covering MGF biology, PEGylation benefits, satellite cell activation, and muscle repair findings.	2026-05-15 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
16	Sermorelin: GHRH Analogue and Pituitary GH Stimulation Research	sermorelin-ghrh-pituitary	Sermorelin is a synthetic analogue of GHRH comprising the first 29 amino acids of native GHRH(1-44). It stimulates endogenous GH secretion through pituitary GHRH receptors, preserving physiological feedback regulation.	## Background\n\nSermorelin (GHRH 1-29) is a synthetic version of the first 29 amino acids of endogenous growth hormone-releasing hormone (GHRH). This truncated form retains full biological activity at the GHRH receptor, as the first 29 amino acids contain the complete receptor-binding domain.\n\n## Mechanism of Action\n\nSermorelin binds GHRH receptors on anterior pituitary somatotrophs, activating Gs/cAMP/PKA signalling that leads to:\n- GH gene transcription upregulation\n- GH vesicle release from somatotrophs\n- Indirect downstream IGF-1 elevation\n\nCritically, sermorelin works within the normal hypothalamic-pituitary-somatotropic axis. Somatostatin inhibition and negative feedback from IGF-1 remain active, so GH output is amplified without bypassing physiological regulation.\n\n## Comparison with CJC-1295\n\n| Feature | Sermorelin | CJC-1295 (no DAC) |\n|---|---|---|\n| Length | 29 amino acids | 30 amino acids + modifications |\n| Half-life | ~10 minutes | ~30 minutes |\n| DPP-IV resistance | Low | Moderate |\n| GH pulse character | Physiological | Physiological |\n\nSermorelin's shorter half-life means more frequent dosing is required for sustained GH stimulation, which can be advantageous in research designs that require precise temporal control of GH pulsatility.\n\n## Clinical Data\n\nSermorelin has been FDA-approved (as Geref) and used clinically for paediatric GH deficiency diagnosis and treatment, providing extensive human pharmacological data. This clinical history is a significant research resource unavailable for newer analogues.\n\n## Age-Related GH Decline Research\n\nAs GH secretion declines with age, sermorelin has been studied as a means of restoring more youthful GH pulsatility via pituitary stimulation rather than exogenous GH administration. Studies report improvements in sleep architecture (GH is predominantly secreted during slow-wave sleep) alongside metabolic benefits.\n\n## Conclusion\n\nSermorelin offers a well-characterised, clinically validated GHRH analogue for pituitary GH stimulation research. Its physiological feedback preservation and extensive clinical dataset make it a reliable reference compound for GH axis studies.	OmniQure Research Team	{Sermorelin,GHRH,"Growth Hormone",Pituitary,"GH Deficiency"}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	Sermorelin GHRH Analogue GH Stimulation Research | OmniQure	Research overview of sermorelin covering GHRH receptor activation, comparison with CJC-1295, clinical data, and age-related GH decline research.	2026-05-16 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
17	TB-500 Fragment (17-23): The Active Actin-Binding Core of Thymosin Beta-4	tb-500-fragment-17-23	The TB-500 Fragment (17-23) is a synthetic heptapeptide corresponding to the actin-binding domain of Thymosin Beta-4, studied for its core role in cell migration, wound healing, and tissue repair.	## What is the Fragment (17-23)?\n\nThymosin Beta-4 (Tβ4) is a 43-amino acid protein whose biological activity is primarily attributed to a short internal sequence. The Fragment 17-23 (Ac-LKKTETQ) — also referred to as the TB4 actin-binding peptide — represents the minimal sequence responsible for G-actin sequestration, the defining biochemical function of the full-length protein.\n\n## Actin Sequestration\n\nThe core function of Tβ4 Fragment 17-23 is G-actin (monomeric actin) sequestration. By binding G-actin:\n- The fragment reduces the pool of actin available for filament polymerisation\n- This modulates the dynamic balance between F-actin (filamentous) and G-actin\n- Cell migration speed and directionality are directly regulated by this balance\n\nIn wound healing, this translates to accelerated lamellipodium formation at the wound edge, driving epithelial and endothelial cell migration.\n\n## Comparison with Full-Length TB-500\n\nResearchers frequently ask whether the fragment is equivalent to full-length Tβ4/TB-500:\n\n- **Actin binding**: The fragment retains full G-actin sequestration activity\n- **VEGF upregulation**: Present in full-length Tβ4 but less consistently documented for the fragment alone\n- **Anti-inflammatory effects**: Full-length Tβ4 has documented NF-κB and IL signalling effects; fragment data are more limited\n- **Research use**: The fragment is useful for isolating actin-dependent effects from the broader Tβ4 pharmacology\n\n## Wound Healing Research\n\nIn in vitro scratch assays and rodent wound models, the 17-23 fragment has demonstrated:\n- Accelerated wound closure rates comparable to full-length Tβ4\n- Increased keratinocyte and fibroblast migration rates\n- Enhanced corneal epithelial wound healing (topical application)\n\n## Corneal Research\n\nThe fragment has been particularly well studied in corneal wound healing, where Tβ4 and its active fragment are being evaluated as a potential treatment for corneal surface damage.\n\n## Conclusion\n\nThe TB-500 Fragment (17-23) provides a precisely defined tool for studying the actin-sequestration-dependent component of Thymosin Beta-4 activity, allowing isolation of this mechanism from the broader pleiotropic effects of the full-length protein.	OmniQure Research Team	{"TB-500 Fragment","Thymosin Beta-4",Actin,"Wound Healing","Cell Migration"}	published	https://cdn.pixabay.com/photo/2022/01/28/12/05/microbiology-6974451_640.jpg	TB-500 Fragment 17-23 Actin-Binding Peptide Research | OmniQure	Research overview of TB-500 Fragment (17-23), covering G-actin sequestration, wound healing, comparison with full-length Thymosin Beta-4, and corneal research.	2026-05-17 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
18	Gonadorelin: Synthetic GnRH and Reproductive Endocrinology Research	gonadorelin-gnrh-research	Gonadorelin is a synthetic decapeptide identical to endogenous GnRH (gonadotropin-releasing hormone), used to study the hypothalamic-pituitary-gonadal axis and LH/FSH secretion dynamics.	## What is Gonadorelin?\n\nGonadorelin is a synthetic form of gonadotropin-releasing hormone (GnRH), a decapeptide (pGlu-His-Trp-Ser-Tyr-Gly-Leu-Arg-Pro-Gly-NH2) secreted by the hypothalamus in pulses every 60–120 minutes. It is biosynthetically identical to endogenous GnRH-I.\n\n## The Hypothalamic-Pituitary-Gonadal (HPG) Axis\n\nGnRH acts on pituitary gonadotrophs to stimulate the release of:\n- **LH (Luteinising Hormone)**: Triggers ovulation in females; stimulates testosterone production in males (Leydig cells)\n- **FSH (Follicle-Stimulating Hormone)**: Drives follicular development in females; supports spermatogenesis in males\n\nCritically, pulsatile GnRH stimulation promotes LH/FSH release, while continuous GnRH exposure paradoxically downregulates the receptors and suppresses gonadotropin secretion — the basis for GnRH agonist therapy in prostate cancer and endometriosis.\n\n## Research Applications\n\n### Fertility Research\nGonadorelin is used to study and model pulsatile HPG axis signalling. In animal models, it can restore fertility in GnRH-deficient animals and study the effects of pulse frequency on LH/FSH ratios.\n\n### Testosterone Production\nIn males, pulsatile gonadorelin administration maintains endogenous testosterone production — research relevant to hypogonadism models and testosterone suppression recovery studies.\n\n### Diagnostic Applications\nThe gonadorelin stimulation test (measuring LH/FSH response after IV gonadorelin administration) is used to assess pituitary gonadotroph reserve and differentiate hypothalamic from pituitary hypogonadism.\n\n### Sports Science Research\nGonadorelin has been studied as a means of maintaining HPG axis function during exogenous androgen administration in animal models, preventing the testicular atrophy associated with negative feedback.\n\n## Conclusion\n\nGonadorelin is the canonical tool compound for HPG axis research, providing a structurally defined, physiologically authentic GnRH signal with extensive published pharmacological data. Its dual pulsatile/continuous mode effects make it uniquely versatile for reproductive endocrinology research.	OmniQure Research Team	{Gonadorelin,GnRH,LH,FSH,"Reproductive Endocrinology"}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	Gonadorelin GnRH HPG Axis Research | OmniQure	Research overview of gonadorelin covering GnRH receptor pharmacology, pulsatile LH/FSH stimulation, HPG axis research, and diagnostic applications.	2026-05-18 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
19	Kisspeptin-10: The GnRH Gatekeeper Neuropeptide in Reproductive Research	kisspeptin-10-gnrh-axis	Kisspeptin-10 is the shortest bioactive fragment of the kisspeptin family, acting as a master regulator of GnRH secretion and the HPG axis. It is studied for fertility, puberty onset, and reproductive neuroendocrinology.	## Discovery and Significance\n\nKisspeptin was discovered in 1996 as a metastasis suppressor (originally named metastin) before its critical role in reproductive endocrinology was recognised in 2003 when loss-of-function mutations in the kisspeptin receptor (GPR54/KISS1R) were found to cause hypogonadotropic hypogonadism in humans and mice.\n\nThe gene KISS1 encodes a 145-amino acid protein that is proteolytically processed to several bioactive fragments: kisspeptin-54, -14, -13, and -10. All share the C-terminal decapeptide sequence and full biological activity at KISS1R.\n\n## Mechanism: GnRH Control\n\nKisspeptin neurons in the hypothalamus (primarily in the arcuate nucleus and anteroventral periventricular nucleus) are the primary drivers of GnRH neuron firing:\n\n- Kisspeptin → KISS1R on GnRH neurons → GnRH pulse initiation\n- Kisspeptin neurons integrate signals from sex steroids (oestrogen and testosterone feedback), circadian rhythm, metabolic status, and stress\n- The arcuate nucleus kisspeptin/neurokinin B/dynorphin (KNDy) neurons form the GnRH pulse generator\n\n## Research Applications\n\n### Puberty Onset\nKisspeptin signalling is essential for puberty. Kisspeptin levels rise dramatically at puberty in multiple species, making it a key research target in delayed puberty and precocious puberty models.\n\n### Fertility and Ovulation\nKisspeptin-10 reliably triggers LH surges and ovulation when administered acutely in animal models and women with hypothalamic amenorrhoea, making it a research tool for fertility restoration studies.\n\n### Metabolic Regulation\nKNDy neurons respond to leptin and ghrelin, linking energy status to reproductive function. Research into how nutrition affects fertility frequently uses kisspeptin as a readout.\n\n### Stress and Reproduction\nKisspeptin neurons are inhibited by CRH and glucocorticoids, explaining stress-induced reproductive suppression. This axis is an active research area.\n\n## Conclusion\n\nKisspeptin-10 provides precise pharmacological access to the GnRH pulse generator, making it an essential research tool for reproductive neuroendocrinology, puberty biology, and the interaction between metabolism and fertility.	OmniQure Research Team	{Kisspeptin-10,GnRH,"HPG Axis",Fertility,Puberty}	published	https://cdn.pixabay.com/photo/2017/02/14/04/13/dna-2064062_640.jpg	Kisspeptin-10 GnRH Reproductive Research | OmniQure	Research overview of kisspeptin-10 covering KISS1R signalling, GnRH pulse generation, puberty, fertility research, and metabolic-reproductive crosstalk.	2026-05-19 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
20	LL-37: Human Cathelicidin, Antimicrobial Defence and Immune Modulation	ll-37-cathelicidin-antimicrobial	LL-37 is the sole human cathelicidin peptide, derived from the C-terminal domain of hCAP18. It is studied for broad-spectrum antimicrobial activity, wound healing, immune modulation, and emerging cancer research.	## What is LL-37?\n\nLL-37 is a 37-amino acid cationic helical peptide, the only known human cathelicidin. It is derived by proteolytic cleavage of the precursor protein hCAP18 (human cationic antimicrobial protein of 18 kDa). The name "LL-37" refers to its two N-terminal leucines and 37-amino acid length.\n\nLL-37 is produced by:\n- Neutrophils (stored in specific granules)\n- Epithelial cells of the skin, lung, gut, and urogenital tract\n- Monocytes, macrophages, and mast cells\n- Keratinocytes (upregulated by vitamin D)\n\n## Antimicrobial Mechanisms\n\nLL-37 is active against a remarkably broad spectrum of pathogens:\n\n### Bacteria\n- Disrupts bacterial membranes by forming pores via a "carpet" or "toroidal pore" mechanism\n- Active against both Gram-positive (*S. aureus*, *MRSA*) and Gram-negative (*E. coli*, *P. aeruginosa*) bacteria\n- Also active against antibiotic-resistant strains\n\n### Viruses\n- Disrupts viral envelope membranes\n- Studied against influenza, HIV, RSV, and herpes viruses in vitro\n\n### Fungi\n- Activity against *Candida albicans* and other fungal pathogens\n\n## Immune Modulation\n\nBeyond direct killing, LL-37 acts as an immune signal:\n- Recruits neutrophils, monocytes, and mast cells to infection sites (chemoattractant)\n- Modulates TLR (Toll-like receptor) signalling — can both amplify and dampen inflammatory responses depending on context\n- Promotes wound healing through keratinocyte migration and proliferation\n- Upregulates angiogenesis via VEGF and HIF-1α\n\n## Cancer Research\n\nLL-37 has dual roles in cancer:\n- Tumour suppressor in colon, gastric, and lung cancer models\n- Pro-tumorigenic in ovarian and breast cancer models\nThis context-dependent activity makes it an interesting research subject in tumour microenvironment biology.\n\n## Vitamin D Connection\n\nVitamin D3 strongly induces LL-37 expression in macrophages and epithelial cells via a vitamin D response element in the hCAP18 promoter — mechanistically linking vitamin D insufficiency to impaired innate immune defence.\n\n## Conclusion\n\nLL-37 is a pleiotropic innate immune effector with antimicrobial, immunomodulatory, wound healing, and cancer biology applications. Its status as the sole human cathelicidin makes it an irreplaceable research tool in host defence and inflammation research.	OmniQure Research Team	{LL-37,Cathelicidin,Antimicrobial,"Innate Immunity","Wound Healing"}	published	https://cdn.pixabay.com/photo/2020/03/22/13/01/virus-4957673_640.jpg	LL-37 Human Cathelicidin Antimicrobial Research | OmniQure	Research overview of LL-37 covering membrane disruption mechanisms, antimicrobial spectrum, immune modulation, wound healing, and cancer biology.	2026-05-20 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
21	Thymosin Alpha-1: Thymic Immune Modulation and T-Cell Research	thymosin-alpha-1-immune-modulation	Thymosin Alpha-1 (Tα1) is a 28-amino acid peptide originally isolated from thymic tissue, studied for T-cell maturation, antiviral immunity, and immunomodulation in infection and cancer models.	## Background\n\nThymosin Alpha-1 (Tα1) was first isolated from thymosin fraction 5 of bovine thymic tissue by Allan Goldstein and colleagues in 1972. A 28-amino acid peptide with an N-terminal acetylation, it is now produced synthetically (marketed as Thymalfasin/Zadaxin). It has regulatory approval in approximately 40 countries for hepatitis B, hepatitis C, and as an immune adjuvant in cancer patients, providing an unusually rich clinical dataset for a research peptide.\n\n## Mechanisms of Immune Modulation\n\nTα1 exerts broad immunomodulatory effects through multiple mechanisms:\n\n### T-Cell Maturation\n- Promotes maturation of T-cell precursors in the thymus\n- Upregulates T-cell markers (CD3, CD4, CD8)\n- Enhances T-helper cell (Th1) differentiation and function\n\n### Dendritic Cell Activation\n- Stimulates dendritic cell maturation and antigen presentation capacity\n- Upregulates co-stimulatory molecules (CD80, CD86)\n- Increases IL-12 production, driving Th1 polarisation\n\n### TLR Signalling\n- Activates TLR2 and TLR9 signalling in dendritic cells and macrophages\n- Promotes type I interferon production\n- Enhances NK cell activity\n\n## Clinical and Preclinical Research\n\n### Viral Infections\nTα1 has been studied in chronic hepatitis B and C, with clinical trials showing enhanced seroconversion rates when combined with standard antiviral therapy. More recently, it has been examined in COVID-19 as an immune normalising agent.\n\n### Cancer Immunology\nTα1 enhances tumour antigen-specific T-cell responses and has been studied as an adjuvant to chemotherapy and immunotherapy, improving immune reconstitution after cytotoxic treatment.\n\n### Sepsis\nA randomised controlled trial in China (ETASS trial) demonstrated reduced 28-day mortality in sepsis patients receiving Tα1, suggesting its immunomodulatory effects may counteract the immune suppression of sepsis.\n\n## Conclusion\n\nThymosin Alpha-1 is among the most clinically validated immunomodulatory peptides, with over 40 years of research and regulatory approval across multiple countries. Its Th1-promoting, antiviral, and dendritic cell-activating properties make it a key tool in immune research.	OmniQure Research Team	{"Thymosin Alpha-1",T-Cell,"Immune Modulation",Antiviral,Thymus}	published	https://cdn.pixabay.com/photo/2020/03/22/13/01/virus-4957673_640.jpg	Thymosin Alpha-1 Immune Modulation Research | OmniQure	Research overview of Thymosin Alpha-1 covering T-cell maturation, dendritic cell activation, antiviral immunity, and clinical findings in infection and cancer.	2026-05-21 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
22	N-Acetyl Epithalon Amidate: Enhanced Stability Longevity Peptide Research	n-acetyl-epithalon-amidate	N-Acetyl Epithalon Amidate is a chemically modified form of Epithalon with N-terminal acetylation and C-terminal amidation, providing enhanced metabolic stability and bioavailability for longevity research.	## What is N-Acetyl Epithalon Amidate?\n\nN-Acetyl Epithalon Amidate is a chemically modified version of Epithalon (Ala-Glu-Asp-Gly), the synthetic tetrapeptide analogue of Epithalamin derived from pineal gland tissue. The two modifications:\n\n1. **N-terminal acetylation**: Protects the N-terminus from aminopeptidase cleavage\n2. **C-terminal amidation**: Replaces the free C-terminal carboxyl with an amide group, protecting against carboxypeptidase cleavage and improving membrane permeability\n\nThese modifications are common strategies for improving peptide drug-like properties and are used throughout pharmaceutical development.\n\n## Why Modify Epithalon?\n\nNative Epithalon (Ala-Glu-Asp-Gly) has the limitations of small peptides:\n- Rapid proteolytic degradation in vivo (half-life minutes)\n- Limited membrane permeability\n- Potential poor bioavailability via non-injectable routes\n\nThe acetylated-amidated form is hypothesised to show:\n- Longer circulating half-life due to resistance to terminal aminopeptidases and carboxypeptidases\n- Enhanced cell penetration\n- Potentially improved sublingual or intranasal bioavailability\n\n## Research Context\n\nThe underlying research base on this analogue is limited compared to native Epithalon. Researchers should be aware that:\n\n- Most Epithalon efficacy data (telomerase activation, pineal modulation, life extension) derives from studies using the unmodified tetrapeptide\n- The modified form is presumed to retain similar activity based on its structural similarity\n- Independent validation of the modified form's activity is an area requiring further research\n\n## Telomerase and Longevity Mechanisms\n\nThe proposed mechanisms are inherited from the Epithalon research literature:\n- Telomerase activation in cell culture models\n- Pineal gland peptide bioregulation\n- Antioxidant activity (SOD and catalase upregulation)\n\n## Practical Considerations\n\nFor researchers choosing between Epithalon and N-Acetyl Epithalon Amidate, the key trade-off is:\n- **Epithalon**: Better-evidenced activity, more published data\n- **N-Acetyl Epithalon Amidate**: Hypothetically improved stability and bioavailability\n\n## Conclusion\n\nN-Acetyl Epithalon Amidate represents a stability-optimised version of Epithalon, developed to improve pharmacokinetic properties while retaining the biological activity of the parent peptide. It is best understood in the context of the broader Epithalon research literature.	OmniQure Research Team	{"N-Acetyl Epithalon Amidate",Epithalon,Longevity,Telomerase,"Peptide Stability"}	published	https://neurosciencenews.com/files/2024/12/aging-longevity-genetics-neuroscience.jpg	N-Acetyl Epithalon Amidate Longevity Peptide Research | OmniQure	Research overview of N-Acetyl Epithalon Amidate covering chemical modification rationale, stability improvements, and comparison with native Epithalon.	2026-05-22 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
23	N-Acetyl Selank Amidate: Stability-Enhanced Anxiolytic Peptide Research	n-acetyl-selank-amidate	N-Acetyl Selank Amidate is a chemically modified form of Selank with enhanced metabolic stability, studied for anxiolytic, nootropic, and immunomodulatory effects via the GABAergic and neurotrophic systems.	## Background\n\nN-Acetyl Selank Amidate is a modified version of Selank — itself a heptapeptide based on the tuftsin sequence (Thr-Lys-Pro-Arg) with an additional Pro-Gly-Pro extension. The acetyl and amide modifications to the N and C termini respectively provide resistance to aminopeptidases and carboxypeptidases, extending the peptide's half-life.\n\n## Selank's Mechanism\n\nThe underlying mechanisms of Selank (and by extension its modified form) have been studied primarily by Russian research institutes:\n\n### GABAergic Modulation\nSelank is proposed to modulate GABA-A receptors, producing anxiolytic effects similar to benzodiazepines but without dependence or sedation. The mechanism may involve allosteric modulation rather than direct receptor agonism.\n\n### BDNF Upregulation\nSelank increases BDNF (Brain-Derived Neurotrophic Factor) expression in the hippocampus and prefrontal cortex, which may underlie its cognitive-enhancing effects.\n\n### Enkephalin Stabilisation\nSelank inhibits enkephalin-degrading enzymes, prolonging the effects of endogenous enkephalin peptides and contributing to anxiolytic and mood effects.\n\n### Immunomodulation\nTuftsin (the parent sequence) is an endogenous phagocytosis-stimulating tetrapeptide. Selank retains some immunomodulatory activity, particularly on macrophage function and T-cell signalling.\n\n## Modified Form Advantages\n\nN-Acetyl Selank Amidate is hypothesised to offer:\n- Improved blood-brain barrier penetration\n- Longer duration of action due to resistance to peptidases\n- Potentially reduced dosing frequency\n\n## Research Limitations\n\nLike many Russian-origin peptides, the research base for Selank and its analogues is primarily from Soviet-era and Russian Federation publications, with limited independent replication in Western peer-reviewed literature. Researchers should evaluate primary sources critically.\n\n## Conclusion\n\nN-Acetyl Selank Amidate extends the anxiolytic and nootropic research profile of Selank with improved pharmacokinetic properties. It is best evaluated in the context of the broader Selank literature, with the acknowledgement that independent replication of core findings is limited.	OmniQure Research Team	{"N-Acetyl Selank Amidate",Selank,Anxiolytic,GABA,BDNF}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	N-Acetyl Selank Amidate Anxiolytic Peptide Research | OmniQure	Research overview of N-Acetyl Selank Amidate covering GABAergic modulation, BDNF upregulation, enkephalin stabilisation, and stability improvements.	2026-05-23 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
24	N-Acetyl Semax Amidate: Enhanced Neuroprotective Peptide Research	n-acetyl-semax-amidate	N-Acetyl Semax Amidate is a stability-optimised form of Semax, an ACTH-derived heptapeptide studied for neuroprotection, BDNF upregulation, and cognitive enhancement with improved bioavailability.	## Background\n\nN-Acetyl Semax Amidate is a chemically modified form of Semax (Met-Glu-His-Phe-Pro-Gly-Pro), an ACTH(4-7)-PGP heptapeptide developed at the Institute of Molecular Genetics of the Russian Academy of Sciences. N-terminal acetylation and C-terminal amidation are applied to enhance metabolic stability and CNS bioavailability.\n\n## Semax's Mechanism\n\n### BDNF and Neurotrophin Upregulation\nSemax's most consistently reported effect is upregulation of BDNF (Brain-Derived Neurotrophic Factor) and related neurotrophins in the brain. BDNF promotes:\n- Neuronal survival under ischaemic and excitotoxic stress\n- Synaptic plasticity and long-term potentiation (learning and memory formation)\n- Adult neurogenesis in the hippocampus\n\n### ACTH-Derived Activity\nSemax is derived from ACTH(4-7) but lacks the steroidogenic or adrenal-stimulating properties of full-length ACTH. It interacts with MC4R (melanocortin 4 receptor) in the brain, a receptor involved in memory, mood, and energy regulation.\n\n### Dopaminergic and Serotonergic Effects\nSemax modulates dopamine and serotonin turnover in the prefrontal cortex and hippocampus, potentially contributing to its nootropic and mood effects.\n\n## Neuroprotection Research\n\nSemax and N-Acetyl Semax Amidate have been studied in:\n- Stroke/ischaemia models: Reduced infarct size, improved neurological outcome\n- TBI models: Attenuated secondary injury and improved recovery\n- Neurodegenerative models: Reduced neuroinflammation and improved cognition in Alzheimer's-adjacent paradigms\n\n## Clinical Use in Russia\n\nSemax is approved in Russia as a prescription nasal spray for stroke, transient ischaemic attacks, and cognitive disorders, providing human pharmacological data. The acetylated-amidated form is designed for improved intranasal bioavailability and duration.\n\n## Conclusion\n\nN-Acetyl Semax Amidate represents the pharmacokinetically optimised form of one of the most studied neuroprotective peptides from Russian neuroscience. Its BDNF-upregulating, neuroprotective, and cognitive effects are well-documented in the primary literature.	OmniQure Research Team	{"N-Acetyl Semax Amidate",Semax,BDNF,Neuroprotection,ACTH}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	N-Acetyl Semax Amidate Neuroprotective Peptide Research | OmniQure	Research overview of N-Acetyl Semax Amidate covering BDNF upregulation, ACTH-derived neuroprotection, stroke research, and enhanced bioavailability.	2026-05-24 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
25	Selank: Tuftsin-Derived Anxiolytic and Nootropic Research	selank-anxiolytic-nootropic	Selank is a synthetic heptapeptide analogue of tuftsin (Thr-Lys-Pro-Arg) combined with Pro-Gly-Pro, studied for anxiolytic, nootropic, and immunomodulatory effects with a favourable side effect profile.	## What is Selank?\n\nSelank (Thr-Lys-Pro-Arg-Pro-Gly-Pro) is a synthetic heptapeptide developed at the Institute of Molecular Genetics, Russian Academy of Sciences. It combines the tuftsin sequence (Thr-Lys-Pro-Arg) with a C-terminal Pro-Gly-Pro extension that stabilises the peptide and modifies its receptor interactions.\n\nTuftsin itself is an endogenous tetrapeptide derived from the Fc region of IgG, with roles in innate immunity and phagocytosis stimulation. Selank extends this profile into the CNS.\n\n## Anxiolytic Properties\n\nThe most consistently reported effect of Selank in research models is anxiolytic activity:\n\n- Reduces anxiety-like behaviour in elevated plus maze and open field tests\n- Comparable to benzodiazepines in some paradigms but without motor impairment or sedation\n- No observed dependence or tolerance in rodent models with repeated administration\n- Proposed GABAergic mechanism — may modulate GABA-A receptor sensitivity\n\n## Nootropic Effects\n\nSelank enhances cognitive performance in rodent models:\n- Improved learning in maze tasks\n- Enhanced short-term memory consolidation\n- Increased attentional performance\n- BDNF upregulation in hippocampus and prefrontal cortex\n\n## Immunomodulatory Activity\n\nAs a tuftsin analogue, Selank retains immunomodulatory properties:\n- Stimulates macrophage phagocytic activity\n- Modulates T-cell activity and cytokine balance\n- Upregulates IL-2 and interferon levels in some models\n\n## Enkephalinase Inhibition\n\nA proposed mechanism for Selank's sustained CNS effects is inhibition of enkephalin-degrading enzymes, prolonging the action of endogenous opioid peptides. This mechanism is shared with a class of opioid-potentiating research compounds.\n\n## Safety Profile\n\nSelank has a well-characterised safety profile from Russian clinical use (approved as an anxiolytic nasal spray in Russia and Ukraine), with no documented sedation, dependence, or withdrawal at therapeutic doses.\n\n## Conclusion\n\nSelank offers a distinctive combination of anxiolytic, nootropic, and immunomodulatory effects in a single peptide, with a safety profile superior to conventional anxiolytics. It is one of the most interesting compounds in the Russian neuropsychopharmacology literature.	OmniQure Research Team	{Selank,Anxiolytic,Nootropic,Tuftsin,GABA}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	Selank Anxiolytic Nootropic Peptide Research | OmniQure	Research overview of Selank covering tuftsin-derived pharmacology, GABAergic anxiolytic effects, cognitive enhancement, and immunomodulatory activity.	2026-05-25 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
26	Semax: ACTH-Derived Heptapeptide and Neuroprotection Research	semax-acth-neuroprotection	Semax is a synthetic ACTH(4-7)-PGP heptapeptide developed in Russia, studied for neuroprotection, BDNF upregulation, cognitive enhancement, and stroke treatment research.	## Origins and Structure\n\nSemax (Met-Glu-His-Phe-Pro-Gly-Pro) is derived from the ACTH(4-7) sequence (Met-Glu-His-Phe) — the portion of ACTH responsible for CNS effects — with a C-terminal Pro-Gly-Pro extension added for stability and modified CNS activity. Crucially, Semax lacks ACTH's Phe-7 position and the steroidogenic C-terminal sequences, so it does not stimulate cortisol production.\n\n## Primary Mechanism: BDNF and Neurotrophin Signalling\n\nThe most replicated finding for Semax is its ability to upregulate neurotrophins, particularly:\n\n- **BDNF**: Increased expression in the hippocampus, prefrontal cortex, and striatum following acute administration\n- **VEGF**: Upregulated in some ischaemia models, contributing to neuroprotection via angiogenesis\n- **NGF**: Elevated in some model systems\n\nBDNF upregulation is pharmacologically significant because it mirrors the mechanism of some antidepressants and exercise-induced neuroplasticity.\n\n## Neuroprotection in Ischaemia\n\nThe most extensively studied application of Semax is cerebral ischaemia/stroke:\n- Reduced infarct volume in MCA occlusion rodent models\n- Improved neurological scoring in ischaemia models\n- Reduced oxidative stress markers and neuroinflammatory cytokines in affected tissue\n- Approved in Russia for ischaemic stroke treatment (as a nasal spray)\n\n## Cognitive Effects\n\nIn rodent learning and memory paradigms:\n- Improved performance in active and passive avoidance tasks\n- Enhanced Morris water maze performance\n- Reversed memory impairment in scopolamine (muscarinic antagonist) models\n- Effects appear mediated through MC4R activation and downstream BDNF\n\n## Neuroinflammation Research\n\nSemax reduces microglial activation and pro-inflammatory cytokine production (IL-1β, TNF-α) in CNS injury and neurodegenerative models, suggesting potential applications in neuroinflammatory conditions.\n\n## Conclusion\n\nSemax is one of the best-characterised neuroprotective peptides in the literature, with regulatory approval in Russia and a well-replicated BDNF-upregulating mechanism. It provides a valuable research tool for studying neurotrophin biology, stroke recovery, and cognitive enhancement.	OmniQure Research Team	{Semax,ACTH,BDNF,Neuroprotection,Stroke}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	Semax ACTH-Derived Neuroprotective Peptide Research | OmniQure	Research overview of Semax covering ACTH-derived neuroprotection, BDNF upregulation, stroke ischaemia findings, and cognitive enhancement research.	2026-05-26 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
27	BPC-157 + TB-500 Blend: Combined Healing and Regenerative Research	bpc-157-tb-500-blend	The BPC-157 + TB-500 blend combines two of the most studied healing peptides with complementary mechanisms: BPC-157's angiogenic and cytoprotective activity alongside TB-500's actin-mediated cell migration.	## Rationale for the Combination\n\nBPC-157 and TB-500 are frequently studied in combination because they address different aspects of tissue repair through mechanistically distinct pathways:\n\n**BPC-157** (Body Protection Compound-157):\n- Promotes angiogenesis via VEGF upregulation\n- Modulates nitric oxide signalling\n- Cytoprotects gastric mucosa and multiple tissue types\n- Stimulates fibroblast and tendon cell proliferation\n\n**TB-500** (Thymosin Beta-4):\n- Sequesters G-actin, facilitating lamellipodia formation and directed cell migration\n- Promotes keratinocyte and endothelial cell migration to wound sites\n- Anti-inflammatory via NF-κB modulation\n- Upregulates VEGF independently\n\nThe two peptides are proposed to be synergistic because BPC-157 creates the vascular architecture (new blood vessels) while TB-500 drives the cellular migration needed for complete tissue reconstitution.\n\n## Research Evidence\n\n**BPC-157 + TB-500 combination studies** in the primary literature are limited — most published work examines each peptide independently. The combination rationale is mechanistically sound but should be considered partly inferential pending dedicated combination studies.\n\n### Individual Evidence Bases\n- **BPC-157**: Extensive rodent data (tendon, ligament, muscle, GI, bone healing)\n- **TB-500**: Strong actin/cell migration data; cardiac and wound healing animal studies\n\n## Tissue Applications in Research\n\nThe combination has been applied in preclinical models of:\n- Tendon and ligament injury\n- Muscle tear and strain\n- Dermal wound healing\n- Surgical tissue repair\n\n## Research Design Considerations\n\nFor researchers using this blend:\n- The 1:1 ratio is the most common studied configuration, though optimal ratios are not established\n- Separate dosing allows individual peptide effects to be disambiguated\n- Blends are convenient for combined endpoint research but limit mechanistic attribution\n\n## Conclusion\n\nThe BPC-157 + TB-500 combination represents a mechanistically logical dual-peptide approach to tissue repair research, combining angiogenic and cell migration-promoting activities. It is best understood in the context of the robust individual literature for each component peptide.	OmniQure Research Team	{BPC-157,TB-500,"Peptide Blend","Tissue Repair",Angiogenesis}	published	https://cdn.pixabay.com/photo/2022/01/28/12/05/microbiology-6974451_640.jpg	BPC-157 + TB-500 Combination Healing Research | OmniQure	Research overview of the BPC-157 + TB-500 peptide blend, covering complementary mechanisms, combination rationale, and tissue repair research applications.	2026-05-27 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
28	DSIP: Delta Sleep-Inducing Peptide and Neuroendocrine Research	dsip-sleep-inducing-peptide	Delta Sleep-Inducing Peptide (DSIP) is a nonapeptide first isolated in 1977 for its ability to induce delta-wave EEG activity. It has been studied for sleep modulation, stress regulation, and neuroendocrine effects.	## Discovery\n\nDSIP (Trp-Ala-Gly-Gly-Asp-Ala-Ser-Gly-Glu) was first isolated from rabbit cerebral venous blood during slow-wave sleep by Schoenenberger and Monnier at the University of Basel in 1977. Their initial finding that perfusate from sleeping rabbits could induce sleep in awake recipients launched decades of investigation.\n\n## Sleep Research\n\n### Delta-Wave Induction\nDSIP was named for its ability to increase delta-wave (0.5–4 Hz) EEG activity in recipient animals following lateral ventricle infusion. Delta waves are the hallmark of slow-wave sleep (SWS), the restorative deep sleep stage.\n\n### Sleep Architecture\nSubsequent studies showed DSIP effects on sleep architecture including:\n- Reduction in sleep onset latency\n- Increased total sleep time\n- Altered NREM/REM distribution\n\n### Interpretation Challenges\nReplication of DSIP's sleep effects has been inconsistent across research groups. Variables including peptide purity, route of administration, species, and time-of-day effects appear to significantly influence outcomes.\n\n## Neuroendocrine Research\n\nBeyond sleep, DSIP has been found to modulate multiple neuroendocrine axes:\n- Inhibits somatostatin release, potentially influencing GH secretion\n- Modulates cortisol secretion (circadian rhythm effects)\n- Influences LH release in some models\n- Naloxone-sensitive effects suggest possible opioidergic interactions\n\n## Stress Response\n\nDSIP levels change during physical and psychological stress in animal models, and exogenous DSIP has been studied for:\n- Reducing stress-induced ulcer formation\n- Attenuating physiological stress responses\n- Anti-oxidant-like effects in some paradigms\n\n## Research Considerations\n\nDSIP research suffers from the same issues as many early neuropeptides:\n- Small study sizes\n- Inconsistent methodological standards\n- Limited modern replication with current techniques\n\nResearchers should approach this compound with appropriate scientific caution while acknowledging the intriguing breadth of its proposed activities.\n\n## Conclusion\n\nDSIP remains a scientifically interesting peptide with a unique historical origin in sleep research. Its neuroendocrine modulation, stress response, and sleep architecture effects make it a distinctive research tool for circadian and sleep biology.	OmniQure Research Team	{DSIP,Sleep,"Delta Waves",Neuroendocrine,Stress}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	DSIP Delta Sleep-Inducing Peptide Research | OmniQure	Research overview of DSIP covering delta-wave EEG induction, sleep architecture effects, neuroendocrine modulation, and stress research applications.	2026-05-28 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
29	Melanotan 1: α-MSH Analogue and Melanogenesis Research	melanotan-1-melanogenesis	Melanotan 1 (afamelanotide) is a linear synthetic analogue of α-MSH that activates MC1R, the primary regulator of skin pigmentation, and has been studied for photoprotection and melanogenesis research.	## Background\n\nMelanotan 1 (also known as afamelanotide, [Nle4,D-Phe7]-α-MSH) is a synthetic 13-amino acid analogue of α-melanocyte-stimulating hormone (α-MSH) with two substitutions:\n1. Nle4: Norleucine at position 4 (replacing methionine, improving oxidative stability)\n2. D-Phe7: D-phenylalanine at position 7 (replacing L-Phe, conferring protease resistance and increasing MC1R potency)\n\nThese modifications extend the biological half-life from approximately 1 minute (native α-MSH) to 12+ hours.\n\n## MC1R Pharmacology\n\nMelanotan 1 is a potent MC1R (melanocortin 1 receptor) agonist. MC1R is expressed on:\n- Melanocytes (skin, hair follicles)\n- Keratinocytes\n- Dermal fibroblasts\n- Immunocytes\n\nMC1R activation leads to:\n- Increased eumelanin (brown/black pigment) synthesis vs phaeomelanin (red/yellow)\n- Melanocyte proliferation\n- Anti-inflammatory effects on keratinocytes and immunocytes\n- DNA repair enhancement (via MSH-R signalling in some models)\n\n## Photoprotection Research\n\nThe most extensively clinically studied application is photoprotection in photosensitive diseases:\n- **Erythropoietic protoporphyria (EPP)**: FDA and EMA approved (as Scenesse/afamelanotide) — reduces sunlight-induced pain episodes\n- Clinical trials in vitiligo, polymorphous light eruption, and actinic keratosis\n\n## Distinction from Melanotan 2\n\n| Feature | Melanotan 1 | Melanotan 2 |\n|---|---|---|\n| Structure | Linear 13-mer | Cyclic 7-mer |\n| Primary receptor | MC1R | MC1R, MC3R, MC4R |\n| Libido effects | Minimal | Pronounced (MC4R) |\n| Regulatory status | FDA/EMA approved (EPP) | Not approved |\n| Nausea profile | Moderate | More pronounced |\n\n## Conclusion\n\nMelanotan 1 is the clinically validated member of the melanocortin analogue family, with regulatory approval for EPP and an extensive clinical dataset. Its selective MC1R profile and photoprotective mechanism make it a well-characterised tool for melanogenesis and photoprotection research.	OmniQure Research Team	{"Melanotan 1",α-MSH,MC1R,Melanogenesis,Photoprotection}	published	https://fvderm.com/wp-content/uploads/2024/04/The-Science-of-Beautiful-Skin-Insights-into-Dermatological-Research.png	Melanotan 1 α-MSH Analogue Melanogenesis Research | OmniQure	Research overview of Melanotan 1 (afamelanotide) covering MC1R pharmacology, melanogenesis, EPP clinical approval, and distinction from Melanotan 2.	2026-05-29 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
30	Melanotan 2: Cyclic α-MSH Analogue and Melanocortin Receptor Research	melanotan-2-cyclic-msh	Melanotan 2 is a cyclic synthetic α-MSH analogue that activates MC1R, MC3R, and MC4R, studied for melanogenesis, sexual function, and appetite regulation through broad melanocortin receptor pharmacology.	## Structure and Receptor Profile\n\nMelanotan 2 (cyclo[Nle4,D-Phe7]-α-MSH(4-10)) is a cyclic 7-amino acid peptide synthesised from the core active sequence of α-MSH. The cyclisation (via amide bond between the N-terminus and the side chain of lysine at position 10) confers conformational constraint that:\n- Increases metabolic stability\n- Enhances receptor binding affinity\n- Broadens receptor selectivity vs. the linear Melanotan 1\n\nMelanotan 2 activates MC1R, MC3R, and MC4R with significant affinity.\n\n## Melanogenesis (MC1R)\n\nLike Melanotan 1, MT-2 activates MC1R on melanocytes, increasing melanin synthesis and producing skin darkening. Due to the cyclic structure and shorter sequence, MT-2 has somewhat different receptor kinetics than MT-1.\n\n## Sexual Function Research (MC4R)\n\nThe most distinctive feature of MT-2 is its MC4R activity. MC4R is expressed in the hypothalamus and spinal cord, where it mediates:\n- Pro-erectile signalling in male rodent models (through autonomic nervous system activation)\n- Female sexual receptivity in some paradigms\n- PT-141 (bremelanotide) — a metabolite of MT-2 — was developed as a selective MC4R drug and is FDA-approved for hypoactive sexual desire disorder in premenopausal women\n\n## Appetite Regulation (MC3R/MC4R)\n\nBoth MC3R and MC4R are involved in energy homeostasis. MC4R activation suppresses appetite and increases energy expenditure. MT-2's activity at these receptors produces appetite-reducing effects in rodent models.\n\n## Side Effect Profile\n\nMT-2's broader receptor activity produces more off-target effects than MT-1:\n- Nausea (MC3R/MC4R in area postrema)\n- Facial flushing\n- Spontaneous erections in males at higher doses\n- Appetite suppression\n\nThese effects are relevant to research design and safety monitoring.\n\n## Conclusion\n\nMelanotan 2 is a pharmacologically rich melanocortin agonist whose broad receptor activity makes it a valuable tool for studying MC1R/MC3R/MC4R cross-talk, while its clinical derivative (bremelanotide) demonstrates the therapeutic translational potential of this peptide class.	OmniQure Research Team	{"Melanotan 2",α-MSH,MC4R,Melanogenesis,"Sexual Function"}	published	https://fvderm.com/wp-content/uploads/2024/04/The-Science-of-Beautiful-Skin-Insights-into-Dermatological-Research.png	Melanotan 2 Cyclic α-MSH Melanocortin Research | OmniQure	Research overview of Melanotan 2 covering MC1R/MC3R/MC4R pharmacology, melanogenesis, sexual function research, and comparison with Melanotan 1.	2026-05-30 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
31	Oxytocin: Social Bonding, Anxiety Modulation and Reproductive Research	oxytocin-social-bonding-research	Oxytocin is a nine-amino acid neuropeptide produced in the hypothalamus with established roles in parturition, lactation, social bonding, anxiety modulation, and emerging research in autism and psychiatric disorders.	## Background\n\nOxytocin (Cys-Tyr-Ile-Gln-Asn-Cys-Pro-Leu-Gly-NH2) is a cyclic nonapeptide produced by magnocellular neurons in the supraoptic and paraventricular nuclei of the hypothalamus. It is stored in and released from the posterior pituitary into the systemic circulation, and also released locally in the brain as a neuromodulator.\n\n## Classical Reproductive Physiology\n\n### Parturition\nOxytocin stimulates uterine smooth muscle contractions during childbirth via Gq-protein-coupled oxytocin receptors, explaining its clinical use (as Pitocin/Syntocinon) for labour induction.\n\n### Lactation\nOxytocin triggers the milk ejection (let-down) reflex by contracting myoepithelial cells of the mammary gland.\n\n## Social Neuroscience Research\n\nOxytocin's role as the "bonding hormone" is supported by substantial research:\n- Elevated during pair bonding, parent-infant contact, and sexual activity\n- Nasal administration in humans increases trust, eye contact, and social affiliation\n- Prairie vole studies (naturally monogamous rodents) demonstrated oxytocin is essential for pair bond formation via nucleus accumbens reward circuits\n- OXT receptor expression in limbic regions correlates with social behaviour phenotypes\n\n## Anxiety and Stress\n\nOxytocin has complex, context-dependent effects on anxiety:\n- Generally anxiolytic via HPA axis dampening (reduces CRH and cortisol responses)\n- Enhances social approach and reduces social anxiety\n- In-group/out-group effects: may amplify hostility toward strangers while increasing in-group trust — the "tend and defend" hypothesis\n\n## Autism Spectrum Research\n\nOxytocin has been extensively investigated in autism spectrum disorder (ASD):\n- Oxytocin system dysfunction has been proposed as a contributor to social deficits\n- Multiple clinical trials of intranasal oxytocin in ASD — results have been mixed, with some trials showing improved social cognition and others showing no effect\n- Age, baseline oxytocin levels, and dosing protocol appear to significantly affect outcomes\n\n## Conclusion\n\nOxytocin is one of the most studied neuropeptides in social neuroscience, with well-established reproductive physiology and a rich emerging literature in social behaviour, anxiety, and psychiatric research. Its translational relevance makes it a uniquely positioned research compound.	OmniQure Research Team	{Oxytocin,"Social Bonding",Anxiety,Autism,"Reproductive Research"}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	Oxytocin Social Bonding and Anxiety Research | OmniQure	Research overview of oxytocin covering social bonding, anxiety modulation, autism spectrum research, and reproductive physiology.	2026-05-31 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
32	VIP: Vasoactive Intestinal Peptide, Vasodilation and Immune Research	vip-vasoactive-intestinal-peptide	Vasoactive Intestinal Peptide (VIP) is a 28-amino acid neuropeptide with potent vasodilatory, bronchodilatory, anti-inflammatory, and immunomodulatory actions, studied across pulmonary, cardiovascular, and autoimmune research.	## Background\n\nVasoactive Intestinal Peptide (VIP) is a 28-amino acid peptide member of the glucagon/secretin superfamily, first isolated from porcine small intestine by Said and Mutt in 1970. It is widely distributed throughout the nervous system, gastrointestinal tract, lung, and immune system, acting on VPAC1 and VPAC2 receptors via Gs/cAMP signalling.\n\n## Vasodilatory Properties\n\nVIP was named for its initial identification as a potent vasodilator:\n- Relaxes vascular smooth muscle via endothelium-dependent and -independent mechanisms\n- Reduces pulmonary vascular resistance (relevant to pulmonary hypertension research)\n- Dilates coronary arteries and reduces cardiac afterload\n\n## Pulmonary Research\n\nVIP is one of the most potent endogenous bronchodilators:\n- Relaxes airway smooth muscle via VPAC receptors\n- Reduces airway mucus secretion\n- Anti-inflammatory effects in asthma and COPD models\n- VIP-deficient mice develop spontaneous pulmonary hypertension — demonstrating its essential role in lung homeostasis\n\n## Immune Modulation\n\nVIP's immunomodulatory actions are extensive:\n- Shifts macrophage polarisation from M1 (pro-inflammatory) to M2 (anti-inflammatory/reparative)\n- Inhibits TNF-α, IL-6, and IL-12 production\n- Upregulates IL-10 (anti-inflammatory)\n- Suppresses Th1 responses and promotes Th2 and T-regulatory cell differentiation\n- Reduces neuroinflammation in CNS disease models\n\n## Neuroprotective Effects\n\nAs a neuropeptide, VIP exerts neuroprotective actions:\n- Promotes neuronal survival under excitotoxic and oxidative stress\n- BDNF upregulation\n- Studied in models of Alzheimer's disease, Parkinson's disease, and traumatic brain injury\n\n## Autoimmune Disease Research\n\nVIP's anti-inflammatory profile has made it a subject of interest in:\n- Rheumatoid arthritis models (reduced joint inflammation and cytokine expression)\n- Inflammatory bowel disease models\n- Sepsis (VIP reduces systemic inflammatory response)\n- Multiple sclerosis models (neuroprotection and T-regulatory cell promotion)\n\n## Conclusion\n\nVIP is a remarkably pleiotropic neuropeptide with vasodilatory, bronchodilatory, anti-inflammatory, immunomodulatory, and neuroprotective properties. Its breadth of action across organ systems makes it a valuable research tool in pulmonary, cardiovascular, autoimmune, and neurological research.	OmniQure Research Team	{VIP,"Vasoactive Intestinal Peptide",Vasodilation,"Immune Modulation",Pulmonary}	published	https://cdn.pixabay.com/photo/2020/03/22/13/01/virus-4957673_640.jpg	VIP Vasoactive Intestinal Peptide Research | OmniQure	Research overview of VIP covering vasodilation, bronchodilation, immune modulation, neuroprotection, and autoimmune disease research.	2026-06-02 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
33	Cagrilintide: Long-Acting Amylin Analogue and Appetite Research	cagrilintide-amylin-analogue	Cagrilintide is a long-acting amylin analogue studied for appetite suppression, weight management, and metabolic regulation as a complement to GLP-1-based therapies.	## What is Cagrilintide?\n\nCagrilintide is a fatty acid-modified amylin analogue developed by Novo Nordisk. Amylin (islet amyloid polypeptide, IAPP) is a 37-amino acid peptide co-secreted with insulin from pancreatic beta cells. Native amylin has poor stability and forms amyloid fibrils — a property associated with type 2 diabetes pathology. Cagrilintide introduces structural modifications that:\n- Eliminate amyloid fibril formation\n- Extend half-life to approximately one week (enabling weekly dosing)\n- Maintain amylin receptor agonism\n\n## Amylin Receptor Biology\n\nAmylin acts on the amylin receptor — a complex of the calcitonin receptor (CTR) with receptor activity-modifying proteins (RAMPs). Key areas of expression:\n- Area postrema and nucleus of the solitary tract (NTS) — satiety signalling\n- Hypothalamus — appetite and energy regulation\n- Kidney — fluid and electrolyte balance\n\n## Appetite and Satiety Mechanisms\n\nCagrilintide suppresses appetite through:\n- Slowing gastric emptying (reducing meal size and post-meal glucose excursion)\n- Reducing food intake via central amylin receptor satiety signalling in area postrema/NTS\n- Decreasing meal frequency\n- Complementing GLP-1 signalling (different receptor, additive appetite suppression)\n\n## Combination Research: CagriSema\n\nThe most exciting clinical development is the combination of cagrilintide and semaglutide (CagriSema):\n- Phase III trials (REDEFINE programme) show >20% body weight reduction\n- Greater weight loss than either agent alone\n- Improved glycaemic control endpoints\n- Dual mechanism addresses both GLP-1 receptor (semaglutide) and amylin receptor (cagrilintide) pathways\n\n## Metabolic Effects\n\nAmylin analogues also have metabolic effects beyond appetite:\n- Suppress post-meal glucagon (reducing hepatic glucose output)\n- Reduce triglyceride-rich lipoprotein secretion\n- May improve insulin sensitivity at the CNS level\n\n## Conclusion\n\nCagrilintide represents the most advanced amylin-based research compound, with phase III clinical data from combination studies showing industry-leading weight loss efficacy. Its distinct mechanism from GLP-1 analogues makes it valuable for understanding complementary satiety pathways.	OmniQure Research Team	{Cagrilintide,Amylin,Appetite,"Weight Management",GLP-1}	published	https://media.istockphoto.com/id/1044228822/photo/nmr-science-lab-research-into-cancer-diabetes-dementia-or-autism.jpg?s=612x612&w=0&k=20&c=rxA58ckwj9z14n18UXB4xb82m1EP7LNsrdWzExqKNWo=	Cagrilintide Amylin Analogue Weight Management Research | OmniQure	Research overview of cagrilintide covering amylin receptor pharmacology, appetite suppression, combination with semaglutide (CagriSema), and weight loss findings.	2026-06-03 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
34	Retatrutide: Triple GIP/GLP-1/Glucagon Receptor Agonist Research	retatrutide-triple-receptor-agonist	Retatrutide is a novel triple agonist of GIP, GLP-1, and glucagon receptors, studied for weight management, metabolic syndrome, and non-alcoholic fatty liver disease with clinical data showing >20% weight reduction.	## The Triple Agonist Concept\n\nRetatrutide (LY3437943) represents the third generation of incretin-based metabolic pharmacology:\n- **Generation 1**: GLP-1 receptor agonists (semaglutide, liraglutide)\n- **Generation 2**: Dual GIP/GLP-1 receptor agonists (tirzepatide)\n- **Generation 3**: Triple GIP/GLP-1/glucagon receptor agonists (retatrutide)\n\nAdding glucagon receptor agonism to the GIP/GLP-1 combination is intended to increase energy expenditure via thermogenesis — a mechanism absent from GLP-1 and dual GIP/GLP-1 agents.\n\n## Receptor Pharmacology\n\n### GLP-1 Receptor (GLP-1R)\n- Insulin secretion (glucose-dependent)\n- Appetite suppression via hypothalamic and brainstem pathways\n- Gastric emptying delay\n- Cardiovascular protective effects\n\n### GIP Receptor (GIPR)\n- Amplifies insulin secretion in a glucose-dependent manner\n- Adipocyte effects — may enhance GLP-1-driven fat loss\n- Synergy with GLP-1 receptor signalling at multiple levels\n\n### Glucagon Receptor (GCGR)\n- Increases hepatic glucose output (the classical action, balanced by co-activated GLP-1R)\n- **Increases energy expenditure**: GCGR activation in brown adipose tissue drives thermogenesis\n- **Reduces hepatic fat**: Direct liver GCGR effects reduce hepatic lipogenesis\n- Increases lipolysis in adipose tissue\n\n## Clinical Research\n\nPhase 2 data from Eli Lilly's MOMENTUM trial demonstrated:\n- ~17–24% weight reduction at 48 weeks (dose-dependent) in adults with obesity\n- Greater weight loss than tirzepatide at comparable timepoints\n- Significant improvements in cardiometabolic markers (TG, HDL, blood pressure)\n- Reduction in liver fat by MRI\n\n## NASH/MASH Applications\n\nRetatrutide's glucagon receptor component makes it particularly interesting for non-alcoholic/metabolic-associated steatohepatitis (NASH/MASH):\n- Reduces hepatic lipogenesis directly via GCGR\n- Improves liver steatosis independent of body weight changes\n- Phase 3 trials are ongoing\n\n## Conclusion\n\nRetatrutide represents the current frontier of metabolic peptide pharmacology, combining three complementary receptor mechanisms to produce weight loss and metabolic improvement exceeding current dual agonists. Its unique thermogenic component via glucagon receptor activation sets it apart mechanistically.	OmniQure Research Team	{Retatrutide,GLP-1,GIP,Glucagon,"Weight Management",NASH}	published	https://media.istockphoto.com/id/1044228822/photo/nmr-science-lab-research-into-cancer-diabetes-dementia-or-autism.jpg?s=612x612&w=0&k=20&c=rxA58ckwj9z14n18UXB4xb82m1EP7LNsrdWzExqKNWo=	Retatrutide Triple Receptor Agonist Research | OmniQure	Research overview of retatrutide covering GIP/GLP-1/glucagon triple receptor pharmacology, thermogenesis, weight loss clinical data, and NASH applications.	2026-06-04 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
35	Tirzepatide: Dual GIP/GLP-1 Receptor Agonist Research	tirzepatide-dual-incretin-research	Tirzepatide is a synthetic dual agonist of GIP and GLP-1 receptors, FDA-approved for type 2 diabetes and obesity, studied for body weight reduction, glycaemic control, cardiovascular protection, and NASH.	## Background\n\nTirzepatide (LY3298176) is a 39-amino acid synthetic peptide that acts as a dual agonist at both glucose-dependent insulinotropic polypeptide (GIP) receptors and glucagon-like peptide-1 (GLP-1) receptors. It is FDA-approved as Mounjaro (type 2 diabetes) and Zepbound (obesity/weight management).\n\n## The Dual Agonist Pharmacology\n\n### GLP-1 Receptor Agonism\n- Stimulates glucose-dependent insulin secretion\n- Suppresses glucagon during hyperglycaemia\n- Reduces appetite via central mechanisms (hypothalamus, area postrema)\n- Slows gastric emptying\n- Cardiovascular protective effects (SURPASS-CVOT: 16% MACE reduction)\n\n### GIP Receptor Agonism\nThe addition of GIPR agonism to GLP-1R activity is what distinguishes tirzepatide from earlier GLP-1 agents:\n- **Potentiates GLP-1-mediated insulin secretion** at the pancreatic level\n- **Adipocyte effects**: GIPR on fat cells — tirzepatide may enhance fat mobilisation from adipose tissue via adipocyte GIPR signalling\n- **Brain GIPR**: Expression in hypothalamic nuclei, contributing to appetite suppression\n- **Synergy**: The combination produces greater weight loss than maximally dosed GLP-1 agonists\n\n## Weight Loss Research\n\nClinical trial data (SURMOUNT programme):\n- 15–21% body weight reduction at 72 weeks (dose-dependent)\n- Greater weight loss than semaglutide 2.4 mg in head-to-head SURMOUNT-5 trial\n- Reduced waist circumference, improved cardiometabolic markers\n\n## Non-Alcoholic Fatty Liver Disease\n\nThe SYNERGY-NASH trial demonstrated tirzepatide resolution of NASH (histological) in 44–62% of subjects, with no worsening of fibrosis — a landmark result in metabolic liver disease research.\n\n## Sleep Apnoea\n\nThe SURMOUNT-OSA trial found significant reductions in apnoea-hypopnoea index with tirzepatide, the first FDA-approved drug for obesity-related sleep apnoea.\n\n## Conclusion\n\nTirzepatide represents the best-evidenced dual incretin agonist, with extensive phase 3 clinical data across metabolic, cardiovascular, hepatic, and pulmonary research endpoints. It provides an important pharmacological reference point for research into next-generation metabolic peptides.	OmniQure Research Team	{Tirzepatide,GLP-1,GIP,"Dual Agonist",Obesity,NASH}	published	https://media.istockphoto.com/id/1044228822/photo/nmr-science-lab-research-into-cancer-diabetes-dementia-or-autism.jpg?s=612x612&w=0&k=20&c=rxA58ckwj9z14n18UXB4xb82m1EP7LNsrdWzExqKNWo=	Tirzepatide Dual GIP/GLP-1 Research | OmniQure	Research overview of tirzepatide covering dual GIP/GLP-1 receptor pharmacology, weight loss trial data, NASH findings, and sleep apnoea research.	2026-06-06 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
36	ARA-290: Innate Repair Receptor Agonist and Neuroprotection Research	ara-290-innate-repair-receptor	ARA-290 (Cibinetide) is a selective agonist of the innate repair receptor (IRR), a non-erythropoietic pathway of the EPO receptor, studied for neuroprotection, small fibre neuropathy, and tissue repair without haematopoietic effects.	## Background\n\nARA-290 (also known as cibinetide) is a synthetic 11-amino acid peptide derived from the three-dimensional structure of erythropoietin (EPO). It was designed to activate the tissue-protective arm of EPO signalling — the innate repair receptor (IRR) — while avoiding the haematopoietic EPO receptor complex that drives red blood cell production.\n\n## The IRR vs EPO Receptor Distinction\n\nEPO acts through two receptor complexes:\n1. **Homodimeric EPO receptor (EpoR/EpoR)**: Mediates erythropoiesis (red blood cell production). Clinically relevant but associated with thrombosis and tumour growth risks if over-activated.\n2. **Heteromeric innate repair receptor (EpoR/βcR)**: Mediates tissue protection, anti-inflammation, and repair. Does not drive erythropoiesis.\n\nARA-290 selectively binds βcR and activates the IRR complex, providing tissue-protective effects without erythropoietic risk — a pharmacologically important separation.\n\n## Neuroprotection Research\n\nARA-290 has been studied in multiple neuroprotection models:\n- Reduced neuroinflammation and cell death in rodent ischaemia models\n- Protection against chemotherapy-induced peripheral neuropathy\n- Improved nerve conduction velocity and intraepidermal nerve fibre density in diabetic neuropathy models\n\n## Small Fibre Neuropathy (SFN)\n\nThe most advanced clinical application is small fibre neuropathy:\n- A phase 2 randomised controlled trial demonstrated that ARA-290 significantly increased corneal nerve fibre density (a biomarker of small fibre regeneration) in sarcoidosis-associated SFN patients\n- Reduced pain scores and improved quality of life measures\n- This remains one of the most credible clinical signals for a research peptide in recent years\n\n## Anti-Inflammatory Effects\n\nARA-290 modulates innate immunity:\n- Reduces macrophage pro-inflammatory cytokine production\n- Promotes M2 macrophage polarisation\n- Inhibits neutrophil migration at sites of injury\n\n## Conclusion\n\nARA-290 is a mechanistically innovative peptide that separates EPO's tissue-protective properties from its haematopoietic effects, providing a tool for studying innate repair receptor biology in neuroprotection, neuroregeneration, and tissue repair research.	OmniQure Research Team	{ARA-290,Cibinetide,"Innate Repair Receptor",Neuroprotection,"Small Fibre Neuropathy"}	published	https://cdn.pixabay.com/photo/2018/06/08/00/48/neuron-3461704_640.jpg	ARA-290 Cibinetide Innate Repair Receptor Research | OmniQure	Research overview of ARA-290 covering innate repair receptor pharmacology, neuroprotection, small fibre neuropathy clinical data, and anti-inflammatory effects.	2026-06-07 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
37	GLOW BLEND: Skin-Focused Peptide Combination Research	glow-blend-skin-peptides	The GLOW BLEND is a proprietary peptide combination studied for skin repair, collagen synthesis stimulation, radiance improvement, and anti-ageing effects through synergistic multi-peptide mechanisms.	## Overview\n\nThe GLOW BLEND is a proprietary multi-peptide formulation designed to address multiple aspects of skin biology simultaneously. Rather than relying on a single mechanism, it combines peptides with complementary roles in the extracellular matrix, melanin regulation, and epidermal repair.\n\n## Multi-Target Skin Peptide Research\n\nModern cosmeceutical and dermatological research supports the use of peptide combinations for synergistic outcomes. Key target pathways in skin peptide research:\n\n### Collagen Synthesis\nSignal peptides (e.g., palmitoyl pentapeptide-4/Matrixyl) stimulate fibroblast collagen production by mimicking collagen breakdown products that signal for repair. Collagen-stimulating peptides are among the best-evidenced cosmeceutical ingredients.\n\n### Melanin Regulation\nPeptides can modulate melanocyte activity via MC1R and related pathways, influencing the balance between eumelanin (brown/black) and phaeomelanin (yellow/red) production, affecting skin tone uniformity.\n\n### Epidermal Growth Factor Pathway\nEGF-mimetic peptides stimulate keratinocyte proliferation and accelerate epidermal turnover, contributing to improved skin texture and wound healing.\n\n### Antioxidant Defence\nTripeptides like GHK-Cu stimulate antioxidant enzyme expression (SOD, catalase), protecting against UV and environmental oxidative damage.\n\n## Research Applications\n\nThe GLOW BLEND is suited to research in:\n- Skin ageing and photoageing models\n- Wound healing and post-procedure skin recovery\n- Collagen density assessment (histological and instrumental)\n- Melanin quantification in pigmentation models\n\n## Formulation Considerations\n\nPeptide blend research requires attention to:\n- Peptide-peptide interactions (stability in combination)\n- pH stability of individual components\n- Reconstitution solvent compatibility\n- Vehicle effects on skin penetration\n\n## Conclusion\n\nThe GLOW BLEND provides a multi-mechanism approach to skin research, targeting collagen synthesis, melanin regulation, epidermal renewal, and antioxidant defence. Its multi-peptide composition reflects the current direction of cosmeceutical research toward synergistic combination strategies.	OmniQure Research Team	{"GLOW BLEND","Skin Peptides",Collagen,Anti-Ageing,Cosmeceutical}	published	https://fvderm.com/wp-content/uploads/2024/04/The-Science-of-Beautiful-Skin-Insights-into-Dermatological-Research.png	GLOW BLEND Skin Peptide Combination Research | OmniQure	Research overview of the GLOW BLEND covering collagen synthesis, melanin modulation, epidermal renewal, and multi-peptide skin biology research.	2026-06-08 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
38	KLOW BLEND: Inflammatory Modulation Peptide Blend Research	klow-blend-inflammatory-modulation	The KLOW BLEND is a proprietary anti-inflammatory peptide combination studied for NF-κB pathway suppression, inflammatory cytokine reduction, and tissue recovery in inflammatory models.	## Overview\n\nThe KLOW BLEND is a proprietary multi-peptide formulation focused on modulating the inflammatory cascade. Named for its KPV-anchored anti-inflammatory mechanism, it combines peptides targeting multiple points in the inflammatory signalling network to achieve broader and more complete suppression.\n\n## Anti-Inflammatory Peptide Research Rationale\n\nThe inflammatory response involves multiple converging pathways. Single-agent anti-inflammatory peptides act at discrete points in these networks. A multi-peptide approach can:\n- Target redundant pathways simultaneously\n- Prevent signalling bypass around single-target inhibition\n- Allow lower individual peptide concentrations (reducing off-target effects)\n- Provide complementary mechanisms (receptor-level, intracellular, cytokine-level)\n\n## Key Anti-Inflammatory Mechanisms Targeted\n\n### NF-κB Pathway Inhibition\nKPV (Lys-Pro-Val) directly inhibits NF-κB nuclear translocation, reducing transcription of TNF-α, IL-1β, and IL-6. This is a central mechanism shared by several research peptides.\n\n### Melanocortin Pathway\nα-MSH-derived peptides activate MC3R and MC4R on immunocytes, producing cAMP elevation and PKA activation that downregulates macrophage inflammatory output.\n\n### Th1/Th2 Balancing\nSome peptide combinations can shift T-cell polarisation from pro-inflammatory Th1 toward anti-inflammatory Th2 and T-regulatory phenotypes.\n\n## Research Applications\n\nThe KLOW BLEND is studied in:\n- Inflammatory bowel disease and gut inflammation models\n- Arthritis and joint inflammation models\n- Post-surgical inflammatory response research\n- Chronic low-grade inflammation in metabolic disease models\n\n## Research Design Considerations\n\nWhen using peptide blends in anti-inflammatory research:\n- Establish that individual components are active in your model system first\n- Use appropriate cytokine panels (IL-1β, IL-6, TNF-α, IL-10, TGF-β) to characterise the inflammatory phenotype\n- Include positive controls (dexamethasone, indomethacin) for comparison\n\n## Conclusion\n\nThe KLOW BLEND provides a multi-target anti-inflammatory peptide tool for research into inflammatory pathology. Its combined mechanisms address the redundancy of the inflammatory cascade in a way that single-peptide approaches cannot.	OmniQure Research Team	{"KLOW BLEND",Anti-Inflammatory,NF-κB,KPV,Cytokines}	published	https://cdn.pixabay.com/photo/2020/03/22/13/01/virus-4957673_640.jpg	KLOW BLEND Anti-Inflammatory Peptide Research | OmniQure	Research overview of the KLOW BLEND covering NF-κB inhibition, melanocortin pathway anti-inflammatory activity, and inflammatory modulation research.	2026-06-10 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
39	Semax + Selank Blend: Combined Neuroprotective and Anxiolytic Research	semax-selank-blend-neuro	The Semax + Selank blend combines two established Russian neuropeptides with complementary mechanisms: Semax's BDNF-upregulating neuroprotection with Selank's GABAergic anxiolytic and immunomodulatory activity.	## Rationale for the Combination\n\nSemax and Selank are two of the most studied neuropeptides from Russian neuropharmacology, with distinct but complementary mechanisms:\n\n**Semax** (ACTH-derived):\n- Upregulates BDNF and neurotrophins\n- Neuroprotection in ischaemia and TBI models\n- Dopaminergic and serotonergic modulation\n- Cognitive enhancement\n\n**Selank** (Tuftsin-derived):\n- GABAergic anxiolytic effects (without sedation or dependence)\n- BDNF upregulation (shared with Semax)\n- Enkephalinase inhibition\n- Immunomodulatory via tuftsin mechanism\n\nThe combination is proposed to address both the neuroprotective/cognitive and anxiolytic/stress-modulating dimensions simultaneously.\n\n## Overlapping and Synergistic Mechanisms\n\nBoth peptides independently upregulate BDNF in the hippocampus, suggesting a potentially additive neurotrophin effect. Meanwhile, Semax's monoaminergic modulation and Selank's GABAergic activity target different neurotransmitter systems — reducing the risk of pathway competition.\n\n## Research Applications\n\nThe Semax + Selank combination is studied in:\n- Anxiety-depression comorbidity models (where both anxiolytic and neurotrophin effects are relevant)\n- Stress resilience research\n- Cognitive performance under stress conditions (where anxiety impairs cognitive output)\n- Neuroinflammation models (where both compounds have anti-inflammatory CNS effects)\n\n## Published Evidence\n\nMost evidence for each compound exists independently. Combination studies are limited in the published literature, making this an area where researchers can contribute meaningfully to the primary data. The mechanistic rationale for combination is strong, but controlled comparison studies between individual and combined peptide administration are sparse.\n\n## Practical Research Considerations\n\n- Both peptides are typically administered intranasally in clinical use\n- Injectable routes are available for research\n- Timing of administration relative to stressors or cognitive tasks is important for experimental design\n\n## Conclusion\n\nThe Semax + Selank blend addresses the neurological landscape of anxiety, stress resilience, neuroprotection, and cognition through complementary mechanisms. It represents a rational combination for research into brain health conditions where multiple pathways require simultaneous addressing.	OmniQure Research Team	{Semax,Selank,"Peptide Blend",Neuroprotection,Anxiolytic}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	Semax + Selank Neuroprotective Anxiolytic Blend Research | OmniQure	Research overview of the Semax + Selank blend covering complementary neuroprotective and anxiolytic mechanisms, BDNF upregulation, and research applications.	2026-06-11 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
40	Tesamorelin + Ipamorelin Blend: Synergistic GH Stimulation Research	tesamorelin-ipamorelin-blend	The Tesamorelin + Ipamorelin blend combines a GHRH analogue with a selective GH secretagogue, exploiting two complementary receptor pathways for synergistic GH release with a physiological pulse profile.	## Mechanistic Rationale\n\nThe Tesamorelin + Ipamorelin combination follows the same dual-pathway principle as CJC-1295 + Ipamorelin but uses tesamorelin — the clinically approved GHRH analogue — as the GHRH component:\n\n**Tesamorelin** (GHRH analogue):\n- Binds GHRH receptor (GHRHR) on pituitary somatotrophs\n- Activates Gs/cAMP/PKA signalling\n- Half-life: ~26 minutes (improved vs native GHRH by trans-3-hexenoic acid modification)\n- FDA-approved clinical reference dataset available\n\n**Ipamorelin** (selective GHSR-1a agonist):\n- Binds ghrelin receptor (GHSR-1a)\n- Activates Gq/PLC/IP3 calcium signalling (different from GHRHR)\n- Minimal off-target effects (no significant cortisol, prolactin, or appetite stimulation)\n- Produces clean GH pulse\n\n## Synergy Mechanisms\n\nWhen GHRH receptor and GHSR-1a are co-activated:\n1. cAMP/PKA (tesamorelin) and Ca²⁺ (ipamorelin) pathways converge on somatotroph secretory machinery\n2. Somatostatin inhibition by ipamorelin removes the brake on tesamorelin's stimulatory effect\n3. Combined GH pulse is 2–4x greater than either compound alone\n\n## Tesamorelin Advantage Over CJC-1295\n\nFor researchers comparing GHRH components:\n- **Tesamorelin**: Clinically approved, well-characterised in humans, shorter half-life (~26 min) produces more physiological pulsatility\n- **CJC-1295 No DAC**: Research compound only, ~30 min half-life, similar pulsatility profile\n- **CJC-1295 with DAC**: Very long half-life (days), non-pulsatile — less physiological for many research designs\n\n## Research Applications\n\nThe combination is studied in:\n- GH axis restoration in age-related GH decline\n- Body composition improvement (visceral fat and lean mass)\n- IGF-1 normalisation studies\n- Sleep architecture (GH predominantly secreted during SWS)\n\n## Conclusion\n\nThe Tesamorelin + Ipamorelin blend provides a clinically grounded, dual-mechanism GH secretagogue combination with strong individual pharmacological characterisation and robust synergy rationale. Tesamorelin's clinical approval provides human pharmacological reference data that pure research compounds cannot offer.	OmniQure Research Team	{Tesamorelin,Ipamorelin,"Growth Hormone",GHRH,"Peptide Blend"}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	Tesamorelin + Ipamorelin GH Blend Research | OmniQure	Research overview of the Tesamorelin + Ipamorelin blend covering dual GHRH/GHSR-1a receptor synergy, GH pulse amplification, and body composition research.	2026-06-13 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
41	CJC-1295 + Ipamorelin Blend: Dual Pathway Synergistic GH Research	cjc-1295-ipamorelin-blend-research	The CJC-1295 No DAC + Ipamorelin blend provides a 1:1 combination of a GHRH analogue and a selective GH secretagogue for maximum synergistic pulsatile GH release research.	## Overview\n\nThis blend pairs CJC-1295 No DAC (Modified GRF 1-29) with Ipamorelin in a 1:1 ratio, combining complementary growth hormone secretagogue mechanisms into a single research compound. It is one of the most commonly studied GH secretagogue combinations in the preclinical literature.\n\n## Component Mechanisms\n\n### CJC-1295 No DAC (Modified GRF 1-29)\nA 30-amino acid GHRH analogue with modifications at positions 2, 8, 15, and 27:\n- Position 2 (Ala→D-Ala): DPP-IV resistance\n- Position 8 (Asn→Gln): Improved stability\n- Position 15 (Gly→Ala): Reduced oxidation susceptibility\n- Position 27 (Met→Norleucine): Improved oxidative stability\n\nHalf-life: ~30 minutes. Produces physiological GHRH receptor activation and pulsatile GH release.\n\n### Ipamorelin (Selective GHSR-1a Agonist)\nHis-D-2-MeAla-Trp-D-Phe-Lys-NH2. The most selective GH secretagogue, with:\n- Minimal cortisol or prolactin elevation\n- No appetite stimulation\n- Clean GH pulse profile\n\n## Physiological Pulsatility\n\nThe combination maintains physiological GH pulsatility because:\n- Both components have relatively short half-lives (~30 min)\n- Somatostatin feedback remains active between pulses\n- GH secretion pattern mimics the natural 3–5 hour pulsatile rhythm rather than creating tonic GH elevation\n\nThis pulsatility is important because many of GH's effects (IGF-1 production, lipolysis, anabolic signalling) are pulse-dependent rather than concentration-dependent.\n\n## Synergy Evidence\n\nStudies combining GHRH analogues with GHRP-class peptides consistently show 2–4× greater GH release than either compound alone. The mechanisms are complementary:\n- GHRH receptor: Gs/cAMP/PKA → enhanced GH gene expression and vesicle priming\n- GHSR-1a: Gq/Ca²⁺ → triggers GH vesicle fusion and release\n- Ipamorelin also partially inhibits somatostatin release, removing the brake on GHRH action\n\n## Research Applications\n\n- GH axis pharmacology\n- Age-related GH decline models\n- Body composition studies (lean mass, fat mass)\n- IGF-1 dose-response characterisation\n- Sleep and circadian GH secretion studies\n\n## Conclusion\n\nThe CJC-1295 No DAC + Ipamorelin combination is the most widely studied GHRH/GHRP pairing in the research literature, offering well-documented synergistic GH release with a physiological pulsatility profile and Ipamorelin's clean selectivity. It is the reference combination for GH secretagogue research.	OmniQure Research Team	{CJC-1295,Ipamorelin,"Peptide Blend","Growth Hormone",GHRH,GHRP}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	CJC-1295 + Ipamorelin GH Blend Research | OmniQure	Research overview of the CJC-1295 No DAC + Ipamorelin blend covering dual GH secretagogue mechanisms, synergy evidence, pulsatility, and research applications.	2026-06-14 09:00:00+00	2026-08-03 13:47:47.31872+00	2026-08-03 13:47:47.31872+00
42	BPC-157: Mechanisms of Tissue Repair in Preclinical Research	bpc-157-tissue-repair-mechanisms	Body Protection Compound-157 has emerged as one of the most studied peptides in regenerative research. We examine its proposed mechanisms across tendon, muscle, and gastrointestinal models.	## Introduction\n\nBody Protection Compound-157 (BPC-157) is a synthetic pentadecapeptide derived from the gastric juice protein BPC. With the sequence Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val, it has been the subject of extensive preclinical investigation across a wide range of tissue repair models.\n\n## Proposed Mechanisms\n\n### Angiogenesis Promotion\n\nMultiple in vitro and in vivo studies have reported that BPC-157 upregulates VEGF (vascular endothelial growth factor) expression, promoting the formation of new blood vessels at injury sites. This neovascularisation is thought to accelerate nutrient delivery to healing tissue.\n\n### Nitric Oxide Pathway Modulation\n\nBPC-157 has been shown in rodent models to influence the nitric oxide (NO) system, modulating both eNOS and nNOS activity. This may contribute to its observed cytoprotective effects in gastric mucosa.\n\n### Tendon-to-Bone Healing\n\nResearch published in the *Journal of Orthopaedic Research* demonstrated accelerated tendon-to-bone healing in a rat Achilles tendon transection model, with histological evidence of improved collagen organisation and fibroblast proliferation.\n\n### Gastrointestinal Protection\n\nPerhaps the most consistently replicated finding is BPC-157's protective effect on gastric mucosa against NSAID-induced lesions, alcohol, and corrosion. The mechanism appears to involve both PGE2 modulation and direct cell proliferation signalling.\n\n## Research Considerations\n\nBPC-157 is approved exclusively for in vitro research purposes. All data referenced here derives from animal and cell culture studies. Human pharmacokinetics, safety profiles, and efficacy have not been established in clinical trials.\n\n## Conclusion\n\nBPC-157 remains one of the most mechanistically versatile peptides in the preclinical literature. Its apparent activity across diverse tissue types makes it a compelling subject for continued investigation, though researchers should carefully distinguish between replicated and single-study findings.	OmniQure Research Team	{BPC-157,"Tissue Repair",Angiogenesis,"Gastric Protection"}	published	https://media.istockphoto.com/id/182807377/photo/molecule.jpg?s=612x612&w=0&k=20&c=882ccFgZWW-568bFc8eMIpLgnyKpMH33M_YxqYUQLWY=	BPC-157 Tissue Repair Mechanisms | OmniQure Research	An in-depth look at the proposed mechanisms of BPC-157 in preclinical tissue repair research, covering angiogenesis, NO pathways, and gastrointestinal models.	2026-06-01 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
43	TB-500 and Thymosin Beta-4: What the Research Actually Shows	tb-500-thymosin-beta-4-research-review	TB-500 is a synthetic analogue of the naturally occurring protein Thymosin Beta-4. This review examines the peer-reviewed literature on its role in actin sequestration, wound healing, and cardiac models.	## Background\n\nThymosin Beta-4 (Tβ4) is a ubiquitous 43-amino acid protein found in virtually all mammalian cells. Its primary established role is as the main intracellular G-actin sequestering molecule, regulating the pool of monomeric actin available for polymerisation. TB-500 refers to a synthetic fragment corresponding to amino acids 17–23 of Tβ4 (Ac-LKKTETQ), which is proposed to retain key bioactive properties.\n\n## Actin Dynamics and Cell Migration\n\nThe sequestration of G-actin by Tβ4 is critical for lamellipodia formation and directed cell migration. In wound healing models, this translates to enhanced keratinocyte and endothelial cell migration toward the wound edge, a prerequisite for re-epithelialisation.\n\n## Cardiac Research\n\nA series of studies from the Bhatt laboratory demonstrated that Tβ4 can activate cardiac progenitor cells in mouse infarction models, promoting cardiomyocyte survival and modest regeneration. This has generated significant interest in the peptide's potential in myocardial research, though translation to clinical contexts remains speculative.\n\n## Angiogenesis\n\nLike BPC-157, Tβ4/TB-500 has been associated with upregulation of VEGF and promotion of endothelial tube formation in vitro. However, the two peptides appear to operate via distinct upstream mechanisms, making combination studies a potentially fruitful area of inquiry.\n\n## Anti-Inflammatory Properties\n\nSeveral papers report that Tβ4 downregulates NF-κB signalling and reduces pro-inflammatory cytokine expression (IL-1β, TNF-α) in macrophage models. This immunomodulatory role may be relevant to chronic wound healing scenarios.\n\n## Research Limitations\n\nMost TB-500 research utilises recombinant full-length Tβ4 rather than the synthetic fragment marketed as TB-500. Researchers should be cautious when extrapolating results between these molecules. All studies referenced are preclinical.\n\n## Summary\n\nTB-500/Thymosin Beta-4 represents a well-mechanistically grounded research peptide with consistent activity across wound healing, cardiac, and inflammatory models. Its actin-sequestering mechanism distinguishes it from growth factor-based peptides and offers a distinct research angle.	OmniQure Research Team	{TB-500,"Thymosin Beta-4","Wound Healing","Cardiac Research"}	published	https://cdn.pixabay.com/photo/2022/01/28/12/05/microbiology-6974451_640.jpg	TB-500 & Thymosin Beta-4 Research Review | OmniQure	A critical review of the peer-reviewed literature on TB-500 and Thymosin Beta-4, covering actin dynamics, wound healing, cardiac regeneration, and anti-inflammatory mechanisms.	2026-06-05 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
44	GHK-Cu: Copper Peptide Science and Skin Biology Research	ghk-cu-copper-peptide-skin-biology	GHK-Cu (glycyl-L-histidyl-L-lysine copper complex) has accumulated an impressive body of research spanning wound healing, gene expression, and anti-ageing biology. We review the current evidence base.	## What is GHK-Cu?\n\nGHK-Cu is a naturally occurring tripeptide-copper complex first isolated from human plasma by Dr Loren Pickart in 1973. The molecule consists of glycyl-L-histidyl-L-lysine coordinated with a Cu²⁺ ion. Plasma concentrations of GHK decline markedly with age — from approximately 200 ng/mL at age 20 to around 80 ng/mL by age 60 — a pattern that has driven research interest in its role in systemic repair signalling.\n\n## Gene Expression Modulation\n\nPerhaps the most remarkable finding in recent GHK-Cu research is its broad effect on gene expression. Pickart and colleagues demonstrated using microarray analysis that GHK-Cu modulates over 4,000 human genes, upregulating many involved in tissue remodelling, anti-inflammatory signalling, and DNA repair, while downregulating genes associated with cancer progression and inflammation.\n\n## Wound Healing and Collagen Synthesis\n\nThe established body of work on GHK-Cu in wound healing models is substantial:\n\n- **Collagen synthesis**: Multiple studies confirm upregulation of collagen types I, III, and VI in fibroblast cultures\n- **Glycosaminoglycan synthesis**: Increased hyaluronic acid and dermatan sulphate production\n- **Wound contraction**: Accelerated wound closure in rodent excisional models\n- **Angiogenesis**: VEGF upregulation and endothelial tube formation in vitro\n\n## Anti-Ageing and Extracellular Matrix Research\n\nGHK-Cu has demonstrated consistent activity in reducing the expression of matrix metalloproteinases (MMPs) responsible for collagen degradation, while simultaneously increasing expression of tissue inhibitors of metalloproteinases (TIMPs). This dual action on ECM turnover is a key area of cosmeceutical and geroscience research.\n\n## Neurological Research\n\nEmerging research suggests GHK-Cu may have neuroprotective properties, including upregulation of BDNF expression and modulation of oxidative stress pathways in neuronal models. This remains an early-stage area.\n\n## Stability Considerations\n\nResearchers working with GHK-Cu should be aware that the peptide-copper complex can be sensitive to pH and temperature. Reconstitution in slightly acidic aqueous solution (pH 5–6) and storage at -20°C is generally recommended for short-term stability.\n\n## Conclusion\n\nGHK-Cu stands apart from many research peptides by virtue of its well-characterised natural occurrence, its decades-long research history, and its unusually broad gene regulatory activity. It continues to be one of the most scientifically substantiated peptides in the skin biology and geroscience literature.	OmniQure Research Team	{GHK-Cu,"Copper Peptide",Collagen,"Skin Biology","Gene Expression"}	published	https://fvderm.com/wp-content/uploads/2024/04/The-Science-of-Beautiful-Skin-Insights-into-Dermatological-Research.png	GHK-Cu Copper Peptide Science | OmniQure Research Blog	A comprehensive review of GHK-Cu research, covering gene expression modulation, collagen synthesis, wound healing, and emerging neurological findings.	2026-06-09 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
45	Understanding Peptide Reconstitution: A Researcher's Guide	peptide-reconstitution-guide	Proper reconstitution is critical to research reproducibility. This guide covers solvent selection, concentration calculations, storage conditions, and common mistakes that compromise data quality.	## Why Reconstitution Matters\n\nLyophilised peptides are supplied in dry powder form for stability during shipping and storage. The process of reconstituting them into solution is the first and often most consequential step in any research protocol. Errors at this stage — wrong solvent, incorrect concentration, inadequate mixing, or improper storage — can invalidate experiments before they begin.\n\n## Solvent Selection\n\nThe appropriate solvent depends on the peptide's amino acid composition and sequence:\n\n### Aqueous Peptides\nPeptides with predominantly hydrophilic residues (Asp, Glu, Arg, Lys, His) typically dissolve well in:\n- Sterile water for injection (WFI)\n- Phosphate-buffered saline (PBS)\n- 0.9% sodium chloride solution\n\n### Hydrophobic Peptides\nPeptides with significant hydrophobic content (Trp, Phe, Leu, Val) may require:\n- A small volume of glacial acetic acid (5–10%) followed by dilution with water\n- DMSO as a co-solvent (typically ≤10% final concentration)\n- Acetonitrile for initial dissolution prior to aqueous dilution\n\n### BPC-157 Specifically\nBPC-157 dissolves readily in sterile water or acidic aqueous solution. Most researchers use sterile 0.9% NaCl or WFI. Avoid strongly alkaline conditions.\n\n### GHK-Cu Specifically\nAs a copper complex, GHK-Cu dissolves best in slightly acidic aqueous solution (pH 5–6). Phosphate buffers at neutral pH can cause precipitation.\n\n## Concentration Calculations\n\nThe reconstitution calculator on our site automates this, but the underlying formula is:\n\n**Volume (mL) = Mass (mg) / [Concentration (mg/mL)]**\n\nOr in molar terms:\n\n**Volume (mL) = [Mass (mg) / Molecular Weight (g/mol)] × 1000 / [Target concentration (mM)]**\n\n### Example: BPC-157\n- MW: 1419.5 g/mol\n- Vial: 5 mg\n- Target: 1 mg/mL (703 µM)\n- Add: 5 mL sterile water\n\n## Mixing Technique\n\n1. **Do not vortex** — mechanical shearing can denature peptides\n2. Gently swirl or roll the vial\n3. If dissolving slowly, allow to sit at room temperature for 5–10 minutes\n4. Check for complete dissolution before use — visual clarity is necessary but not sufficient (some precipitates are too fine to see)\n\n## Aliquoting and Storage\n\n- Prepare aliquots immediately after reconstitution to minimise freeze-thaw cycles\n- Suggested aliquot volumes: enough for one experimental run\n- Short-term (≤1 week): 4°C, sealed\n- Long-term: -20°C or -80°C in low-binding tubes\n- Avoid repeated freeze-thaw (limit to ≤3 cycles for most peptides)\n\n## Common Mistakes\n\n| Mistake | Consequence |\n|---|---|\n| Reconstituting in the wrong solvent | Precipitation, inactivity |\n| Using tap water | Microbial contamination, ion interference |\n| Vigorous vortexing | Peptide denaturation |\n| Storing at 4°C long-term | Degradation, bacterial growth |\n| Multiple freeze-thaw cycles | Progressive activity loss |\n\n## Quality Checks\n\nBefore using reconstituted peptide in experiments, verify:\n- Visual clarity (absence of visible precipitate)\n- Correct volume\n- Absence of colour change (most peptides should be colourless to faintly yellow)\n- pH if relevant to your model system\n\n## Conclusion\n\nReproducible peptide research starts with reproducible reconstitution. Standardising your solvent, concentration, mixing, and storage protocols — and documenting each step — is foundational to generating reliable data.	OmniQure Research Team	{Reconstitution,"Laboratory Technique","Research Protocol","Peptide Storage"}	published	https://images.pexels.com/photos/8940480/pexels-photo-8940480.jpeg?auto=compress&cs=tinysrgb&w=800	Peptide Reconstitution Guide for Researchers | OmniQure	A complete guide to peptide reconstitution covering solvent selection, concentration calculations, storage, and common mistakes that affect research quality.	2026-06-12 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
46	Semaglutide and GLP-1 Receptor Agonists: The Metabolic Research Landscape	semaglutide-glp1-metabolic-research	GLP-1 receptor agonists have reshaped metabolic research. This article surveys the mechanistic literature on semaglutide, focusing on pancreatic beta-cell function, appetite regulation, and cardiovascular effects.	## The GLP-1 Receptor Agonist Class\n\nGlucagon-like peptide-1 (GLP-1) is a 30-amino-acid incretin hormone secreted by L-cells of the intestinal mucosa in response to nutrient ingestion. Its principal physiological actions include:\n\n- Glucose-dependent insulin secretion from pancreatic beta cells\n- Suppression of glucagon secretion\n- Gastric emptying delay\n- Central appetite regulation via hypothalamic and brainstem pathways\n\nSemaglutide is a GLP-1 analogue modified to extend its half-life from approximately 2 minutes (native GLP-1) to approximately 7 days, achieved through a C-18 fatty diacid chain attachment and two amino acid substitutions.\n\n## Pancreatic Effects\n\n### Beta-Cell Function\nIn rodent models, semaglutide and related GLP-1 agonists have been shown to:\n- Stimulate insulin gene transcription\n- Promote beta-cell proliferation\n- Inhibit beta-cell apoptosis under glucotoxic and lipotoxic conditions\n\nThese effects operate through cAMP/PKA and PI3K/Akt signalling pathways downstream of GLP-1R activation.\n\n### Alpha-Cell Suppression\nGlucagon suppression under hyperglycaemic conditions is a well-replicated effect, reducing hepatic glucose output and contributing to improved glycaemic control models.\n\n## Central Nervous System Effects\n\nGLP-1 receptors are expressed throughout the brain, including in the arcuate nucleus, nucleus of the solitary tract, and area postrema. Semaglutide has demonstrated:\n\n- Reduction in caloric intake in rodent free-feeding models\n- Modulation of dopaminergic reward circuits (reduced food reward motivation)\n- Possible neuroprotective effects in models of Parkinson's and Alzheimer's disease (an emerging area of active investigation)\n\n## Cardiovascular Research\n\nThe SUSTAIN and PIONEER clinical trial programmes demonstrated cardiovascular risk reduction with semaglutide in type 2 diabetes populations. The proposed mechanisms from mechanistic studies include:\n\n- Direct endothelial GLP-1R activation reducing oxidative stress\n- Anti-inflammatory effects on atherosclerotic plaque\n- Blood pressure reduction via natriuresis\n- Improvements in lipid profiles\n\n## Research Considerations\n\nSemaglutide is available for in vitro and in vivo research purposes. Researchers should note that the subcutaneous formulation (Ozempic) and oral formulation (Rybelsus) have distinct pharmacokinetic profiles, and research-grade semaglutide may differ from pharmaceutical-grade material in formulation.\n\n## Emerging Research Directions\n\n- **Combination with tirzepatide-type dual agonism**: GLP-1/GIP dual receptor agonism represents a next-generation approach\n- **Neurodegeneration models**: Multiple groups are investigating GLP-1R agonism in Parkinson's and Alzheimer's models\n- **NASH/MASH**: Hepatic steatosis resolution in non-alcoholic steatohepatitis models\n- **Muscle preservation**: The question of lean mass preservation during GLP-1-driven weight loss is an active research area\n\n## Conclusion\n\nSemaglutide and the GLP-1 receptor agonist class represent one of the most fertile areas of contemporary metabolic and cardiovascular research. The mechanistic literature is extensive and continues to expand into non-metabolic disease areas.	OmniQure Research Team	{Semaglutide,GLP-1,"Metabolic Research",Cardiovascular,Diabetes}	published	https://media.istockphoto.com/id/1044228822/photo/nmr-science-lab-research-into-cancer-diabetes-dementia-or-autism.jpg?s=612x612&w=0&k=20&c=rxA58ckwj9z14n18UXB4xb82m1EP7LNsrdWzExqKNWo=	Semaglutide & GLP-1 Metabolic Research Overview | OmniQure	Survey of the mechanistic research on semaglutide and GLP-1 receptor agonists, covering pancreatic function, appetite regulation, and cardiovascular effects.	2026-06-15 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
47	Epithalon: Telomere Biology and the Search for Longevity Peptides	epithalon-telomere-biology-longevity	Epithalon (Epitalon) is a tetrapeptide studied for its proposed effects on telomerase activity and pineal function. We examine the research evidence and contextualise it within broader longevity biology.	## Background\n\nEpithalon (Ala-Glu-Asp-Gly) is a synthetic tetrapeptide analogue of Epithalamin, a natural polypeptide isolated from bovine pineal gland extracts. The compound was developed by Vladimir Khavinson and colleagues at the St Petersburg Institute of Bioregulation and Gerontology, where it has been the subject of study for over four decades.\n\n## Telomere Research\n\nThe most widely cited claimed mechanism of Epithalon is activation of telomerase, the enzyme responsible for maintaining telomere length at chromosomal ends. Telomere attrition is associated with cellular senescence and is widely considered a biomarker of biological ageing.\n\n### Key Studies\nA study by Khavinson et al. in *Bulletin of Experimental Biology and Medicine* reported that Epithalon stimulated telomerase activity in human fetal fibroblasts and prolonged their replicative lifespan. Additional cell culture studies reported elongation of telomeres in treated cells.\n\n### Critical Context\nIt is important to note that:\n- Most Epithalon research originates from a single research group\n- Independent replication by other laboratories is limited\n- Cell culture findings do not necessarily translate to in vivo or clinical contexts\n- Telomerase activation in somatic cells carries theoretical oncogenic risk at high levels\n\n## Pineal Gland and Melatonin Research\n\nEpithalon was originally investigated as a peptide bioregulator with activity in the hypothalamic-pineal axis. Animal studies reported:\n- Normalisation of circadian melatonin production in aged rats\n- Restoration of gonadotropin secretion patterns\n- Life extension in multiple rodent and invertebrate models (up to 25% in some studies)\n\n## Antioxidant Properties\n\nSeveral studies report antioxidant effects, including reduction of lipid peroxidation markers and upregulation of antioxidant enzymes (SOD, catalase) in aged animal models.\n\n## Regulatory and Research Status\n\nEpithalon is a research peptide with no approved medical applications in any jurisdiction. Researchers interested in telomere biology, cellular senescence, or circadian regulation may find it a useful tool compound, but should approach the existing literature with appropriate critical evaluation given the limited independent replication.\n\n## Broader Longevity Peptide Research\n\nEpithalon is part of a growing area of research into short peptide bioregulators. The Khavinson group's broader Cytomax and Cytogen series represents a systematic attempt to develop organ-specific peptide regulators, though this work remains largely outside mainstream Western geroscience.\n\n## Conclusion\n\nEpithalon occupies an interesting niche in longevity research — mechanistically plausible, with a substantial body of primary research, but lacking the independent replication and rigorous study design that would place it alongside better-validated geroscience compounds. It remains a legitimate research subject, particularly for groups interested in telomere biology and peptide bioregulators.	OmniQure Research Team	{Epithalon,Telomere,Longevity,"Pineal Gland",Anti-Ageing}	published	https://neurosciencenews.com/files/2024/12/aging-longevity-genetics-neuroscience.jpg	Epithalon, Telomere Biology & Longevity Research | OmniQure	An evidence-based review of Epithalon research, covering telomerase activation, pineal function, life extension studies, and critical evaluation of the evidence base.	2026-06-18 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
48	CJC-1295 and Ipamorelin: Growth Hormone Secretagogue Research	cjc-1295-ipamorelin-ghrh-ghrp-research	CJC-1295 and Ipamorelin act through complementary mechanisms to stimulate growth hormone release. This article reviews the pharmacology, research findings, and combination rationale for these two secretagogues.	## The Growth Hormone Secretagogue Concept\n\nGrowth hormone (GH) secretion is regulated by two principal hypothalamic signals: Growth Hormone-Releasing Hormone (GHRH), which stimulates GH release, and somatostatin, which inhibits it. Ghrelin and its synthetic mimetics (GHRPs) provide an additional, complementary stimulatory pathway via the GHSR-1a receptor.\n\nCJC-1295 and Ipamorelin exploit these two distinct mechanisms, making them a frequently studied combination in GH secretagogue research.\n\n## CJC-1295: GHRH Analogue\n\nCJC-1295 is a synthetic GHRH analogue with modifications at positions 2, 8, 15, and 27 to confer resistance to dipeptidyl peptidase-IV (DPP-IV) degradation. Two variants are commonly available:\n\n### CJC-1295 with DAC (Drug Affinity Complex)\nThe DAC modification causes covalent binding to albumin via maleimide chemistry, extending the half-life from minutes to approximately 6–8 days. This produces sustained, non-pulsatile GHRH stimulation.\n\n### CJC-1295 without DAC (Modified GRF 1-29)\nWithout DAC, the half-life is approximately 30 minutes, producing a more physiological pulsatile profile. This is often the preferred form for research seeking to maintain natural GH pulsatility.\n\n### Published Research\nA phase II clinical trial (Teichman et al., *JCEM*, 2006) demonstrated dose-dependent increases in GH and IGF-1 levels over 28 days with CJC-1295 with DAC, without significant adverse effects, providing important human pharmacological data.\n\n## Ipamorelin: Selective GHRP\n\nIpamorelin is a pentapeptide GH secretagogue (His-D-2-MeAla-Trp-D-Phe-Lys-NH2) developed to be highly selective for the GHSR-1a receptor. Unlike first-generation GHRPs such as GHRP-2 and GHRP-6, Ipamorelin demonstrates minimal off-target effects:\n\n- Negligible cortisol stimulation (unlike GHRP-2)\n- Negligible prolactin stimulation\n- No significant appetite stimulation (unlike GHRP-6)\n- Clean GH pulse with minimal IGF-1 independent effects\n\n### Research Findings\nAnimal studies have demonstrated that Ipamorelin reliably produces GH pulses with a 3–5 fold increase over baseline in rodent models. Its selectivity profile makes it a useful research tool for isolating GHSR-1a-mediated effects.\n\n## Combination Rationale\n\nThe rationale for combining CJC-1295 and Ipamorelin is mechanistic synergy:\n\n- CJC-1295 stimulates somatotrophs via GHRH receptor (Gsα/cAMP/PKA pathway)\n- Ipamorelin stimulates via GHSR-1a (Gq/PKC pathway, also Gsα)\n- Together they act on complementary second messenger systems\n- Animal studies demonstrate that combination produces greater GH release than either alone\n\n## Research Considerations\n\nStudies examining these peptides focus on GH and IGF-1 as primary endpoints. Researchers should note that the physiological consequences of sustained IGF-1 elevation are distinct from those of pulsatile GH secretion, and experimental design should account for which endpoint is relevant to the research question.\n\n## Conclusion\n\nCJC-1295 and Ipamorelin represent well-characterised growth hormone secretagogues with complementary mechanisms, a clear pharmacological rationale for combination use, and an accessible research literature. Their selectivity profiles — particularly Ipamorelin's minimal off-target activity — make them valuable tools in GH axis research.	OmniQure Research Team	{CJC-1295,Ipamorelin,"Growth Hormone",GHRH,GHRP,Secretagogue}	published	https://thumbs.dreamstime.com/b/exploration-advanced-neuroscience-technology-modern-laboratory-environment-sleek-lab-showcases-glowing-brain-models-329002686.jpg	CJC-1295 & Ipamorelin GH Secretagogue Research | OmniQure	Pharmacology and research findings for CJC-1295 and Ipamorelin, covering GHRH and GHRP mechanisms, combination rationale, and key published studies.	2026-06-22 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
49	Purity Testing: What the Data Actually Tells You	purity-testing-explained	Independent purity verification is the backbone of trustworthy research peptides. This article explains what purity data means, how it is generated, and what limitations researchers should understand.	## Why Purity Testing Matters\n\nResearch reproducibility depends critically on compound identity and purity. A peptide preparation that is 85% pure introduces up to 15% unknown material into every experiment — material that may itself be biologically active, toxic, or simply confounding. Understanding what purity data means — and what it cannot tell you — is an essential research skill.\n\n## How Purity Is Measured\n\nAnalytical laboratories separate the components of a peptide sample and measure the relative abundance of each. The dominant component is the target peptide; everything else is classed as an impurity — truncated synthesis fragments, deletion sequences, oxidised or reduced variants, residual protecting groups, or reagent contaminants. The **purity figure** reported on a Certificate of Analysis is the proportion of the sample made up by the target compound.\n\n### Consistency Between Batches\nA well-controlled manufacturing process produces consistent purity results across lots. Reputable suppliers publish lot-specific data rather than a single generic figure for a product line.\n\n### What a High Purity Number Means\nFor a research-grade peptide, a single dominant, well-resolved result indicates a clean preparation with minimal side-products.\n\n## What Purity Percentages Mean\n\n| Purity | Interpretation |\n|---|---|\n| ≥98% | Research grade; suitable for most in vitro and in vivo applications |\n| 95–97% | Acceptable for many applications; some impurity burden |\n| 90–94% | Lower grade; impurity effects must be considered |\n| <90% | Not recommended for mechanistic research |\n\nOmniQure provides only ≥98% independently verified peptides. Our COA data is available for every product.\n\n## What a Purity Result Cannot Tell You\n\nThis is critical: **purity does not confirm identity**. A result showing 99% purity tells you that 99% of the material in your sample is a single, consistent component. It does not confirm:\n\n- That the compound is the correct peptide sequence\n- That the compound has the correct molecular weight\n- That chiral centres have the correct stereochemistry\n- That the compound is the correct salt form\n\n## Practical Tips for Evaluating Supplier Data\n\n1. **Request the full Certificate of Analysis** — not just a purity number. Lot number, manufacturing date, and testing method all matter.\n2. **Check for lot-specific data** — generic, product-wide claims are far weaker evidence than per-batch results.\n3. **Ask which laboratory performed the analysis** — independent, accredited labs are more credible than in-house-only claims.\n4. **Compare purity alongside identity confirmation** — purity and identity are separate questions, and both matter.\n\n## Conclusion\n\nPurity data is a necessary quality indicator for research peptides, but researchers should understand both the power and limitations of the measurement when evaluating the material they work with.	OmniQure Research Team	{"Purity Testing","Quality Control","Research Methods"}	published	https://founderssg.com/wp-content/uploads/2025/01/lab-jars.jpg	Purity Testing for Research Peptides Explained | OmniQure	A researcher's guide to understanding purity data and purity percentages in peptide research.	2026-06-25 09:00:00+00	2026-08-03 13:47:47.32441+00	2026-08-03 13:47:47.32441+00
\.


--
-- Data for Name: customer_credit_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_credit_transactions (id, customer_id, amount_pence, type, reason, admin_note, order_id, created_at) FROM stdin;
\.


--
-- Data for Name: customer_credits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customer_credits (id, customer_id, balance_pence, updated_at) FROM stdin;
\.


--
-- Data for Name: customers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.customers (id, email, first_name, last_name, password_hash, phone, address1, address2, city, county, postcode, country, total_orders, total_spend_gbp, created_at, updated_at, reset_token, reset_token_expires_at, referral_code, referred_by, referral_credit_gbp, last_seen_ip, last_seen_country, known_ips, referral_abuse_flag) FROM stdin;
\.


--
-- Data for Name: discount_codes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discount_codes (id, code, type, value, min_spend, usage_limit, usage_count, expires_at, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: email_logs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.email_logs (id, to_email, subject, type, status, resend_id, order_number, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_audit_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.inventory_audit_log (id, product_id, product_name, change_type, quantity_before, quantity_after, quantity_change, reason, reference_id, reference_type, created_at) FROM stdin;
\.


--
-- Data for Name: loyalty_transactions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.loyalty_transactions (id, customer_id, order_id, type, points, description, created_at) FROM stdin;
\.


--
-- Data for Name: newsletter_subscribers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.newsletter_subscribers (id, email, first_name, is_active, source, subscribed_at, unsubscribed_at) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, order_id, product_id, product_name, product_category, quantity, price_gbp, created_at) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, order_number, status, customer_email, customer_name, customer_id, phone, address1, address2, city, county, postcode, country, subtotal_gbp, bundle_discount_gbp, shipping_cost_gbp, tax_amount_gbp, total_gbp, refunded_amount_gbp, refund_status, shipping_method, shipping_rate_id, tracking_number, notes, fraud_score, fraud_flags, fraud_reviewed, fraud_review_note, created_at, updated_at, review_request_sent_at) FROM stdin;
\.


--
-- Data for Name: product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_reviews (id, product_id, customer_id, customer_name, rating, title, body, is_approved, created_at) FROM stdin;
1	1	90001	Sean Z.	5	Great for IGF-1 pathway studies	Used alongside IGF-1 LR3 for downstream signalling research. Both compounds excellent. Consistent lot-to-lot quality is what keeps me coming back.	t	2026-03-12 13:48:55.294+00
2	2	90021	Connor G.	4	Solid product, will reorder	Good purity, complete documentation, reasonable pricing. Nothing to complain about on the product side. Product itself is great.	t	2026-03-31 13:48:55.294+00
3	3	90041	Tom W.	4	Solid research grade material	Good product for gastrointestinal research protocols. Reconstitution was smooth and aliquots have remained stable at -20°C for 8 weeks so far.	t	2025-08-04 13:48:55.294+00
4	4	90061	Joshua T.	5	Best source I've found for this compound	Tried three other suppliers before this one. This is the only one that provided the full lab report, not just a purity number. The data integrity here is on another level.	t	2026-07-06 13:48:55.294+00
5	5	90081	Claire J.	4	Good value for the quality	Pricing is fair for the documentation provided. full lab report included, which is increasingly rare. Minor note only that the website checkout could be smoother.	t	2025-09-01 13:48:55.294+00
6	6	90101	Emma R.	5	Best source I've found for this compound	Tried three other suppliers before this one. This is the only one that provided the full lab report, not just a purity number. The data integrity here is on another level.	t	2026-06-01 13:48:55.294+00
7	7	90121	Niall O.	5	Excellent blend for tissue repair research	Using in our tissue repair model. Having both components documented individually in the data sheet is invaluable. Activity is exactly as literature predicts.	t	2025-12-28 13:48:55.294+00
8	8	90141	James T.	4	Good synergistic research blend	Blend composition matches what's stated. Both peptides dissolve cleanly together. Documentation is comprehensive. Product quality is excellent.	t	2026-04-10 13:48:55.294+00
9	9	90161	Chris N.	5	Excellent for adiposity research	Used in our metabolic syndrome study. Compound purity and activity are both exceptional. More detail than any other supplier I've used at this price point.	t	2025-10-09 13:48:55.294+00
10	10	90181	Callum X.	5	Best source for this compound class	Tried two other suppliers. This material is considerably cleaner based on our in-house testing. The data is accurate and detailed.	t	2026-02-14 13:48:55.294+00
11	11	90201	Rosalind T.	4	Good product for GH axis research	Peptide dissolved readily in sterile water and showed expected activity in our cell-based assay. Documentation complete. Product arrived in good condition.	t	2026-01-17 13:48:55.294+00
12	12	90221	Stellan U.	4	Clean material for secretagogue studies	Purity is where it should be for serious research use. The lyophilised form is stable and dissolves well. Good batch.	t	2026-03-30 13:48:55.294+00
13	15	90281	George C.	4	Solid choice for this compound class	Detailed purity documentation as standard for a tetrapeptide is reassuring. Purity also within spec. Good supplier for longevity research.	t	2025-09-27 13:48:55.294+00
14	16	90301	Mark E.	5	Exceptional purity for telomere research	Ordered for telomerase activity assays. Purity 99.2% by in-house testing — matches stated value exactly. This is what research-grade means.	t	2025-11-22 13:48:55.294+00
15	17	90321	Amy Z.	4	High quality copper peptide	Good dissolution and expected colour profile. independent testing matches what was stated. Solid product for skin biology research.	t	2025-10-08 13:48:55.294+00
16	18	90341	Sophia G.	5	Outstanding for collagen research	Using in fibroblast cell culture studies. Activity in our collagen synthesis assay is exactly as literature predicts. Documentation is exemplary.	t	2026-06-28 13:48:55.294+00
17	19	90361	Calliope R.	5	Impressive purity documentation	Ordered for GH secretagogue receptor binding studies. full lab report provided with peak analysis. The data quality here is what separates this supplier from competitors.	t	2026-06-29 13:48:55.294+00
18	20	90381	Jake F.	5	Consistent batch quality	Third order of this compound. Each batch has come with consistent purity data and clean analytical profiles. That reproducibility is critical for longitudinal work.	t	2025-11-10 13:48:55.294+00
19	21	90401	Grace H.	5	Reliable and well documented	Fourth order this year. Every batch has come with fresh lot-specific documentation. Purity has been above 99% every time — impressive consistency.	t	2026-03-05 13:48:55.294+00
20	22	90421	Hannah V.	5	Perfect for synergistic receptor research	Running dual pathway studies and needed both compounds documented separately. That's provided as standard here. Compound quality is excellent.	t	2025-12-10 13:48:55.294+00
21	23	90441	Poppy R.	4	Good quality hormonal peptide	Purity is within spec based on our independent testing analysis. Reconstitution was clean in sterile water. Documentation more comprehensive than most suppliers.	t	2026-01-02 13:48:55.294+00
22	24	90461	Calliope R.	5	Research grade — genuinely	I've been burned by substandard material before. The documentation here is the real deal — our own testing results were independently verifiable.	t	2025-12-22 13:48:55.294+00
23	25	90481	Celestine X.	5	Excellent for pituitary studies	Used for rat pituitary cell work. Compound purity is excellent and our GH secretion assay results are clean and reproducible. Very happy.	t	2026-06-12 13:48:55.294+00
24	26	90501	Evelyn Q.	5	Cleanest GHRP I've sourced in two years	Tried several vendors for this compound. This batch is notably cleaner. The purity profile has minimal secondary peaks. Our in-vitro GH release assay confirms bioactivity.	t	2026-03-06 13:48:55.294+00
25	27	90521	Lily A.	4	Clean material for secretagogue studies	Purity is where it should be for serious research use. The lyophilised form is stable and dissolves well. Good batch.	t	2025-09-18 13:48:55.294+00
26	28	90541	Alice B.	5	Excellent for KISS1 pathway research	Running hypothalamic GnRH studies. Kisspeptin-10 is consistently clean batch to batch. Detailed lot-specific purity data is exactly what we need.	t	2025-11-19 13:48:55.294+00
27	29	90561	Stellan U.	4	Well documented and clean	purity profile is clean with minimal secondary peaks. Good quality material.	t	2025-12-16 13:48:55.294+00
28	30	90581	Evelyn Q.	4	Good synergistic research blend	Blend composition matches what's stated. Both peptides dissolve cleanly together. Documentation is comprehensive. Product quality is excellent.	t	2025-12-26 13:48:55.294+00
29	31	90601	Michael B.	5	Excellent for gut biology research	Using in intestinal epithelial cell studies. Compound quality is exceptional and consistent. Detailed purity documentation as standard is a huge differentiator.	t	2025-10-29 13:48:55.294+00
30	51	90621	Laura H.	5	Excellent for adiposity research	Used in our metabolic syndrome study. Compound purity and activity are both exceptional. More detail than any other supplier I've used at this price point.	t	2026-05-08 13:48:55.294+00
31	32	90641	Ruairidh M.	4	Excellent for thymic peptide research	Thymosin Alpha-1 purity is above spec. Documentation includes a full lab report as expected. An excellent product and supplier.	t	2026-05-02 13:48:55.294+00
32	33	90661	Luke D.	5	Ideal for pharmacology research	The level of analytical data provided here is what you need for serious research use. Compound quality is also excellent. Recommended.	t	2026-04-23 13:48:55.294+00
33	34	90681	Freya T.	4	Good product, solid supplier	Purity is within stated spec. Reconstitution clean and straightforward. Documentation more comprehensive than any other supplier at this price point.	t	2026-07-31 13:48:55.294+00
34	35	90701	Imogen Y.	5	Best source for this compound class	Compared three suppliers for purity and documentation. This is clearly the best option — full lab reports included as standard is rare and valuable.	t	2026-07-08 13:48:55.294+00
35	36	90721	Connor G.	5	Excellent for mitochondrial research	Ordered for mitochondrial membrane potential assays. Purity and documentation are both excellent — independent testing shows a very clean profile.	t	2026-04-16 13:48:55.294+00
36	37	90741	Amber L.	5	Best source for this compound class	Compared three suppliers for purity and documentation. This is clearly the best option — full lab reports included as standard is rare and valuable.	t	2026-03-21 13:48:55.294+00
37	38	90761	Freya T.	5	Perfect for pineal peptide research	Purity and purity documentation are exactly what we need for antioxidant and longevity pathway studies. Clean material, well documented.	t	2025-10-13 13:48:55.294+00
38	39	90781	Amber L.	5	Ideal for cognitive research protocols	Clean material, verified purity, and detailed analytical documentation. Everything we need for a well-controlled study. Will reorder.	t	2025-10-19 13:48:55.294+00
39	40	90801	Ethan V.	4	Good batch, replicable results	Third order of this compound. Results in our cognition model are consistent batch to batch. That's what you need when running longitudinal work.	t	2026-07-11 13:48:55.294+00
40	41	90821	Celestine X.	5	Best source for this compound class	Compared three suppliers for purity and documentation. This is clearly the best option — full lab reports included as standard is rare and valuable.	t	2026-04-09 13:48:55.294+00
41	42	90841	Daisy N.	5	Excellent for receptor pharmacology	Using in binding assay studies. Compound purity directly affects assay signal-to-noise. Clean, reproducible results here. Highly recommended.	t	2026-02-24 13:48:55.294+00
42	43	90861	Matilda F.	5	Excellent for receptor pharmacology	Using in binding assay studies. Compound purity directly affects assay signal-to-noise. Clean, reproducible results here. Highly recommended.	t	2025-12-31 13:48:55.294+00
43	47	90941	Calliope R.	5	Consistent batch quality	Second order of this compound. Purity numbers are very close to the previous batch — good quality control. Essential for longitudinal research protocols.	t	2026-02-16 13:48:55.294+00
44	48	90961	Michael B.	4	Reliable supplier for this compound class	Have now ordered three different GLP-1 related peptides. All three have been excellent. Packaging is solid for international orders.	t	2026-02-04 13:48:55.294+00
45	49	90981	Violet B.	4	Well documented and clean	full lab report provided. No degradation peaks. Performing exactly as expected in our long-term obesity model.	t	2026-06-29 13:48:55.294+00
46	50	91001	Lily A.	5	Excellent purity for metabolic research	Ordered for GLP-1 receptor pharmacology studies. independent testing confirmed purity within spec. Reconstitution clean with no particulates.	t	2026-01-02 13:48:55.294+00
47	52	91021	Tom W.	4	Great quality product	Purity checks out and dissolution is straightforward in the supplied buffer. Aliquots have been stable at -80°C for our metabolic model.	t	2026-05-05 13:48:55.294+00
48	53	91041	Alice B.	4	Well within spec	in-house testing matched the stated value within acceptable limits. Clean dissolution, no visible aggregation. Good value for documentation provided.	t	2025-12-02 13:48:55.294+00
49	54	91061	Owen D.	5	Clean, well-characterised blend	Both components verified independently. The blend reconstitutes cleanly and our assay results are consistent with published literature. Very pleased.	t	2026-03-06 13:48:55.294+00
50	55	91081	Stellan U.	4	Good batch, replicable results	Third order of this compound. Results in our cognition model are consistent batch to batch. That's what you need when running longitudinal work.	t	2025-10-11 13:48:55.294+00
51	56	91101	Amy Z.	4	Solid product, will reorder	Good purity, complete documentation, reasonable pricing. Nothing to complain about on the product side. Product itself is great.	t	2025-08-13 13:48:55.294+00
52	60	91181	Finn Q.	5	Excellent for gastrointestinal research	Clean material with no visible particulates on reconstitution. Our cytoprotection assay gave results consistent with published literature. Very satisfied.	t	2026-05-05 13:48:55.294+00
53	61	91201	Cormac C.	5	Excellent for gastrointestinal research	Clean material with no visible particulates on reconstitution. Our cytoprotection assay gave results consistent with published literature. Very satisfied.	t	2026-02-05 13:48:55.294+00
54	62	91221	Zoe X.	5	Outstanding purity, dissolved perfectly	Ordered for in-vitro tissue repair research. purity data matches exactly what was stated. Dissolved cleanly in sterile water with no particulates. Very impressed.	t	2025-09-20 13:48:55.294+00
55	63	91241	Grace H.	4	Very good quality material	Product quality is excellent. The lyophilised cake was intact and reconstituted perfectly. Content itself is top tier — very clean profile on our in-house testing.	t	2025-11-04 13:48:55.294+00
56	64	91261	George C.	5	Excellent for combined pathway studies	Individual component documentation makes this suitable for our quality-assured research environment. Both peptides confirmed independently.	t	2026-04-11 13:48:55.294+00
57	65	91281	Luke D.	4	Good immunological research peptide	Clean material with comprehensive documentation. Activity in our NK cell assay is consistent with published data.	t	2025-12-12 13:48:55.294+00
58	66	91301	Magnus Y.	5	Excellent for GIP/GLP research	Running dual receptor studies. Compound is clean and well-characterised. Results in our cell-based assay are highly reproducible. Very satisfied.	t	2025-08-06 13:48:55.294+00
59	67	91321	Laura H.	4	Good purity, clean dissolution	Reconstituted cleanly in PBS. No visible particulates. Our receptor binding assay gave clean results consistent with published literature.	t	2026-04-08 13:48:55.294+00
60	68	91341	Calliope R.	5	Excellent for GIP/GLP research	Running dual receptor studies. Compound is clean and well-characterised. Results in our cell-based assay are highly reproducible. Very satisfied.	t	2025-08-14 13:48:55.294+00
61	69	91361	Violet B.	5	Consistent batch quality	Second order of this compound. Purity numbers are very close to the previous batch — good quality control. Essential for longitudinal research protocols.	t	2025-09-21 13:48:55.294+00
62	70	91381	David K.	5	Top tier GLP-1/GIP agonist material	Running receptor binding assays with this compound. Activity correlates well with published Ki values. Analytical documentation is excellent.	t	2025-11-09 13:48:55.294+00
63	72	91421	Calliope R.	4	Good quality recombinant peptide	Purity is within spec based on our verification. Documentation comprehensive. Performs as expected in our STAT5 phosphorylation assay.	t	2025-08-22 13:48:55.294+00
64	73	91441	David K.	5	Excellent for mitophagy studies	Compound is clean and well characterised. Results in our mitochondrial function assay are consistent with published literature. Very pleased.	t	2026-02-14 13:48:55.294+00
65	74	91461	Niall O.	5	Very high purity, clean reconstitution	Lyophilised cake was pristine on arrival. Reconstituted quickly and completely. Our receptor binding assay confirms expected pharmacological activity.	t	2026-03-02 13:48:55.294+00
\.


--
-- Data for Name: products_catalog; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_catalog (id, slug, name, category, price_gbp, short_description, description, image_url, purity, also_known_as, molecular_weight, cas_number, formula, sequence, storage, appearance, solubility, half_life, coa_url, ms_image_url, is_published, is_featured, sort_order, created_at, updated_at) FROM stdin;
2	aod-9604-10mg	AOD-9604 10mg	Growth Peptides	95.00	10mg vial of AOD-9604 — a synthetic hGH fragment investigated for fat metabolism and lipolytic activity.	AOD-9604 10mg is a synthetic peptide analogue of the C-terminal fragment of human growth hormone (hGH), residues 176–191. Investigated for stimulating lipolysis and inhibiting lipogenesis without the growth-promoting or insulin-desensitizing effects of full-length hGH.	/products/2.jpg	99%+	AOD9604, hGH Fragment 176-191	908.1 g/mol	221231-10-3	C₄₅H₆₉N₉O₁₀	\N	Store lyophilized at -20°C. After reconstitution store at 4°C for up to 4 weeks.	White lyophilized powder	Soluble in sterile water or bacteriostatic water	Approximately 30 minutes	\N	\N	f	f	2	2026-08-03 13:48:55.041184+00	2026-08-03 14:13:59.522+00
3	bpc-157-5mg	BPC-157 5mg	Healing Peptides	65.00	A synthetic pentadecapeptide derived from a partial sequence of human Body Protection Compound. Studied for regenerative, cytoprotective, and angiogenic properties.	BPC-157 is a synthetic pentadecapeptide derived from a partial sequence of the human Body Protection Compound found in gastric juice. It has been extensively studied in preclinical models for its regenerative, cytoprotective, and angiogenic properties across multiple organ systems.	/products/3.jpg	99%+	Body Protection Compound-157, BPC157, Bepecin, PL 14736	1419.56 g/mol	137525-51-0	C₆₂H₉₈N₁₆O₂₂	Gly-Glu-Pro-Pro-Pro-Gly-Lys-Pro-Ala-Asp-Asp-Ala-Gly-Leu-Val	Store lyophilized at -20°C. After reconstitution store at 4°C for up to 2 weeks.	White lyophilized powder	Soluble in sterile water or 0.9% saline	Unknown in humans; stable in gastric juice	\N	\N	f	f	3	2026-08-03 13:48:55.045645+00	2026-08-03 14:13:59.571+00
5	bpc-157-20mg	BPC-157 20mg	Healing Peptides	185.00	20mg vial of BPC-157 for extended research applications.	BPC-157 20mg is a synthetic pentadecapeptide studied for its regenerative and cytoprotective properties across musculoskeletal, gastrointestinal, and neurological systems.	/products/5.jpg	99%+	\N	1419.56 g/mol	137525-51-0	C₆₂H₉₈N₁₆O₂₂	\N	Store lyophilized at -20°C. After reconstitution store at 4°C for up to 2 weeks.	White lyophilized powder	Soluble in sterile water or 0.9% saline	\N	\N	\N	f	f	5	2026-08-03 13:48:55.0538+00	2026-08-03 14:13:59.61+00
6	bpc-157-40mg	BPC-157 40mg	Healing Peptides	290.00	40mg vial of BPC-157 for large-scale research.	BPC-157 40mg for extended research. Studied for regenerative, anti-inflammatory, and angiogenic properties.	/products/6.jpg	99%+	\N	\N	137525-51-0	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	6	2026-08-03 13:48:55.057096+00	2026-08-03 14:13:59.646+00
8	bpc-157-tb-500-blend-20mg	BPC-157 + TB-500 Blend 20mg	Peptide Blends	190.00	20mg blend of BPC-157 and TB-500 for extended tissue repair research.	A 20mg research blend of BPC-157 and TB-500. These peptides have been studied for synergistic wound healing, musculoskeletal repair, and anti-inflammatory activity.	/products/8.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	8	2026-08-03 13:48:55.064133+00	2026-08-03 14:13:59.686+00
9	cagrilintide-5mg	Cagrilintide 5mg	Weight Management	145.00	A long-acting amylin analogue studied for appetite suppression and metabolic regulation.	Cagrilintide is a long-acting acylated amylin analogue investigated for weight management. It acts on amylin receptors in the hypothalamus to reduce appetite and food intake.	/products/9.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	9	2026-08-03 13:48:55.067205+00	2026-08-03 14:13:59.73+00
10	cagrilintide-10mg	Cagrilintide 10mg	Weight Management	245.00	10mg vial of Cagrilintide, an amylin analogue studied for appetite and metabolic control.	Cagrilintide 10mg is a long-acting amylin analogue investigated in combination with GLP-1 receptor agonists for synergistic weight management effects.	/products/10.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	10	2026-08-03 13:48:55.070206+00	2026-08-03 14:13:59.765+00
11	cjc-1295-no-dac-5mg	CJC-1295 No DAC 5mg	Growth Peptides	65.00	A growth hormone releasing hormone (GHRH) analogue without DAC modification, studied for pulsatile GH release.	CJC-1295 No DAC is a modified GHRH analogue studied for its ability to stimulate pulsatile growth hormone secretion. Without the DAC modification it has a shorter half-life, mimicking natural GH release patterns.	/products/11.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	Approximately 30 minutes	\N	\N	f	f	11	2026-08-03 13:48:55.073618+00	2026-08-03 14:13:59.8+00
12	cjc-1295-no-dac-10mg	CJC-1295 No DAC 10mg	Growth Peptides	110.00	10mg vial of CJC-1295 No DAC for extended GHRH research.	CJC-1295 No DAC 10mg studied for pulsatile GH secretion without long-acting DAC modification.	/products/12.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	12	2026-08-03 13:48:55.079145+00	2026-08-03 14:13:59.836+00
13	dsip-5mg	DSIP 5mg	Research Peptides	60.00	Delta Sleep-Inducing Peptide — studied for EEG delta-wave activity, stress modulation, and neuroendocrine regulation.	DSIP (Delta Sleep-Inducing Peptide) is a nonapeptide originally isolated from rabbit cerebral venous blood. Studied for its influence on EEG delta-wave activity, stress modulation, and neuroendocrine regulation.	/products/13.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	13	2026-08-03 13:48:55.082569+00	2026-08-03 14:13:59.874+00
14	dsip-10mg	DSIP 10mg	Research Peptides	100.00	10mg vial of DSIP for extended sleep and neuroendocrine research.	DSIP 10mg — Delta Sleep-Inducing Peptide studied for neuroendocrine regulation, stress response, and sleep-related EEG activity.	/products/14.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	14	2026-08-03 13:48:55.08529+00	2026-08-03 14:13:59.911+00
4	bpc-157-10mg	BPC-157 10mg	Healing Peptides	12.00	10mg vial of BPC-157, studied for healing of tendons, ligaments, muscles, and gastrointestinal tissue.	BPC-157 10mg is a synthetic pentadecapeptide studied extensively in preclinical models for regenerative, cytoprotective, and angiogenic properties across multiple organ systems including musculoskeletal and gastrointestinal tissue.	/products/4.jpg	99%+	Body Protection Compound-157, BPC157	1419.56 g/mol	137525-51-0	C₆₂H₉₈N₁₆O₂₂	\N	Store lyophilized at -20°C. After reconstitution store at 4°C for up to 2 weeks.	White lyophilized powder	Soluble in sterile water or 0.9% saline	\N	\N	\N	t	f	4	2026-08-03 13:48:55.049697+00	2026-08-04 12:50:25.206+00
7	bpc-157-tb-500-blend-10mg	BPC-157 + TB-500 Blend 10mg	Peptide Blends	25.00	A synergistic blend of BPC-157 and TB-500 studied for combined healing and regenerative effects.	A research blend combining BPC-157 and TB-500 (Thymosin Beta-4). Both peptides have been independently studied for tissue repair, angiogenesis, and anti-inflammatory effects.	/products/7.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	t	f	7	2026-08-03 13:48:55.061069+00	2026-08-04 12:53:13.112+00
24	hexarelin-5mg	Hexarelin 5mg	Growth Peptides	75.00	A potent synthetic hexapeptide GH secretagogue with the highest GHS-R1a binding affinity of its class. Also studied for cardioprotective properties.	Hexarelin is a potent synthetic hexapeptide GH secretagogue with the highest GHS-R1a binding affinity of its class. Also studied for cardioprotective properties via CD36 receptor signalling.	/products/25.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	25	2026-08-03 13:48:55.125136+00	2026-08-03 14:08:10.12+00
26	ipamorelin-5mg	Ipamorelin 5mg	Growth Peptides	65.00	A selective GH secretagogue with minimal effect on cortisol or prolactin.	Ipamorelin is a pentapeptide GH secretagogue that selectively stimulates GH release with minimal impact on cortisol, prolactin, or ACTH levels, making it one of the most selective GHS-R1a agonists.	/products/31.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	Approximately 2 hours	\N	\N	f	f	31	2026-08-03 13:48:55.131894+00	2026-08-03 14:08:10.138+00
28	kisspeptin-10-5mg	Kisspeptin-10 5mg	Hormonal Peptides	85.00	A neuropeptide that activates GnRH neurons, studied for its role in reproductive hormone regulation.	Kisspeptin-10 is a 10-amino acid neuropeptide derived from the KISS1 gene product. It activates GnRH neurons in the hypothalamus, studied for reproductive endocrinology and hormonal regulation.	/products/33.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	33	2026-08-03 13:48:55.138639+00	2026-08-03 14:08:10.157+00
29	kisspeptin-10-10mg	Kisspeptin-10 10mg	Hormonal Peptides	140.00	10mg vial of Kisspeptin-10 for extended GnRH and reproductive research.	Kisspeptin-10 10mg for extended research into GnRH neuron activation and reproductive hormone cascades.	/products/34.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	34	2026-08-03 13:48:55.141756+00	2026-08-03 14:08:10.172+00
15	epithalon-10mg	Epithalon 10mg	Longevity Peptides	75.00	A synthetic tetrapeptide analogous to Epithalamin from the pineal gland, studied for telomere-lengthening and antioxidant properties.	Epithalon (Epitalon) is a synthetic tetrapeptide (Ala-Glu-Asp-Gly) analogous to Epithalamin derived from the pineal gland. Studied for telomere-lengthening, antioxidant, and life-extension properties.	/products/15.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	15	2026-08-03 13:48:55.088629+00	2026-08-03 14:13:59.947+00
16	epithalon-40mg	Epithalon 40mg	Longevity Peptides	220.00	40mg vial of Epithalon for extended longevity and telomere research.	Epithalon 40mg for extended research into telomere biology, antioxidant activity, and longevity mechanisms.	/products/16.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	16	2026-08-03 13:48:55.092466+00	2026-08-03 14:13:59.994+00
17	ghk-cu-50mg	GHK-Cu 50mg	Skin & Repair	85.00	A naturally occurring copper-binding tripeptide studied for collagen synthesis, wound healing, and antioxidant gene expression.	GHK-Cu is a naturally occurring copper-binding tripeptide (Gly-His-Lys) found in plasma, saliva, and urine. Studied for stimulating collagen synthesis, wound healing, and antioxidant gene expression.	/products/17.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	Blue lyophilized powder	\N	\N	\N	\N	f	f	17	2026-08-03 13:48:55.096045+00	2026-08-03 14:14:00.018+00
19	ghrp-2-5mg	GHRP-2 5mg	Growth Peptides	55.00	A synthetic hexapeptide that potently stimulates GH release via the ghrelin receptor (GHS-R1a).	GHRP-2 is a synthetic hexapeptide (D-Ala-D-β-Nal-Ala-Trp-D-Phe-Lys-NH₂) that potently stimulates GH release via the ghrelin receptor (GHS-R1a).	/products/19.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	Approximately 15-60 minutes	\N	\N	f	f	19	2026-08-03 13:48:55.102911+00	2026-08-03 14:14:00.108+00
20	ghrp-2-10mg	GHRP-2 10mg	Growth Peptides	90.00	10mg vial of GHRP-2 for extended GH secretagogue research.	GHRP-2 10mg — a potent GHS-R1a agonist studied for growth hormone stimulation and related metabolic effects.	/products/20.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	20	2026-08-03 13:48:55.105926+00	2026-08-03 14:14:00.216+00
21	ghrp-6-5mg	GHRP-6 5mg	Growth Peptides	55.00	One of the first synthetic GH secretagogues. A hexapeptide that potently stimulates GH release with notable orexigenic effects.	GHRP-6 is one of the first synthetic growth hormone secretagogues discovered. A hexapeptide that potently stimulates GH release with notable orexigenic side effects at standard doses.	/products/21.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	21	2026-08-03 13:48:55.114731+00	2026-08-03 14:14:00.258+00
22	glow-blend-70mg	GLOW BLEND 70mg	Peptide Blends	175.00	A proprietary skin-focused peptide blend studied for skin repair, collagen synthesis, and radiance.	GLOW BLEND is a proprietary combination of skin-supporting peptides studied for their synergistic effects on collagen synthesis, skin repair, and antioxidant activity.	/products/22.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	22	2026-08-03 13:48:55.118926+00	2026-08-03 14:14:00.296+00
25	igf-1-lr3-1mg	IGF-1 LR3 1mg	Growth Peptides	130.00	A long-acting IGF-1 analogue with extended half-life, studied for anabolic and cellular proliferation effects.	IGF-1 LR3 is a recombinant analogue of insulin-like growth factor 1 with an arginine substitution that extends its half-life. Studied for anabolic, anti-catabolic, and cellular proliferation effects.	/products/30.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	Approximately 20-30 hours	\N	\N	f	f	30	2026-08-03 13:48:55.128249+00	2026-08-03 14:14:00.33+00
27	ipamorelin-10mg	Ipamorelin 10mg	Growth Peptides	110.00	10mg vial of Ipamorelin for extended GH secretagogue research.	Ipamorelin 10mg — a selective GHS-R1a agonist studied for clean GH stimulation with minimal hormonal side effects.	/products/32.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	32	2026-08-03 13:48:55.135487+00	2026-08-03 14:14:00.366+00
30	klow-blend-80mg	KLOW BLEND 80mg	Peptide Blends	195.00	A proprietary blend studied for inflammatory modulation and tissue recovery.	KLOW BLEND is a proprietary peptide combination researched for anti-inflammatory properties and tissue recovery support.	/products/35.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	35	2026-08-03 13:48:55.145391+00	2026-08-03 14:14:00.403+00
51	retatrutide-50mg	Retatrutide 50mg	Weight Management	535.00	50mg Retatrutide.	Retatrutide 50mg for very large-scale metabolic research.	/products/60.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	60	2026-08-03 13:48:55.209507+00	2026-08-03 14:14:00.958+00
18	ghk-cu-100mg	GHK-Cu 100mg	Skin & Repair	25.00	100mg GHK-Cu for large-scale skin repair and collagen research.	GHK-Cu 100mg — copper-binding tripeptide studied for collagen synthesis, fibroblast activity, wound healing, and antioxidant gene expression at scale.	/products/18.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	Blue lyophilized powder	\N	\N	\N	\N	t	f	18	2026-08-03 13:48:55.099878+00	2026-08-04 12:56:44.527+00
31	kpv-10mg	KPV 10mg	Anti-Inflammatory	19.00	A tripeptide (Lys-Pro-Val) studied for anti-inflammatory, antimicrobial, and gut-protective properties.	KPV is a tripeptide (Lys-Pro-Val) derived from the C-terminus of alpha-MSH. It has been studied for anti-inflammatory, antimicrobial, and intestinal protective properties.	/products/37.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	t	f	37	2026-08-03 13:48:55.14866+00	2026-08-04 12:58:54.971+00
43	oxytocin-10mg	Oxytocin 10mg	Research Peptides	115.00	10mg Oxytocin for extended social and reproductive research.	Oxytocin 10mg for extended research into social bonding, anxiety, and reproductive physiology.	/products/51.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	51	2026-08-03 13:48:55.185581+00	2026-08-03 14:08:10.21+00
45	pe-22-28-10mg	PE-22-28 10mg	Cognitive Peptides	115.00	A spadin analogue studied for antidepressant-like effects and TREK-1 channel modulation.	PE-22-28 is a synthetic analogue of spadin studied for antidepressant-like activity through TREK-1 potassium channel blockade.	/products/53.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	53	2026-08-03 13:48:55.190757+00	2026-08-03 14:08:10.224+00
46	peg-mgf-2mg	PEG MGF 2mg	Growth Peptides	95.00	PEGylated Mechano Growth Factor studied for muscle repair and satellite cell activation.	PEG MGF is a PEGylated form of Mechano Growth Factor (MGF), an IGF-1 splice variant. PEGylation extends its half-life. Studied for muscle repair, satellite cell activation, and tissue regeneration.	/products/54.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	54	2026-08-03 13:48:55.193783+00	2026-08-03 14:08:10.239+00
32	ll-37-5mg	LL-37 5mg	Immune Support	115.00	The only known human cathelicidin, studied for broad-spectrum antimicrobial and immunomodulatory activity.	LL-37 is the only known human cathelicidin peptide. Derived from the hCAP-18 precursor, it has been studied for broad-spectrum antimicrobial activity, wound healing, and immunomodulation.	/products/38.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	38	2026-08-03 13:48:55.151736+00	2026-08-03 14:14:00.442+00
33	melanotan-1-10mg	Melanotan 1 10mg	Research Peptides	85.00	A synthetic α-MSH analogue studied for melanogenesis and skin pigmentation research.	Melanotan 1 (afamelanotide) is a synthetic α-melanocyte-stimulating hormone analogue studied for stimulating melanogenesis through MC1R activation.	/products/39.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	39	2026-08-03 13:48:55.154743+00	2026-08-03 14:14:00.483+00
35	mots-c-10mg	MOTS-C 10mg	Cellular Health	110.00	A mitochondria-derived peptide studied for metabolic regulation, insulin sensitivity, and anti-aging effects.	MOTS-C is a 16-amino acid peptide encoded within the mitochondrial 12S rRNA gene. Studied for metabolic regulation, insulin sensitivity improvement, and anti-aging mechanisms.	/products/43.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	43	2026-08-03 13:48:55.162094+00	2026-08-03 14:14:00.519+00
36	mots-c-20mg	MOTS-C 20mg	Cellular Health	185.00	20mg MOTS-C for extended mitochondrial and metabolic research.	MOTS-C 20mg for extended research into mitochondrial signalling, metabolic regulation, and cellular health.	/products/44.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	44	2026-08-03 13:48:55.165107+00	2026-08-03 14:14:00.554+00
37	mots-c-40mg	MOTS-C 40mg	Cellular Health	320.00	40mg MOTS-C for large-scale cellular health research.	MOTS-C 40mg for large-scale research into mitochondria-derived peptide signalling.	/products/45.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	45	2026-08-03 13:48:55.167787+00	2026-08-03 14:14:00.593+00
38	n-acetyl-epithalon-amidate-5mg	N-Acetyl Epithalon Amidate 5mg	Longevity Peptides	95.00	An acetylated and amidated form of Epithalon with enhanced stability and bioavailability.	N-Acetyl Epithalon Amidate is a modified form of Epithalon (Epitalon) with N-terminal acetylation and C-terminal amidation, providing enhanced stability and potentially improved bioavailability.	/products/46.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	46	2026-08-03 13:48:55.171112+00	2026-08-03 14:14:00.627+00
39	n-acetyl-selank-amidate-10mg	N-Acetyl Selank Amidate 10mg	Nootropics	120.00	A modified Selank analogue with enhanced stability, studied for anxiolytic and cognitive effects.	N-Acetyl Selank Amidate is an acetylated and amidated derivative of Selank, studied for anxiolytic, immunomodulatory, and nootropic properties with enhanced metabolic stability.	/products/47.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	47	2026-08-03 13:48:55.173747+00	2026-08-03 14:14:00.664+00
40	n-acetyl-semax-amidate-10mg	N-Acetyl Semax Amidate 10mg	Nootropics	130.00	A modified Semax analogue with enhanced stability, studied for neuroprotective and cognitive-enhancing effects.	N-Acetyl Semax Amidate is a stabilised derivative of Semax studied for neuroprotective, cognitive-enhancing, and BDNF-stimulating properties.	/products/48.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	48	2026-08-03 13:48:55.176315+00	2026-08-03 14:14:00.702+00
41	nad-plus-500mg	NAD+ 500mg	Cellular Health	85.00	Nicotinamide adenine dinucleotide studied for mitochondrial function, DNA repair, and cellular energy metabolism.	NAD+ (Nicotinamide Adenine Dinucleotide) is a coenzyme central to energy metabolism. Studied for roles in mitochondrial function, DNA repair, and sirtuin-mediated longevity pathways.	/products/49.jpg	99%+	\N	\N	53-84-9	\N	\N	Store at -20°C in sealed container.	White to off-white powder	\N	\N	\N	\N	f	f	49	2026-08-03 13:48:55.17951+00	2026-08-03 14:14:00.74+00
44	p21-10mg	P21 10mg	Cognitive Peptides	120.00	A CNTF-derived peptide studied for neurotrophic and cognitive-enhancing effects.	P21 is a peptide fragment derived from Ciliary Neurotrophic Factor (CNTF), studied for neurotrophic activity, neurogenesis support, and potential cognitive-enhancing properties.	/products/52.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	52	2026-08-03 13:48:55.188073+00	2026-08-03 14:14:00.775+00
47	retatrutide-10mg	Retatrutide 10mg	Weight Management	155.00	A triple GIP/GLP-1/glucagon receptor agonist studied for weight loss and metabolic syndrome.	Retatrutide is a triple agonist targeting GIP, GLP-1, and glucagon receptors, studied for its potent weight-reducing and metabolic-regulating effects.	/products/56.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	56	2026-08-03 13:48:55.196426+00	2026-08-03 14:14:00.812+00
48	retatrutide-20mg	Retatrutide 20mg	Weight Management	265.00	20mg Retatrutide for extended triple receptor agonist research.	Retatrutide 20mg — triple GIP/GLP-1/glucagon receptor agonist for extended metabolic and weight management research.	/products/57.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	57	2026-08-03 13:48:55.199071+00	2026-08-03 14:14:00.847+00
49	retatrutide-30mg	Retatrutide 30mg	Weight Management	365.00	30mg Retatrutide.	Retatrutide 30mg for large-scale triple receptor agonist research.	/products/58.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	58	2026-08-03 13:48:55.202328+00	2026-08-03 14:14:00.888+00
50	retatrutide-40mg	Retatrutide 40mg	Weight Management	455.00	40mg Retatrutide.	Retatrutide 40mg for extended large-scale research.	/products/59.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	59	2026-08-03 13:48:55.206314+00	2026-08-03 14:14:00.923+00
34	melanotan-2-10mg	Melanotan 2 10mg	Research Peptides	14.00	A cyclic α-MSH analogue studied for melanogenesis and MC receptor pharmacology.	Melanotan 2 is a cyclic lactam analogue of α-MSH studied for melanocortin receptor pharmacology and skin pigmentation.	/products/40.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	t	f	40	2026-08-03 13:48:55.158177+00	2026-08-04 13:00:08.027+00
60	tb-500-fragment-17-23-10mg	TB-500 Fragment (17-23) 10mg	Healing Peptides	105.00	The active 7-amino acid fragment of Thymosin Beta-4 studied for actin binding and tissue repair.	TB-500 Fragment (17-23) is the key active sequence of Thymosin Beta-4, studied for actin polymerisation regulation, cell migration, and wound healing.	/products/69.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	69	2026-08-03 13:48:55.2376+00	2026-08-03 14:08:10.278+00
64	tesamorelin-ipamorelin-blend-8mg	Tesamorelin + Ipamorelin Blend 8mg	Peptide Blends	130.00	A blend of Tesamorelin (GHRH analogue) and Ipamorelin (GH secretagogue) studied for synergistic GH stimulation.	A blend of Tesamorelin and Ipamorelin, combining a GHRH analogue with a selective GH secretagogue for potentially synergistic growth hormone stimulation.	/products/74.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	74	2026-08-03 13:48:55.249748+00	2026-08-03 14:08:10.291+00
52	retatrutide-60mg	Retatrutide 60mg	Weight Management	610.00	60mg Retatrutide for the largest research quantities.	Retatrutide 60mg — highest quantity vial of the triple GIP/GLP-1/glucagon receptor agonist.	/products/61.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	61	2026-08-03 13:48:55.212638+00	2026-08-03 14:14:00.99+00
56	sermorelin-5mg	Sermorelin 5mg	Growth Peptides	65.00	A synthetic GHRH analogue (amino acids 1-29) studied for stimulating pituitary GH secretion.	Sermorelin is a synthetic analogue of GHRH comprising the first 29 amino acids. Studied for stimulating the pituitary gland to secrete growth hormone in a physiological pulsatile manner.	/products/65.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	Approximately 10-20 minutes	\N	\N	f	f	65	2026-08-03 13:48:55.225173+00	2026-08-03 14:14:01.029+00
57	ss-31-10mg	SS-31 10mg	Cellular Health	175.00	A mitochondria-targeted peptide studied for oxidative stress reduction and cardioprotection.	SS-31 (Elamipretide) is a mitochondria-targeted tetrapeptide studied for reducing mitochondrial reactive oxygen species, improving ATP production, and cardioprotection.	/products/66.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	66	2026-08-03 13:48:55.227988+00	2026-08-03 14:14:01.064+00
58	ss-31-30mg	SS-31 30mg	Cellular Health	420.00	30mg SS-31 for extended mitochondrial research.	SS-31 30mg for extended research into mitochondrial protection and energy metabolism.	/products/67.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	67	2026-08-03 13:48:55.231673+00	2026-08-03 14:14:01.098+00
59	ss-31-50mg	SS-31 50mg	Cellular Health	645.00	50mg SS-31 for large-scale mitochondrial research.	SS-31 50mg for large-scale mitochondria-targeted peptide research.	/products/68.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	68	2026-08-03 13:48:55.234788+00	2026-08-03 14:14:01.133+00
61	tb-500-5mg	TB-500 5mg	Healing Peptides	75.00	Thymosin Beta-4 — studied for tissue repair, anti-inflammation, and angiogenesis.	TB-500 is a synthetic version of Thymosin Beta-4, studied for tissue repair, wound healing, anti-inflammatory activity, and angiogenesis through actin regulation.	/products/71.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	71	2026-08-03 13:48:55.240702+00	2026-08-03 14:14:01.172+00
63	tb-500-20mg	TB-500 20mg	Healing Peptides	220.00	20mg Thymosin Beta-4 for large-scale repair research.	TB-500 20mg for large-scale Thymosin Beta-4 tissue repair and angiogenesis research.	/products/73.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	73	2026-08-03 13:48:55.247184+00	2026-08-03 14:14:01.207+00
65	thymosin-alpha-1-10mg	Thymosin Alpha-1 10mg	Immune Support	125.00	A thymic peptide studied for immune modulation, antiviral activity, and T-cell regulation.	Thymosin Alpha-1 is a 28-amino acid peptide derived from prothymosin alpha. Studied for immunomodulatory activity including T-cell maturation, NK cell activation, and antiviral effects.	/products/75.jpg	99%+	\N	\N	62304-98-7	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	75	2026-08-03 13:48:55.253521+00	2026-08-03 14:14:01.244+00
66	tirzepatide-10mg	Tirzepatide 10mg	Weight Management	165.00	A dual GIP and GLP-1 receptor agonist studied for weight management and type 2 diabetes research.	Tirzepatide is a dual GIP (glucose-dependent insulinotropic polypeptide) and GLP-1 receptor agonist studied for its effects on body weight, glycaemic control, and metabolic parameters.	/products/76.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	76	2026-08-03 13:48:55.258175+00	2026-08-03 14:14:01.278+00
67	tirzepatide-15mg	Tirzepatide 15mg	Weight Management	225.00	15mg Tirzepatide for extended dual GIP/GLP-1 receptor research.	Tirzepatide 15mg — dual GIP/GLP-1 receptor agonist for extended metabolic and weight management research.	/products/77.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	77	2026-08-03 13:48:55.261558+00	2026-08-03 14:14:01.32+00
68	tirzepatide-30mg	Tirzepatide 30mg	Weight Management	390.00	30mg Tirzepatide.	Tirzepatide 30mg for large-scale dual GIP/GLP-1 agonist research.	/products/78.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	78	2026-08-03 13:48:55.264855+00	2026-08-03 14:14:01.362+00
69	tirzepatide-45mg	Tirzepatide 45mg	Weight Management	530.00	45mg Tirzepatide.	Tirzepatide 45mg for very large-scale research.	/products/79.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	79	2026-08-03 13:48:55.267721+00	2026-08-03 14:14:01.397+00
70	tirzepatide-60mg	Tirzepatide 60mg	Weight Management	665.00	60mg Tirzepatide — largest research quantity.	Tirzepatide 60mg — the highest quantity vial of the dual GIP/GLP-1 receptor agonist.	/products/80.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	80	2026-08-03 13:48:55.271428+00	2026-08-03 14:14:01.432+00
71	vip-10mg	VIP 10mg	Research Peptides	110.00	Vasoactive Intestinal Peptide studied for vasodilation, immune modulation, and neuroprotection.	VIP (Vasoactive Intestinal Peptide) is a 28-amino acid neuropeptide studied for vasodilatory, immunomodulatory, anti-inflammatory, and neuroprotective properties.	/products/81.jpg	99%+	\N	\N	37221-79-7	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	81	2026-08-03 13:48:55.27516+00	2026-08-03 14:14:01.471+00
53	selank-10mg	Selank 10mg	Nootropics	18.00	A synthetic heptapeptide analogue of tuftsin studied for anxiolytic, immunomodulatory, and nootropic effects.	Selank is a synthetic heptapeptide (Thr-Lys-Pro-Arg-Pro-Gly-Pro) analogue of tuftsin, studied for anxiolytic, immunomodulatory, and cognitive-enhancing properties.	/products/62.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	t	f	62	2026-08-03 13:48:55.215482+00	2026-08-04 13:02:44.336+00
55	semax-10mg	Semax 10mg	Nootropics	18.00	An ACTH-derived heptapeptide studied for neuroprotection, BDNF upregulation, and cognitive enhancement.	Semax is a synthetic heptapeptide derived from the N-terminal fragment of ACTH(4-10). Studied for neuroprotective, BDNF-stimulating, and cognitive-enhancing properties.	/products/64.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	t	f	64	2026-08-03 13:48:55.221742+00	2026-08-04 13:03:45.788+00
62	tb-500-10mg	TB-500 10mg	Healing Peptides	25.00	10mg Thymosin Beta-4 for extended repair and recovery research.	TB-500 10mg for extended research into Thymosin Beta-4's role in tissue repair and regeneration.	/products/72.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	t	f	72	2026-08-03 13:48:55.244487+00	2026-08-04 13:05:15.795+00
23	gonadorelin-2mg	Gonadorelin 2mg	Hormonal Peptides	65.00	Synthetic GnRH studied for pituitary LH and FSH stimulation.	Gonadorelin is a synthetic decapeptide identical to endogenous Gonadotropin-Releasing Hormone (GnRH). It stimulates the pituitary gland to secrete LH and FSH.	/products/23.jpg	99%+	\N	\N	33515-09-2	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	23	2026-08-03 13:48:55.122105+00	2026-08-03 14:08:10.08+00
42	oxytocin-5mg	Oxytocin 5mg	Research Peptides	70.00	Synthetic oxytocin studied for social bonding, anxiety modulation, and reproductive physiology.	Oxytocin is a nonapeptide neurohormone produced in the hypothalamus. Studied for roles in social behaviour, anxiety modulation, lactation, and parturition.	/products/50.jpg	99%+	\N	\N	50-56-6	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	50	2026-08-03 13:48:55.182773+00	2026-08-03 14:08:10.189+00
54	semax-selank-blend-20mg	Semax + Selank Blend 20mg	Peptide Blends	145.00	A blend of Semax and Selank studied for combined neuroprotective and anxiolytic effects.	A blend of Semax and Selank, two nootropic peptides studied for neuroprotection, cognitive enhancement, and anxiety modulation.	/products/63.jpg	99%+	\N	\N	\N	\N	\N	Store lyophilized at -20°C.	White lyophilized powder	\N	\N	\N	\N	f	f	63	2026-08-03 13:48:55.218869+00	2026-08-03 14:08:10.262+00
1	aod-9604-5mg	AOD-9604 5mg	Growth Peptides	55.00	A synthetic peptide analogue of the C-terminal fragment of human growth hormone (hGH), residues 176–191. Investigated for stimulating lipolysis and inhibiting lipogenesis.	AOD-9604 is a synthetic peptide analogue of the C-terminal fragment of human growth hormone (hGH), specifically residues 176–191. It is investigated for its ability to stimulate lipolysis and inhibit lipogenesis without exhibiting the growth-promoting or insulin-desensitizing effects of full-length hGH.	/products/1.jpg	99%+	AOD9604, hGH Fragment 176-191	908.1 g/mol	221231-10-3	C₄₅H₆₉N₉O₁₀	\N	Store lyophilized at -20°C. After reconstitution store at 4°C for up to 4 weeks.	White lyophilized powder	Soluble in sterile water or bacteriostatic water	Approximately 30 minutes	\N	\N	f	f	1	2026-08-03 13:48:54.990829+00	2026-08-03 14:13:59.215+00
73	5-amino-1q-50mg	5-Amino-1Q 50mg	Cellular Health	95.00	5-Amino-1MQ is a selective NNMT inhibitor studied for metabolic regulation, fat mass reduction, NAD⁺ metabolism, and cellular energy homeostasis.	5-Amino-1MQ (5-Amino-1-methylquinolinium) is a selective, cell-permeable inhibitor of nicotinamide N-methyltransferase (NNMT) studied for its role in adipogenesis, metabolic disease, and NAD⁺ pathway regulation.	/products/83.jpg	99%+	\N	\N	42464-96-0	\N	\N	Store at room temperature away from light and moisture.	White to off-white powder	\N	\N	\N	\N	f	f	83	2026-08-03 13:48:55.281911+00	2026-08-03 14:14:01.509+00
75	ara-290-16mg	ARA-290 16mg	Research Peptides	120.00	ARA-290 (Cibinetide) is a selective innate repair receptor (IRR/EPOR-βcR) agonist studied for neuroprotection, small fiber neuropathy, anti-inflammatory activity, and tissue repair without erythropoietic effects.	ARA-290 (Cibinetide) is a synthetic peptide ligand of the innate repair receptor studied for neuroprotection, small fiber neuropathy regeneration, sarcoidosis-associated nerve damage, and anti-inflammatory tissue protection without the hematopoietic activity of erythropoietin.	/products/84.jpg	99%+	Cibinetide, ARA290	304.47 g/mol	506-32-1	C₂₀H₃₂O₂	\N	Store lyophilized at -20°C. After reconstitution store at 4°C for up to 2 weeks.	White lyophilized powder	Soluble in sterile water or bacteriostatic water	\N	\N	\N	f	f	84	2026-08-03 13:48:55.288434+00	2026-08-03 14:14:01.546+00
72	tesamorelin-20mg	Tesamorelin 20mg	Growth Hormone	80.00	A stabilised GHRH(1-44) analogue with trans-3-hexenoic acid modification, studied for pulsatile GH secretion, visceral fat reduction, and body composition research.	Tesamorelin (TH9507) is a stabilised synthetic analogue of human GHRH(1-44) studied for pituitary GH axis stimulation, visceral adiposity reduction, and lipodystrophy-related metabolic research.	/products/82.jpg	99%+	\N	\N	218949-48-5	\N	\N	Store lyophilized at -20°C. After reconstitution, store at 4°C for up to 2 weeks.	White lyophilized powder	\N	\N	\N	\N	t	f	82	2026-08-03 13:48:55.279144+00	2026-08-04 13:07:11.806+00
74	cjc-1295-no-dac-ipamorelin-5mg	CJC-1295 No DAC + Ipamorelin 5mg	Growth Hormone	25.00	A dual-peptide blend combining CJC-1295 No DAC (5mg, GHRH analogue) and Ipamorelin (5mg, selective GHSR agonist) for synergistic GH secretion research via complementary receptor pathways.	CJC-1295 No DAC + Ipamorelin Blend combines a GHRH receptor agonist with a selective ghrelin receptor agonist to study synergistic pulsatile GH release, body composition, and growth hormone axis physiology.	/products/85.jpg	99%+ (each component)	Modified GRF 1-29 + Ipamorelin Blend, mGRF(1-29) + IPA Blend	\N	863288-34-0 / 170851-70-4	\N	\N	Store lyophilized blend at -20°C. After reconstitution store at 4°C for up to 2 weeks.	White lyophilized powder	\N	\N	\N	\N	t	f	85	2026-08-03 13:48:55.285446+00	2026-08-04 13:09:07.573+00
\.


--
-- Data for Name: products_inventory; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.products_inventory (id, product_id, product_name, product_category, product_image, stock_level, low_stock_threshold, is_published, updated_at) FROM stdin;
\.


--
-- Data for Name: refunds_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refunds_log (id, order_id, order_number, amount_gbp, type, reason, notes, restore_inventory, line_items_json, created_at) FROM stdin;
\.


--
-- Data for Name: returns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.returns (id, order_id, order_number, customer_name, customer_email, reason, status, refund_amount_gbp, admin_notes, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shipping_rates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_rates (id, zone_id, name, carrier, price_gbp, free_above_gbp, estimated_days_min, estimated_days_max, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: shipping_zones; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.shipping_zones (id, name, description, country_codes, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: stock_alerts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock_alerts (id, product_id, product_name, customer_email, customer_name, created_at, notified_at) FROM stdin;
\.


--
-- Data for Name: store_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.store_settings (id, store_name, support_email, support_phone, currency, order_prefix, address_line1, address_line2, city, postcode, country, announcement_banner, maintenance_mode, updated_at) FROM stdin;
\.


--
-- Data for Name: subscriptions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.subscriptions (id, customer_id, items_json, interval_days, next_renewal_at, discount_pct, status, paused_at, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tax_rates; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.tax_rates (id, name, country_code, country_name, region, rate, is_inclusive, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: webhook_deliveries; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhook_deliveries (id, webhook_id, event_type, payload_json, status, response_code, response_body, attempted_at) FROM stdin;
\.


--
-- Data for Name: webhooks; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.webhooks (id, url, events, secret, is_active, description, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: wishlists; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.wishlists (id, customer_id, product_id, created_at) FROM stdin;
\.


--
-- Name: abandoned_carts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.abandoned_carts_id_seq', 1, false);


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admin_users_id_seq', 1, false);


--
-- Name: blocked_ips_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blocked_ips_id_seq', 1, false);


--
-- Name: blog_posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.blog_posts_id_seq', 49, true);


--
-- Name: customer_credit_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_credit_transactions_id_seq', 1, false);


--
-- Name: customer_credits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customer_credits_id_seq', 1, false);


--
-- Name: customers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.customers_id_seq', 1, false);


--
-- Name: discount_codes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.discount_codes_id_seq', 1, false);


--
-- Name: email_logs_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.email_logs_id_seq', 1, false);


--
-- Name: inventory_audit_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.inventory_audit_log_id_seq', 1, false);


--
-- Name: loyalty_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.loyalty_transactions_id_seq', 1, false);


--
-- Name: newsletter_subscribers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.newsletter_subscribers_id_seq', 1, false);


--
-- Name: order_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.order_items_id_seq', 1, false);


--
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.orders_id_seq', 1, false);


--
-- Name: product_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.product_reviews_id_seq', 65, true);


--
-- Name: products_catalog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_catalog_id_seq', 75, true);


--
-- Name: products_inventory_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.products_inventory_id_seq', 1, false);


--
-- Name: refunds_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refunds_log_id_seq', 1, false);


--
-- Name: returns_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.returns_id_seq', 1, false);


--
-- Name: shipping_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_rates_id_seq', 1, false);


--
-- Name: shipping_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.shipping_zones_id_seq', 1, false);


--
-- Name: stock_alerts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.stock_alerts_id_seq', 1, false);


--
-- Name: store_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.store_settings_id_seq', 1, false);


--
-- Name: subscriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.subscriptions_id_seq', 1, false);


--
-- Name: tax_rates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tax_rates_id_seq', 1, false);


--
-- Name: webhook_deliveries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.webhook_deliveries_id_seq', 1, false);


--
-- Name: webhooks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.webhooks_id_seq', 1, false);


--
-- Name: wishlists_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.wishlists_id_seq', 1, false);


--
-- Name: abandoned_carts abandoned_carts_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abandoned_carts
    ADD CONSTRAINT abandoned_carts_customer_id_unique UNIQUE (customer_id);


--
-- Name: abandoned_carts abandoned_carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.abandoned_carts
    ADD CONSTRAINT abandoned_carts_pkey PRIMARY KEY (id);


--
-- Name: admin_users admin_users_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_email_unique UNIQUE (email);


--
-- Name: admin_users admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: blocked_ips blocked_ips_ip_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_ips
    ADD CONSTRAINT blocked_ips_ip_unique UNIQUE (ip);


--
-- Name: blocked_ips blocked_ips_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blocked_ips
    ADD CONSTRAINT blocked_ips_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_pkey PRIMARY KEY (id);


--
-- Name: blog_posts blog_posts_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.blog_posts
    ADD CONSTRAINT blog_posts_slug_unique UNIQUE (slug);


--
-- Name: customer_credit_transactions customer_credit_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_credit_transactions
    ADD CONSTRAINT customer_credit_transactions_pkey PRIMARY KEY (id);


--
-- Name: customer_credits customer_credits_customer_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_credits
    ADD CONSTRAINT customer_credits_customer_id_unique UNIQUE (customer_id);


--
-- Name: customer_credits customer_credits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customer_credits
    ADD CONSTRAINT customer_credits_pkey PRIMARY KEY (id);


--
-- Name: customers customers_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_email_unique UNIQUE (email);


--
-- Name: customers customers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_pkey PRIMARY KEY (id);


--
-- Name: customers customers_referral_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.customers
    ADD CONSTRAINT customers_referral_code_unique UNIQUE (referral_code);


--
-- Name: discount_codes discount_codes_code_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT discount_codes_code_unique UNIQUE (code);


--
-- Name: discount_codes discount_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discount_codes
    ADD CONSTRAINT discount_codes_pkey PRIMARY KEY (id);


--
-- Name: email_logs email_logs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.email_logs
    ADD CONSTRAINT email_logs_pkey PRIMARY KEY (id);


--
-- Name: inventory_audit_log inventory_audit_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.inventory_audit_log
    ADD CONSTRAINT inventory_audit_log_pkey PRIMARY KEY (id);


--
-- Name: loyalty_transactions loyalty_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.loyalty_transactions
    ADD CONSTRAINT loyalty_transactions_pkey PRIMARY KEY (id);


--
-- Name: newsletter_subscribers newsletter_subscribers_email_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_email_unique UNIQUE (email);


--
-- Name: newsletter_subscribers newsletter_subscribers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.newsletter_subscribers
    ADD CONSTRAINT newsletter_subscribers_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: orders orders_order_number_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_order_number_unique UNIQUE (order_number);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: product_reviews product_reviews_customer_product_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_customer_product_unique UNIQUE (product_id, customer_id);


--
-- Name: product_reviews product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_reviews
    ADD CONSTRAINT product_reviews_pkey PRIMARY KEY (id);


--
-- Name: products_catalog products_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_catalog
    ADD CONSTRAINT products_catalog_pkey PRIMARY KEY (id);


--
-- Name: products_catalog products_catalog_slug_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_catalog
    ADD CONSTRAINT products_catalog_slug_unique UNIQUE (slug);


--
-- Name: products_inventory products_inventory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_inventory
    ADD CONSTRAINT products_inventory_pkey PRIMARY KEY (id);


--
-- Name: products_inventory products_inventory_product_id_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.products_inventory
    ADD CONSTRAINT products_inventory_product_id_unique UNIQUE (product_id);


--
-- Name: refunds_log refunds_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds_log
    ADD CONSTRAINT refunds_log_pkey PRIMARY KEY (id);


--
-- Name: returns returns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.returns
    ADD CONSTRAINT returns_pkey PRIMARY KEY (id);


--
-- Name: shipping_rates shipping_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates
    ADD CONSTRAINT shipping_rates_pkey PRIMARY KEY (id);


--
-- Name: shipping_zones shipping_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_zones
    ADD CONSTRAINT shipping_zones_pkey PRIMARY KEY (id);


--
-- Name: stock_alerts stock_alerts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock_alerts
    ADD CONSTRAINT stock_alerts_pkey PRIMARY KEY (id);


--
-- Name: store_settings store_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.store_settings
    ADD CONSTRAINT store_settings_pkey PRIMARY KEY (id);


--
-- Name: subscriptions subscriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.subscriptions
    ADD CONSTRAINT subscriptions_pkey PRIMARY KEY (id);


--
-- Name: tax_rates tax_rates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tax_rates
    ADD CONSTRAINT tax_rates_pkey PRIMARY KEY (id);


--
-- Name: webhook_deliveries webhook_deliveries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_pkey PRIMARY KEY (id);


--
-- Name: webhooks webhooks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhooks
    ADD CONSTRAINT webhooks_pkey PRIMARY KEY (id);


--
-- Name: wishlists wishlists_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wishlists
    ADD CONSTRAINT wishlists_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: refunds_log refunds_log_order_id_orders_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refunds_log
    ADD CONSTRAINT refunds_log_order_id_orders_id_fk FOREIGN KEY (order_id) REFERENCES public.orders(id) ON DELETE CASCADE;


--
-- Name: shipping_rates shipping_rates_zone_id_shipping_zones_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.shipping_rates
    ADD CONSTRAINT shipping_rates_zone_id_shipping_zones_id_fk FOREIGN KEY (zone_id) REFERENCES public.shipping_zones(id) ON DELETE CASCADE;


--
-- Name: webhook_deliveries webhook_deliveries_webhook_id_webhooks_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.webhook_deliveries
    ADD CONSTRAINT webhook_deliveries_webhook_id_webhooks_id_fk FOREIGN KEY (webhook_id) REFERENCES public.webhooks(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict gimyoF4eDJCLw7TfHGecw5HDGDGf95ZknQelptydGK1Hil0wl2Dz9o3CEpLVGg3

-- Keep restored development snapshots aligned with the current Janoshik-only
-- verification model.
ALTER TABLE public.products_catalog
    DROP COLUMN IF EXISTS coa_url,
    DROP COLUMN IF EXISTS ms_image_url;

UPDATE public.blog_posts
SET content = replace(
  replace(
    content,
    'Our COA data is available for every product.',
    'Available Janoshik reports are linked on relevant product pages.'
  ),
  'Certificate of Analysis',
  'independent laboratory report'
)
WHERE slug = 'purity-testing-explained';

