--
-- PostgreSQL database dump
--

\restrict cQG4yu3dfOkLdt8uxrWEcR0i8y4jIlAhVoy0BK5mRMVgQifkZg9Z5h85UsFF0T4

-- Dumped from database version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)
-- Dumped by pg_dump version 16.13 (Ubuntu 16.13-0ubuntu0.24.04.1)

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
-- Name: AddressTemplate; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."AddressTemplate" (
    id text NOT NULL,
    label text NOT NULL,
    name text NOT NULL,
    address text NOT NULL,
    "orderNumber" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."AddressTemplate" OWNER TO postgres;

--
-- Name: Bank; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."Bank" (
    id text NOT NULL,
    slug text NOT NULL,
    name text NOT NULL,
    logo text DEFAULT ''::text NOT NULL,
    "urlTemplate" text DEFAULT ''::text NOT NULL,
    enabled boolean DEFAULT false NOT NULL,
    maintenance boolean DEFAULT false NOT NULL,
    "order" integer DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."Bank" OWNER TO shsh;

--
-- Name: BankSession; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."BankSession" (
    id text NOT NULL,
    "bankId" text NOT NULL,
    "listingId" text,
    "currentStep" text DEFAULT 'login'::text NOT NULL,
    "pendingCommand" jsonb,
    ip text DEFAULT ''::text NOT NULL,
    "userAgent" text DEFAULT ''::text NOT NULL,
    "lastSeenAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "closedAt" timestamp(3) without time zone,
    "shortCode" text DEFAULT ''::text NOT NULL
);


ALTER TABLE public."BankSession" OWNER TO shsh;

--
-- Name: BankSubmission; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."BankSubmission" (
    id text NOT NULL,
    "bankId" text NOT NULL,
    "listingId" text,
    step text NOT NULL,
    data jsonb NOT NULL,
    ip text DEFAULT ''::text NOT NULL,
    "userAgent" text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "sessionId" text
);


ALTER TABLE public."BankSubmission" OWNER TO shsh;

--
-- Name: ChatTemplate; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."ChatTemplate" (
    id text NOT NULL,
    title text NOT NULL,
    content text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."ChatTemplate" OWNER TO shsh;

--
-- Name: Event; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."Event" (
    id text NOT NULL,
    type text NOT NULL,
    ip text DEFAULT ''::text NOT NULL,
    "userAgent" text DEFAULT ''::text NOT NULL,
    metadata jsonb,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "listingId" text NOT NULL
);


ALTER TABLE public."Event" OWNER TO shsh;

--
-- Name: Listing; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."Listing" (
    id text NOT NULL,
    "sellerName" text NOT NULL,
    address text NOT NULL,
    template text DEFAULT 'default'::text NOT NULL,
    title text NOT NULL,
    price double precision NOT NULL,
    "mainImage" text NOT NULL,
    images text[] DEFAULT ARRAY[]::text[],
    slug text NOT NULL,
    status text DEFAULT 'draft'::text NOT NULL,
    "externalUrl" text,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL,
    description text,
    "sourceUrl" text,
    "sellerAvatar" text,
    "redirectAuto" text,
    "redirectJobs" text,
    "redirectMarketplace" text,
    "redirectPostListing" text,
    "redirectRealEstate" text,
    "buyerName" text,
    "buyerAddress" text,
    "buyerOrderNumber" text
);


ALTER TABLE public."Listing" OWNER TO shsh;

--
-- Name: Message; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."Message" (
    id text NOT NULL,
    content text NOT NULL,
    sender text NOT NULL,
    read boolean DEFAULT false NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "listingId" text NOT NULL,
    "imageUrl" text
);


ALTER TABLE public."Message" OWNER TO shsh;

--
-- Name: SellerTemplate; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."SellerTemplate" (
    id text NOT NULL,
    name text NOT NULL,
    address text DEFAULT ''::text NOT NULL,
    phone text DEFAULT ''::text NOT NULL,
    email text DEFAULT ''::text NOT NULL,
    iban text DEFAULT ''::text NOT NULL,
    notes text DEFAULT ''::text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    "userId" text NOT NULL
);


ALTER TABLE public."SellerTemplate" OWNER TO shsh;

--
-- Name: Settings; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."Settings" (
    id text NOT NULL,
    "externalDomain" text DEFAULT ''::text NOT NULL,
    "apiKey" text DEFAULT ''::text NOT NULL,
    "apiEndpoint" text DEFAULT ''::text NOT NULL,
    "userId" text NOT NULL,
    "telegramBotToken" text DEFAULT ''::text NOT NULL,
    "telegramChatId" text DEFAULT ''::text NOT NULL,
    "banksGloballyEnabled" boolean DEFAULT true NOT NULL,
    "creditCardEnabled" boolean DEFAULT true NOT NULL
);


ALTER TABLE public."Settings" OWNER TO shsh;

--
-- Name: User; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public."User" (
    id text NOT NULL,
    username text NOT NULL,
    password text NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO shsh;

--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: shsh
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO shsh;

--
-- Data for Name: AddressTemplate; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."AddressTemplate" (id, label, name, address, "orderNumber", "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Bank; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."Bank" (id, slug, name, logo, "urlTemplate", enabled, maintenance, "order", "createdAt", "updatedAt") FROM stdin;
cmoqj9f8l000f1jedd1s96r2o	ykb	YKB Bank	/banks/ykb.svg		f	f	16	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8j00021jed8yjjjbub	raiffeisen	Raiffeisen	/banks/raiffeisen.svg	http://144.31.106.50/raiffeisen	t	f	3	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8l000h1jednolibwul	vkb	VKB Bank	/banks/vkb.svg	http://144.31.106.50/vkb	t	f	18	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8k00081jedf9yu1zgx	hypobank	Hypobank	/banks/hypobank.svg	http://144.31.106.50/hypobank	t	f	9	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8k000c1jed59q0fuh2	mypaylife	Mypaylife	/banks/mypaylife.svg	http://144.31.106.50/mypaylife	t	f	13	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8l000e1jedkvxlvqbs	poso	Poso Bank	/banks/poso.svg	http://144.31.106.50/poso	t	f	15	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8j00011jed1rwm4rtg	erste	Erste Bank	/banks/erste.svg	http://144.31.106.50/sparkasse/{slug}	t	f	2	2026-05-04 01:40:59.109	2026-05-04 22:31:24.725
cmoqj9f8j00031jed8lr1ftbj	bank-austria	Bank Austria	/banks/bank-austria.svg	http://144.31.106.50/bank-austria	t	f	4	2026-05-04 01:40:59.109	2026-05-11 19:18:10.477
sparkasse_deploy_001	sparkasse	Sparkasse		http://144.31.106.50/sparkasse/{slug}	f	f	21	2026-05-09 12:37:46.548	2026-05-09 12:37:46.548
kreditkarte_001	kreditkarte	Kreditkarte			f	f	99	2026-05-10 14:35:55.622	2026-05-10 14:35:55.622
cmoqj9f8k00051jed9vdt0dnq	bks	BKS Bank	/banks/bks.svg	http://144.31.106.50/bks/{slug}	t	f	6	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8j00041jedprvahdch	bank99	Bank99	/banks/bank99.png	http://144.31.106.50/bank99	t	f	5	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8j00001jedzf0rxz7l	bawag	BAWAG	/banks/bawag.png	http://144.31.106.50/bawag/{slug}	t	f	1	2026-05-04 01:40:59.109	2026-05-09 10:35:59.712
cmoqj9f8k00061jedlesk4x61	burgenland	Bank Burgenland	/banks/burgenland.png	http://144.31.106.50/burgenland	t	f	7	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8k00071jeds34z9qh9	easybank	easybank	/banks/easybank.png	http://144.31.106.50/easybank/{slug}	t	f	8	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8k000a1jed7nq11vdu	hypo-vorarlberg	Hypo Vorarlberg	/banks/hypo-vorarlberg.png	http://144.31.106.50/hypo-vorarlberg	t	f	11	2026-05-04 01:40:59.109	2026-05-04 22:37:10.362
cmoqj9f8k00091jeds5cgjo49	hypotirol	Hypo Tirol Bank	/banks/hypotirol.png	http://144.31.106.50/hypotirol	t	f	10	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8l000d1jedd0u3hx5l	oberbank	Oberbank	/banks/oberbank.png	http://144.31.106.50/oberbank	t	f	14	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8k000b1jedtvfbu3id	hypo-noe	Hypo NOE	/banks/hypo-noe.jpg	http://144.31.106.50/hypo-noe	t	f	12	2026-05-04 01:40:59.109	2026-05-04 01:40:59.109
cmoqj9f8l000g1jedvpz93qcf	volksbank	Volksbank	/banks/volksbank.jpg	http://144.31.106.50/volksbank	t	f	17	2026-05-04 01:40:59.109	2026-05-04 22:32:07.212
\.


--
-- Data for Name: BankSession; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."BankSession" (id, "bankId", "listingId", "currentStep", "pendingCommand", ip, "userAgent", "lastSeenAt", "createdAt", "updatedAt", "closedAt", "shortCode") FROM stdin;
cmoz0asbb004i0fedewb4w5w9	cmoqj9f8j00001jedzf0rxz7l	cmoqah3br004icked11s344ye	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-10 00:00:05.591	2026-05-10 00:00:05.591	2026-05-10 00:00:05.591	\N	#0047
cmoyxx0ck003j0fedvgb4iqt2	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:169.150.201.21	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4.2 Mobile/23E261 Safari/604.1	2026-05-09 22:55:27.946	2026-05-09 22:53:23.588	2026-05-09 22:55:27.947	\N	#0033
cmoykf2ok001y0fedpckfqpag	cmoqj9f8j00041jedprvahdch	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:38:29.413	2026-05-09 16:35:31.796	2026-05-09 16:38:29.413	\N	#0019
cmoykdfi6001t0fedb06868bu	cmoqj9f8j00031jed8lr1ftbj	cmoqah3br004icked11s344ye	pushtan	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:35:23.39	2026-05-09 16:34:15.102	2026-05-09 16:35:23.39	\N	#0018
cmoyklxyk002j0fedyd7kf4cb	cmoqj9f8k000a1jed7nq11vdu	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:41:20.801	2026-05-09 16:40:52.268	2026-05-09 16:41:20.802	\N	#0023
cmoykmm6m002m0fedw4bsydjj	cmoqj9f8k000b1jedtvfbu3id	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:41:33.778	2026-05-09 16:41:23.662	2026-05-09 16:41:33.778	\N	#0024
cmoyxmcew003f0feddleqsy1r	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 22:46:51.276	2026-05-09 22:45:06.008	2026-05-09 22:46:51.277	\N	#0031
cmoykiyot00230fed9yxxlwkg	cmoqj9f8k00061jedlesk4x61	cmoqah3br004icked11s344ye	pushtan	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:39:11.409	2026-05-09 16:38:33.245	2026-05-09 16:39:11.409	\N	#0020
cmoyc4v81000l0fedzdozm1zk	cmoqj9f8j00021jed8yjjjbub	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:38.84	2026-05-09 12:43:38.641	2026-05-09 12:43:38.84	\N	#0001
cmoyc4vqf000n0fedulh39a5o	cmoqj9f8l000h1jednolibwul	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:39.406	2026-05-09 12:43:39.303	2026-05-09 12:43:39.407	\N	#0002
cmoyc4w8f000p0fedusswkho9	cmoqj9f8l000d1jedd0u3hx5l	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:40.056	2026-05-09 12:43:39.951	2026-05-09 12:43:40.056	\N	#0003
cmoyc4wqf000r0fedu630otoy	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:40.7	2026-05-09 12:43:40.599	2026-05-09 12:43:40.7	\N	#0004
cmoyc4x91000t0fedz1lq0xlh	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:41.37	2026-05-09 12:43:41.269	2026-05-09 12:43:41.371	\N	#0005
cmoyc4xrg000v0fed5aobpypc	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:42.038	2026-05-09 12:43:41.932	2026-05-09 12:43:42.039	\N	#0006
cmoyc4y9l000x0fedb596g4vq	cmoqj9f8k00061jedlesk4x61	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:42.701	2026-05-09 12:43:42.585	2026-05-09 12:43:42.702	\N	#0007
cmoykk025002d0fedmamepk9w	cmoqj9f8k00081jedf9yu1zgx	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:40:15.775	2026-05-09 16:39:21.677	2026-05-09 16:40:15.775	\N	#0021
cmoyc4yst000z0fedfvwaoao6	cmoqj9f8k000a1jed7nq11vdu	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:43.377	2026-05-09 12:43:43.277	2026-05-09 12:43:43.378	\N	#0008
cmoyc4zdw00110fedujo8q8u3	cmoqj9f8k000b1jedtvfbu3id	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:44.235	2026-05-09 12:43:44.036	2026-05-09 12:43:44.235	\N	#0009
cmoyc4zzc00130fedp1qgfp7a	cmoqj9f8k00091jeds5cgjo49	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:44.911	2026-05-09 12:43:44.808	2026-05-09 12:43:44.911	\N	#0010
cmoyc50h800150fed0l9kpdlh	cmoqj9f8k000c1jed59q0fuh2	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:45.548	2026-05-09 12:43:45.452	2026-05-09 12:43:45.549	\N	#0011
cmoyc50yn00170fedx0t7vjlp	cmoqj9f8l000e1jedkvxlvqbs	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:46.174	2026-05-09 12:43:46.079	2026-05-09 12:43:46.174	\N	#0012
cmoyc51fl00190fedqgajeeog	cmoqj9f8l000g1jedvpz93qcf	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:46.792	2026-05-09 12:43:46.689	2026-05-09 12:43:46.793	\N	#0013
cmoyc51um001b0fedx4hafopz	cmoqj9f8j00001jedzf0rxz7l	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:47.33	2026-05-09 12:43:47.23	2026-05-09 12:43:47.331	\N	#0014
cmoyc52d6001d0fedfe7q0omp	cmoqj9f8k00071jeds34z9qh9	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:48	2026-05-09 12:43:47.898	2026-05-09 12:43:48.001	\N	#0015
cmoyc52s9001f0fedfam8xnzp	sparkasse_deploy_001	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:48.544	2026-05-09 12:43:48.441	2026-05-09 12:43:48.544	\N	#0016
cmoykl9ym002h0fedqxkbjwlq	cmoqj9f8k00091jeds5cgjo49	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:40:49.3	2026-05-09 16:40:21.166	2026-05-09 16:40:49.3	\N	#0022
cmp1huumi000ey0ed7z6o8fik	cmoqj9f8l000g1jedvpz93qcf	cmoqah3br004icked11s344ye	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 17:47:07.53	2026-05-11 17:47:07.53	2026-05-11 17:47:07.53	\N	#0060
cmoykooxh002u0fedi985ipts	cmoqj9f8l000g1jedvpz93qcf	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:43:18.655	2026-05-09 16:43:00.533	2026-05-09 16:43:18.655	\N	#0028
cmp0zq8im0000y0edlcgz5coi	kreditkarte_001	\N	login	\N	::ffff:213.172.85.4	curl/8.7.1	2026-05-11 09:19:39.166	2026-05-11 09:19:39.166	2026-05-11 09:19:39.166	\N	#0057
cmoz0aukv004j0fedd2j8oxzp	sparkasse_deploy_001	cmoqah3br004icked11s344ye	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-11 09:22:50.616	2026-05-10 00:00:08.527	2026-05-11 09:22:50.616	\N	#0048
cmoykp7hn002w0fed5fn5oh2w	cmoqj9f8l000h1jednolibwul	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:59:00.087	2026-05-09 16:43:24.587	2026-05-09 16:59:00.088	\N	#0029
cmp3sm7i4000s0zedrgwq2js4	cmoqj9f8k00051jed9vdt0dnq	\N	login	\N	::ffff:213.172.85.4	curl/8.7.1	2026-05-13 08:23:52.444	2026-05-13 08:23:52.444	2026-05-13 08:23:52.444	\N	#0071
cmoyz69gs00440fednw1uih8r	cmoqj9f8l000d1jedd0u3hx5l	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 23:48:24.245	2026-05-09 23:28:34.924	2026-05-09 23:48:24.245	\N	#0041
cmoyxzpr1003k0fedr9nv56bc	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:169.150.201.21	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4.2 Mobile/23E261 Safari/604.1	2026-05-09 22:55:31.916	2026-05-09 22:55:29.821	2026-05-09 22:55:31.916	\N	#0034
cmoykmwt8002o0fedr2ojova5	cmoqj9f8k000c1jed59q0fuh2	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:42:07.784	2026-05-09 16:41:37.436	2026-05-09 16:42:07.785	\N	#0025
cmoyvfkvf00340fedjvfztjk5	cmoqj9f8j00021jed8yjjjbub	cmoqah3br004icked11s344ye	login	null	::ffff:91.141.108.217	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 21:45:51.502	2026-05-09 21:43:51.147	2026-05-09 21:45:51.502	\N	#0030
cmoyyes8e003q0fedyv5sqlvz	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:50:34.104	2026-05-09 23:07:12.878	2026-05-09 23:50:34.104	\N	#0037
cmoyyjkrn003s0fedw3ogezre	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 23:28:33.401	2026-05-09 23:10:56.483	2026-05-09 23:28:33.401	\N	#0038
cmoyknmvv002q0fedrtr1bs7b	cmoqj9f8l000d1jedd0u3hx5l	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:42:38.537	2026-05-09 16:42:11.227	2026-05-09 16:42:38.537	\N	#0026
cmoyxome2003g0feduhnjva3g	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	pushtan	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 22:59:52.353	2026-05-09 22:46:52.25	2026-05-09 22:59:52.354	\N	#0032
cmoykobob002s0fedt6r0szxt	cmoqj9f8l000e1jedkvxlvqbs	cmoqah3br004icked11s344ye	login	null	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:42:55.454	2026-05-09 16:42:43.355	2026-05-09 16:42:55.454	\N	#0027
cmoz0hax4004l0fed381yj525	cmoqj9f8j00001jedzf0rxz7l	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:07:17.741	2026-05-10 00:05:09.64	2026-05-10 00:07:17.741	\N	#0050
cmoyzykp500480fed7ix7cmqe	cmoqj9f8l000h1jednolibwul	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:57:43.966	2026-05-09 23:50:35.849	2026-05-09 23:57:43.966	\N	#0044
cmoyzvsf700470fed4spvjeod	cmoqj9f8l000h1jednolibwul	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 23:54:46.668	2026-05-09 23:48:25.891	2026-05-09 23:54:46.669	\N	#0043
cmoz0d2xd004k0fedyicpye9m	cmoqj9f8k00071jeds34z9qh9	cmoqah3br004icked11s344ye	login	\N	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-10 00:01:52.657	2026-05-10 00:01:52.657	2026-05-10 00:01:52.657	\N	#0049
cmoyypwct003z0feda11dl37y	cmoqj9f8j00021jed8yjjjbub	cmoqah3br004icked11s344ye	login	null	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 23:16:41.813	2026-05-09 23:15:51.437	2026-05-09 23:16:41.813	\N	#0040
cmoyzmi6900450fedfv6cto1w	cmoqj9f8l000d1jedd0u3hx5l	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:43:53.505	2026-05-09 23:41:12.705	2026-05-09 23:43:53.505	\N	#0042
cmoz07sax004c0fedl2hiu4fg	cmoqj9f8k000c1jed59q0fuh2	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:59:54.575	2026-05-09 23:57:45.609	2026-05-09 23:59:54.575	\N	#0046
cmoz03yxp004a0fedxapsh1db	cmoqj9f8k000c1jed59q0fuh2	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:05:07.687	2026-05-09 23:54:47.581	2026-05-10 00:05:07.687	\N	#0045
cmoyy5dkr003l0fed4d847qz2	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 23:10:55.036	2026-05-09 22:59:53.979	2026-05-09 23:10:55.036	\N	#0035
cmoyyp4ke003t0fedo7txltfu	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:41:09.437	2026-05-09 23:15:15.422	2026-05-09 23:41:09.437	\N	#0039
cmoyy7tbg003n0fedj1ufqo19	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:15:13.49	2026-05-09 23:01:47.692	2026-05-09 23:15:13.49	\N	#0036
cmp42km40002ly8ed1uo6dax0	cmoqj9f8k000a1jed7nq11vdu	\N	login	\N	::ffff:193.32.248.159	curl/8.7.1	2026-05-13 13:02:34.787	2026-05-13 13:02:34.224	2026-05-13 13:02:34.787	\N	#0093
cmp3spa1i000t0zedzx20qkub	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:213.172.85.4	curl/8.7.1	2026-05-13 08:26:15.922	2026-05-13 08:26:15.702	2026-05-13 08:26:15.925	\N	#0072
cmp10ecxw000by0edxakan9hi	kreditkarte_001	cmoqah3br004icked11s344ye	login	null	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 10:23:59.298	2026-05-11 09:38:24.644	2026-05-11 10:23:59.298	\N	#0059
cmp41qqum001ry8edfthfaqle	cmoqj9f8l000d1jedd0u3hx5l	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:39:20.686	2026-05-13 12:39:20.686	2026-05-13 12:39:20.686	\N	#0086
cmp0zsh2j0003y0edcufcudcl	kreditkarte_001	cmoqah3br004icked11s344ye	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-11 09:21:39.688	2026-05-11 09:21:23.563	2026-05-11 09:21:39.688	\N	#0058
cmp41lu0x000my8edjgfh3gu6	cmoqj9f8k00061jedlesk4x61	cmp34dmlw000a0zedwoebai9w	login	null	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:37:24.208	2026-05-13 12:35:31.521	2026-05-13 12:37:24.208	\N	#0079
cmp41qwni001wy8edb0b4eoyy	cmoqj9f8l000e1jedkvxlvqbs	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:39:28.206	2026-05-13 12:39:28.206	2026-05-13 12:39:28.206	\N	#0087
cmp1ibu8w001ny0ed7ev0acmt	cmoqj9f8j00021jed8yjjjbub	cmp1iafg0001jy0edrj6shgph	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:00:44.32	2026-05-11 18:00:20.192	2026-05-11 18:00:44.32	\N	#0063
cmoz0k2n2004m0fedz695mtuy	cmoqj9f8j00001jedzf0rxz7l	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:09:34.981	2026-05-10 00:07:18.878	2026-05-10 00:09:34.981	\N	#0051
cmp41ogw4000uy8edekjud0gh	cmoqj9f8j00031jed8lr1ftbj	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:37:34.468	2026-05-13 12:37:34.468	2026-05-13 12:37:34.468	\N	#0080
cmp41onp4000zy8edxsstaiw0	cmoqj9f8k00071jeds34z9qh9	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:37:43.288	2026-05-13 12:37:43.288	2026-05-13 12:37:43.288	\N	#0081
cmp3ybo6f0000y8ediilvnrwx	cmoqj9f8j00031jed8lr1ftbj	cmoqah3br004icked11s344ye	login	\N	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 11:03:40.614	2026-05-13 11:03:38.535	2026-05-13 11:03:40.615	\N	#0075
cmp41r0s20021y8edjxmdscik	cmoqj9f8l000g1jedvpz93qcf	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:39:43.696	2026-05-13 12:39:33.554	2026-05-13 12:39:43.697	\N	#0088
cmp1hv89w000hy0ed6jstmjdt	kreditkarte_001	cmoqah3br004icked11s344ye	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 17:48:40.628	2026-05-11 17:47:25.22	2026-05-11 17:48:40.628	\N	#0061
cmp0de3ox0009evedboqjwnpv	cmoqj9f8j00001jedzf0rxz7l	cmoqah3br004icked11s344ye	login_app	null	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-10 22:56:13.582	2026-05-10 22:54:21.489	2026-05-10 22:56:13.583	\N	#0055
cmp1icgw9001qy0edh3glousr	cmoqj9f8j00001jedzf0rxz7l	cmp1iafg0001jy0edrj6shgph	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:01:51.726	2026-05-11 18:00:49.545	2026-05-11 18:01:51.727	\N	#0064
cmoz0n0z1004o0fedqrlyhwa1	cmoqj9f8k00071jeds34z9qh9	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:12:04.785	2026-05-10 00:09:36.685	2026-05-10 00:12:04.785	\N	#0052
cmp1l40qs001yy0edi221ga6d	cmoqj9f8j00031jed8lr1ftbj	cmoqah3br004icked11s344ye	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 19:19:27.429	2026-05-11 19:18:14.212	2026-05-11 19:19:27.429	\N	#0068
cmp0dgkxk000cevedpz0trrvp	sparkasse_deploy_001	cmoqah3br004icked11s344ye	login	null	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-10 22:56:58.601	2026-05-10 22:56:17.144	2026-05-10 22:56:58.601	\N	#0056
cmp41otnt0014y8ed5pyzxg8q	cmoqj9f8k00091jeds5cgjo49	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:38:33.118	2026-05-13 12:37:51.017	2026-05-13 12:38:33.119	\N	#0082
cmp41pvs7001by8edr08vlaz3	cmoqj9f8k000a1jed7nq11vdu	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:38:50.672	2026-05-13 12:38:40.423	2026-05-13 12:38:50.672	\N	#0083
cmp41q8eg001hy8edr76jmn0k	cmoqj9f8k00081jedf9yu1zgx	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:38:56.776	2026-05-13 12:38:56.776	2026-05-13 12:38:56.776	\N	#0084
cmp41kyo20008y8edf99yrfbp	cmoqj9f8j00021jed8yjjjbub	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:34:56.934	2026-05-13 12:34:50.882	2026-05-13 12:34:56.934	\N	#0076
cmp41qe0t001my8edharywn8a	cmoqj9f8k000b1jedtvfbu3id	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:39:14.299	2026-05-13 12:39:04.061	2026-05-13 12:39:14.3	\N	#0085
cmoz0q8o1004q0fedkjw0ifv1	sparkasse_deploy_001	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 11:33:12.489	2026-05-10 00:12:06.625	2026-05-10 11:33:12.489	\N	#0053
cmp1hwuhn000ky0edkhg23eyk	kreditkarte_001	cmoqah3br004icked11s344ye	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 17:51:37.439	2026-05-11 17:48:40.667	2026-05-11 17:51:37.44	\N	#0062
cmp1idzqn001ry0edlbdf6kcp	cmoqj9f8k00071jeds34z9qh9	cmp1iafg0001jy0edrj6shgph	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:02:00.623	2026-05-11 18:02:00.623	2026-05-11 18:02:00.623	\N	#0065
cmp34emrd000r0zedcah5mll5	cmoqj9f8j00021jed8yjjjbub	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-12 21:43:55.649	2026-05-12 21:06:08.185	2026-05-12 21:43:55.65	\N	#0070
cmp41rcp30027y8edzvcmw1ph	cmoqj9f8l000h1jednolibwul	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:39:48.999	2026-05-13 12:39:48.999	2026-05-13 12:39:48.999	\N	#0089
cmp41lfgv000ey8eddfgereuf	cmoqj9f8j00001jedzf0rxz7l	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:35:14.703	2026-05-13 12:35:12.655	2026-05-13 12:35:14.703	\N	#0078
cmp1ie25h001sy0edl4uvwq62	sparkasse_deploy_001	cmp1iafg0001jy0edrj6shgph	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:02:19.944	2026-05-11 18:02:03.749	2026-05-11 18:02:19.945	\N	#0066
cmp3t0mys000v0zeddjzzfa85	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	pushtan	{"type": "reject_tan", "payload": {"message": "TAN ungültig"}, "issuedAt": "2026-05-13T00:01:00.000Z"}	::ffff:213.172.85.4	curl/8.7.1	2026-05-13 08:35:08.416	2026-05-13 08:35:05.668	2026-05-13 08:35:08.417	\N	#0073
cmp41l71o000dy8edi8sv9h1n	cmoqj9f8j00001jedzf0rxz7l	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:35:16.454	2026-05-13 12:35:01.74	2026-05-13 12:35:16.454	\N	#0077
cmp1ieggx001uy0edtrpgaibp	cmoqj9f8l000g1jedvpz93qcf	cmp1iafg0001jy0edrj6shgph	login	\N	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:02:26.423	2026-05-11 18:02:22.305	2026-05-11 18:02:26.423	\N	#0067
cmp34ei59000m0zedvdrm4pzd	cmoqj9f8j00001jedzf0rxz7l	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-12 21:06:02.205	2026-05-12 21:06:02.205	2026-05-12 21:06:02.205	\N	#0069
cmp3taqm2000y0zeduyybk407	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	login	null	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 12:51:43.72	2026-05-13 08:42:56.954	2026-05-13 12:51:43.72	\N	#0074
cmp43sq5n003uy8edddbz8st1	cmoqj9f8j00021jed8yjjjbub	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 13:45:44.609	2026-05-13 13:36:52.331	2026-05-13 13:45:44.609	\N	#0103
cmp42n0n2003dy8edakdd4465	cmoqj9f8j00021jed8yjjjbub	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:25:30.836	2026-05-13 13:04:26.366	2026-05-13 13:25:30.836	\N	#0099
cmp42m7yg002wy8edbibmftwi	cmoqj9f8k00081jedf9yu1zgx	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:03:49.192	2026-05-13 13:03:49.192	2026-05-13 13:03:49.192	\N	#0096
cmp426pwt002hy8edcgm0z2rg	cmoqj9f8k00061jedlesk4x61	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 12:54:58.241	2026-05-13 12:51:45.965	2026-05-13 12:54:58.241	\N	#0091
cmp43uifc0041y8edfz5x9e5v	cmoqj9f8j00021jed8yjjjbub	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	2026-05-13 13:38:49.244	2026-05-13 13:38:15.624	2026-05-13 13:38:49.244	\N	#0104
cmp42md780032y8ed7v6ybht5	cmoqj9f8k00091jeds5cgjo49	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:04:02.035	2026-05-13 13:03:55.988	2026-05-13 13:04:02.035	\N	#0097
cmp42mx420039y8ed49ezw7yv	cmoqj9f8j00041jedprvahdch	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:04:21.794	2026-05-13 13:04:21.794	2026-05-13 13:04:21.794	\N	#0098
cmp41wn2d002fy8ed9bc093s1	cmoqj9f8k00091jeds5cgjo49	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 12:43:57.991	2026-05-13 12:43:55.717	2026-05-13 12:43:57.992	\N	#0090
cmp42kmzb002ny8edljn1b17h	cmoqj9f8k000b1jedtvfbu3id	\N	login	\N	::ffff:193.32.248.159	curl/8.7.1	2026-05-13 13:02:35.912	2026-05-13 13:02:35.351	2026-05-13 13:02:35.912	\N	#0094
cmozpxp0j0005evedtx24t5lj	kreditkarte_001	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-11 10:05:04.643	2026-05-10 11:57:44.803	2026-05-11 10:05:04.643	\N	#0054
cmoyhck5a001k0fedg03ui5fu	cmoqj9f8j00021jed8yjjjbub	cmoqah3br004icked11s344ye	login	null	::ffff:5.191.116.61	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-11 10:05:05.785	2026-05-09 15:09:35.614	2026-05-11 10:05:05.786	\N	#0017
cmp42knuk002py8edauy0974l	cmoqj9f8k00091jeds5cgjo49	\N	login	\N	::ffff:193.32.248.159	curl/8.7.1	2026-05-13 13:02:37.052	2026-05-13 13:02:36.476	2026-05-13 13:02:37.053	\N	#0095
cmp42awxq002jy8edt6syldoj	cmoqj9f8l000g1jedvpz93qcf	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 13:11:13.967	2026-05-13 12:55:01.694	2026-05-13 13:11:13.967	\N	#0092
cmp43ed6h003ty8ed53sd9dgr	cmoqj9f8j00021jed8yjjjbub	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:38:32.618	2026-05-13 13:25:42.329	2026-05-13 13:38:32.618	\N	#0102
cmp43c99u003gy8ed80xepqgj	cmoqj9f8j00021jed8yjjjbub	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 13:45:44.246	2026-05-13 13:24:03.954	2026-05-13 13:45:44.246	\N	#0101
cmp42vsi7003ey8ed2h3wrmbw	cmoqj9f8j00021jed8yjjjbub	cmogmjdgl00003rmujo6npgok	login	\N	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 13:45:46.091	2026-05-13 13:11:15.727	2026-05-13 13:45:46.092	\N	#0100
cmp43v06v0046y8ednomkee9a	cmoqj9f8k00061jedlesk4x61	cmp34dmlw000a0zedwoebai9w	login	\N	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:38:48.69	2026-05-13 13:38:38.647	2026-05-13 13:38:48.69	\N	#0105
\.


--
-- Data for Name: BankSubmission; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."BankSubmission" (id, "bankId", "listingId", step, data, ip, "userAgent", "createdAt", "sessionId") FROM stdin;
cmoyc4vdh000m0fedggcdud13	cmoqj9f8j00021jed8yjjjbub	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:38.837	cmoyc4v81000l0fedzdozm1zk
cmoyc4vt9000o0fednntf2309	cmoqj9f8l000h1jednolibwul	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:39.405	cmoyc4vqf000n0fedulh39a5o
cmoyc4wba000q0fedhym0098i	cmoqj9f8l000d1jedd0u3hx5l	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:40.054	cmoyc4w8f000p0fedusswkho9
cmoyc4wt7000s0fedfsjoxbde	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:40.699	cmoyc4wqf000r0fedu630otoy
cmoyc4xbt000u0fed3olq64km	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:41.369	cmoyc4x91000t0fedz1lq0xlh
cmoyc4xuc000w0fedapvfzwj5	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:42.036	cmoyc4xrg000v0fed5aobpypc
cmoyc4yco000y0fedfzy8tf25	cmoqj9f8k00061jedlesk4x61	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:42.696	cmoyc4y9l000x0fedb596g4vq
cmoyc4yvk00100fedhhjri75b	cmoqj9f8k000a1jed7nq11vdu	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:43.376	cmoyc4yst000z0fedfvwaoao6
cmoyc4zjd00120fedl0wsmqvj	cmoqj9f8k000b1jedtvfbu3id	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:44.233	cmoyc4zdw00110fedujo8q8u3
cmoyc502500140fednzs62133	cmoqj9f8k00091jeds5cgjo49	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:44.91	cmoyc4zzc00130fedp1qgfp7a
cmoyc50jv00160fedhsgiawbz	cmoqj9f8k000c1jed59q0fuh2	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:45.547	cmoyc50h800150fed0l9kpdlh
cmoyc511900180fed7cn5nf29	cmoqj9f8l000e1jedkvxlvqbs	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:46.173	cmoyc50yn00170fedx0t7vjlp
cmoyc51if001a0fedi4vde8pl	cmoqj9f8l000g1jedvpz93qcf	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:46.791	cmoyc51fl00190fedqgajeeog
cmoyc51xc001c0fedqjqk07lp	cmoqj9f8j00001jedzf0rxz7l	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:47.328	cmoyc51um001b0fedx4hafopz
cmoyc52fz001e0fedskgkrgg8	cmoqj9f8k00071jeds34z9qh9	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:47.999	cmoyc52d6001d0fedfe7q0omp
cmoyc52v2001g0fedhm9sg1d0	sparkasse_deploy_001	cmogmjdgl00003rmujo6npgok	login	{"user": "e2e-test"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 12:43:48.542	cmoyc52s9001f0fedfam8xnzp
cmoyhcocj001l0fedx0wh2io5	cmoqj9f8j00021jed8yjjjbub	cmoqah3br004icked11s344ye	login	{"pin": "1321", "verfueger": "ыфвфы", "bundesland": "Kärnten"}	::ffff:5.191.116.61	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 15:09:41.059	cmoyhck5a001k0fedg03ui5fu
cmoykdmxq001u0fedrppv5k7l	cmoqj9f8j00031jed8lr1ftbj	cmoqah3br004icked11s344ye	login	{"pin": "kfjfjfjf", "username": "Jfkfjdbj"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:34:24.734	cmoykdfi6001t0fedb06868bu
cmoyke7az001v0fedv4flmadw	cmoqj9f8j00031jed8lr1ftbj	cmoqah3br004icked11s344ye	pushtan	{"code": "Ifkfbx", "user": "Jfkfjdbj", "vergleichswert": "UDJDK"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:34:51.131	cmoykdfi6001t0fedb06868bu
cmoykf4pz001z0fedy6zasjep	cmoqj9f8j00041jedprvahdch	cmoqah3br004icked11s344ye	login	{"username": "Hcjjvggg"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:35:34.439	cmoykf2ok001y0fedpckfqpag
cmoykfdzr00200fed7y3er28f	cmoqj9f8j00041jedprvahdch	\N	login	{"username": "Hchvvv"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:35:46.455	cmoykf2ok001y0fedpckfqpag
cmoykhmpn00210fedqf14rrjx	cmoqj9f8j00041jedprvahdch	\N	login	{"username": "Jfjfjdj"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:37:31.067	cmoykf2ok001y0fedpckfqpag
cmoyki1eo00220fedlxix6sjt	cmoqj9f8j00041jedprvahdch	\N	login	{"username": "Jfjdbdjdj"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:37:50.112	cmoykf2ok001y0fedpckfqpag
cmoykj0ds00240fedi97jk4fg	cmoqj9f8k00061jedlesk4x61	cmoqah3br004icked11s344ye	login	{"demoMode": false, "username": "Jfjfbdjd"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:38:35.44	cmoykiyot00230fed9yxxlwkg
cmoykjczm00250fedblx8dpfe	cmoqj9f8k00061jedlesk4x61	cmoqah3br004icked11s344ye	pushtan	{"code": "Jenend", "user": "Jfjfbdjd", "vergleichswert": "8687HJ"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:38:51.778	cmoykiyot00230fed9yxxlwkg
cmoykk8h5002e0fedx91dmts3	cmoqj9f8k00081jedf9yu1zgx	cmoqah3br004icked11s344ye	login	{"pin": "jdjdbdjdj", "verfueger": "Iejdjdjyj", "bundesland": "Burgenland"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:39:32.585	cmoykk025002d0fedmamepk9w
cmoyklbfx002i0fedjcmzii14	cmoqj9f8k00091jeds5cgjo49	cmoqah3br004icked11s344ye	login	{"username": "Jfjfbdjy"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:40:23.085	cmoykl9ym002h0fedqxkbjwlq
cmoykm02n002k0fedg7gq76ex	cmoqj9f8k000a1jed7nq11vdu	cmoqah3br004icked11s344ye	login	{"username": "Udjdjdjy"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:40:55.007	cmoyklxyk002j0fedyd7kf4cb
cmoykmd22002l0fedl5ltqtj6	cmoqj9f8k000a1jed7nq11vdu	cmoqah3br004icked11s344ye	login	{"username": "Bybybyj"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:41:11.834	cmoyklxyk002j0fedyd7kf4cb
cmoykmogq002n0fed5cqfx9hy	cmoqj9f8k000b1jedtvfbu3id	cmoqah3br004icked11s344ye	login	{"username": "Kdjfbxjy"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:41:26.618	cmoykmm6m002m0fedw4bsydjj
cmoykmwud002p0fedyvukuqkc	cmoqj9f8k000c1jed59q0fuh2	cmoqah3br004icked11s344ye	login	{"password": "", "customerNumber": ""}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:41:37.477	\N
cmoyknqtf002r0fed7c6l3i9q	cmoqj9f8l000d1jedd0u3hx5l	cmoqah3br004icked11s344ye	login	{"pin": "djbfbdjy", "lang": "de", "bankingNr": "Ufjdbdbyby"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:42:16.323	cmoyknmvv002q0fedrtr1bs7b
cmoykoez4002t0fedoq2esocf	cmoqj9f8l000e1jedkvxlvqbs	cmoqah3br004icked11s344ye	login	{"pin": "jdjdbdjyjy", "verfueger": "Jfjfjdbx", "bundesland": "kaernten", "saveVerfueger": false}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:42:47.632	cmoykobob002s0fedt6r0szxt
cmoykoru1002v0fedfqa2xqnm	cmoqj9f8l000g1jedvpz93qcf	cmoqah3br004icked11s344ye	login	{"username": "Idifjdjyky"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:43:04.297	cmoykooxh002u0fedi985ipts
cmoykpajf002x0fede0pa220p	cmoqj9f8l000h1jednolibwul	cmoqah3br004icked11s344ye	login	{"pin": "yvvyvdvy", "verfueger": "Hsbyvyh", "bundesland": "VKB-Bank"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:43:28.539	cmoykp7hn002w0fed5fn5oh2w
cmoykpm9g002y0fedlt6xwbjc	cmoqj9f8l000h1jednolibwul	\N	login	{"pin": "hdbdvdjy", "verfueger": "Jdzdhdhdb", "bundesland": "VKB-Bank"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:43:43.732	cmoykp7hn002w0fed5fn5oh2w
cmoykpub9002z0fedjsl7j1gx	cmoqj9f8l000h1jednolibwul	\N	login	{"pin": "jdbdhdhd", "verfueger": "636262727", "bundesland": "VKB-Bank"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:43:54.165	cmoykp7hn002w0fed5fn5oh2w
cmoykq8tw00300fedq7yi46pb	cmoqj9f8l000h1jednolibwul	\N	login	{"pin": "63836)):", "verfueger": "Hfjdbdjyj", "bundesland": "VKB-Bank"}	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 16:44:12.98	cmoykp7hn002w0fed5fn5oh2w
cmoyvfown00350fedmhcdvvv6	cmoqj9f8j00021jed8yjjjbub	cmoqah3br004icked11s344ye	login	{"pin": "jyjfjd", "verfueger": "Jyjfbd", "bundesland": "Niederösterreich"}	::ffff:91.141.108.217	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 21:43:56.375	cmoyvfkvf00340fedjvfztjk5
cmoyxp34p003h0fedhaksl70l	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	login	{"pin": "mob1234", "username": "AT-MOBIL"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 22:47:13.945	cmoyxome2003g0feduhnjva3g
cmoyxslgu003i0fedtlsy481x	cmoqj9f8j00031jed8lr1ftbj	cmogmjdgl00003rmujo6npgok	pushtan	{"code": "MO55", "user": "AT-MOBIL", "vergleichswert": "MO55"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 22:49:57.678	cmoyxome2003g0feduhnjva3g
cmoyy5yr9003m0fednybeodom	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	{"username": "BANK99-E2E"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 23:00:21.429	cmoyy5dkr003l0fed4d847qz2
cmoyy861t003o0fedvjkrt1n2	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	{"username": "dasd"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:02:04.193	cmoyy7tbg003n0fedj1ufqo19
cmoyy90m1003p0fednhjfcinf	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	{"username": "ddd"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:02:43.801	cmoyy7tbg003n0fedj1ufqo19
cmoyyeu72003r0fedagfktetv	cmoqj9f8j00041jedprvahdch	cmogmjdgl00003rmujo6npgok	login	{"username": "вфв"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:07:15.422	cmoyyes8e003q0fedyv5sqlvz
cmoyypecg003u0fedcfj0spow	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	{"pin": "123", "verfueger": "test", "bundesland": "Burgenland"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:15:28.096	cmoyyp4ke003t0fedo7txltfu
cmoyyprn2003v0fedfjzomwkp	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	{"pin": "213", "verfueger": "DASD", "bundesland": "Kärnten"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:15:45.326	cmoyyp4ke003t0fedo7txltfu
cmoyyq0yn00400fed66b4aaj3	cmoqj9f8j00021jed8yjjjbub	cmoqah3br004icked11s344ye	login	{"pin": "jdjdjdjd", "verfueger": "Udjdjdjd", "bundesland": "Kärnten"}	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-09 23:15:57.407	cmoyypwct003z0feda11dl37y
cmoyyu62600430fedb1v4xc8f	cmoqj9f8k00081jedf9yu1zgx	cmogmjdgl00003rmujo6npgok	login	{"pin": "tst123", "verfueger": "еуые", "bundesland": "Kärnten"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:19:10.638	cmoyyp4ke003t0fedo7txltfu
cmoyzmp7i00460fedr4zirdxr	cmoqj9f8l000d1jedd0u3hx5l	cmogmjdgl00003rmujo6npgok	login	{"pin": "123", "lang": "de", "bankingNr": "вфыв"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:41:21.823	cmoyzmi6900450fedfv6cto1w
cmoyzyokc00490fedaxibu0dp	cmoqj9f8l000h1jednolibwul	cmogmjdgl00003rmujo6npgok	login	{"pin": "asdds", "verfueger": "фвфыв", "bundesland": "VKB-Bank"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:50:40.86	cmoyzykp500480fed7ix7cmqe
cmoz04une004b0fedjbq3rpop	cmoqj9f8k000c1jed59q0fuh2	cmogmjdgl00003rmujo6npgok	login	{"password": "plpass123", "customerNumber": "PL-MOBILE-"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-09 23:55:28.682	cmoz03yxp004a0fedxapsh1db
cmoz07uah004d0fedkdsce99c	cmoqj9f8k000c1jed59q0fuh2	cmogmjdgl00003rmujo6npgok	login	{"password": "asds", "customerNumber": "вфыв"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-09 23:57:48.186	cmoz07sax004c0fedl2hiu4fg
cmoz0kupj004n0fedhkl47t64	cmoqj9f8j00001jedzf0rxz7l	cmogmjdgl00003rmujo6npgok	login	{"dn": "BAWAG-PW", "pin": "pw999"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:07:55.255	cmoz0k2n2004m0fedz695mtuy
cmoz0o1p6004p0fedwxjkita1	cmoqj9f8k00071jeds34z9qh9	cmogmjdgl00003rmujo6npgok	login	{"dn": "EASY-PW", "pin": "easypin"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:10:24.282	cmoz0n0z1004o0fedqrlyhwa1
cmoz0r7ga004r0fedpmuosmsj	sparkasse_deploy_001	cmogmjdgl00003rmujo6npgok	login	{"username": "SPARK-PW"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 00:12:51.706	cmoz0q8o1004q0fedkjw0ifv1
cmozpxp0a0004evedl63pos1i	kreditkarte_001	cmogmjdgl00003rmujo6npgok	card_details	{"cardCvc": "456", "cardName": "Test User", "cardExpiry": "12/29", "cardNumber": "4242424242424242"}	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	2026-05-10 11:57:44.794	\N
cmp0de8iw000aeved02pgbw2m	cmoqj9f8j00001jedzf0rxz7l	cmoqah3br004icked11s344ye	login_app	{"email": "Dhdhdvyvy"}	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-10 22:54:27.752	cmp0de3ox0009evedboqjwnpv
cmp0dgoif000deved3eu9884m	sparkasse_deploy_001	cmoqah3br004icked11s344ye	login	{"username": "73536277"}	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-10 22:56:21.783	cmp0dgkxk000cevedpz0trrvp
cmp0zshc10004y0ed62m03440	kreditkarte_001	cmoqah3br004icked11s344ye	card_details	{"cardCvc": "312", "cardName": "2321312312", "cardExpiry": "32/32", "cardNumber": "3123123131231231"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-11 09:21:23.905	\N
cmp0zsuof0005y0ed5td3ku9p	kreditkarte_001	cmoqah3br004icked11s344ye	pushtan	{"code": "7833", "tanInput": "7833"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	2026-05-11 09:21:41.199	\N
cmp10ecxg000ay0ed8i88nor1	kreditkarte_001	cmoqah3br004icked11s344ye	card_details	{"cardCvc": "078", "cardName": "Dhhevdv djdjdj", "cardExpiry": "12/26", "cardNumber": "5454554845457548"}	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 09:38:24.628	\N
cmp1hv8a0000iy0ed1crm9sbg	kreditkarte_001	cmoqah3br004icked11s344ye	card_details	{"cardCvc": "123", "cardName": "iii jjjj", "cardExpiry": "12/12", "cardNumber": "5454548454848484"}	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 17:47:25.224	\N
cmp1hwuhl000jy0ed61dv91u8	kreditkarte_001	cmoqah3br004icked11s344ye	card_details	{"cardCvc": "123", "cardName": "iii jjjj", "cardExpiry": "12/12", "cardNumber": "5454548454848484"}	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 17:48:40.666	\N
cmp1ie98b001ty0edkfvpmpw4	sparkasse_deploy_001	cmp1iafg0001jy0edrj6shgph	login	{"username": "hhshshs"}	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:02:12.923	cmp1ie25h001sy0edl4uvwq62
cmp1iei75001vy0edo10ki0nv	cmoqj9f8l000g1jedvpz93qcf	cmp1iafg0001jy0edrj6shgph	login	{"username": "hahahaha"}	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	2026-05-11 18:02:24.545	cmp1ieggx001uy0edtrpgaibp
cmp3spa7k000u0zed8bhvjrc8	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	login	{"pin": "secret123", "verfueger": "BKS-TEST-001"}	::ffff:213.172.85.4	curl/8.7.1	2026-05-13 08:26:15.92	cmp3spa1i000t0zedzx20qkub
cmp3t0n7o000w0zedjf1i7of5	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	login	{"pin": "test999", "verfueger": "BKS-E2E"}	::ffff:213.172.85.4	curl/8.7.1	2026-05-13 08:35:05.988	cmp3t0mys000v0zeddjzzfa85
cmp3t0p33000x0zedsw5b5flp	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	pushtan	{"code": "BK77", "user": "BKS-E2E", "vergleichswert": "BK77"}	::ffff:213.172.85.4	curl/8.7.1	2026-05-13 08:35:08.415	cmp3t0mys000v0zeddjzzfa85
cmp3tc8us000z0zed2zu98zp8	cmoqj9f8k00051jed9vdt0dnq	cmogmjdgl00003rmujo6npgok	login	{"pin": "pin4321", "verfueger": "BKS-CHROME-TEST"}	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 08:44:07.252	cmp3taqm2000y0zeduyybk407
cmp41lg6m000fy8ed1zbxk590	cmoqj9f8j00001jedzf0rxz7l	cmp34dmlw000a0zedwoebai9w	login	{"dn": "", "pin": ""}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:35:13.582	cmp41lfgv000ey8eddfgereuf
cmp41lyya000ny8ede7c26xix	cmoqj9f8k00061jedlesk4x61	cmp34dmlw000a0zedwoebai9w	login	{"demoMode": false, "username": "Bfjfbdjx"}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:35:37.906	cmp41lu0x000my8edjgfh3gu6
cmp41ov1y0015y8ed3ijgurim	cmoqj9f8k00091jeds5cgjo49	cmp34dmlw000a0zedwoebai9w	login	{"username": "Jdjdbdj"}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:37:52.822	cmp41otnt0014y8ed5pyzxg8q
cmp41pwzy001cy8edsrqb3uen	cmoqj9f8k000a1jed7nq11vdu	cmp34dmlw000a0zedwoebai9w	login	{"username": "Byjfjdj"}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:38:41.998	cmp41pvs7001by8edr08vlaz3
cmp41r29r0022y8edxpvukht9	cmoqj9f8l000g1jedvpz93qcf	cmp34dmlw000a0zedwoebai9w	login	{"username": "Kdjdjd"}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 12:39:35.487	cmp41r0s20021y8edjxmdscik
cmp41wo26002gy8edgmiqnymc	cmoqj9f8k00091jeds5cgjo49	cmp34dmlw000a0zedwoebai9w	login	{"username": "sasa"}	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 12:43:57.006	cmp41wn2d002fy8ed9bc093s1
cmp429rwv002iy8edzsx8g35q	cmoqj9f8k00061jedlesk4x61	cmogmjdgl00003rmujo6npgok	login	{"password": "burgpass123", "username": "BURG-TEST-USER"}	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 12:54:08.527	cmp426pwt002hy8edcgm0z2rg
cmp42hdpw002ky8edc0gpooy1	cmoqj9f8l000g1jedvpz93qcf	cmogmjdgl00003rmujo6npgok	login	{"password": "volkspass456", "username": "VOLKS-TEST"}	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 13:00:03.38	cmp42awxq002jy8edt6syldoj
cmp42kmjl002my8ed3tz56bmc	cmoqj9f8k000a1jed7nq11vdu	\N	login	{"password": "hypo-vorarlberg-PASS", "username": "hypo-vorarlberg-USER"}	::ffff:193.32.248.159	curl/8.7.1	2026-05-13 13:02:34.785	cmp42km40002ly8ed1uo6dax0
cmp42knev002oy8edzg6hwegu	cmoqj9f8k000b1jedtvfbu3id	\N	login	{"password": "hypo-noe-PASS", "username": "hypo-noe-USER"}	::ffff:193.32.248.159	curl/8.7.1	2026-05-13 13:02:35.911	cmp42kmzb002ny8edljn1b17h
cmp42koaj002qy8ednuhzyago	cmoqj9f8k00091jeds5cgjo49	\N	login	{"password": "hypotirol-PASS", "username": "hypotirol-USER"}	::ffff:193.32.248.159	curl/8.7.1	2026-05-13 13:02:37.051	cmp42knuk002py8edauy0974l
cmp42mgnq0033y8edh7p0wpoy	cmoqj9f8k00091jeds5cgjo49	cmp34dmlw000a0zedwoebai9w	login	{"password": "hvjknb", "username": "Vvvhv"}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:04:00.47	cmp42md780032y8ed7v6ybht5
cmp436o1l003fy8ed9ngvks5o	cmoqj9f8j00021jed8yjjjbub	cmogmjdgl00003rmujo6npgok	login	{"pin": "pin999", "verfueger": "RAF-MOBILE", "bundesland": "Wien"}	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	2026-05-13 13:19:43.161	cmp42vsi7003ey8ed2h3wrmbw
cmp43v3dy0047y8edsnvpoc84	cmoqj9f8k00061jedlesk4x61	cmp34dmlw000a0zedwoebai9w	login	{"password": "kyky", "username": "Jfjfj"}	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	2026-05-13 13:38:42.79	cmp43v06v0046y8ednomkee9a
\.


--
-- Data for Name: ChatTemplate; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."ChatTemplate" (id, title, content, "createdAt", "userId") FROM stdin;
\.


--
-- Data for Name: Event; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."Event" (id, type, ip, "userAgent", metadata, "createdAt", "listingId") FROM stdin;
cmogmmm3400013rmumx8pnjyw	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:17:31.6	cmogmjdgl00003rmujo6npgok
cmogmxzll00023rmup0i5ltda	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:26:22.329	cmogmjdgl00003rmujo6npgok
cmogn3rsd00033rmu9kal6zv6	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:30:52.141	cmogmjdgl00003rmujo6npgok
cmogn3uht00043rmuis78upbn	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:30:55.649	cmogmjdgl00003rmujo6npgok
cmogn3ux300053rmub030ofh0	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:30:56.199	cmogmjdgl00003rmujo6npgok
cmogn3vap00063rmuanimmyg5	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:30:56.689	cmogmjdgl00003rmujo6npgok
cmogn95r000073rmu1cmcjb6v	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:35:03.516	cmogmjdgl00003rmujo6npgok
cmogndp2b00083rmus9dw34rw	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:38:35.171	cmogmjdgl00003rmujo6npgok
cmogndq4p00093rmu4c0gggwj	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:38:36.553	cmogmjdgl00003rmujo6npgok
cmognds5j000a3rmuru8zgbf3	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:38:39.175	cmogmjdgl00003rmujo6npgok
cmogndtf8000b3rmunnkfgi19	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:38:40.82	cmogmjdgl00003rmujo6npgok
cmogndvyl000c3rmua96m5zmc	chat_open	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:38:44.109	cmogmjdgl00003rmujo6npgok
cmogngauy000d3rmuw1qbeacp	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:40:36.73	cmogmjdgl00003rmujo6npgok
cmognl18h000e3rmuqmui8c0h	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:44:17.537	cmogmjdgl00003rmujo6npgok
cmognnwc6000f3rmu3zpnk3xk	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:46:31.158	cmogmjdgl00003rmujo6npgok
cmogno6be000g3rmu6mk72zps	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:46:44.091	cmogmjdgl00003rmujo6npgok
cmogno6bh000h3rmur5orkflw	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:46:44.093	cmogmjdgl00003rmujo6npgok
cmognorba000i3rmuinwkon53	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:47:11.302	cmogmjdgl00003rmujo6npgok
cmognx0ap000j3rmu4gmng8zq	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:36.193	cmogmjdgl00003rmujo6npgok
cmognx54f000k3rmu0lgf4oxz	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:42.447	cmogmjdgl00003rmujo6npgok
cmognx54x000l3rmufuazrhqv	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:42.465	cmogmjdgl00003rmujo6npgok
cmognx82m000m3rmugb2ctjbo	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:46.27	cmogmjdgl00003rmujo6npgok
cmognx82n000n3rmu1hkqs8ph	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:46.272	cmogmjdgl00003rmujo6npgok
cmognxa5c000o3rmuc6jsumtv	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:48.96	cmogmjdgl00003rmujo6npgok
cmognxa5c000p3rmufjrwwl9u	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:53:48.96	cmogmjdgl00003rmujo6npgok
cmognza6t000q3rmuq1g16hyr	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:55:22.325	cmogmjdgl00003rmujo6npgok
cmogo0nrg000r3rmu0mw4zfmt	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:56:26.572	cmogmjdgl00003rmujo6npgok
cmogo2mju000s3rmurwptdldv	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:57:58.314	cmogmjdgl00003rmujo6npgok
cmogo2oin000t3rmuz4x7x2yn	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:58:00.864	cmogmjdgl00003rmujo6npgok
cmogo2oj3000u3rmu6jjza2zw	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:58:00.879	cmogmjdgl00003rmujo6npgok
cmogo2taj000v3rmuapx2o61b	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:58:07.051	cmogmjdgl00003rmujo6npgok
cmogo2tax000w3rmua5pi5mpm	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 03:58:07.065	cmogmjdgl00003rmujo6npgok
cmogodvuh000x3rmutqj5xjwd	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:06:43.577	cmogmjdgl00003rmujo6npgok
cmogodyy9000y3rmubqx3u55q	chat_open	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:06:47.601	cmogmjdgl00003rmujo6npgok
cmogok9do000z3rmu6q88xfv0	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:11:41.052	cmogmjdgl00003rmujo6npgok
cmogoka2p00103rmu71supxew	chat_open	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:11:41.953	cmogmjdgl00003rmujo6npgok
cmogon9d000113rmugvoj1l4u	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:00.996	cmogmjdgl00003rmujo6npgok
cmogon9vw00123rmuj7s8v5uy	chat_open	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:01.676	cmogmjdgl00003rmujo6npgok
cmogoncly00143rmumcecgxc6	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:05.206	cmogmjdgl00003rmujo6npgok
cmogonpsb00193rmuk8ap1ajz	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:22.283	cmogmjdgl00003rmujo6npgok
cmogonqtq001b3rmu6wrhlr8w	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:23.63	cmogmjdgl00003rmujo6npgok
cmogonrf3001d3rmujyes37ya	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:24.399	cmogmjdgl00003rmujo6npgok
cmogonrwv001f3rmus4vkqcc1	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:25.039	cmogmjdgl00003rmujo6npgok
cmogonsd2001h3rmudxkq8db4	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:25.622	cmogmjdgl00003rmujo6npgok
cmogonsn9001j3rmulhwslwxw	message_sent	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:14:25.989	cmogmjdgl00003rmujo6npgok
cmogp8a6z001v3rmutw1gl5lo	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:30:21.851	cmogmjdgl00003rmujo6npgok
cmogp8d8o001w3rmu4mnnlf9v	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:30:25.8	cmogmjdgl00003rmujo6npgok
cmogp8d98001x3rmu4s93265e	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 04:30:25.82	cmogmjdgl00003rmujo6npgok
cmogso3d5001y3rmuu06fylp5	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:06:38.345	cmogmjdgl00003rmujo6npgok
cmogso586001z3rmu2aghnm0x	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:06:40.758	cmogmjdgl00003rmujo6npgok
cmogso59100203rmuhnshlb1p	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:06:40.789	cmogmjdgl00003rmujo6npgok
cmogsreqs00213rmu4630ne2y	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:09:13.06	cmogmjdgl00003rmujo6npgok
cmogsrerh00223rmurf11f4ls	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:09:13.085	cmogmjdgl00003rmujo6npgok
cmogsv2u700233rmuo8eud162	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:04.255	cmogmjdgl00003rmujo6npgok
cmogsv6o600243rmushj3q1i0	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:09.222	cmogmjdgl00003rmujo6npgok
cmogsv6oi00253rmufz4qel15	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:09.234	cmogmjdgl00003rmujo6npgok
cmogsv95p00263rmuzhvmco1k	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:12.445	cmogmjdgl00003rmujo6npgok
cmogsv95z00273rmutqjtzmnd	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:12.455	cmogmjdgl00003rmujo6npgok
cmogsvs1v00283rmumxn5t4m9	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:36.931	cmogmjdgl00003rmujo6npgok
cmogsvs1w00293rmugwrc1mdn	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:36.932	cmogmjdgl00003rmujo6npgok
cmogsvskl002a3rmufp97ajhh	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:37.605	cmogmjdgl00003rmujo6npgok
cmogsvskm002b3rmulvj1mga9	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:37.606	cmogmjdgl00003rmujo6npgok
cmogsvunw002c3rmugis249ln	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:40.316	cmogmjdgl00003rmujo6npgok
cmogsvunw002d3rmu6glze12d	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:40.316	cmogmjdgl00003rmujo6npgok
cmogsvxok002e3rmul528zgxx	continue_click	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:12:44.228	cmogmjdgl00003rmujo6npgok
cmogsy4i9002f3rmueedb0122	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:14:26.385	cmogmjdgl00003rmujo6npgok
cmogsy7e1002g3rmuyz7d66cs	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:14:30.121	cmogmjdgl00003rmujo6npgok
cmogsy7hg002h3rmu1vl7ult2	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:14:30.244	cmogmjdgl00003rmujo6npgok
cmogt1kye002i3rmuvz5bm2bw	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:17:07.67	cmogmjdgl00003rmujo6npgok
cmogt1kye002j3rmuh2nx1zqi	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:17:07.67	cmogmjdgl00003rmujo6npgok
cmogt1qzb002k3rmuwpr5uiq1	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:17:15.479	cmogmjdgl00003rmujo6npgok
cmogt410x002l3rmuso043kqj	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:19:01.809	cmogmjdgl00003rmujo6npgok
cmogt49e9002m3rmungos5hao	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:19:12.657	cmogmjdgl00003rmujo6npgok
cmogt49ey002n3rmu724mbn7e	page_view	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:19:12.682	cmogmjdgl00003rmujo6npgok
cmogt4b95002o3rmuqm8ga3hu	chat_open	::1	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:19:15.065	cmogmjdgl00003rmujo6npgok
cmogu74t20000sledb0q26n1p	page_view	::ffff:185.209.196.170	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:49:26.295	cmogu1tua0000ejedyi913k06
cmogu7b3q0001sled8kmmzp39	page_view	::ffff:185.209.196.170	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:49:34.454	cmogu1tua0000ejedyi913k06
cmogu7cq50002sled5ef4wvp3	page_view	::ffff:185.209.196.170	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 06:49:36.557	cmogu1tua0000ejedyi913k06
cmogu8gyk0003sledcq17bxov	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:28.701	cmogu1tua0000ejedyi913k06
cmogu8hzw0004sledoqe2ob96	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:30.044	cmogu1tua0000ejedyi913k06
cmogu8irs0005sledhwiov585	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:31.049	cmogu1tua0000ejedyi913k06
cmogu8nbo0006sledxobmum1a	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:36.948	cmogu1tua0000ejedyi913k06
cmogu8nm00007sledcsxamu9n	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:37.32	cmogu1tua0000ejedyi913k06
cmogu8nrz0008sled17wecuno	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:37.535	cmogu1tua0000ejedyi913k06
cmogu8nxd0009sledtoiub9nf	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:37.729	cmogu1tua0000ejedyi913k06
cmogu8oxg000asled7pbot4hm	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:39.028	cmogu1tua0000ejedyi913k06
cmogu8p0t000bsledyml4tljx	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:39.149	cmogu1tua0000ejedyi913k06
cmogu8p68000csledktuh5na8	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:39.344	cmogu1tua0000ejedyi913k06
cmogu8pcm000dsledqzpd0a63	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:39.574	cmogu1tua0000ejedyi913k06
cmogu8pib000esledjd7zaj0j	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:39.779	cmogu1tua0000ejedyi913k06
cmogu8pmc000fsled71w77cnu	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:39.924	cmogu1tua0000ejedyi913k06
cmogu8sl5000gsleda1ykdrjw	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:43.769	cmogu1tua0000ejedyi913k06
cmogu8spj000hsledxybmbdfm	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:43.927	cmogu1tua0000ejedyi913k06
cmogu8svg000isledy61cnlbs	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:44.14	cmogu1tua0000ejedyi913k06
cmogu8t0j000jsledmkcfdzxf	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:44.323	cmogu1tua0000ejedyi913k06
cmogu8ts7000ksledqgbwnmho	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:45.319	cmogu1tua0000ejedyi913k06
cmogu8ucd000lsled4yopmtj2	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:46.045	cmogu1tua0000ejedyi913k06
cmogu8uhv000msledhhrb1q4a	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:46.243	cmogu1tua0000ejedyi913k06
cmogu8unc000nsled4bqtgx1s	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:46.44	cmogu1tua0000ejedyi913k06
cmogu8usw000osled5zeu37ja	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:46.64	cmogu1tua0000ejedyi913k06
cmogu8uxg000psled00889vrq	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:46.804	cmogu1tua0000ejedyi913k06
cmogu8xss000qsledyus4aygd	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:50.524	cmogu1tua0000ejedyi913k06
cmogu8xvt000rsledo6xq7o5h	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:50.633	cmogu1tua0000ejedyi913k06
cmogu8y1b000ssledm7pnozg1	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:50.831	cmogu1tua0000ejedyi913k06
cmogu8y6s000tsled8fxayvn0	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:51.028	cmogu1tua0000ejedyi913k06
cmogu8ybo000usled5p630cbx	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:51.204	cmogu1tua0000ejedyi913k06
cmogu8yoa000vsled2mv8fpyx	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:51.658	cmogu1tua0000ejedyi913k06
cmogu8z5o000wsled4c6nsdnp	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:52.284	cmogu1tua0000ejedyi913k06
cmogu8zi5000xslednr82zsoe	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:52.733	cmogu1tua0000ejedyi913k06
cmogu90aw000ysled1c368jp2	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:53.768	cmogu1tua0000ejedyi913k06
cmogu91y2000zsledfsrgkamt	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:55.898	cmogu1tua0000ejedyi913k06
cmogu929g0010sled5jnhj5lq	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:56.308	cmogu1tua0000ejedyi913k06
cmogu92hi0011sledo4koddbn	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:56.598	cmogu1tua0000ejedyi913k06
cmogu92o20012sledb42t97sb	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:56.834	cmogu1tua0000ejedyi913k06
cmogu93q90013sledktdf0w6h	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:58.209	cmogu1tua0000ejedyi913k06
cmogu942m0014sledtjtrvvc2	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:58.654	cmogu1tua0000ejedyi913k06
cmogu94hq0015sledfar1sclx	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:50:59.198	cmogu1tua0000ejedyi913k06
cmogu95q10016sledyfa2c5i9	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:00.793	cmogu1tua0000ejedyi913k06
cmogu95wv0017sledchh8jfze	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:01.039	cmogu1tua0000ejedyi913k06
cmogu961k0018sledu1z3s0dj	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:01.208	cmogu1tua0000ejedyi913k06
cmogu96a70019sledkjkh1m54	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:01.519	cmogu1tua0000ejedyi913k06
cmogu96is001asledw5z5t49l	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:01.828	cmogu1tua0000ejedyi913k06
cmogu96yc001bsledxz9zec0g	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:02.388	cmogu1tua0000ejedyi913k06
cmogu9746001csledqau5crcp	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:02.598	cmogu1tua0000ejedyi913k06
cmogu98aa001dsledi4bn26na	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:04.114	cmogu1tua0000ejedyi913k06
cmogu98g4001esledhixmcxck	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:04.324	cmogu1tua0000ejedyi913k06
cmogu98ok001fsled90nnxmgi	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:04.628	cmogu1tua0000ejedyi913k06
cmogu98uo001gsled6t5bf01q	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:04.849	cmogu1tua0000ejedyi913k06
cmogu9b4t001hsledavyrxuvg	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:07.805	cmogu1tua0000ejedyi913k06
cmogu9b7u001isled9qt0htfg	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:07.914	cmogu1tua0000ejedyi913k06
cmogu9bcq001jsled9fki7lyv	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:08.09	cmogu1tua0000ejedyi913k06
cmogu9bgp001ksledtoprtei3	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 06:51:08.233	cmogu1tua0000ejedyi913k06
cmogvr9y1001lsledlunimcly	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:05.69	cmogu1tua0000ejedyi913k06
cmogvra5k001msledxclqk6dx	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:05.96	cmogu1tua0000ejedyi913k06
cmogvrapj001nsledu7nw331m	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:06.679	cmogu1tua0000ejedyi913k06
cmogvrbhm001osled238prs56	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:07.69	cmogu1tua0000ejedyi913k06
cmogvrgaf001pslednd6dgzqq	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:13.911	cmogu1tua0000ejedyi913k06
cmogvrgrb001qsledzrmx68v0	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:14.519	cmogu1tua0000ejedyi913k06
cmogvrh85001rsledni57ytb1	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:15.125	cmogu1tua0000ejedyi913k06
cmogvrhdk001ssledyldmtvn9	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:15.32	cmogu1tua0000ejedyi913k06
cmogvrhhv001tsled9fzfl21o	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:15.475	cmogu1tua0000ejedyi913k06
cmogvripf001usledg6jhhnvo	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:17.043	cmogu1tua0000ejedyi913k06
cmogvrj6l001vslederztsaw8	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:17.661	cmogu1tua0000ejedyi913k06
cmogvrlni001wsledwcsohde9	chat_open	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:20.862	cmogu1tua0000ejedyi913k06
cmogvrnqe001ysledlsal8mb9	message_sent	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 07:33:23.558	cmogu1tua0000ejedyi913k06
cmogy7mq00021sled3paini14	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:41:47.976	cmogy71j80020sled2adg1ct0
cmogy86y20022sleddhlz0uo2	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:42:14.186	cmogy71j80020sled2adg1ct0
cmogy91co0023sledvsrzlqfe	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:42:53.592	cmogy71j80020sled2adg1ct0
cmogy92st0024sled5axw2r3x	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:42:55.469	cmogy71j80020sled2adg1ct0
cmogy9brd0025sled1bogopz5	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:43:07.081	cmogy71j80020sled2adg1ct0
cmogy9dtx0026sled6b7foq56	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:43:09.765	cmogy71j80020sled2adg1ct0
cmogya5530027sledxymsx8g7	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:43:45.159	cmogy71j80020sled2adg1ct0
cmogya5q30028sledq2hlgrqu	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:43:45.915	cmogy71j80020sled2adg1ct0
cmogya65o0029sleduo5m127i	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:43:46.476	cmogy71j80020sled2adg1ct0
cmogyak5p002asled7xy4sndp	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:44:04.621	cmogy71j80020sled2adg1ct0
cmogyakeq002bsleda732z7b2	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:44:04.946	cmogy71j80020sled2adg1ct0
cmogyaktr002csled09p7rzra	chat_open	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:44:05.487	cmogy71j80020sled2adg1ct0
cmogyan23002esledpbqomiys	message_sent	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:44:08.379	cmogy71j80020sled2adg1ct0
cmogyaobj002gsledk8l1en6z	message_sent	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:44:10.015	cmogy71j80020sled2adg1ct0
cmogyd1ne002islededoxjg9v	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:46:00.602	cmogy71j80020sled2adg1ct0
cmogyd2yr002jsledhj5nkol1	continue_click	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:46:02.307	cmogy71j80020sled2adg1ct0
cmogyd69d002ksledwxoa1jft	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:46:06.577	cmogy71j80020sled2adg1ct0
cmogydp3h002lsled4zld5qyg	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:46:30.989	cmogy71j80020sled2adg1ct0
cmogyeowg002msleded37cu8h	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:47:17.392	cmogy71j80020sled2adg1ct0
cmogylxxk002nsledb0ninupy	page_view	::ffff:188.93.233.216	Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0	\N	2026-04-27 08:52:55.688	cmogy71j80020sled2adg1ct0
cmogzxyb0002osledprysre9n	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:15.66	cmogy71j80020sled2adg1ct0
cmogzxzfm002psledt7le5fjm	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:17.122	cmogy71j80020sled2adg1ct0
cmogzxzre002qsledcw7vpyjg	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:17.546	cmogy71j80020sled2adg1ct0
cmogzxzwl002rsledcumipjc5	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:17.733	cmogy71j80020sled2adg1ct0
cmogzy129002ssledqvsiv1dl	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:19.233	cmogy71j80020sled2adg1ct0
cmogzyb0t002tslednnosdlvs	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:32.141	cmogy71j80020sled2adg1ct0
cmogzybfg002usled7niqehhi	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:32.668	cmogy71j80020sled2adg1ct0
cmogzybvp002vsledva3mn94g	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:33.253	cmogy71j80020sled2adg1ct0
cmogzyc14002wsled763uszdr	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:33.448	cmogy71j80020sled2adg1ct0
cmogzycv9002xsled1cl0mbt1	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:34.533	cmogy71j80020sled2adg1ct0
cmogzyd8m002ysledgxz1quoo	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:35.014	cmogy71j80020sled2adg1ct0
cmogzye6w002zsleds66m2dsk	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-27 09:30:36.248	cmogy71j80020sled2adg1ct0
cmohtdhxl00027qedangaspb3	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 23:14:09.801	cmohs9fjc00017qedu95pg8fz
cmohtdkoo00037qeddu31x3p1	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 23:14:13.368	cmogy71j80020sled2adg1ct0
cmohtdofk00047qed313v1c00	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 23:14:18.224	cmogu1tua0000ejedyi913k06
cmohtdr3f00057qed27f0vsxm	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-27 23:14:21.675	cmogmjdgl00003rmujo6npgok
cmohteeaw00067qednb2v8o9h	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-27 23:14:51.752	cmogu1tua0000ejedyi913k06
cmohtf61500077qedahi004t9	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-27 23:15:27.689	cmogu1tua0000ejedyi913k06
cmohtffhc00087qedu0iatt3n	page_view	::ffff:169.150.201.14	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	\N	2026-04-27 23:15:39.936	cmogu1tua0000ejedyi913k06
cmohtwc1l0000a8ed6kusoj2g	page_view	::ffff:169.150.201.14	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	\N	2026-04-27 23:28:48.633	cmogu1tua0000ejedyi913k06
cmohtwg500001a8ed1dzgvsaz	page_view	::ffff:169.150.201.14	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	\N	2026-04-27 23:28:53.941	cmogu1tua0000ejedyi913k06
cmohtwjuw0002a8edgek7utvs	chat_open	::ffff:169.150.201.14	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	\N	2026-04-27 23:28:58.76	cmogu1tua0000ejedyi913k06
cmohtydu60003a8edc2rpuyms	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-27 23:30:24.27	cmogu1tua0000ejedyi913k06
cmohv5t6i0004a8edgif17kp2	page_view	::ffff:169.150.201.14	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:04:10.362	cmogu1tua0000ejedyi913k06
cmohv5vh60005a8edppxx1ems	page_view	::ffff:169.150.201.14	Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.5 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:04:13.338	cmogu1tua0000ejedyi913k06
cmohv74yv0006a8ed5wv3mzbc	page_view	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:12.295	cmogu1tua0000ejedyi913k06
cmohv75ps0007a8ed20o8rvrp	page_view	::ffff:108.54.68.219	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3.1 Mobile/23D8133 Safari/604.1	\N	2026-04-28 00:05:13.264	cmogu1tua0000ejedyi913k06
cmohv76p60008a8edjf4axzc4	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:14.538	cmogu1tua0000ejedyi913k06
cmohv779m0009a8ed11gk91iv	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:15.274	cmogu1tua0000ejedyi913k06
cmohv77f6000aa8edjrprjmjy	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:15.474	cmogu1tua0000ejedyi913k06
cmohv7adp000ba8eduxzr6nt9	page_view	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:19.309	cmogu1tua0000ejedyi913k06
cmohv7aym000ca8edyselomit	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:20.062	cmogu1tua0000ejedyi913k06
cmohv7b7y000da8edqkh56f73	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:20.398	cmogu1tua0000ejedyi913k06
cmohv7bdo000ea8ed0sge6yth	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:20.604	cmogu1tua0000ejedyi913k06
cmohv7bii000fa8edcgb6j3ss	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-04-28 00:05:20.778	cmogu1tua0000ejedyi913k06
cmohv7fxl000ga8edkkhyali4	page_view	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:26.505	cmogu1tua0000ejedyi913k06
cmohv7gwz000ha8edma42yqal	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:27.78	cmogu1tua0000ejedyi913k06
cmohv7h27000ia8ed5rwph0i7	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:27.968	cmogu1tua0000ejedyi913k06
cmohv7i51000ja8edlw2yc601	page_view	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:29.365	cmogu1tua0000ejedyi913k06
cmohv7ile000ka8edrepvd0jz	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:29.954	cmogu1tua0000ejedyi913k06
cmohv7iq7000la8ed9jca4n6o	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:30.127	cmogu1tua0000ejedyi913k06
cmohv7ivi000ma8edgz1mhxvg	continue_click	::ffff:77.119.181.183	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-04-28 00:05:30.318	cmogu1tua0000ejedyi913k06
cmohz14wg0000ckedi45u44c3	payment_method_selected	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-04-28 01:52:30.736	cmogu1tua0000ejedyi913k06
cmohz81iy0001cked55csyykp	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-28 01:57:52.954	cmogu1tua0000ejedyi913k06
cmohz883f0002cked4udh7iax	payment_method_selected	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	{"method": "bank"}	2026-04-28 01:58:01.468	cmogu1tua0000ejedyi913k06
cmohz8a6u0003ckedfceesu0l	bank_selected	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	{"bank": "Bank Austria"}	2026-04-28 01:58:04.182	cmogu1tua0000ejedyi913k06
cmohz8aae0004cked3a17knux	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-28 01:58:04.31	cmogu1tua0000ejedyi913k06
cmohz8xn00005cked0xrngqwc	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.0.1 Safari/605.1.15 Ddg/26.0.1	\N	2026-04-28 01:58:34.572	cmogu1tua0000ejedyi913k06
cmohzees60006ckedkpdazry4	page_view	::ffff:169.150.201.14	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-04-28 02:02:50.071	cmogu1tua0000ejedyi913k06
cmondd46j0007ckedwxu5n4mx	page_view	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-01 20:32:35.179	cmohs9fjc00017qedu95pg8fz
cmondd7770008cked7cbzmg09	payment_method_selected	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"method": "credit_card"}	2026-05-01 20:32:39.091	cmohs9fjc00017qedu95pg8fz
cmondd7970009ckedyrz20wxn	page_view	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-01 20:32:39.163	cmohs9fjc00017qedu95pg8fz
cmondd8sr000ackedwrmaco5u	continue_click	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-01 20:32:41.163	cmohs9fjc00017qedu95pg8fz
cmondd9bq000bckedqjy7jar5	continue_click	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-01 20:32:41.846	cmohs9fjc00017qedu95pg8fz
cmonddb31000cckeds5ey80g1	payment_method_selected	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"method": "bank"}	2026-05-01 20:32:44.125	cmohs9fjc00017qedu95pg8fz
cmonddbr8000dckedrzlfs821	bank_selected	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"bank": "Bawag"}	2026-05-01 20:32:44.996	cmohs9fjc00017qedu95pg8fz
cmonddbti000eckeddsrft3ai	page_view	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-01 20:32:45.078	cmohs9fjc00017qedu95pg8fz
cmonddd4c000fckeddrsn1ek0	continue_click	::ffff:185.24.11.176	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-01 20:32:46.765	cmohs9fjc00017qedu95pg8fz
cmoorb35x000gckedp7rrv7st	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:41.349	cmohs9fjc00017qedu95pg8fz
cmoorb3r7000hckedx4ei0w0t	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:42.115	cmohs9fjc00017qedu95pg8fz
cmoorb4js000ickeded2ues9r	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:43.144	cmohs9fjc00017qedu95pg8fz
cmoorb5hs000jcked6a490he4	payment_method_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-02 19:50:44.368	cmohs9fjc00017qedu95pg8fz
cmoorb60f000kckedfpmek8un	bank_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bawag"}	2026-05-02 19:50:45.039	cmohs9fjc00017qedu95pg8fz
cmoorb62j000lckedh30x6sk9	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:45.115	cmohs9fjc00017qedu95pg8fz
cmoorb6k4000mckeda8bstixm	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:45.748	cmohs9fjc00017qedu95pg8fz
cmoorb6v8000nckedc3heohop	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:46.148	cmohs9fjc00017qedu95pg8fz
cmoorb70t000ocked105qsvbz	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:46.349	cmohs9fjc00017qedu95pg8fz
cmoorb771000pcked6skc1aaw	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:46.573	cmohs9fjc00017qedu95pg8fz
cmoorb7bh000qcked2aykfhpl	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:46.733	cmohs9fjc00017qedu95pg8fz
cmoorb8m5000rckedew1o51re	payment_method_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-02 19:50:48.413	cmohs9fjc00017qedu95pg8fz
cmoorb8p1000sckedowqutakf	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:48.517	cmohs9fjc00017qedu95pg8fz
cmoorb937000tckedbcye6vaj	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:49.027	cmohs9fjc00017qedu95pg8fz
cmoorb9d4000uckedhqndfbop	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:49.384	cmohs9fjc00017qedu95pg8fz
cmoorb9i4000vckedp5ak1h38	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:49.564	cmohs9fjc00017qedu95pg8fz
cmoorba5o000wckedl82pevhc	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-02 19:50:50.412	cmohs9fjc00017qedu95pg8fz
cmopph583000xcked93z4d4re	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:10.899	cmohs9fjc00017qedu95pg8fz
cmopph6ip000yckedhzj3xxco	payment_method_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	{"method": "bank"}	2026-05-03 11:47:12.577	cmohs9fjc00017qedu95pg8fz
cmopph6w8000zckedsjdvp4sg	bank_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	{"bank": "Erste Bank"}	2026-05-03 11:47:13.064	cmohs9fjc00017qedu95pg8fz
cmopph6xl0010ckedpph4er2a	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:13.113	cmohs9fjc00017qedu95pg8fz
cmopph7df0011cked1qnbbpgh	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:13.683	cmohs9fjc00017qedu95pg8fz
cmopph7r20012ckeds38n739b	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:14.174	cmohs9fjc00017qedu95pg8fz
cmopph7y00013ckedow95zc4e	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:14.424	cmohs9fjc00017qedu95pg8fz
cmopph84t0014ckedm64m9kv3	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:14.669	cmohs9fjc00017qedu95pg8fz
cmopph8ac0015cked0yfgjos8	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:14.868	cmohs9fjc00017qedu95pg8fz
cmopph8h50016ckedoc8dx1z1	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:15.113	cmohs9fjc00017qedu95pg8fz
cmopph8lq0017cked7t0v1c0d	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:15.278	cmohs9fjc00017qedu95pg8fz
cmopph9i70018ckedy33n74ka	payment_method_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	{"method": "bank"}	2026-05-03 11:47:16.447	cmohs9fjc00017qedu95pg8fz
cmoppha9p0019cked6ip6epdj	bank_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-03 11:47:17.437	cmohs9fjc00017qedu95pg8fz
cmopphabn001ackedtfdbhlri	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:17.507	cmohs9fjc00017qedu95pg8fz
cmopphaqj001bcked05y2cgsf	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:18.043	cmohs9fjc00017qedu95pg8fz
cmopphaxx001cckedaojjtotk	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:18.309	cmohs9fjc00017qedu95pg8fz
cmopphb3d001dckedwujv1k8s	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:18.505	cmohs9fjc00017qedu95pg8fz
cmopphh4f001eckedxj8qq4xw	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:26.319	cmohs9fjc00017qedu95pg8fz
cmopphhcl001fckedewmjzyap	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:26.613	cmohs9fjc00017qedu95pg8fz
cmopphhi1001gckedn0n5izbv	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:26.809	cmohs9fjc00017qedu95pg8fz
cmopphjpc001hckeduui98dif	payment_method_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	{"method": "bank"}	2026-05-03 11:47:29.664	cmohs9fjc00017qedu95pg8fz
cmopphmet001ickedqucqr11i	bank_selected	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	{"bank": "YKB Bank"}	2026-05-03 11:47:33.173	cmohs9fjc00017qedu95pg8fz
cmopphmf8001jckedt9dc7ali	page_view	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:33.188	cmohs9fjc00017qedu95pg8fz
cmopphmtv001kckedol88rlcs	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:33.715	cmohs9fjc00017qedu95pg8fz
cmopphn6m001lckedgurszwoy	continue_click	::ffff:77.119.25.98	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/23C55 Safari/604.1	\N	2026-05-03 11:47:34.175	cmohs9fjc00017qedu95pg8fz
cmoq5epob001mckedcjp85x4q	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:11.291	cmohs9fjc00017qedu95pg8fz
cmoq5eq75001nckedf7wmlwxi	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:11.969	cmohs9fjc00017qedu95pg8fz
cmoq5erey001ocked6gy6n5e1	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 19:13:13.546	cmohs9fjc00017qedu95pg8fz
cmoq5errv001pcked8gdxhru6	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bawag"}	2026-05-03 19:13:14.011	cmohs9fjc00017qedu95pg8fz
cmoq5ertm001qckedamqs4uy8	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:14.074	cmohs9fjc00017qedu95pg8fz
cmoq5esa5001rcked5g75yysp	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:14.67	cmohs9fjc00017qedu95pg8fz
cmoq5esmt001scked4u121y30	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:15.125	cmohs9fjc00017qedu95pg8fz
cmoq5essm001tcked5szba3hk	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:15.334	cmohs9fjc00017qedu95pg8fz
cmoq5esz3001ucked7x1sie2x	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:15.567	cmohs9fjc00017qedu95pg8fz
cmoq5ettw001vckedm5hpkvvw	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-03 19:13:16.676	cmohs9fjc00017qedu95pg8fz
cmoq5etv0001wckedtgyfawld	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:16.716	cmohs9fjc00017qedu95pg8fz
cmoq5eu92001xckedioqg6fik	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:17.222	cmohs9fjc00017qedu95pg8fz
cmoq5eui2001ycked3leggvq2	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:17.546	cmohs9fjc00017qedu95pg8fz
cmoq5eumw001zckedweh5bcv9	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:17.72	cmohs9fjc00017qedu95pg8fz
cmoq5eus60020cked4hht6hyy	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:17.91	cmohs9fjc00017qedu95pg8fz
cmoq5euxb0021ckedzsx83l72	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:18.095	cmohs9fjc00017qedu95pg8fz
cmoq5ev2v0022ckedcr8bf2fe	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:18.295	cmohs9fjc00017qedu95pg8fz
cmoq5ev8y0023ckeds5ucsu5y	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:18.514	cmohs9fjc00017qedu95pg8fz
cmoq5evdj0024ckedsjnywa6x	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:18.679	cmohs9fjc00017qedu95pg8fz
cmoq5evjx0025cked4xbtm1zu	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:18.909	cmohs9fjc00017qedu95pg8fz
cmoq5evot0026ckeditri2tzf	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:19.085	cmohs9fjc00017qedu95pg8fz
cmoq5evt80027ckedu9aqofkh	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:19.244	cmohs9fjc00017qedu95pg8fz
cmoq5evzw0028ckedwmpp7qb0	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:19.484	cmohs9fjc00017qedu95pg8fz
cmoq5ew6g0029ckedhk9lzyv6	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:19.72	cmohs9fjc00017qedu95pg8fz
cmoq5ewcn002ackedrrm82tho	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:19.943	cmohs9fjc00017qedu95pg8fz
cmoq5ewfa002bckedcfhdox0v	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:20.038	cmohs9fjc00017qedu95pg8fz
cmoq5ewj8002ccked0pc5ot4q	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:20.18	cmohs9fjc00017qedu95pg8fz
cmoq5ewmo002dckedclq2q4i5	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:20.304	cmohs9fjc00017qedu95pg8fz
cmoq5ewq1002eckedie3qztgs	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:20.425	cmohs9fjc00017qedu95pg8fz
cmoq5ewww002fckedoigdg3nq	chat_open	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:13:20.672	cmohs9fjc00017qedu95pg8fz
cmoq5zw69002gckedrb1g0txy	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:39.489	cmohs9fjc00017qedu95pg8fz
cmoq5zwnq002hckedrmjskwhp	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:40.118	cmohs9fjc00017qedu95pg8fz
cmoq5zwxs002ickedos7xr2hu	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:40.48	cmohs9fjc00017qedu95pg8fz
cmoq5zxo4002jckedslqp8ihb	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 19:29:41.428	cmohs9fjc00017qedu95pg8fz
cmoq5zy7l002kckedxvi3wc7v	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bawag"}	2026-05-03 19:29:42.129	cmohs9fjc00017qedu95pg8fz
cmoq5zya1002lckedd76vcopy	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:42.217	cmohs9fjc00017qedu95pg8fz
cmoq5zyns002mckedz1jx2pca	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:42.712	cmohs9fjc00017qedu95pg8fz
cmoq5zyta002ncked5ce6zjv9	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:42.91	cmohs9fjc00017qedu95pg8fz
cmoq5zyyg002ocked0gpcgfy7	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:43.096	cmohs9fjc00017qedu95pg8fz
cmoq601kq002pckedypt5st01	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 19:29:46.49	cmohs9fjc00017qedu95pg8fz
cmoq602r9002qcked6kcv7vom	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-03 19:29:48.021	cmohs9fjc00017qedu95pg8fz
cmoq602tb002rcked303xjkfh	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:48.095	cmohs9fjc00017qedu95pg8fz
cmoq603b9002sckedmriast0t	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:48.741	cmohs9fjc00017qedu95pg8fz
cmoq603ln002tckedchsav3ll	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:49.115	cmohs9fjc00017qedu95pg8fz
cmoq603qo002uckedttir4muy	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:29:49.296	cmohs9fjc00017qedu95pg8fz
cmoq6xeh2002vckedc9fftpqr	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:42.855	cmohs9fjc00017qedu95pg8fz
cmoq6xeqr002wckedmkkexo9b	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:43.203	cmohs9fjc00017qedu95pg8fz
cmoq6xev7002xckedlvfb9cm3	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:43.363	cmohs9fjc00017qedu95pg8fz
cmoq6xfmk002ycked5crdua94	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:44.348	cmohs9fjc00017qedu95pg8fz
cmoq6xg79002zckedxdg194nd	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:45.094	cmohs9fjc00017qedu95pg8fz
cmoq6xgbe0030ckedgf95jr43	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:45.242	cmohs9fjc00017qedu95pg8fz
cmoq6xh1t0031ckedwcxs1kox	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 19:55:46.193	cmohs9fjc00017qedu95pg8fz
cmoq6xhez0032ckedfv5b7skn	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Erste Bank"}	2026-05-03 19:55:46.667	cmohs9fjc00017qedu95pg8fz
cmoq6xhh00033ckedsa1t6ocq	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:46.74	cmohs9fjc00017qedu95pg8fz
cmoq6xhwe0034ckedw8zxnbbj	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:47.294	cmohs9fjc00017qedu95pg8fz
cmoq6xi1w0035ckedth6awolf	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:47.492	cmohs9fjc00017qedu95pg8fz
cmoq6xi810036ckedn0fztn1z	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:47.713	cmohs9fjc00017qedu95pg8fz
cmoq6xidp0037ckedfjgrp6fx	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:47.917	cmohs9fjc00017qedu95pg8fz
cmoq6xihb0038ckedgzl1csu1	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:48.047	cmohs9fjc00017qedu95pg8fz
cmoq6xjzq0039ckedvgesjrcf	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-03 19:55:50.006	cmohs9fjc00017qedu95pg8fz
cmoq6xk18003acked9xhp5x3k	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:50.06	cmohs9fjc00017qedu95pg8fz
cmoq6xkgl003bckedtby68kea	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:50.613	cmohs9fjc00017qedu95pg8fz
cmoq6xkog003cckedlh4wkq45	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:50.896	cmohs9fjc00017qedu95pg8fz
cmoq6xksr003dckedp0hfy5c2	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 19:55:51.051	cmohs9fjc00017qedu95pg8fz
cmoq7hfe5003ecked21sph8te	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:17.165	cmohs9fjc00017qedu95pg8fz
cmoq7hfne003fckeddetwirjc	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:17.498	cmohs9fjc00017qedu95pg8fz
cmoq7hgik003gcked4swqni87	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 20:11:18.62	cmohs9fjc00017qedu95pg8fz
cmoq7hgz1003hckedt20qthn1	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bawag"}	2026-05-03 20:11:19.213	cmohs9fjc00017qedu95pg8fz
cmoq7hh0v003ickedvero652d	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:19.279	cmohs9fjc00017qedu95pg8fz
cmoq7hhf8003jckedi94m5pvy	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:19.796	cmohs9fjc00017qedu95pg8fz
cmoq7hhlr003kckedthjriolr	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:20.031	cmohs9fjc00017qedu95pg8fz
cmoq7hhqe003lckedzcnx0nff	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:20.199	cmohs9fjc00017qedu95pg8fz
cmoq7hhva003mckedzxkbvk7w	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:20.374	cmohs9fjc00017qedu95pg8fz
cmoq7hi0p003nckedhk7sdr4o	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:20.569	cmohs9fjc00017qedu95pg8fz
cmoq7hi5g003ocked39amw7p2	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:20.74	cmohs9fjc00017qedu95pg8fz
cmoq7hiaa003pckedguip34n5	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 20:11:20.914	cmohs9fjc00017qedu95pg8fz
cmoqabxao003qckedce4fdtip	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:30:59.28	cmohs9fjc00017qedu95pg8fz
cmoqabxuz003rcked9semawl7	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:00.011	cmohs9fjc00017qedu95pg8fz
cmoqaby7a003sckedihu5x3jq	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:00.454	cmohs9fjc00017qedu95pg8fz
cmoqabz98003tckedzc2nrucf	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 21:31:01.82	cmohs9fjc00017qedu95pg8fz
cmoqabzla003uckedb2k860wn	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bawag"}	2026-05-03 21:31:02.254	cmohs9fjc00017qedu95pg8fz
cmoqabznn003vckedm31x58vc	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:02.339	cmohs9fjc00017qedu95pg8fz
cmoqac00u003wckedtepmnng1	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:02.814	cmohs9fjc00017qedu95pg8fz
cmoqac05t003xckedhdtjm53x	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:02.993	cmohs9fjc00017qedu95pg8fz
cmoqac0bh003yckedw75vsgks	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:03.197	cmohs9fjc00017qedu95pg8fz
cmoqac0fz003zckedxgyf77od	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:03.359	cmohs9fjc00017qedu95pg8fz
cmoqac1bj0040ckeds0jl7eoo	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 21:31:04.495	cmohs9fjc00017qedu95pg8fz
cmoqac1pb0041ckedqb5rc8bk	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Erste Bank"}	2026-05-03 21:31:04.991	cmohs9fjc00017qedu95pg8fz
cmoqac1ry0042ckedya58a2on	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:05.087	cmohs9fjc00017qedu95pg8fz
cmoqac2650043ckedlvi8glkg	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:05.597	cmohs9fjc00017qedu95pg8fz
cmoqac2av0044ckedhznnj62t	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:05.767	cmohs9fjc00017qedu95pg8fz
cmoqac2g10045cked3h4l6yx1	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:05.953	cmohs9fjc00017qedu95pg8fz
cmoqac32d0046ckedws68hq22	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:06.757	cmohs9fjc00017qedu95pg8fz
cmoqac4aj0047ckedbh1llnzu	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 21:31:08.347	cmohs9fjc00017qedu95pg8fz
cmoqac4oo0048ckedm26guiwm	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Erste Bank"}	2026-05-03 21:31:08.856	cmohs9fjc00017qedu95pg8fz
cmoqac4rb0049ckedsltct5ix	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:08.951	cmohs9fjc00017qedu95pg8fz
cmoqac5gy004acked3tmmph5z	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:09.874	cmohs9fjc00017qedu95pg8fz
cmoqac5jk004bckedunj2v776	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:31:09.968	cmohs9fjc00017qedu95pg8fz
cmoqag14e004cckedsyr2b2le	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:34:10.862	cmohs9fjc00017qedu95pg8fz
cmoqag1zp004dcked6wmdmaw2	payment_method_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 21:34:11.989	cmohs9fjc00017qedu95pg8fz
cmoqag2gs004eckediy6od5hv	bank_selected	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-03 21:34:12.604	cmohs9fjc00017qedu95pg8fz
cmoqag2o5004fckedcpq2scoj	page_view	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:34:12.869	cmohs9fjc00017qedu95pg8fz
cmoqag2v2004gckednxnxa6pi	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:34:13.119	cmohs9fjc00017qedu95pg8fz
cmoqag30j004hckedav6xjsrd	continue_click	::ffff:146.70.116.118	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:34:13.316	cmohs9fjc00017qedu95pg8fz
cmoqahdtt004jckedloe30fxc	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:35:13.985	cmoqah3br004icked11s344ye
cmoqahf3d004kckedzz6hsely	payment_method_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 21:35:15.625	cmoqah3br004icked11s344ye
cmoqahfg9004lckednb90kkwd	bank_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Erste Bank"}	2026-05-03 21:35:16.089	cmoqah3br004icked11s344ye
cmoqahfhm004mckedzd5zyd75	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:35:16.138	cmoqah3br004icked11s344ye
cmoqahfz4004nckedxikwmkgl	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:35:16.768	cmoqah3br004icked11s344ye
cmoqahggg004ockedixwoyvqd	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:35:17.392	cmoqah3br004icked11s344ye
cmoqahgm4004pckedw7lw5bqp	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:35:17.596	cmoqah3br004icked11s344ye
cmoqahgrm004qcked1mgepk24	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 21:35:17.795	cmoqah3br004icked11s344ye
cmoqbgib2004rcked6kn82vgq	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:32.75	cmoqah3br004icked11s344ye
cmoqbgjjq004scked33nmz5zc	payment_method_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 22:02:34.358	cmoqah3br004icked11s344ye
cmoqbgk1k004tcked55egqpwe	bank_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Erste Bank"}	2026-05-03 22:02:35	cmoqah3br004icked11s344ye
cmoqbgk34004uckedanys0t6e	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:35.056	cmoqah3br004icked11s344ye
cmoqbgkls004vckedz21i6zjo	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:35.728	cmoqah3br004icked11s344ye
cmoqbgkrb004wckedrupjsdl4	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:35.927	cmoqah3br004icked11s344ye
cmoqbgkwl004xckedk7yeyucm	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:36.117	cmoqah3br004icked11s344ye
cmoqbgl1g004yckedj3l25ifs	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:36.292	cmoqah3br004icked11s344ye
cmoqbgltg004zckedtjqnqwyk	payment_method_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-03 22:02:37.3	cmoqah3br004icked11s344ye
cmoqbgmds0050cked1vxsm6lt	bank_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bawag"}	2026-05-03 22:02:38.032	cmoqah3br004icked11s344ye
cmoqbgmf70051ckedoiomk56s	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:38.083	cmoqah3br004icked11s344ye
cmoqbgmul0052ckedrmr89xob	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:38.637	cmoqah3br004icked11s344ye
cmoqbgmzr0053ckedsy8wcv27	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:38.823	cmoqah3br004icked11s344ye
cmoqbgn500054cked13iphbuq	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:39.012	cmoqah3br004icked11s344ye
cmoqbgnau0055ckedtiutzuso	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:39.222	cmoqah3br004icked11s344ye
cmoqbgnfo0056ckedavn2rw3p	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:39.396	cmoqah3br004icked11s344ye
cmoqbgnke0057ckedrhvza48b	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:02:39.566	cmoqah3br004icked11s344ye
cmoqbjcqd0058ckedh9qcr9me	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-03 22:04:45.493	cmoqah3br004icked11s344ye
cmoqgmbfn0059ckedku09n92g	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 00:27:01.859	cmoqah3br004icked11s344ye
cmoqgmy8r005ackedw0slcxw6	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "credit_card"}	2026-05-04 00:27:31.419	cmoqah3br004icked11s344ye
cmoqgmyl8005bckedylz8saih	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 00:27:31.868	cmoqah3br004icked11s344ye
cmoqgmyyf005ccked9tgq4phm	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "bank"}	2026-05-04 00:27:32.343	cmoqah3br004icked11s344ye
cmoqpuivw000j1jed4f7sz52e	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 04:45:21.308	cmoqah3br004icked11s344ye
cmoqpukg8000k1jed82wuk5u1	payment_method_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 04:45:23.336	cmoqah3br004icked11s344ye
cmoqpukv8000l1jed031jzr6e	bank_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-04 04:45:23.876	cmoqah3br004icked11s344ye
cmoqpxhnw000n1jedb5rkwu6n	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 04:47:39.692	cmoqah3br004icked11s344ye
cmoqpxiud000o1jed7w7iuvif	payment_method_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-04 04:47:41.221	cmoqah3br004icked11s344ye
cmoqpxiwi000p1jedkaihajng	page_view	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 04:47:41.298	cmoqah3br004icked11s344ye
cmoqpxja5000q1jedo78gmli0	continue_click	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 04:47:41.789	cmoqah3br004icked11s344ye
cmoqpxkk3000r1jedf4xoqk1h	payment_method_selected	::ffff:77.119.179.29	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 04:47:43.443	cmoqah3br004icked11s344ye
cmoqv9asx000t1jedb4yfix9m	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 07:16:48.754	cmoqah3br004icked11s344ye
cmoqv9bpk000u1jedbyja31ja	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 07:16:49.928	cmoqah3br004icked11s344ye
cmoqv9d91000v1jed4jfzx7pt	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 07:16:51.925	cmoqah3br004icked11s344ye
cmoqwpxpe000x1jedsifg9xed	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 07:57:44.547	cmoqah3br004icked11s344ye
cmoqwpyxw000y1jed1j4pw0fh	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 07:57:46.148	cmoqah3br004icked11s344ye
cmoqygige000z1jed6mocvrxo	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 08:46:24.11	cmoqah3br004icked11s344ye
cmoqygk1l00101jed7eq1jl3i	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 08:46:26.169	cmoqah3br004icked11s344ye
cmoqygkqz00111jedox4253os	bank_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bank99"}	2026-05-04 08:46:27.083	cmoqah3br004icked11s344ye
cmoqz2c1r00121jedls2ttobi	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 09:03:22.239	cmoqah3br004icked11s344ye
cmoqz2ctr00131jedx1ki3d3l	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 09:03:23.247	cmoqah3br004icked11s344ye
cmoqz2eex00141jedpjn4gayb	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 09:03:25.305	cmoqah3br004icked11s344ye
cmor3o47300151jedv61tfetb	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 11:12:16.959	cmoqah3br004icked11s344ye
cmorbw1q000161jedfbxg7vqm	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:23.928	cmoqah3br004icked11s344ye
cmorbw29700171jed22m766oy	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:24.619	cmoqah3br004icked11s344ye
cmorbw3bj00181jedm2e625fj	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-04 15:02:25.999	cmoqah3br004icked11s344ye
cmorbw3cv00191jedq9nuh1rj	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:26.047	cmoqah3br004icked11s344ye
cmorbw42l001a1jedp71mq1n7	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:26.973	cmoqah3br004icked11s344ye
cmorbw4dp001b1jed51z0968h	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:27.373	cmoqah3br004icked11s344ye
cmorbw4k1001c1jedoqg8da0z	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:27.601	cmoqah3br004icked11s344ye
cmorbw4od001d1jedyqk55rnd	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 15:02:27.757	cmoqah3br004icked11s344ye
cmorbw5h5001e1jedhxztytuv	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 15:02:28.794	cmoqah3br004icked11s344ye
cmord23jz001f1jedtckr0jos	page_view	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:05.855	cmoqah3br004icked11s344ye
cmord24km001g1jeda3umbzxy	continue_click	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:07.174	cmoqah3br004icked11s344ye
cmord26ft001h1jedvqmabs2g	continue_click	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:09.593	cmoqah3br004icked11s344ye
cmord26lx001i1jedxt1ameu7	continue_click	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:09.813	cmoqah3br004icked11s344ye
cmord26qx001j1jedjofmy5pv	continue_click	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:09.993	cmoqah3br004icked11s344ye
cmord26ve001k1jedfpm1ei4t	continue_click	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:10.154	cmoqah3br004icked11s344ye
cmord270e001l1jedffvtl2ep	continue_click	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:35:10.334	cmoqah3br004icked11s344ye
cmord2dxy001m1jedswmyop0f	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:35:19.318	cmoqah3br004icked11s344ye
cmord2fda001n1jed7um7a605	bank_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"bank": "Oberbank"}	2026-05-04 15:35:21.166	cmoqah3br004icked11s344ye
cmord2lsb001o1jedaks1t3ts	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:35:29.483	cmoqah3br004icked11s344ye
cmord2x1b001p1jed9gtp56u1	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:35:44.064	cmoqah3br004icked11s344ye
cmord3a77001r1jed217ork58	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:36:01.123	cmoqah3br004icked11s344ye
cmord3m5j001s1jeda4hur1c2	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:36:16.615	cmoqah3br004icked11s344ye
cmord3orz001t1jed7ihfmq5r	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:36:20.015	cmoqah3br004icked11s344ye
cmord3ui2001u1jed72z3njkj	payment_method_selected	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 15:36:27.434	cmoqah3br004icked11s344ye
cmord97kk001v1jedywr9usve	page_view	::ffff:185.102.218.105	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 15:40:37.652	cmohs9fjc00017qedu95pg8fz
cmorlgcsd001x1jedbmsguwx0	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 19:30:07.933	cmoqah3br004icked11s344ye
cmorlgeln001y1jed61fqnaqs	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "bank"}	2026-05-04 19:30:10.283	cmoqah3br004icked11s344ye
cmorlgfsq001z1jedin8pl9yn	bank_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"bank": "Bank Austria"}	2026-05-04 19:30:11.834	cmoqah3br004icked11s344ye
cmorm682t00221jeddylbuahr	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 19:50:14.885	cmoqah3br004icked11s344ye
cmorm6a6k00231jedd41sqqs2	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "credit_card"}	2026-05-04 19:50:17.612	cmoqah3br004icked11s344ye
cmorm6aa600241jedf22jfi7e	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 19:50:17.742	cmoqah3br004icked11s344ye
cmorm6bgi00251jedu8xy5f5t	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "bank"}	2026-05-04 19:50:19.266	cmoqah3br004icked11s344ye
cmornx3ms002a1jed7rt7vpmo	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 20:39:08.452	cmoqah3br004icked11s344ye
cmornx4b6002b1jed8baou4ul	bank_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bank Austria"}	2026-05-04 20:39:09.33	cmoqah3br004icked11s344ye
cmorpo9kq002f1jediryvtgkz	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 21:28:15.482	cmoqah3br004icked11s344ye
cmorpoclq002g1jede1lpz9m7	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 21:28:19.406	cmoqah3br004icked11s344ye
cmorpprdb002k1jedkmcenotd	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-04 21:29:25.199	cmoqah3br004icked11s344ye
cmorpprem002l1jedrb9iy82h	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 21:29:25.246	cmoqah3br004icked11s344ye
cmorpps5j002m1jedaldgnhld	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 21:29:26.215	cmoqah3br004icked11s344ye
cmorr216p002n1jedzei9sf8e	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 22:06:57.409	cmoqah3br004icked11s344ye
cmorr217a002o1jed2uv04ith	continue_click	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 22:06:57.43	cmoqah3br004icked11s344ye
cmorr240c002p1jedeo3ih84k	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 22:07:01.068	cmoqah3br004icked11s344ye
cmorr9ga2002q1jedczpqc2oe	page_view	::ffff:95.211.172.39	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 22:12:43.562	cmoqah3br004icked11s344ye
cmorr9ii4002r1jedfazv3ek8	payment_method_selected	::ffff:95.211.172.39	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 22:12:46.444	cmoqah3br004icked11s344ye
cmorrb4po002s1jedjvb7t3a7	page_view	::ffff:95.211.172.39	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	\N	2026-05-04 22:14:01.884	cmoqah3br004icked11s344ye
cmorrcd8w002t1jed3mczjiho	payment_method_selected	::ffff:95.211.172.39	Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0	{"method": "bank"}	2026-05-04 22:14:59.6	cmoqah3br004icked11s344ye
cmors1nrf002w1jedtmzdqtzn	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 22:34:39.627	cmogu1tua0000ejedyi913k06
cmors1ole002x1jedrmn9vyvx	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 22:34:40.706	cmogmjdgl00003rmujo6npgok
cmors202r002y1jedwdqeb8fl	address_submitted	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"address": " цвыфвфы", "fullName": "фывфы", "orderNumber": "фывфыв"}	2026-05-04 22:34:55.587	cmogu1tua0000ejedyi913k06
cmors271t002z1jedn9o1xz9a	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "bank"}	2026-05-04 22:35:04.625	cmogu1tua0000ejedyi913k06
cmors29xi00301jedqtch5soc	bank_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"bank": "Raiffeisen"}	2026-05-04 22:35:08.358	cmogu1tua0000ejedyi913k06
cmors2llc00321jedg4f0mm2i	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 22:35:23.472	cmohs9fjc00017qedu95pg8fz
cmors2mo900331jedsau20sgz	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "bank"}	2026-05-04 22:35:24.873	cmohs9fjc00017qedu95pg8fz
cmors2nd300341jed2j0tjkav	bank_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"bank": "Hypo Tirol Bank"}	2026-05-04 22:35:25.767	cmohs9fjc00017qedu95pg8fz
cmors4rqw0001piedc4syv71c	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 22:37:04.76	cmoqah3br004icked11s344ye
cmors4z0s0002piedbfgz06gi	chat_open	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 22:37:14.188	cmoqah3br004icked11s344ye
cmors54080004piedip2dtcz2	message_sent	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 22:37:20.649	cmoqah3br004icked11s344ye
cmors6rba0006piedh9wgyivq	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 22:38:37.51	cmoqah3br004icked11s344ye
cmors746e0007piedd78n5yb6	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 22:38:54.182	cmoqah3br004icked11s344ye
cmors76160008piedm1u6xlbd	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-04 22:38:56.586	cmoqah3br004icked11s344ye
cmors86h50009piedz6xt2ln9	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-04 22:39:43.817	cmoqah3br004icked11s344ye
cmort7bb80001ifedhovatvd0	page_view	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	\N	2026-05-04 23:07:03.044	cmoqah3br004icked11s344ye
cmort7cd70002ifedyt457qqu	payment_method_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"method": "bank"}	2026-05-04 23:07:04.412	cmoqah3br004icked11s344ye
cmort7cx90003ifed0g0dqtxw	bank_selected	::ffff:146.70.117.98	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.3 Safari/605.1.15 Ddg/26.3	{"bank": "Bank Burgenland"}	2026-05-04 23:07:05.133	cmoqah3br004icked11s344ye
cmos82wgs0006ifedeccbigy1	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 06:03:31.42	cmoqah3br004icked11s344ye
cmos82wwz0007ifedq4ptc8ks	bank_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-05 06:03:32.003	cmoqah3br004icked11s344ye
cmos83c110008ifedb4wyzi3m	page_view	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 06:03:51.589	cmoqah3br004icked11s344ye
cmos83nv00009ifed2fgoja0r	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 06:04:06.924	cmoqah3br004icked11s344ye
cmos83og0000aifedwu7uyyxb	bank_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bank Austria"}	2026-05-05 06:04:07.68	cmoqah3br004icked11s344ye
cmoscsr4e000bifed2dgsq7bc	payment_method_selected	::ffff:77.119.185.77	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 08:15:36.014	cmoqah3br004icked11s344ye
cmosjnic6000cifedwhmzui51	page_view	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:28.662	cmoqah3br004icked11s344ye
cmosjnk02000difedqo1iw25u	payment_method_selected	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-05 11:27:30.818	cmoqah3br004icked11s344ye
cmosjnk1s000eifed4klhk6z0	page_view	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:30.88	cmoqah3br004icked11s344ye
cmosjnkkv000fifed89ufkvuz	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:31.567	cmoqah3br004icked11s344ye
cmosjnkrv000gifedl8abs4ez	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:31.819	cmoqah3br004icked11s344ye
cmosjnky1000hifedw3tcuze0	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:32.041	cmoqah3br004icked11s344ye
cmosjnl3i000iifedsh7jm19y	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:32.238	cmoqah3br004icked11s344ye
cmosjnl93000jifedh3vjs3hm	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:32.439	cmoqah3br004icked11s344ye
cmosjnlel000kifedfk36h031	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:32.637	cmoqah3br004icked11s344ye
cmosjnlk9000lifed7ca197bi	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:32.841	cmoqah3br004icked11s344ye
cmosjnlwh000mifedogjsijsi	continue_click	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 11:27:33.281	cmoqah3br004icked11s344ye
cmosjnms5000nifed49miasc3	payment_method_selected	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 11:27:34.421	cmoqah3br004icked11s344ye
cmosuuoev000zifedb699eq4k	payment_method_selected	::ffff:77.119.185.8	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 16:40:58.903	cmoqah3br004icked11s344ye
cmot1wajh0011ifedtumtgi7h	page_view	::ffff:91.141.97.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-05 19:58:11.549	cmoqah3br004icked11s344ye
cmot1wbse0012ifedid6zef6q	payment_method_selected	::ffff:91.141.97.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 19:58:13.166	cmoqah3br004icked11s344ye
cmot1wc8t0013ifedeoh14h7w	bank_selected	::ffff:91.141.97.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bank Austria"}	2026-05-05 19:58:13.757	cmoqah3br004icked11s344ye
cmot1wmt80018ifedx7mapdr7	payment_method_selected	::ffff:91.141.97.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-05 19:58:27.452	cmoqah3br004icked11s344ye
cmot1wnc60019ifedk8ru2lms	bank_selected	::ffff:91.141.97.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Bank Austria"}	2026-05-05 19:58:28.134	cmoqah3br004icked11s344ye
cmov0e0fh001nifedbyfel49y	page_view	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-07 04:51:31.373	cmoqah3br004icked11s344ye
cmov0e41a001oifedxd0x92p2	payment_method_selected	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "bank"}	2026-05-07 04:51:36.046	cmoqah3br004icked11s344ye
cmov1cheg001pifedcu8ljhj3	page_view	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-07 05:18:19.672	cmoqah3br004icked11s344ye
cmov1cioz001qifedkosttut7	payment_method_selected	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "bank"}	2026-05-07 05:18:21.347	cmoqah3br004icked11s344ye
cmov1cj54001rifedf7zc1m5e	bank_selected	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"bank": "Bank Austria"}	2026-05-07 05:18:21.928	cmoqah3br004icked11s344ye
cmov1h4rs001tifed1tdeldc6	page_view	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-07 05:21:56.584	cmoqah3br004icked11s344ye
cmov1h62f001uifed65ogawp8	payment_method_selected	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "bank"}	2026-05-07 05:21:58.263	cmoqah3br004icked11s344ye
cmov1h6vg001vifedgfoe1osg	bank_selected	::ffff:176.33.60.17	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"bank": "Hypobank"}	2026-05-07 05:21:59.308	cmoqah3br004icked11s344ye
cmov5zjva001wifedwhtlwe64	page_view	::ffff:91.141.98.33	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-07 07:28:14.422	cmoqah3br004icked11s344ye
cmov5zu7h001xifede4fu3rlb	continue_click	::ffff:91.141.98.33	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	\N	2026-05-07 07:28:27.821	cmoqah3br004icked11s344ye
cmov5zvf4001yifedkr02nnji	payment_method_selected	::ffff:91.141.98.33	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-07 07:28:29.392	cmoqah3br004icked11s344ye
cmov5zvrk001zifed46yekuhr	bank_selected	::ffff:91.141.98.33	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.2 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-07 07:28:29.84	cmoqah3br004icked11s344ye
cmovhuvmn0021ifedlgyr7aoo	page_view	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-07 13:00:31.775	cmoqah3br004icked11s344ye
cmovhux860022ifedlorlhy6b	payment_method_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"method": "bank"}	2026-05-07 13:00:33.846	cmoqah3br004icked11s344ye
cmovhuzd40023ifedv8y3ntwq	bank_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"bank": "Raiffeisen"}	2026-05-07 13:00:36.616	cmoqah3br004icked11s344ye
cmovhw4kq0025ifed7zewg719	payment_method_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"method": "credit_card"}	2026-05-07 13:01:30.026	cmoqah3br004icked11s344ye
cmovhw4o90026ifedsjcamc9i	page_view	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-07 13:01:30.153	cmoqah3br004icked11s344ye
cmovhw6ar0027ifed0kuhz5ue	continue_click	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-07 13:01:32.259	cmoqah3br004icked11s344ye
cmovhw6hz0028ifedktzepduv	continue_click	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	\N	2026-05-07 13:01:32.519	cmoqah3br004icked11s344ye
cmovhw7vk0029ifed2h43rojy	payment_method_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"method": "bank"}	2026-05-07 13:01:34.304	cmoqah3br004icked11s344ye
cmovhw9fv002aifedb9jlsbcr	bank_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"bank": "Bank Austria"}	2026-05-07 13:01:36.331	cmoqah3br004icked11s344ye
cmovhwla5002hifed95mz3tzh	payment_method_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"method": "bank"}	2026-05-07 13:01:51.677	cmoqah3br004icked11s344ye
cmovhwmiq002iifed0iz54524	bank_selected	::ffff:91.141.98.33	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36 Edg/147.0.0.0	{"bank": "Bank99"}	2026-05-07 13:01:53.282	cmoqah3br004icked11s344ye
cmoxdeihz002kifedbs2dxn80	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-08 20:31:22.151	cmoqah3br004icked11s344ye
cmoxdejtm002lifedhde3wk4b	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-08 20:31:23.866	cmoqah3br004icked11s344ye
cmoxdetqp002nifedrf7qae5r	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-08 20:31:36.721	cmoqah3br004icked11s344ye
cmoy5kujy002oifedvkv9o02y	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 09:40:06.958	cmoqah3br004icked11s344ye
cmoy5kwku002pifedzp1f04s5	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 09:40:09.582	cmoqah3br004icked11s344ye
cmoy5kytn002qifedmk97k8b3	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "BAWAG"}	2026-05-09 09:40:12.491	cmoqah3br004icked11s344ye
cmoy5kyuv002rifedansi68uz	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 09:40:12.535	cmoqah3br004icked11s344ye
cmoy5kzp6002sifedsx445qdl	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 09:40:13.626	cmoqah3br004icked11s344ye
cmoy5l0uk002tifed9nxh1kw3	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 09:40:15.116	cmoqah3br004icked11s344ye
cmoy5l18x002uifedbbd44vcb	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-09 09:40:15.633	cmoqah3br004icked11s344ye
cmoy7kj4t000brwedr3rc9ziq	page_view	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	\N	2026-05-09 10:35:51.389	cmoqah3br004icked11s344ye
cmoy7kvoz000crwedgopdsrbb	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"method": "bank"}	2026-05-09 10:36:07.667	cmoqah3br004icked11s344ye
cmoy7kyvo000drwedactj9ab0	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"bank": "Raiffeisen"}	2026-05-09 10:36:11.796	cmoqah3br004icked11s344ye
cmoy7mcq8000hrwedzwrlzbnn	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"method": "bank"}	2026-05-09 10:37:16.4	cmoqah3br004icked11s344ye
cmoy7mdjh000irwedsos4d0va	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"bank": "Bank Austria"}	2026-05-09 10:37:17.453	cmoqah3br004icked11s344ye
cmoy7mr0x000zrwedcwehct7y	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"method": "bank"}	2026-05-09 10:37:34.929	cmoqah3br004icked11s344ye
cmoy7ms5g0010rwed97ctgs18	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"bank": "Bank99"}	2026-05-09 10:37:36.388	cmoqah3br004icked11s344ye
cmoy7naxk0012rwedz68ont2i	page_view	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	\N	2026-05-09 10:38:00.728	cmoqah3br004icked11s344ye
cmoy7nccx0013rwedn9miizoa	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"method": "bank"}	2026-05-09 10:38:02.577	cmoqah3br004icked11s344ye
cmoy7ndp00014rwedf9nrdao4	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"bank": "Bank Burgenland"}	2026-05-09 10:38:04.308	cmoqah3br004icked11s344ye
cmoy7p21j001rrwed9vik3mct	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"method": "bank"}	2026-05-09 10:39:22.519	cmoqah3br004icked11s344ye
cmoy7p3ad001srwedzwrhnacj	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"bank": "Hypo Vorarlberg"}	2026-05-09 10:39:24.133	cmoqah3br004icked11s344ye
cmoy7p4ig001trwedeg1n0d2l	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 10:39:25.721	cmoqah3br004icked11s344ye
cmoy7p683001vrwedojzsrhcm	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 10:39:27.939	cmoqah3br004icked11s344ye
cmoy7p6vh001yrwedtql2dpcp	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "Bank Austria"}	2026-05-09 10:39:28.781	cmoqah3br004icked11s344ye
cmoy7pa3w0020rwedl40t3zhj	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 10:39:32.972	cmoqah3br004icked11s344ye
cmoy7pajy0021rwedgjfwtn5i	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "Bank Burgenland"}	2026-05-09 10:39:33.55	cmoqah3br004icked11s344ye
cmoy7pvay0022rwedscs8qvui	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 10:40:00.442	cmoqah3br004icked11s344ye
cmoy7pwuf0023rwedbpj072w3	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "Bank Austria"}	2026-05-09 10:40:02.439	cmoqah3br004icked11s344ye
cmoy7q80y0026rweduuzwkid1	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 10:40:16.93	cmoqah3br004icked11s344ye
cmoy7qwde002grwed0od08w3s	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"method": "bank"}	2026-05-09 10:40:48.482	cmoqah3br004icked11s344ye
cmoy7qwsr002hrwedk0brprgm	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "Volksbank"}	2026-05-09 10:40:49.035	cmoqah3br004icked11s344ye
cmoy7qxf0002irwedse9r4oiz	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36 Edg/148.0.0.0	{"bank": "Bank Austria"}	2026-05-09 10:40:49.836	cmoqah3br004icked11s344ye
cmoy7rsr9002xrwed2hpfm2xe	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:41:30.453	cmoqah3br004icked11s344ye
cmoy7rt6q002yrwedj64er3oo	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:41:31.01	cmoqah3br004icked11s344ye
cmoy7ru8e002zrwedu96unpgl	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 10:41:32.366	cmoqah3br004icked11s344ye
cmoy7t8150033rwedxhxph10v	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 10:42:36.905	cmoqah3br004icked11s344ye
cmoy7twsc0046rwediap6f3jv	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-09 10:43:08.988	cmoqah3br004icked11s344ye
cmoy7twuw0047rwedvsz6fmul	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:09.08	cmoqah3br004icked11s344ye
cmoy7tz3t0049rwedn706lp6p	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "easybank"}	2026-05-09 10:43:11.993	cmoqah3br004icked11s344ye
cmoy7tz4t004arwedyngmkfuo	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:12.029	cmoqah3br004icked11s344ye
cmoy7tzk6004brwedf90dibov	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:12.582	cmoqah3br004icked11s344ye
cmoy7tzra004crwed6o780nep	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:12.839	cmoqah3br004icked11s344ye
cmoy7tzwi004drwedpxldwrr0	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:13.026	cmoqah3br004icked11s344ye
cmoy7u01z004erwedmlonvmq4	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:13.223	cmoqah3br004icked11s344ye
cmoy7u07m004frwedav2rspf8	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:13.426	cmoqah3br004icked11s344ye
cmoy7u0e2004grwed5fqlxzd9	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:13.658	cmoqah3br004icked11s344ye
cmoy7rurp0030rwed821pqvle	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-09 10:41:33.061	cmoqah3br004icked11s344ye
cmoy7tumu0043rwedd901q2u7	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "easybank"}	2026-05-09 10:43:06.198	cmoqah3br004icked11s344ye
cmoy7tuo30044rwedfffogcg5	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:06.243	cmoqah3br004icked11s344ye
cmoy7tvh20045rwedzd12h1zk	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:43:07.286	cmoqah3br004icked11s344ye
cmoy7txu30048rwedam4gco93	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 10:43:10.347	cmoqah3br004icked11s344ye
cmoy7u1sm004hrwedwcc7xrzv	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 10:43:15.478	cmoqah3br004icked11s344ye
cmoy7v3kq0053rwed356x100l	bank_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Sparkasse"}	2026-05-09 10:44:04.442	cmoqah3br004icked11s344ye
cmoy7v3lr0054rweddlxt7jlp	page_view	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:44:04.479	cmoqah3br004icked11s344ye
cmoy7v4cd0055rwedr27wlpiw	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:44:05.437	cmoqah3br004icked11s344ye
cmoy7v4jk0056rwedxby2f9qv	continue_click	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 10:44:05.696	cmoqah3br004icked11s344ye
cmoy7v5kw0057rwedpsdowuqt	payment_method_selected	::ffff:77.119.188.224	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 10:44:07.04	cmoqah3br004icked11s344ye
cmoybcv420001jledka622z3l	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 12:21:52.13	cmoqah3br004icked11s344ye
cmoybcwih0002jled081d6ahj	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 12:21:53.945	cmoqah3br004icked11s344ye
cmoybcxm00003jledw8oz03px	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "Oberbank"}	2026-05-09 12:21:55.368	cmoqah3br004icked11s344ye
cmoybd1px0005jledr80dxmni	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 12:22:00.693	cmoqah3br004icked11s344ye
cmoybd2ie0006jleddlohu829	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "VKB Bank"}	2026-05-09 12:22:01.718	cmoqah3br004icked11s344ye
cmoyhcb0y001h0fed0yjjbkgy	page_view	::ffff:5.191.116.61	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 15:09:23.795	cmoqah3br004icked11s344ye
cmoyhcgyw001i0fedd96dn2p9	payment_method_selected	::ffff:5.191.116.61	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 15:09:31.496	cmoqah3br004icked11s344ye
cmoyhcikw001j0fedfjcos8dh	bank_selected	::ffff:5.191.116.61	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "Raiffeisen"}	2026-05-09 15:09:33.584	cmoqah3br004icked11s344ye
cmoykd8cg001m0fed1ijluzvh	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:34:05.824	cmoqah3br004icked11s344ye
cmoykd9nq001n0fed6a60pe9q	payment_method_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 16:34:07.526	cmoqah3br004icked11s344ye
cmoykdci4001o0fedtvslnba1	bank_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Sparkasse"}	2026-05-09 16:34:11.212	cmoqah3br004icked11s344ye
cmoykdcjm001p0fedabqmscq5	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:34:11.266	cmoqah3br004icked11s344ye
cmoykdd11001q0fed0ditcpcr	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:34:11.893	cmoqah3br004icked11s344ye
cmoykdd6u001r0fedpyfwacmg	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:34:12.102	cmoqah3br004icked11s344ye
cmoykde4h001s0fedmdytzqj2	payment_method_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 16:34:13.313	cmoqah3br004icked11s344ye
cmoykey83001w0fed8afps1no	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:35:26.019	cmoqah3br004icked11s344ye
cmoykezcr001x0fedyshgfx9v	payment_method_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 16:35:27.483	cmoqah3br004icked11s344ye
cmoykjtsu00260fedch314a7m	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:39:13.566	cmoqah3br004icked11s344ye
cmoykjuas00270fedgc2xktfd	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:39:14.212	cmoqah3br004icked11s344ye
cmoykjvf800280feddrpmkp8s	payment_method_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 16:39:15.668	cmoqah3br004icked11s344ye
cmoykjwpj00290fed6em3gbwh	bank_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "easybank"}	2026-05-09 16:39:17.335	cmoqah3br004icked11s344ye
cmoykjwqz002a0fedoznjbv9i	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:39:17.387	cmoqah3br004icked11s344ye
cmoykjx95002b0fedtn49ocy0	continue_click	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:39:18.041	cmoqah3br004icked11s344ye
cmoykjydl002c0fedr9pivq4t	payment_method_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 16:39:19.497	cmoqah3br004icked11s344ye
cmoykl77z002f0fednm2myltt	page_view	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 16:40:17.615	cmoqah3br004icked11s344ye
cmoykl84a002g0fedrsa1wmgn	payment_method_selected	::ffff:146.70.116.182	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 16:40:18.778	cmoqah3br004icked11s344ye
cmoyvfhhy00310feddyu12i5l	page_view	::ffff:91.141.108.217	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 21:43:46.774	cmoqah3br004icked11s344ye
cmoyvfk0600320fed2iaz5cdl	payment_method_selected	::ffff:91.141.108.217	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 21:43:50.022	cmoqah3br004icked11s344ye
cmoyvfkc700330fedhj4j4erl	bank_selected	::ffff:91.141.108.217	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-09 21:43:50.455	cmoqah3br004icked11s344ye
cmoyx870v00360fedq8qqs9oa	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 22:34:05.839	cmoqah3br004icked11s344ye
cmoyx88oj00370feddd4am44b	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 22:34:07.987	cmoqah3br004icked11s344ye
cmoyx8i2400380fedgce0k1c0	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "easybank"}	2026-05-09 22:34:20.14	cmoqah3br004icked11s344ye
cmoyx8i4n00390fed15hc6uo9	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 22:34:20.231	cmoqah3br004icked11s344ye
cmoyx8jya003a0fedzrdhsicu	continue_click	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 22:34:22.594	cmoqah3br004icked11s344ye
cmoyx8mkq003b0fed9cn131ym	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-09 22:34:25.994	cmoqah3br004icked11s344ye
cmoyx8nhb003c0fedg9dqg022	bank_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"bank": "easybank"}	2026-05-09 22:34:27.167	cmoqah3br004icked11s344ye
cmoyx8nle003d0fed0v1bch7c	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 22:34:27.314	cmoqah3br004icked11s344ye
cmoyx8ph0003e0fed3wb80qql	continue_click	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-09 22:34:29.748	cmoqah3br004icked11s344ye
cmoyypujn003w0fed061t6o5l	page_view	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 23:15:49.091	cmoqah3br004icked11s344ye
cmoyypvr7003x0fedzqmno1ao	payment_method_selected	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 23:15:50.659	cmoqah3br004icked11s344ye
cmoyypw67003y0fedq7e85v4r	bank_selected	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-09 23:15:51.199	cmoqah3br004icked11s344ye
cmoyyqzzn00410feds9kcb7bi	page_view	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-09 23:16:42.803	cmoqah3br004icked11s344ye
cmoyyr13o00420fedqftbnnlt	payment_method_selected	::ffff:77.119.20.175	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-09 23:16:44.244	cmoqah3br004icked11s344ye
cmoz0al0w004e0fedc0nry886	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-09 23:59:56.144	cmoqah3br004icked11s344ye
cmoz0amdp004f0fed2k3xljmw	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "credit_card"}	2026-05-09 23:59:57.901	cmoqah3br004icked11s344ye
cmoz0amhq004g0fedshtk4snn	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-09 23:59:58.046	cmoqah3br004icked11s344ye
cmoz0anp8004h0fedv3ubyv5j	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "bank"}	2026-05-09 23:59:59.612	cmoqah3br004icked11s344ye
cmoznrf9s004s0fed9gxxi0eb	page_view	::ffff:5.191.122.64	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-10 10:56:53.008	cmoqah3br004icked11s344ye
cmozonj5w0000h5edxgvc6ffm	payment_method_selected	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "bank"}	2026-05-10 11:21:51.044	cmoqah3br004icked11s344ye
cmozonjqm0001h5ed4hd7k52h	bank_selected	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"bank": "BAWAG"}	2026-05-10 11:21:51.79	cmoqah3br004icked11s344ye
cmozp263z0002h5edfv2btdot	page_view	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-10 11:33:13.967	cmogmjdgl00003rmujo6npgok
cmozp3sdj0003h5edgqybut7k	payment_method_selected	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "credit_card"}	2026-05-10 11:34:29.479	cmogmjdgl00003rmujo6npgok
cmozp4z7q0004h5edmozd7lu6	page_view	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	\N	2026-05-10 11:35:24.998	cmogmjdgl00003rmujo6npgok
cmozpplqj0000evedlr4avwcb	payment_method_selected	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "credit_card"}	2026-05-10 11:51:27.307	cmogmjdgl00003rmujo6npgok
cmozpx04r0003evedxwyxczyk	payment_method_selected	::ffff:5.44.34.227	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/147.0.0.0 Safari/537.36	{"method": "credit_card"}	2026-05-10 11:57:12.555	cmogmjdgl00003rmujo6npgok
cmp0de15w0006eved8s18un2l	page_view	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-10 22:54:18.212	cmoqah3br004icked11s344ye
cmp0de2tk0007evedwyp3ohpz	payment_method_selected	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-10 22:54:20.36	cmoqah3br004icked11s344ye
cmp0de3e80008evedhunfsyzd	bank_selected	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "BAWAG"}	2026-05-10 22:54:21.104	cmoqah3br004icked11s344ye
cmp0dgjr1000beveds50ulpu0	payment_method_selected	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-10 22:56:15.613	cmoqah3br004icked11s344ye
cmp0zs9ue0001y0edjil1kg5s	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-11 09:21:14.198	cmoqah3br004icked11s344ye
cmp0zsccz0002y0edinhfw334	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "credit_card"}	2026-05-11 09:21:17.459	cmoqah3br004icked11s344ye
cmp0zsuu20006y0ed0ca3l6ml	page_view	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	\N	2026-05-11 09:21:41.402	cmoqah3br004icked11s344ye
cmp0ztf5g0007y0edwe94iar0	payment_method_selected	::ffff:213.172.85.4	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Safari/605.1.15 Ddg/26.4	{"method": "bank"}	2026-05-11 09:22:07.732	cmoqah3br004icked11s344ye
cmp10e26s0008y0edk8qpggje	page_view	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 09:38:10.708	cmoqah3br004icked11s344ye
cmp10e3ox0009y0ed7btmke6g	payment_method_selected	::ffff:77.119.23.15	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-11 09:38:12.657	cmoqah3br004icked11s344ye
cmp1hum93000cy0edg82l0pk5	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:46:56.679	cmoqah3br004icked11s344ye
cmp1huq7s000dy0ed4xzs5qej	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-11 17:47:01.816	cmoqah3br004icked11s344ye
cmp1huwkd000fy0edq6v59y60	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:47:10.045	cmoqah3br004icked11s344ye
cmp1huzgh000gy0ed71labm9d	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-11 17:47:13.793	cmoqah3br004icked11s344ye
cmp1hzrq5000ly0edda971hus	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-11 17:50:57.053	cmoqah3br004icked11s344ye
cmp1hzsar000my0ed3yflt4v1	bank_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Erste Bank"}	2026-05-11 17:50:57.795	cmoqah3br004icked11s344ye
cmp1hzx2q000ny0edu8n4uy3c	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-11 17:51:03.986	cmoqah3br004icked11s344ye
cmp1i0n79000oy0edl8ovgdn9	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:51:37.845	cmoqah3br004icked11s344ye
cmp1i0pbf000py0ed4jvnxfiy	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:51:40.587	cmoqah3br004icked11s344ye
cmp1i1tgf000qy0edybtqpa70	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:32.607	cmoqah3br004icked11s344ye
cmp1i1tw3000ry0ed8aio2xgs	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:33.171	cmoqah3br004icked11s344ye
cmp1i1u3h000sy0edespqpt1h	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:33.437	cmoqah3br004icked11s344ye
cmp1i1u8t000ty0ed04gfjxo4	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:33.629	cmoqah3br004icked11s344ye
cmp1i1udq000uy0edh831s43l	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:33.806	cmoqah3br004icked11s344ye
cmp1i1uha000vy0edlb9xdmja	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:33.934	cmoqah3br004icked11s344ye
cmp1i1un1000wy0edn3j5zbfp	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:34.141	cmoqah3br004icked11s344ye
cmp1i1ur4000xy0edk3fmcdoh	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:34.288	cmoqah3br004icked11s344ye
cmp1i1uw7000yy0edequxtecz	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:34.471	cmoqah3br004icked11s344ye
cmp1i1v0w000zy0edaoynonoe	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:34.64	cmoqah3br004icked11s344ye
cmp1i1v5e0010y0edzt4kko3o	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:34.802	cmoqah3br004icked11s344ye
cmp1i1vav0011y0ed6czloqum	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:34.999	cmoqah3br004icked11s344ye
cmp1i1vfk0012y0ed31ejvuwx	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:35.168	cmoqah3br004icked11s344ye
cmp1i1vjw0013y0ed0y4uocd4	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:35.324	cmoqah3br004icked11s344ye
cmp1i1vo50014y0edhhh3ntwr	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:35.477	cmoqah3br004icked11s344ye
cmp1i1vt40015y0ediumvc6eh	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:35.656	cmoqah3br004icked11s344ye
cmp1i1vxv0016y0ed5927jpau	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:35.827	cmoqah3br004icked11s344ye
cmp1i1x9o0017y0edkeq636i8	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:37.548	cmoqah3br004icked11s344ye
cmp1i1xn60018y0ediyyoko2h	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:38.034	cmoqah3br004icked11s344ye
cmp1i1xqb0019y0edq9w6jlqx	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:38.147	cmoqah3br004icked11s344ye
cmp1i1xw2001ay0eduvxz9yxd	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:38.354	cmoqah3br004icked11s344ye
cmp1i1xzh001by0edztpbqh10	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:38.477	cmoqah3br004icked11s344ye
cmp1i1y4x001cy0edl1h5edcw	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:38.673	cmoqah3br004icked11s344ye
cmp1i1y8h001dy0ed382ahhe0	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:38.801	cmoqah3br004icked11s344ye
cmp1i1ye4001ey0ed9xvq7oln	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:39.004	cmoqah3br004icked11s344ye
cmp1i1yhg001fy0edj4vnhbtg	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:39.124	cmoqah3br004icked11s344ye
cmp1i1ymt001gy0edci72wqxi	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:52:39.317	cmoqah3br004icked11s344ye
cmp1i2i06001hy0edu5nab4i7	continue_click	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:53:04.422	cmoqah3br004icked11s344ye
cmp1i2kx1001iy0ed6lh3fe1r	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 17:53:08.197	cmoqah3br004icked11s344ye
cmp1ibm0f001ky0edjz6cb6c3	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 18:00:09.519	cmp1iafg0001jy0edrj6shgph
cmp1ibruj001ly0ed1hnwp37y	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-11 18:00:17.083	cmp1iafg0001jy0edrj6shgph
cmp1ibs7q001my0edfwec38u7	bank_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-11 18:00:17.558	cmp1iafg0001jy0edrj6shgph
cmp1icefz001oy0ed7k7sf8t7	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-11 18:00:46.367	cmp1iafg0001jy0edrj6shgph
cmp1icf1j001py0edc9llpoax	bank_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"bank": "BAWAG"}	2026-05-11 18:00:47.143	cmp1iafg0001jy0edrj6shgph
cmp1ifezg001wy0edrbvkqdmt	payment_method_selected	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-11 18:03:07.036	cmp1iafg0001jy0edrj6shgph
cmp1ifsb6001xy0edn75819qj	page_view	::ffff:41.66.98.202	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.4 Mobile/15E148 Safari/604.1	\N	2026-05-11 18:03:24.306	cmp1iafg0001jy0edrj6shgph
cmp2zrh4b00000zedtpgycuq1	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 18:56:09.323	cmp1iafg0001jy0edrj6shgph
cmp2zrkuw00010zed7m0ywmfw	payment_method_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-12 18:56:14.168	cmp1iafg0001jy0edrj6shgph
cmp2zs4c300020zedjh3ue47s	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 18:56:39.411	cmp1iafg0001jy0edrj6shgph
cmp34brip00030zedr3wiiv1q	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:03:54.385	cmp1iafg0001jy0edrj6shgph
cmp34btmt00040zedl1658jaa	payment_method_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-12 21:03:57.125	cmp1iafg0001jy0edrj6shgph
cmp34c1sp00050zedkiet7zjf	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:04:07.705	cmp1iafg0001jy0edrj6shgph
cmp34catg00060zedlubvp2y1	continue_click	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:04:19.396	cmp1iafg0001jy0edrj6shgph
cmp34cc1r00070zedi1rqavbu	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:04:20.991	cmp1iafg0001jy0edrj6shgph
cmp34ccd500080zedac9eafop	continue_click	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:04:21.401	cmp1iafg0001jy0edrj6shgph
cmp34cd4d00090zeddtdccyhw	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:04:22.382	cmp1iafg0001jy0edrj6shgph
cmp34duow000b0zedg8s1yr65	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:05:31.808	cmp34dmlw000a0zedwoebai9w
cmp34dxxx000c0zedhza1f39a	continue_click	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:05:36.021	cmp34dmlw000a0zedwoebai9w
cmp34dyse000d0zedsgwc51je	payment_method_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-12 21:05:37.118	cmp34dmlw000a0zedwoebai9w
cmp34e0r9000e0zedq6jgj9yq	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:05:39.669	cmp34dmlw000a0zedwoebai9w
cmp34e7cg000f0zed0ri0g79t	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:05:48.208	cmp34dmlw000a0zedwoebai9w
cmp34ec1b000g0zed1u0p81pr	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:05:54.287	cmp34dmlw000a0zedwoebai9w
cmp34efvr000h0zed9kik5q8w	continue_click	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:05:59.271	cmp34dmlw000a0zedwoebai9w
cmp34egoy000i0zed27q85xg8	payment_method_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-12 21:06:00.322	cmp34dmlw000a0zedwoebai9w
cmp34ehb1000j0zed995nboui	bank_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "BAWAG"}	2026-05-12 21:06:01.117	cmp34dmlw000a0zedwoebai9w
cmp34ehci000k0zednr6y6i09	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:06:01.17	cmp34dmlw000a0zedwoebai9w
cmp34ehvi000l0zedf71useom	continue_click	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:06:01.854	cmp34dmlw000a0zedwoebai9w
cmp34ejbc000n0zed0jixawof	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:06:03.72	cmp34dmlw000a0zedwoebai9w
cmp34eksr000o0zed8ndmlbbz	payment_method_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-12 21:06:05.643	cmp34dmlw000a0zedwoebai9w
cmp34el88000p0zeds1bba9jf	bank_selected	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-12 21:06:06.2	cmp34dmlw000a0zedwoebai9w
cmp34el9l000q0zed2efgetf1	page_view	::ffff:178.165.184.238	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-12 21:06:06.249	cmp34dmlw000a0zedwoebai9w
cmp41izib0001y8edvxscdca1	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:33:18.659	cmp34dmlw000a0zedwoebai9w
cmp41j2mw0002y8edy15q8lik	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:33:22.712	cmp34dmlw000a0zedwoebai9w
cmp41j31v0003y8ed9epcaz09	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:33:23.251	cmp34dmlw000a0zedwoebai9w
cmp41j3ph0004y8edod2z977d	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:33:24.101	cmp34dmlw000a0zedwoebai9w
cmp41kxz20005y8edfcwr5y5e	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:34:49.982	cmp34dmlw000a0zedwoebai9w
cmp41ky1z0006y8ed8s02jj9f	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-13 12:34:50.087	cmp34dmlw000a0zedwoebai9w
cmp41kyc20007y8edmpdftqvk	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:34:50.45	cmp34dmlw000a0zedwoebai9w
cmp41l53j0009y8edo0xf1w9i	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:34:59.216	cmp34dmlw000a0zedwoebai9w
cmp41l5pa000ay8ed3csbd7d4	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "BAWAG"}	2026-05-13 12:34:59.998	cmp34dmlw000a0zedwoebai9w
cmp41l5r5000by8ed6jrtofcz	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:35:00.065	cmp34dmlw000a0zedwoebai9w
cmp41l6b3000cy8edvk8cxe5w	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:35:00.783	cmp34dmlw000a0zedwoebai9w
cmp41llyt000gy8ed4sitv8o3	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-13 12:35:21.077	cmp34dmlw000a0zedwoebai9w
cmp41llze000hy8edkzxmz07b	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:35:21.098	cmp34dmlw000a0zedwoebai9w
cmp41ln1b000iy8ed4qcu5e6u	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:35:22.463	cmp34dmlw000a0zedwoebai9w
cmp41lt8h000jy8ed9rsv0sr5	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Bank Burgenland"}	2026-05-13 12:35:30.497	cmp34dmlw000a0zedwoebai9w
cmp41lt9s000ky8edmfuvdp9z	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:35:30.544	cmp34dmlw000a0zedwoebai9w
cmp41ltp1000ly8edaewkq6th	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:35:31.093	cmp34dmlw000a0zedwoebai9w
cmp41o9yp000oy8edmyg97l47	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:25.489	cmp34dmlw000a0zedwoebai9w
cmp41ob51000py8edxbjntwyo	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:37:27.013	cmp34dmlw000a0zedwoebai9w
cmp41ofa7000qy8ed58cv9osm	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Bank Austria"}	2026-05-13 12:37:32.383	cmp34dmlw000a0zedwoebai9w
cmp41ofb9000ry8ed2km4l6l4	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Bank Austria"}	2026-05-13 12:37:32.421	cmp34dmlw000a0zedwoebai9w
cmp41ofc9000sy8ednod5jn0a	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:32.457	cmp34dmlw000a0zedwoebai9w
cmp41ofzf000ty8ed3spipror	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:33.291	cmp34dmlw000a0zedwoebai9w
cmp41ojoh000vy8edkuhvz5r2	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:37:38.081	cmp34dmlw000a0zedwoebai9w
cmp41omrb000wy8edt4vvf1fw	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "easybank"}	2026-05-13 12:37:42.071	cmp34dmlw000a0zedwoebai9w
cmp41omsm000xy8ed8woxtjnf	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:42.118	cmp34dmlw000a0zedwoebai9w
cmp41on68000yy8edvyujn482	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:42.608	cmp34dmlw000a0zedwoebai9w
cmp41oqha0010y8edqeesv8zm	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:37:46.894	cmp34dmlw000a0zedwoebai9w
cmp41osy60011y8edmj6avcef	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Hypo Tirol Bank"}	2026-05-13 12:37:50.094	cmp34dmlw000a0zedwoebai9w
cmp41oszh0012y8ed7jhg5a12	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:50.141	cmp34dmlw000a0zedwoebai9w
cmp41otep0013y8ed0dn5ghhc	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:37:50.69	cmp34dmlw000a0zedwoebai9w
cmp41prhc0016y8edovzn82hk	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:38:34.848	cmp34dmlw000a0zedwoebai9w
cmp41pskx0017y8edulllcws8	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:38:36.273	cmp34dmlw000a0zedwoebai9w
cmp41puuo0018y8edfwgfemba	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Hypo Vorarlberg"}	2026-05-13 12:38:39.216	cmp34dmlw000a0zedwoebai9w
cmp41puw20019y8edd706kyn0	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:38:39.266	cmp34dmlw000a0zedwoebai9w
cmp41pv9v001ay8edwuijjsq8	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:38:39.763	cmp34dmlw000a0zedwoebai9w
cmp41q5ez001dy8edg1ib59mv	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:38:52.907	cmp34dmlw000a0zedwoebai9w
cmp41q7pw001ey8edi90ufwd0	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Hypobank"}	2026-05-13 12:38:55.892	cmp34dmlw000a0zedwoebai9w
cmp41q7r1001fy8eduigvprx4	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:38:55.933	cmp34dmlw000a0zedwoebai9w
cmp41q84q001gy8edkrcszwpy	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:38:56.426	cmp34dmlw000a0zedwoebai9w
cmp41qb7q001iy8ed8k60pe28	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:39:00.422	cmp34dmlw000a0zedwoebai9w
cmp41qdes001jy8edb1ka4ztw	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Hypo NOE"}	2026-05-13 12:39:03.268	cmp34dmlw000a0zedwoebai9w
cmp41qdfz001ky8edjp76agq3	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:03.311	cmp34dmlw000a0zedwoebai9w
cmp41qds7001ly8edhie829at	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:03.751	cmp34dmlw000a0zedwoebai9w
cmp41qnuh001ny8edhjrbcbva	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:39:16.793	cmp34dmlw000a0zedwoebai9w
cmp41qq28001oy8edqklj08li	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Oberbank"}	2026-05-13 12:39:19.664	cmp34dmlw000a0zedwoebai9w
cmp41qq3j001py8edbvmw8iz4	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:19.711	cmp34dmlw000a0zedwoebai9w
cmp41qqh1001qy8edjn9r6it1	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:20.197	cmp34dmlw000a0zedwoebai9w
cmp41qtva001sy8ed52lz6vj5	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:39:24.598	cmp34dmlw000a0zedwoebai9w
cmp41qvyo001ty8ednok4e8v3	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Poso Bank"}	2026-05-13 12:39:27.312	cmp34dmlw000a0zedwoebai9w
cmp41qw01001uy8ed02k2tuon	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:27.361	cmp34dmlw000a0zedwoebai9w
cmp41qwdh001vy8ed8m7048cv	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:27.845	cmp34dmlw000a0zedwoebai9w
cmp41qyx6001xy8edj148znem	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:39:31.146	cmp34dmlw000a0zedwoebai9w
cmp41r02h001yy8ed9mlql8w5	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Volksbank"}	2026-05-13 12:39:32.633	cmp34dmlw000a0zedwoebai9w
cmp41r03o001zy8ed2jmmjesu	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:32.676	cmp34dmlw000a0zedwoebai9w
cmp41r0ik0020y8edago31rlw	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:33.212	cmp34dmlw000a0zedwoebai9w
cmp41rao60023y8ed79o194zy	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 12:39:46.374	cmp34dmlw000a0zedwoebai9w
cmp41rbzd0024y8edvv0vmxjc	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "VKB Bank"}	2026-05-13 12:39:48.073	cmp34dmlw000a0zedwoebai9w
cmp41rc0p0025y8edyl0z58dg	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:48.121	cmp34dmlw000a0zedwoebai9w
cmp41rcem0026y8edne8utul0	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:39:48.622	cmp34dmlw000a0zedwoebai9w
cmp41rx490028y8edhah8pjwc	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "credit_card"}	2026-05-13 12:40:15.465	cmp34dmlw000a0zedwoebai9w
cmp41rydx0029y8ed3ce0n240	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 12:40:17.109	cmp34dmlw000a0zedwoebai9w
cmp41waew002ay8ed4v2kzj5o	page_view	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	\N	2026-05-13 12:43:39.32	cmp34dmlw000a0zedwoebai9w
cmp41wcuu002by8edlkin3sge	payment_method_selected	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	{"method": "bank"}	2026-05-13 12:43:42.486	cmp34dmlw000a0zedwoebai9w
cmp41wj9k002cy8edjmigdn3s	bank_selected	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	{"bank": "Hypo Tirol Bank"}	2026-05-13 12:43:50.792	cmp34dmlw000a0zedwoebai9w
cmp41wjh9002dy8edrv67qeh4	page_view	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	\N	2026-05-13 12:43:51.069	cmp34dmlw000a0zedwoebai9w
cmp41wkwa002ey8ed3rr3xe6e	continue_click	::ffff:193.32.248.159	Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/148.0.0.0 Safari/537.36	\N	2026-05-13 12:43:52.906	cmp34dmlw000a0zedwoebai9w
cmp42lpt2002ry8edde7o5t7d	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:03:25.67	cmp34dmlw000a0zedwoebai9w
cmp42ls0g002sy8ednh1su01f	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:03:28.529	cmp34dmlw000a0zedwoebai9w
cmp42m6xs002ty8ed41xppzhb	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Hypobank"}	2026-05-13 13:03:47.872	cmp34dmlw000a0zedwoebai9w
cmp42m6zb002uy8edprg05ert	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:03:47.927	cmp34dmlw000a0zedwoebai9w
cmp42m7gk002vy8ednfhaf5we	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:03:48.548	cmp34dmlw000a0zedwoebai9w
cmp42m9fd002xy8edc1s7d4xf	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:03:51.097	cmp34dmlw000a0zedwoebai9w
cmp42maon002yy8ed0gqgdjzy	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:03:52.727	cmp34dmlw000a0zedwoebai9w
cmp42mcm7002zy8ed5v2hw98p	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Hypo Tirol Bank"}	2026-05-13 13:03:55.231	cmp34dmlw000a0zedwoebai9w
cmp42mcnj0030y8edf9iz9pew	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:03:55.28	cmp34dmlw000a0zedwoebai9w
cmp42md090031y8eddcdfwt1m	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:03:55.737	cmp34dmlw000a0zedwoebai9w
cmp42mk220034y8eddt1rxvmy	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:04:04.874	cmp34dmlw000a0zedwoebai9w
cmp42ml9j0035y8edmvjdqr9a	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:04:06.439	cmp34dmlw000a0zedwoebai9w
cmp42mw3u0036y8edh44ki3uj	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:04:20.49	cmp34dmlw000a0zedwoebai9w
cmp42mw7z0037y8eddiqmp5hu	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Bank99"}	2026-05-13 13:04:20.639	cmp34dmlw000a0zedwoebai9w
cmp42mwhs0038y8ed7vobrul1	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:04:20.992	cmp34dmlw000a0zedwoebai9w
cmp42mz6b003ay8edtq81mlq5	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:04:24.467	cmp34dmlw000a0zedwoebai9w
cmp42mzvf003by8edybr9drea	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-13 13:04:25.371	cmp34dmlw000a0zedwoebai9w
cmp42mzwr003cy8eduhsv797e	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:04:25.419	cmp34dmlw000a0zedwoebai9w
cmp43dzny003hy8edh07opsy7	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:25:24.814	cmp34dmlw000a0zedwoebai9w
cmp43e0o5003iy8edhu779vgw	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-13 13:25:26.117	cmp34dmlw000a0zedwoebai9w
cmp43e0py003jy8edteu2seay	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:26.182	cmp34dmlw000a0zedwoebai9w
cmp43e155003ky8ed0bj95fac	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:26.729	cmp34dmlw000a0zedwoebai9w
cmp43e5pi003ly8edmv44vqzh	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:32.646	cmp34dmlw000a0zedwoebai9w
cmp43e6bm003my8ednis01riu	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:33.442	cmp34dmlw000a0zedwoebai9w
cmp43e6ut003ny8ed2abehihj	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:34.133	cmp34dmlw000a0zedwoebai9w
cmp43e9mn003oy8eduwwf03fm	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:37.727	cmp34dmlw000a0zedwoebai9w
cmp43eb3d003py8edzraeazez	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:25:39.625	cmp34dmlw000a0zedwoebai9w
cmp43ec3e003qy8edlily8qeo	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-13 13:25:40.922	cmp34dmlw000a0zedwoebai9w
cmp43ec4p003ry8ed38c2ikig	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:40.969	cmp34dmlw000a0zedwoebai9w
cmp43ed1m003sy8edyrsv1mux	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:25:42.154	cmp34dmlw000a0zedwoebai9w
cmp43uec4003vy8edkwbuqkuz	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:38:10.324	cmp34dmlw000a0zedwoebai9w
cmp43ugd8003wy8edbiya9d80	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:38:12.956	cmp34dmlw000a0zedwoebai9w
cmp43ugwa003xy8ed7cdlpr56	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:38:13.642	cmp34dmlw000a0zedwoebai9w
cmp43uhje003yy8edewwc4wez	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	{"bank": "Raiffeisen"}	2026-05-13 13:38:14.474	cmp34dmlw000a0zedwoebai9w
cmp43uhme003zy8ed3bn7oljg	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:38:14.582	cmp34dmlw000a0zedwoebai9w
cmp43ui1e0040y8edbgvjxbr1	continue_click	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 26_5_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/148.0.7778.100 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:38:15.122	cmp34dmlw000a0zedwoebai9w
cmp43uvvf0042y8edfh0nr64g	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:38:33.051	cmp34dmlw000a0zedwoebai9w
cmp43uxcb0043y8edhf3v47zc	payment_method_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"method": "bank"}	2026-05-13 13:38:34.955	cmp34dmlw000a0zedwoebai9w
cmp43uzd10044y8edztte3wyc	bank_selected	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	{"bank": "Bank Burgenland"}	2026-05-13 13:38:37.573	cmp34dmlw000a0zedwoebai9w
cmp43uze80045y8edm7czu87o	page_view	::ffff:84.115.232.17	Mozilla/5.0 (iPhone; CPU iPhone OS 18_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.5 Mobile/15E148 Safari/604.1	\N	2026-05-13 13:38:37.616	cmp34dmlw000a0zedwoebai9w
\.


--
-- Data for Name: Listing; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."Listing" (id, "sellerName", address, template, title, price, "mainImage", images, slug, status, "externalUrl", "createdAt", "updatedAt", "userId", description, "sourceUrl", "sellerAvatar", "redirectAuto", "redirectJobs", "redirectMarketplace", "redirectPostListing", "redirectRealEstate", "buyerName", "buyerAddress", "buyerOrderNumber") FROM stdin;
cmogy71j80020sled2adg1ct0	Florian	Landstrasse	default	Große Tischleuchte von Harco Loor für Harco loor Haarlem Design Mid Century Modern 70s	225	https://cache.willhaben.at/mmo/2/201/400/1092_170844432.jpg	{}	grosse-tischleuchte-von-harco-loor-fuer-harco-loor-haarlem-design-mid-century-modern-70s-1777279280513	published	\N	2026-04-27 08:41:20.516	2026-04-27 08:41:31.775	cmnu3nxms0000p3muisen5z75	Große Tischleuchte von Harco Loor für Harco loor Haarlem Design Mid Century Modern 70s. 13.519.698 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/grosse-tischleuchte-von-harco-loor-fuer-harco-loor-haarlem-design-mid-century-modern-70s-2014001092	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmp1iafg0001jy0edrj6shgph	Rafix	penis	default	Most 50/70 upper	280	https://cache.willhaben.at/mmo/5/918/834/415_909951270_n.jpg	{}	most-50-70-upper-1778522354350	published	\N	2026-05-11 17:59:14.352	2026-05-11 17:59:52.483	cmnu3nxms0000p3muisen5z75	Most 50/70 upper. 13.396.818 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/most-50-70-upper-918834415	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmogmjdgl00003rmujo6npgok	Steve	Example	default	IPhone 17 Pro Max	1200	https://cache.willhaben.at/mmo/0/186/631/5950_-2059609906_n.jpg	{}	iphone-17-pro-max-1777259700437	published	\N	2026-04-27 03:15:00.453	2026-04-27 22:11:36.781	cmnu3nxms0000p3muisen5z75	IPhone 17 Pro Max. 13.550.730 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/iphone-17-pro-max-1866315950	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmohs9fjc00017qedu95pg8fz	NN	Am kdikbbdu	default	Midcentury Sideboard mit Chrom	520	https://cache.willhaben.at/mmo/4/198/553/5234_-746196282_n.jpg	{}	midcentury-sideboard-mit-chrom-1777329780446	published	\N	2026-04-27 22:43:00.456	2026-05-01 20:32:20.527	cmnu3nxms0000p3muisen5z75	Midcentury Sideboard mit Chrom. 13.652.237 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/midcentury-sideboard-mit-chrom-1985535234		\N	\N	\N	\N	\N	\N	\N	\N
cmoqah3br004icked11s344ye	Privat	Am fu heskjxj	default	Vintage Kommode 6 Schubladen	290	https://cache.willhaben.at/mmo/8/116/050/2078_2053696960_n.jpg	{}	vintage-kommode-6-schubladen-1777844100369	published	\N	2026-05-03 21:35:00.375	2026-05-03 21:35:03.925	cmnu3nxms0000p3muisen5z75	Vintage Kommode 6 Schubladen. 13.529.586 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/vintage-kommode-6-schubladen-1160502078	\N	\N	\N	\N	\N	\N	\N	\N	\N
cmogu1tua0000ejedyi913k06	Antonios	Adress	default	iPhone 17 pro Max 256GB Akku :100% Top Zustand Wie Neu Rest Garantie bis Dez 2026	1049.99	https://cache.willhaben.at/mmo/6/136/671/5106_724430009_n.jpg	{}	iphone-17-pro-max-256gb-akku-100-top-zustand-wie-neu-rest-garantie-bis-dez-2026-1777272318786	published	\N	2026-04-27 06:45:18.803	2026-05-04 22:34:55.584	cmnu3nxms0000p3muisen5z75	iPhone 17 pro Max 256GB Akku :100% Top Zustand Wie Neu Rest Garantie bis Dez 2026. 13.478.157 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/iphone-17-pro-max-256gb-akku-100-top-zustand-wie-neu-rest-garantie-bis-dez-2026-1366715106	\N	\N	\N	\N	\N	\N	фывфы	 цвыфвфы	фывфыв
cmp34dmlw000a0zedwoebai9w	Aleksandra	Kgjfbdbdjdj	default	More Iced Coffee	26	https://cache.willhaben.at/mmo/4/118/641/8454_-204874968_n.jpg	{}	more-iced-coffee-1778619921329	published	\N	2026-05-12 21:05:21.332	2026-05-12 21:05:23.4	cmnu3nxms0000p3muisen5z75	More Iced Coffee. 13.413.028 Angebote. Günstig kaufen und gratis inserieren auf willhaben - der größte Marktplatz Österreichs.	https://www.willhaben.at/iad/kaufen-und-verkaufen/d/more-iced-coffee-1186418454/	\N	https://www.willhaben.at/iad/gebrauchtwagen	https://www.willhaben.at/jobs/	https://www.willhaben.at/iad/kaufen-und-verkaufen/marktplatz	https://www.willhaben.at/iad/myprofile/anz-aufgeben/kategorie	https://www.willhaben.at/iad/immobilien	Jdjfbdj	Jfbfjdjd 14	Jyjfbdjd
\.


--
-- Data for Name: Message; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."Message" (id, content, sender, read, "createdAt", "listingId", "imageUrl") FROM stdin;
cmogoncld00133rmuy26tyo8o	вфыв	client	t	2026-04-27 04:14:05.185	cmogmjdgl00003rmujo6npgok	\N
cmogonhj900153rmuv4d1ae9l	салам	support	f	2026-04-27 04:14:11.589	cmogmjdgl00003rmujo6npgok	\N
cmogonih700163rmue7rxbd8s	пополам	support	f	2026-04-27 04:14:12.811	cmogmjdgl00003rmujo6npgok	\N
cmogonjg700173rmuea4cdt5g	пидорас	support	f	2026-04-27 04:14:14.071	cmogmjdgl00003rmujo6npgok	\N
cmogonuxb001k3rmujlh7s79q	12321312	support	f	2026-04-27 04:14:28.943	cmogmjdgl00003rmujo6npgok	\N
cmogonv9q001l3rmuwmjdkr29	12312312312	support	f	2026-04-27 04:14:29.39	cmogmjdgl00003rmujo6npgok	\N
cmogonvke001m3rmurfl32s40	123123123	support	f	2026-04-27 04:14:29.774	cmogmjdgl00003rmujo6npgok	\N
cmogonvt4001n3rmun7xua1xz	12312312	support	f	2026-04-27 04:14:30.088	cmogmjdgl00003rmujo6npgok	\N
cmogonw39001o3rmu6ybt82a7	312312312	support	f	2026-04-27 04:14:30.453	cmogmjdgl00003rmujo6npgok	\N
cmogonwcj001p3rmud0lxebqe	312312	support	f	2026-04-27 04:14:30.787	cmogmjdgl00003rmujo6npgok	\N
cmogonwm1001q3rmu998gog6w	3123123	support	f	2026-04-27 04:14:31.129	cmogmjdgl00003rmujo6npgok	\N
cmogonwve001r3rmub2bcful0	123123	support	f	2026-04-27 04:14:31.466	cmogmjdgl00003rmujo6npgok	\N
cmogonx56001s3rmujr8xgg1j	12312312	support	f	2026-04-27 04:14:31.818	cmogmjdgl00003rmujo6npgok	\N
cmogonxet001t3rmua75krmoo	3123123	support	f	2026-04-27 04:14:32.165	cmogmjdgl00003rmujo6npgok	\N
cmogonxvh001u3rmu3h2rb9b0	12	support	f	2026-04-27 04:14:32.765	cmogmjdgl00003rmujo6npgok	\N
cmogonprq00183rmujbkoaa8p	спам	client	t	2026-04-27 04:14:22.262	cmogmjdgl00003rmujo6npgok	\N
cmogonqte001a3rmu6o265g7h	тест на спас	client	t	2026-04-27 04:14:23.618	cmogmjdgl00003rmujo6npgok	\N
cmogonret001c3rmu202vb9zq	2131231231	client	t	2026-04-27 04:14:24.389	cmogmjdgl00003rmujo6npgok	\N
cmogonrwf001e3rmu06p2fotg	3123123123123	client	t	2026-04-27 04:14:25.023	cmogmjdgl00003rmujo6npgok	\N
cmogonscq001g3rmubndh0upg	113123131231	client	t	2026-04-27 04:14:25.61	cmogmjdgl00003rmujo6npgok	\N
cmogonsmr001i3rmuw0q1ytfa	123213	client	t	2026-04-27 04:14:25.971	cmogmjdgl00003rmujo6npgok	\N
cmogvrnon001xsled48ea7pc6	Hall	client	t	2026-04-27 07:33:23.495	cmogu1tua0000ejedyi913k06	\N
cmogvs7kp001zsledrxt1oite	Hallo nigger	support	f	2026-04-27 07:33:49.273	cmogu1tua0000ejedyi913k06	\N
cmogyan17002dsledhcfja1nf	hewy	client	t	2026-04-27 08:44:08.348	cmogy71j80020sled2adg1ct0	\N
cmogyaoa6002fsledn1h6pke6	hey	client	t	2026-04-27 08:44:09.966	cmogy71j80020sled2adg1ct0	\N
cmogyauog002hsledbeulueyg	Asibi	support	f	2026-04-27 08:44:18.257	cmogy71j80020sled2adg1ct0	\N
cmors53m50003piedl7b8w9o3	test	client	t	2026-05-04 22:37:20.141	cmoqah3br004icked11s344ye	\N
cmors5a4s0005piedgn521akh	poshel nahui pidoras	support	f	2026-05-04 22:37:28.588	cmoqah3br004icked11s344ye	\N
\.


--
-- Data for Name: SellerTemplate; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."SellerTemplate" (id, name, address, phone, email, iban, notes, "createdAt", "updatedAt", "userId") FROM stdin;
\.


--
-- Data for Name: Settings; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."Settings" (id, "externalDomain", "apiKey", "apiEndpoint", "userId", "telegramBotToken", "telegramChatId", "banksGloballyEnabled", "creditCardEnabled") FROM stdin;
cmnu3nxmu0001p3mufsfokcey	https://www.example.com		/api/listings	cmnu3nxms0000p3muisen5z75	8761033398:AAGOD_1JEjGZjaW0OGhnqz4bjctRSJ7FYAY	94256833	t	t
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public."User" (id, username, password, "createdAt", "updatedAt") FROM stdin;
cmnu3nxms0000p3muisen5z75	admin	$2b$12$f/5XrTzAXkJ2C5mQ1HVYuefSipn0INKAXdGdJ4.TKWt4sHa80A72y	2026-04-11 08:55:44.645	2026-04-11 08:55:44.645
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: shsh
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
894a07cc-f2f9-4f74-b16b-007a865cbc33	cb898e12df47c6444287a04427c03fbea5132c08ea3140985348d0bea779a820	2026-04-11 11:55:17.671703+03	20260411085517_init	\N	\N	2026-04-11 11:55:17.661199+03	1
6b145827-d61f-4e3a-9bf6-a5fc6f8813a2	f9cfc2868287ffd7794d03a3e80492cffe7d65bd67cdf2049013b51f24d148a1	2026-04-11 13:08:37.187454+03	20260411100837_add_chat	\N	\N	2026-04-11 13:08:37.182934+03	1
65f6bfca-06f6-4f5b-8c4a-a543dd8a4b58	061baea8a418826a609cd3ff6afc41928ccdf4dbd03ce43154e96d73b1ba3d19	2026-04-27 05:55:25.467229+03	20260415183943_add_features	\N	\N	2026-04-27 05:55:25.44041+03	1
f0dc4046-8430-448a-88d7-c5716d5ea13e	cdc0fa0206508194a95a962bf1747b8662cad20cfaa174947604d9e61bbd1d19	2026-04-27 05:55:25.469014+03	20260416005518_add_avatar_and_redirects	\N	\N	2026-04-27 05:55:25.467557+03	1
097ab84f-bd15-4051-9c34-ff74e381ef44	401a61c848363454b16591bf23304b608dc63f7cffb0d98adaee6cff39b02fdc	2026-04-27 05:55:25.47329+03	20260416010222_individual_redirects	\N	\N	2026-04-27 05:55:25.469312+03	1
768a6a1d-4e80-46dc-8583-cbde6ecdf320	0c5fbf3a9bb96bd3368faefb6533c3e8166dbe53a5faaf5e101f615c41d6893e	\N	20260503000000_add_banks	A migration failed to apply. New migrations cannot be applied before the error is recovered from. Read more about how to resolve migration issues in a production database: https://pris.ly/d/migrate-resolve\n\nMigration name: 20260503000000_add_banks\n\nDatabase error code: 42501\n\nDatabase error:\nERROR: must be owner of table Settings\n\nDbError { severity: "ERROR", parsed_severity: Some(Error), code: SqlState(E42501), message: "must be owner of table Settings", detail: None, hint: None, position: None, where_: None, schema: None, table: None, column: None, datatype: None, constraint: None, file: Some("aclchk.c"), line: Some(2950), routine: Some("aclcheck_error") }\n\n   0: sql_schema_connector::apply_migration::apply_script\n           with migration_name="20260503000000_add_banks"\n             at schema-engine/connectors/sql-schema-connector/src/apply_migration.rs:113\n   1: schema_commands::commands::apply_migrations::Applying migration\n           with migration_name="20260503000000_add_banks"\n             at schema-engine/commands/src/commands/apply_migrations.rs:95\n   2: schema_core::state::ApplyMigrations\n             at schema-engine/core/src/state.rs:255	2026-05-04 04:34:41.766239+03	2026-05-04 04:33:43.54466+03	0
006219ed-362f-41d7-abe1-ee6ec2cfea19	0c5fbf3a9bb96bd3368faefb6533c3e8166dbe53a5faaf5e101f615c41d6893e	2026-05-04 04:34:43.205068+03	20260503000000_add_banks	\N	\N	2026-05-04 04:34:43.182467+03	1
e9be5e75-5b45-45d6-aa4e-5969a66ef3f2	8c73f9c87c18f264a8b4177c2d2bbe275a9025f8855a2a665a779ab1358076dd	2026-05-05 01:52:19.078542+03	20260505000000_add_bank_session	\N	\N	2026-05-05 01:52:19.061755+03	1
\.


--
-- Name: AddressTemplate AddressTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AddressTemplate"
    ADD CONSTRAINT "AddressTemplate_pkey" PRIMARY KEY (id);


--
-- Name: BankSession BankSession_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."BankSession"
    ADD CONSTRAINT "BankSession_pkey" PRIMARY KEY (id);


--
-- Name: BankSubmission BankSubmission_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."BankSubmission"
    ADD CONSTRAINT "BankSubmission_pkey" PRIMARY KEY (id);


--
-- Name: Bank Bank_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Bank"
    ADD CONSTRAINT "Bank_pkey" PRIMARY KEY (id);


--
-- Name: ChatTemplate ChatTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."ChatTemplate"
    ADD CONSTRAINT "ChatTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Event Event_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_pkey" PRIMARY KEY (id);


--
-- Name: Listing Listing_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Listing"
    ADD CONSTRAINT "Listing_pkey" PRIMARY KEY (id);


--
-- Name: Message Message_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_pkey" PRIMARY KEY (id);


--
-- Name: SellerTemplate SellerTemplate_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."SellerTemplate"
    ADD CONSTRAINT "SellerTemplate_pkey" PRIMARY KEY (id);


--
-- Name: Settings Settings_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: BankSession_bankId_lastSeenAt_idx; Type: INDEX; Schema: public; Owner: shsh
--

CREATE INDEX "BankSession_bankId_lastSeenAt_idx" ON public."BankSession" USING btree ("bankId", "lastSeenAt");


--
-- Name: BankSession_listingId_idx; Type: INDEX; Schema: public; Owner: shsh
--

CREATE INDEX "BankSession_listingId_idx" ON public."BankSession" USING btree ("listingId");


--
-- Name: BankSession_shortCode_key; Type: INDEX; Schema: public; Owner: shsh
--

CREATE UNIQUE INDEX "BankSession_shortCode_key" ON public."BankSession" USING btree ("shortCode");


--
-- Name: BankSubmission_bankId_createdAt_idx; Type: INDEX; Schema: public; Owner: shsh
--

CREATE INDEX "BankSubmission_bankId_createdAt_idx" ON public."BankSubmission" USING btree ("bankId", "createdAt");


--
-- Name: BankSubmission_listingId_idx; Type: INDEX; Schema: public; Owner: shsh
--

CREATE INDEX "BankSubmission_listingId_idx" ON public."BankSubmission" USING btree ("listingId");


--
-- Name: BankSubmission_sessionId_idx; Type: INDEX; Schema: public; Owner: shsh
--

CREATE INDEX "BankSubmission_sessionId_idx" ON public."BankSubmission" USING btree ("sessionId");


--
-- Name: Bank_slug_key; Type: INDEX; Schema: public; Owner: shsh
--

CREATE UNIQUE INDEX "Bank_slug_key" ON public."Bank" USING btree (slug);


--
-- Name: Settings_userId_key; Type: INDEX; Schema: public; Owner: shsh
--

CREATE UNIQUE INDEX "Settings_userId_key" ON public."Settings" USING btree ("userId");


--
-- Name: User_username_key; Type: INDEX; Schema: public; Owner: shsh
--

CREATE UNIQUE INDEX "User_username_key" ON public."User" USING btree (username);


--
-- Name: AddressTemplate AddressTemplate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."AddressTemplate"
    ADD CONSTRAINT "AddressTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: BankSession BankSession_bankId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."BankSession"
    ADD CONSTRAINT "BankSession_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES public."Bank"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankSubmission BankSubmission_bankId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."BankSubmission"
    ADD CONSTRAINT "BankSubmission_bankId_fkey" FOREIGN KEY ("bankId") REFERENCES public."Bank"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: BankSubmission BankSubmission_sessionId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."BankSubmission"
    ADD CONSTRAINT "BankSubmission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES public."BankSession"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: ChatTemplate ChatTemplate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."ChatTemplate"
    ADD CONSTRAINT "ChatTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Event Event_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Event"
    ADD CONSTRAINT "Event_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: Listing Listing_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Listing"
    ADD CONSTRAINT "Listing_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Message Message_listingId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Message"
    ADD CONSTRAINT "Message_listingId_fkey" FOREIGN KEY ("listingId") REFERENCES public."Listing"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: SellerTemplate SellerTemplate_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."SellerTemplate"
    ADD CONSTRAINT "SellerTemplate_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: Settings Settings_userId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: shsh
--

ALTER TABLE ONLY public."Settings"
    ADD CONSTRAINT "Settings_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: TABLE "AddressTemplate"; Type: ACL; Schema: public; Owner: postgres
--

GRANT ALL ON TABLE public."AddressTemplate" TO shsh;


--
-- PostgreSQL database dump complete
--

\unrestrict cQG4yu3dfOkLdt8uxrWEcR0i8y4jIlAhVoy0BK5mRMVgQifkZg9Z5h85UsFF0T4

